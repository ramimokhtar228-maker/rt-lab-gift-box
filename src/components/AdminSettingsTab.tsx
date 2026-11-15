import { useEffect, useState } from 'react';
import { Image as ImageIcon, KeyRound, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type { LabProfile } from '../types';
import { apiClient, DEFAULT_ASSET_ICON, DEFAULT_ASSET_LOGO } from '../services/apiClient';

interface AdminSettingsTabProps {
  labProfile: LabProfile;
  adminToken: string;
  onProfileSaved: (updated: LabProfile) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

async function compressLogoFile(file: File, maxDim = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة الصورة'));
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => reject(new Error('صيغة الصورة غير صالحة'));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result || ''));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, 0.88));
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

export function AdminSettingsTab({
  labProfile,
  adminToken,
  onProfileSaved,
  onNotify,
}: AdminSettingsTabProps) {
  const [form, setForm] = useState<LabProfile>({ ...labProfile });
  const [newBranch, setNewBranch] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ ...labProfile });
  }, [labProfile]);

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onNotify('يرجى اختيار ملف صورة صالح (PNG/JPG).', true);
      return;
    }
    try {
      const compressed = await compressLogoFile(file, 512);
      setForm((prev) => ({ ...prev, logoUrl: compressed }));
      onNotify('تم تجهيز الشعار الجديد — اضغط حفظ لتثبيته.');
    } catch {
      onNotify('تعذر معالجة الصورة المختارة.', true);
    }
  };

  const handleAddBranch = () => {
    const clean = newBranch.trim();
    if (!clean) return;
    if (!form.branches.includes(clean)) {
      setForm((prev) => ({ ...prev, branches: [...prev.branches, clean] }));
    }
    setNewBranch('');
  };

  const handleRemoveBranch = (idx: number) => {
    if (form.branches.length <= 1) {
      onNotify('يجب الإبقاء على فرع واحد على الأقل.', true);
      return;
    }
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (newPassword.trim() && newPassword.trim().length < 4) {
      onNotify('كلمة المرور الجديدة يجب أن تكون 4 أحرف على الأقل.', true);
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { ...form };
      if (newPassword.trim()) {
        payload.newAdminPassword = newPassword.trim();
      }
      const data = await apiClient.updateLabProfile(adminToken, payload);
      if (!data.ok || !data.labProfile) {
        onNotify(data.message || 'تعذر حفظ بيانات المعمل.', true);
      } else {
        setNewPassword('');
        onProfileSaved(data.labProfile);
        onNotify('تم حفظ بيانات المعمل واللوجو بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بالخادم.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Lab Identity & Logo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            بيانات المعمل والشعار (Logo)
          </h2>
          <p className="text-xs text-slate-500">
            يظهر الاسم والشعار وبيانات التواصل تلقائياً للمريض داخل صفحة صندوق السعادة ورسائل الواتساب.
          </p>
        </div>

        {/* Logo Editor */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <img
            src={form.logoUrl === '/logo.jpg' ? DEFAULT_ASSET_LOGO : form.logoUrl || DEFAULT_ASSET_LOGO}
            alt={form.labName}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_ASSET_ICON;
            }}
            className="h-20 w-20 rounded-2xl border border-slate-200 bg-white object-contain p-1"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer">
                <ImageIcon className="h-4 w-4 text-teal-700" />
                <span>تغيير لوجو المعمل (صورة من جهازك)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFile}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: DEFAULT_ASSET_LOGO }))}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>استعادة اللوجو الرسمي</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              يُفضل رفع صورة مربعة PNG أو JPG بحجم واضح.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">اسم المعمل</label>
            <input
              type="text"
              required
              value={form.labName}
              onChange={(e) => setForm({ ...form, labName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">اسم المدير الطبي / الاستشاري</label>
            <input
              type="text"
              value={form.director}
              onChange={(e) => setForm({ ...form, director: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">الرقم المختصر / الهاتف</label>
            <input
              type="text"
              dir="ltr"
              value={form.hotlineNumber}
              onChange={(e) => setForm({ ...form, hotlineNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">رقم واتساب المعمل الرسمي</label>
            <input
              type="text"
              dir="ltr"
              required
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="201100874444"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">العنوان الرئيسي</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">مواعيد العمل</label>
            <input
              type="text"
              value={form.workingHours}
              onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Branches */}
        <div className="space-y-2 border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold text-slate-700">فروع المعمل</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              placeholder="أضف فرعاً جديداً..."
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-teal-700 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddBranch}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>إضافة</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {form.branches.map((br, idx) => (
              <div
                key={`${br}-${idx}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
              >
                <span className="font-semibold text-slate-800">{br}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(idx)}
                  className="text-slate-400 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Templates */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            قوالب رسائل الواتساب التلقائية
          </h2>
          <p className="text-xs text-slate-500">
            المتغيرات المتاحة: {'{clientName}'} {'{labName}'} {'{prizeTitle}'} {'{discountLabel}'} {'{prizeCode}'} {'{expiresAt}'} {'{boxUrl}'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              1. رسالة إرسال رابط البوكس للمريض
            </label>
            <textarea
              rows={5}
              value={form.whatsappInviteTemplate}
              onChange={(e) => setForm({ ...form, whatsappInviteTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              2. رسالة المريض لواتساب المعمل عند الفوز
            </label>
            <textarea
              rows={5}
              value={form.whatsappPatientClaimTemplate}
              onChange={(e) => setForm({ ...form, whatsappPatientClaimTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-teal-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              3. رد المعمل للمريض بأنه كسب والوقت المحدد
            </label>
            <textarea
              rows={5}
              value={form.whatsappWinnerReplyTemplate}
              onChange={(e) => setForm({ ...form, whatsappWinnerReplyTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-teal-700 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Change Admin Password */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-teal-700" />
          <h2 className="text-base font-extrabold text-slate-900">تغيير كلمة مرور الإدارة</h2>
        </div>
        <p className="text-xs text-slate-500">
          اترك الحقل فارغاً إذا لم ترغب في تغيير كلمة المرور الحالية. كلمة المرور مخفية تماماً عن العملاء.
        </p>
        <input
          type="password"
          dir="ltr"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="أدخل كلمة مرور جديدة (اختياري)"
          className="w-full max-w-sm rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-sm focus:border-teal-700 focus:outline-none"
        />
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-teal-700 px-7 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'جاري الحفظ...' : 'حفظ وتثبيت كافة إعدادات المعمل'}</span>
        </button>
      </div>
    </form>
  );
}
