import { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Gamepad2,
  ImagePlus,
  MessageCircle,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
} from 'lucide-react';
import type { AppLang, DistributionTargets, GameMode, LabProfile } from '../types';
import { GAME_MODE_META } from '../i18n/translations';
import { apiClient, DEFAULT_DISTRIBUTION_TARGETS } from '../services/apiClient';
import { formatWhatsAppPhone } from '../utils/whatsapp';
import { PWAInstallButton } from './PWAInstallButton';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_ASSET_LOGO = `${BASE_PATH}logo.jpg`;
const DEFAULT_ASSET_ICON = `${BASE_PATH}icon.svg`;

const GAME_MODES: GameMode[] = ['box', 'three_boxes', 'wheel', 'scratch', 'secret', 'seasonal'];

interface AdminSettingsTabProps {
  labProfile: LabProfile;
  lang: AppLang;
  onProfileSaved: (updated: LabProfile) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function AdminSettingsTab({
  labProfile,
  lang,
  onProfileSaved,
  onNotify,
}: AdminSettingsTabProps) {
  const [form, setForm] = useState<LabProfile>(labProfile);
  const [isDirty, setIsDirty] = useState(false);
  const [newBranch, setNewBranch] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isDirty) {
      setForm(labProfile);
    }
  }, [labProfile, isDirty]);

  const updateForm = (updater: Partial<LabProfile>) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, ...updater }));
  };

  const targets: DistributionTargets = form.distributionTargets || DEFAULT_DISTRIBUTION_TARGETS;
  const targetsSum =
    targets.discMid +
    targets.discHigh +
    targets.paidOffer +
    targets.freeGift +
    targets.grandPrize +
    targets.vipSurprise;

  const updateTarget = (key: keyof DistributionTargets, val: number) => {
    setIsDirty(true);
    setForm((prev) => ({
      ...prev,
      distributionTargets: {
        ...(prev.distributionTargets || DEFAULT_DISTRIBUTION_TARGETS),
        [key]: Math.max(0, Math.min(100, val)),
      },
    }));
  };

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
        updateForm({ logoUrl: reader.result });
        onNotify('تم تحميل الشعار الجديد — اضغط "حفظ الإعدادات" لتثبيته.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddBranch = () => {
    const clean = newBranch.trim();
    if (!clean) return;
    updateForm({ branches: [...form.branches, clean] });
    setNewBranch('');
  };

  const handleRemoveBranch = (idx: number) => {
    updateForm({ branches: form.branches.filter((_, i) => i !== idx) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    const normalizedWa = formatWhatsAppPhone(form.whatsappNumber || '');
    if (!normalizedWa || normalizedWa.length < 10) {
      onNotify('يرجى إدخال رقم واتساب صحيح (مثال: 010xxxxxxxx أو 2011xxxxxxxx).', true);
      return;
    }
    const payload: LabProfile = {
      ...form,
      whatsappNumber: normalizedWa,
    };
    setSaving(true);
    try {
      const data = await apiClient.updateLabProfile(payload);
      if (!data.ok || !data.labProfile) {
        onNotify(data.message || 'تعذر حفظ الإعدادات.', true);
      } else {
        setForm(data.labProfile);
        setIsDirty(false);
        onProfileSaved(data.labProfile);
        onNotify(`تم حفظ الإعدادات وتفعيل الواتساب (${normalizedWa}) ونمط اللعب بنجاح.`);
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* PWA Install & Offline App Card */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-[#C9962D]/40 bg-[#FFF8EB] p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2 text-base font-extrabold text-[#5C1422]">
            <Smartphone className="h-5 w-5 text-[#B8860B]" />
            <span>تنزيل البرنامج كتطبيق (PWA) والعمل أونلاين وأوفلاين</span>
          </h2>
          <p className="text-xs leading-relaxed text-slate-700">
            ثبّت النظام على الموبايل (Android / iPhone) أو اللاب توب (Windows / Mac) ليعمل كتطبيق مستقل مع تخزين محلي كامل ومزامنة تلقائية عند عودة الإنترنت.
          </p>
        </div>
        <div className="shrink-0">
          <PWAInstallButton lang={lang} variant="card" />
        </div>
      </section>

      {/* Slide 5 Interactive Game Mode & Campaign + Slide 4 Distribution Targets */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-base font-extrabold text-[#5C1422]">
            <Gamepad2 className="h-5 w-5 text-[#B8860B]" />
            <span>أنواع الألعاب التفاعلية (Slide 5) والحملة النشطة</span>
          </h2>
          <p className="text-xs text-slate-500">
            اختر النمط التفاعلي الافتراضي للروابط الجديدة واسم الحملة الموسمية الحالية.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">نمط اللعبة الافتراضي</label>
            <select
              value={form.defaultGameMode || 'box'}
              onChange={(e) => updateForm({ defaultGameMode: e.target.value as GameMode })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-[#5C1422] focus:border-[#5C1422] focus:outline-none"
            >
              {GAME_MODES.map((gm) => (
                <option key={gm} value={gm}>
                  {GAME_MODE_META[gm].nameAr} ({GAME_MODE_META[gm].nameEn})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">اسم الحملة الموسمية النشطة</label>
            <input
              type="text"
              value={form.activeCampaign || ''}
              onChange={(e) => updateForm({ activeCampaign: e.target.value })}
              placeholder="مثال: حملة صندوق الفرحة الدائمة / عرض العيد"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-slate-800">
              النسب المستهدفة لتوزيع 1,000 جائزة (Slide 4)
            </span>
            <span
              className={`font-mono text-xs font-extrabold ${
                targetsSum === 100 ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              الإجمالي: {targetsSum}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                { key: 'discMid', label: 'خصم 30–50%' },
                { key: 'discHigh', label: 'خصم 60–80%' },
                { key: 'paidOffer', label: 'عروض مدفوعة' },
                { key: 'freeGift', label: 'هدايا مجانية' },
                { key: 'grandPrize', label: 'جوائز كبرى' },
                { key: 'vipSurprise', label: 'مفاجآت VIP' },
              ] as const
            ).map((item) => (
              <div key={item.key} className="rounded-xl border border-slate-200 bg-[#FAF7F4] p-2.5">
                <label className="mb-1 block text-[11px] font-bold text-slate-600">{item.label} (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={targets[item.key]}
                  onChange={(e) => updateTarget(item.key, Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-center font-mono text-xs font-bold text-[#5C1422] focus:border-[#5C1422] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo & Identity */}
      <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            شعار المعمل والبيانات الأساسية
          </h2>
          <p className="text-xs text-slate-500">
            تظهر هذه البيانات والشعار في صفحة صندوق الفرحة ورسائل الواتساب.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 rounded-2xl border border-slate-200 bg-[#FAF7F4] p-4 sm:flex-row sm:items-center">
          <img
            src={form.logoUrl === '/logo.jpg' ? DEFAULT_ASSET_LOGO : form.logoUrl || DEFAULT_ASSET_LOGO}
            alt="شعار المعمل"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_ASSET_ICON;
            }}
            className="h-20 w-20 shrink-0 rounded-2xl border border-[#C9962D]/40 bg-white object-contain p-1"
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5C1422] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#7A1C2E] cursor-pointer"
              >
                <ImagePlus className="h-3.5 w-3.5" />
                <span>تغيير اللوجو (رفع صورة)</span>
              </button>
              <button
                type="button"
                onClick={() => updateForm({ logoUrl: DEFAULT_ASSET_LOGO })}
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
              onChange={(e) => updateForm({ labName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">اسم المدير الطبي / الاستشاري</label>
            <input
              type="text"
              value={form.director}
              onChange={(e) => updateForm({ director: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">الرقم المختصر / الهاتف</label>
            <input
              type="text"
              dir="ltr"
              value={form.hotlineNumber}
              onChange={(e) => updateForm({ hotlineNumber: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              رقم واتساب المعمل الرسمي (للإرسال والاستقبال) *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                dir="ltr"
                required
                value={form.whatsappNumber}
                onChange={(e) => updateForm({ whatsappNumber: e.target.value })}
                placeholder="010xxxxxxxx أو 2011xxxxxxxx"
                className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-sm focus:border-[#5C1422] focus:outline-none"
              />
              {formatWhatsAppPhone(form.whatsappNumber) ? (
                <a
                  href={`https://wa.me/${formatWhatsAppPhone(form.whatsappNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="اختبار فتح الرقم على واتساب"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 whitespace-nowrap"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>تجربة</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              صيغة التفعيل المباشر:{' '}
              <span dir="ltr" className="font-mono font-bold text-[#5C1422]">
                +{formatWhatsAppPhone(form.whatsappNumber) || '—'}
              </span>
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">العنوان الرئيسي</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => updateForm({ address: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">مواعيد العمل</label>
            <input
              type="text"
              value={form.workingHours}
              onChange={(e) => updateForm({ workingHours: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-700">
              رابط بوابة المرضى العام (تُنشأ منه روابط المرضى)
            </label>
            <input
              type="url"
              dir="ltr"
              value={form.shareBaseUrl || ''}
              onChange={(e) => updateForm({ shareBaseUrl: e.target.value })}
              placeholder="https://ramimokhtar228-maker.github.io/rt-lab-gift-box"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-left font-mono text-xs focus:border-[#5C1422] focus:outline-none"
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
              className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#5C1422] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddBranch}
              className="inline-flex items-center gap-1 rounded-xl bg-[#5C1422] px-4 py-2 text-xs font-bold text-white hover:bg-[#7A1C2E] cursor-pointer"
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
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">
            قوالب رسائل الواتساب التلقائية
          </h2>
          <p className="text-xs text-slate-500">
            المتغيرات المتاحة: {'{clientName}'} {'{labName}'} {'{prizeTitle}'} {'{discountLabel}'} {'{prizeCode}'} {'{prizeTerms}'} {'{branchName}'} {'{expiresAt}'} {'{appointmentAt}'} {'{whatsappNumber}'} {'{boxUrl}'}
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
              onChange={(e) => updateForm({ whatsappInviteTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              2. رسالة المريض لواتساب المعمل عند الفوز
            </label>
            <textarea
              rows={5}
              value={form.whatsappPatientClaimTemplate}
              onChange={(e) => updateForm({ whatsappPatientClaimTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-[#5C1422] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              3. رد المعمل للمريض بالفوز وتحديد الموعد
            </label>
            <textarea
              rows={5}
              value={form.whatsappWinnerReplyTemplate}
              onChange={(e) => updateForm({ whatsappWinnerReplyTemplate: e.target.value })}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-[#5C1422] focus:outline-none"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-[#5C1422] px-7 py-3 text-sm font-extrabold text-white shadow-sm hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
        >
          <Save className="h-4 w-4 text-[#E7C15A]" />
          <span>{saving ? 'جاري الحفظ...' : 'حفظ وتثبيت كافة إعدادات المعمل'}</span>
        </button>
      </div>
    </form>
  );
}
