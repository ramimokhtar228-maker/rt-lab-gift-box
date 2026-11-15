import { useRef, useState } from 'react';
import { ImagePlus, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import type { LabProfile } from '../types';
import { apiClient } from '../services/apiClient';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_ASSET_LOGO = `${BASE_PATH}logo.jpg`;
const DEFAULT_ASSET_ICON = `${BASE_PATH}icon.svg`;

interface AdminSettingsTabProps {
  labProfile: LabProfile;
  onProfileSaved: (updated: LabProfile) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function AdminSettingsTab({
  labProfile,
  onProfileSaved,
  onNotify,
}: AdminSettingsTabProps) {
  const [form, setForm] = useState<LabProfile>(labProfile);
  const [newBranch, setNewBranch] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 350 * 1024) {
      onNotify('يرجى اختيار صورة لوجو أصغر من 350 كيلوبايت لضمان سرعة المزامنة.', true);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, logoUrl: reader.result as string }));
        onNotify('تم تحميل الشعار الجديد — اضغط "حفظ الإعدادات" لتثبيته.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddBranch = () => {
    const clean = newBranch.trim();
    if (!clean) return;
    setForm((prev) => ({ ...prev, branches: [...prev.branches, clean] }));
    setNewBranch('');
  };

  const handleRemoveBranch = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const data = await apiClient.updateLabProfile(form);
      if (!data.ok || !data.labProfile) {
        onNotify(data.message || 'تعذر حفظ الإعدادات.', true);
      } else {
        onProfileSaved(data.labProfile);
        onNotify(data.message || 'تم حفظ وتثبيت بيانات المعمل والشعار في السحابة.');
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Logo & Identity */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            شعار المعمل والبيانات الأساسية
          </h2>
          <p className="text-xs text-slate-500">
            تظهر هذه البيانات والشعار في صفحة صندوق السعادة ورسائل الواتساب.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
          <img
            src={form.logoUrl === '/logo.jpg' ? DEFAULT_ASSET_LOGO : form.logoUrl || DEFAULT_ASSET_LOGO}
            alt="شعار المعمل"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_ASSET_ICON;
            }}
            className="h-20 w-20 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1"
          />
          <div className="flex-1 space-y-2">
            <p className="text-xs font-bold text-slate-800">لوجو المعمل الحالي</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800 cursor-pointer"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                <span>تغيير اللوجو (رفع صورة)</span>
              </button>
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, logoUrl: DEFAULT_ASSET_LOGO }))}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>استعادة شعار RT الافتراضي</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">اسم المعمل *</label>
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
            المتغيرات المتاحة: {'{clientName}'} {'{labName}'} {'{prizeTitle}'} {'{discountLabel}'} {'{prizeCode}'} {'{expiresAt}'} {'{appointmentAt}'} {'{boxUrl}'}
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
              3. رد المعمل للمريض بالفوز وتحديد الموعد
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
