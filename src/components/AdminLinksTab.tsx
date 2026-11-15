import { useMemo, useState } from 'react';
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Link2,
  MessageCircle,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import type { GiftLink, LabProfile, Prize } from '../types';
import { apiClient } from '../services/apiClient';
import {
  buildAdminInviteText,
  buildAdminInviteWhatsAppUrl,
  buildAdminWinnerReplyWhatsAppUrl,
  buildBoxUrl,
  copyToClipboard,
  exportLinksExcelCsv,
  formatArabicDate,
  getTimeRemaining,
} from '../utils/whatsapp';

interface AdminLinksTabProps {
  links: GiftLink[];
  prizes: Prize[];
  labProfile: LabProfile;
  shareBaseUrl: string;
  onRefresh: () => Promise<void>;
  onPreviewBox: (token: string) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function AdminLinksTab({
  links,
  prizes,
  labProfile,
  shareBaseUrl,
  onRefresh,
  onPreviewBox,
  onNotify,
}: AdminLinksTabProps) {
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [branchName, setBranchName] = useState(labProfile.branches[0] || '');
  const [visitRef, setVisitRef] = useState('');
  const [linkValidDays, setLinkValidDays] = useState(14);
  const [creating, setCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState<GiftLink | null>(null);

  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'opened' | 'pending' | 'redeemed' | 'expired'
  >('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline appointment scheduler state per link
  const [editingApptId, setEditingApptId] = useState<string | null>(null);
  const [apptTime, setApptTime] = useState('');
  const [apptNote, setApptNote] = useState('');
  const [savingAppt, setSavingAppt] = useState(false);

  const publicBase =
    shareBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  const getPatientLink = (lnk: GiftLink) =>
    buildBoxUrl(publicBase, lnk.token, {
      clientName: lnk.clientName,
      clientPhone: lnk.clientPhone,
      branchName: lnk.branchName,
      visitRef: lnk.visitRef,
      expiresAt: lnk.expiresAt,
      labProfile,
      prizes,
    });

  const copyText = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } else {
      onNotify('تعذر النسخ التلقائي، يرجى النسخ يدوياً.', true);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const data = await apiClient.createAdminLink({
        clientName,
        clientPhone,
        branchName: branchName || labProfile.branches[0],
        visitRef,
        linkValidDays,
      });
      if (!data.ok || !data.link) {
        onNotify(data.message || 'تعذر إنشاء الرابط.', true);
      } else {
        setLastCreated(data.link);
        setClientName('');
        setClientPhone('');
        setVisitRef('');
        await onRefresh();
        onNotify('تم إنشاء رابط صندوق السعادة وحفظه سحابياً بنجاح.');
      }
    } catch {
      onNotify('تعذر حفظ الرابط في قاعدة البيانات.', true);
    } finally {
      setCreating(false);
    }
  };

  const handleRedeem = async (code: string) => {
    const clean = code.trim();
    if (!clean || redeeming) return;
    setRedeeming(true);
    try {
      const data = await apiClient.redeemPrize(clean, 'استقبال المعمل');
      if (!data.ok) {
        onNotify(data.message || 'تعذر صرف الجائزة.', true);
      } else {
        setRedeemCode('');
        await onRefresh();
        onNotify(data.message || 'تم تأكيد الصرف بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بقاعدة البيانات.', true);
    } finally {
      setRedeeming(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const ok = await apiClient.deleteGiftLink(id);
      if (ok) {
        await onRefresh();
        onNotify('تم حذف السجل.');
      }
    } catch {
      onNotify('تعذر حذف السجل.', true);
    }
  };

  const openAppointmentEditor = (lnk: GiftLink) => {
    setEditingApptId(lnk.id);
    setApptTime(lnk.appointmentAt || '');
    setApptNote(lnk.appointmentNote || '');
  };

  const handleSaveAppointment = async (id: string) => {
    if (savingAppt) return;
    setSavingAppt(true);
    try {
      const res = await apiClient.updateAppointment(id, apptTime, apptNote);
      if (res.ok) {
        setEditingApptId(null);
        await onRefresh();
        onNotify('تم تحديد وحفظ الموعد — يمكنك الآن إرساله للمريض عبر واتساب.');
      } else {
        onNotify(res.message || 'تعذر حفظ الموعد.', true);
      }
    } catch {
      onNotify('تعذر حفظ الموعد في قاعدة البيانات.', true);
    } finally {
      setSavingAppt(false);
    }
  };

  const filteredLinks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return links.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.clientName.toLowerCase().includes(q) ||
        l.clientPhone.toLowerCase().includes(q) ||
        l.token.toLowerCase().includes(q) ||
        (l.prizeCode || '').toLowerCase().includes(q) ||
        (l.prizeTitle || '').toLowerCase().includes(q)
      );
    });
  }, [links, search, statusFilter]);

  const statusText = (s: GiftLink['status']) => {
    switch (s) {
      case 'pending':
        return 'بانتظار الفتح';
      case 'opened':
        return 'كسب — بانتظار الصرف';
      case 'redeemed':
        return 'تم الصرف';
      case 'expired':
        return 'منتهي الصلاحية';
    }
  };

  const statusColor = (s: GiftLink['status']) => {
    switch (s) {
      case 'pending':
        return 'text-slate-600';
      case 'opened':
        return 'text-amber-700 font-bold';
      case 'redeemed':
        return 'text-emerald-700 font-bold';
      case 'expired':
        return 'text-rose-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Create Patient Box Link */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                إرسال رابط صندوق السعادة لمريض
              </h2>
              <p className="text-xs text-slate-500">
                أنشئ رابطاً خاصاً بالمريض وأرسله عبر واتساب — وتظهر نتيجته هنا فور فتحه.
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyText(publicBase, 'universal')}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedId === 'universal' ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>تم نسخ الرابط العام</span>
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" />
                  <span>نسخ الرابط العام للبوكس</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleCreateLink} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">اسم المريض *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="مثال: محمد أحمد علي"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">رقم الواتساب *</label>
              <input
                type="tel"
                required
                dir="ltr"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="010xxxxxxxx"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left font-mono text-sm focus:border-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-700">الفرع</label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-teal-700 focus:outline-none"
              >
                {labProfile.branches.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">رقم الزيارة (اختياري)</label>
                <input
                  type="text"
                  dir="ltr"
                  value={visitRef}
                  onChange={(e) => setVisitRef(e.target.value)}
                  placeholder="RT-2041"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-left font-mono text-sm focus:border-teal-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">مهلة الفتح (أيام)</label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={linkValidDays}
                  onChange={(e) => setLinkValidDays(Number(e.target.value) || 14)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center font-mono text-sm focus:border-teal-700 focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2 pt-1">
              <button
                type="submit"
                disabled={creating}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{creating ? 'جاري الإنشاء...' : 'إنشاء رابط صندوق السعادة للمريض'}</span>
              </button>
            </div>
          </form>

          {lastCreated ? (
            <div className="mt-4 space-y-3 rounded-2xl border border-teal-200 bg-teal-50/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-teal-900">
                  جاهز للإرسال إلى: {lastCreated.clientName}
                </span>
                <span dir="ltr" className="font-mono text-xs font-bold text-teal-800">
                  {lastCreated.token}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={buildAdminInviteWhatsAppUrl(lastCreated, labProfile, publicBase, prizes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>إرسال رابط البوكس عبر واتساب</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyText(getPatientLink(lastCreated), 'last-url')}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {copiedId === 'last-url' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === 'last-url' ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    copyText(buildAdminInviteText(lastCreated, labProfile, publicBase, prizes), 'last-msg')
                  }
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {copiedId === 'last-msg' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedId === 'last-msg' ? 'تم نسخ الرسالة' : 'نسخ نص الرسالة'}</span>
                </button>
              </div>
            </div>
          ) : null}
        </section>

        {/* Quick Redeem Code */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              <h2 className="text-base font-extrabold text-slate-900">صرف وتفعيل كود الجائزة</h2>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              عند وصول رسالة الفوز من المريض أو حضوره للمعمل، أدخل كود الجائزة لتأكيد الصرف وإغلاق الكود فوراً.
            </p>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                dir="ltr"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                placeholder="RTWIN-XXXXXX"
                className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-left font-mono text-sm font-bold uppercase text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                disabled={redeeming || !redeemCode.trim()}
                onClick={() => handleRedeem(redeemCode)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>تأكيد الصرف</span>
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs text-slate-600">
            <div>
              <strong className="text-slate-800">مزامنة سحابية لحظية:</strong> أي مريض يفتح صندوق السعادة من أي هاتف تظهر بياناته وجائزته هنا مباشرة.
            </div>
            <button
              type="button"
              onClick={() => {
                exportLinksExcelCsv(filteredLinks);
                onNotify(`تم تصدير ${filteredLinks.length} سجل مرضى إلى ملف Excel (CSV).`);
              }}
              className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
              <span>تصدير بيانات المرضى والفائزين إلى Excel (CSV)</span>
            </button>
          </div>
        </section>
      </div>

      {/* Patient Links & Winners List */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              سجل المرضى والجوائز ({filteredLinks.length})
            </h2>
            <p className="text-xs text-slate-500">
              حدّد موعد الحضور أو السحب المنزلي وأرسل للمريض رسالة تأكيد الفوز والوقت المحدد عبر واتساب.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[210px] flex-1 sm:flex-initial">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم، الهاتف، أو الكود..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'opened', label: 'كسب' },
                { id: 'pending', label: 'بانتظار الفتح' },
                { id: 'redeemed', label: 'تم الصرف' },
                { id: 'expired', label: 'منتهي' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredLinks.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            لا توجد سجلات مطابقة للبحث الحالي.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLinks.map((lnk) => {
              const rem = getTimeRemaining(lnk.expiresAt);
              const isEditingAppt = editingApptId === lnk.id;
              return (
                <div key={lnk.id} className="space-y-3 py-4">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-extrabold text-slate-900">{lnk.clientName}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span dir="ltr" className="font-mono text-xs text-slate-600 tabular-nums">
                          {lnk.clientPhone || 'بدون هاتف'}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className={`text-xs ${statusColor(lnk.status)}`}>
                          {statusText(lnk.status)}
                        </span>
                      </div>

                      {lnk.prizeTitle ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-bold text-teal-800">{lnk.prizeTitle}</span>
                          <span aria-hidden="true">·</span>
                          <span dir="ltr" className="font-mono font-bold text-slate-800 tabular-nums">
                            {lnk.prizeCode}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {lnk.status === 'redeemed'
                                ? `صُرفت في ${formatArabicDate(lnk.redeemedAt)}`
                                : rem.expired
                                  ? 'انتهى الوقت المحدد'
                                  : `${rem.humanLabel} (حتى ${formatArabicDate(lnk.expiresAt)})`}
                            </span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span dir="ltr" className="font-mono">{lnk.token}</span>
                          <span aria-hidden="true">·</span>
                          <span>{lnk.branchName}</span>
                          <span aria-hidden="true">·</span>
                          <span>متاح للفتح حتى {formatArabicDate(lnk.expiresAt)}</span>
                        </div>
                      )}

                      {lnk.appointmentAt ? (
                        <div className="inline-flex flex-wrap items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-900">
                          <CalendarClock className="h-3.5 w-3.5 text-teal-700" />
                          <span>الموعد المحدد: {lnk.appointmentAt}</span>
                          {lnk.appointmentNote ? (
                            <span className="font-medium text-teal-700">({lnk.appointmentNote})</span>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {lnk.status === 'pending' ? (
                        <a
                          href={buildAdminInviteWhatsAppUrl(lnk, labProfile, publicBase, prizes)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-bold text-white hover:bg-teal-800 whitespace-nowrap"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>إرسال الرابط واتساب</span>
                        </a>
                      ) : null}

                      <button
                        type="button"
                        onClick={() =>
                          isEditingAppt ? setEditingApptId(null) : openAppointmentEditor(lnk)
                        }
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-900 hover:bg-teal-100 cursor-pointer whitespace-nowrap"
                      >
                        <CalendarClock className="h-3.5 w-3.5 text-teal-700" />
                        <span>{lnk.appointmentAt ? 'تعديل الموعد' : 'تحديد الموعد'}</span>
                      </button>

                      {lnk.prizeTitle ? (
                        <a
                          href={buildAdminWinnerReplyWhatsAppUrl(lnk, labProfile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 whitespace-nowrap"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>رد بالمبروك والموعد (واتساب)</span>
                        </a>
                      ) : null}

                      {lnk.status === 'opened' && lnk.prizeCode && !rem.expired ? (
                        <button
                          type="button"
                          onClick={() => handleRedeem(lnk.prizeCode!)}
                          className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 cursor-pointer whitespace-nowrap"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>تأكيد الصرف</span>
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => copyText(getPatientLink(lnk), lnk.id)}
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                      >
                        {copiedId === lnk.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedId === lnk.id ? 'نُسخ' : 'الرابط'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPreviewBox(lnk.token)}
                        title="معاينة"
                        className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLink(lnk.id)}
                        title="حذف"
                        className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-slate-200 bg-white px-2.5 text-slate-400 hover:border-rose-200 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Appointment Editor */}
                  {isEditingAppt ? (
                    <div className="grid grid-cols-1 gap-2 rounded-xl border border-teal-200 bg-teal-50/40 p-3 sm:grid-cols-12">
                      <input
                        type="text"
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        placeholder="الموعد (مثال: غداً الثلاثاء 11 صباحاً - فرع شبرا)"
                        className="sm:col-span-5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-teal-700 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={apptNote}
                        onChange={(e) => setApptNote(e.target.value)}
                        placeholder="ملاحظة (مثال: صيام 12 ساعة / سحب منزلي)"
                        className="sm:col-span-5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-teal-700 focus:outline-none"
                      />
                      <div className="flex gap-1.5 sm:col-span-2">
                        <button
                          type="button"
                          disabled={savingAppt}
                          onClick={() => handleSaveAppointment(lnk.id)}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-teal-700 px-3 py-2 text-xs font-bold text-white hover:bg-teal-800 cursor-pointer"
                        >
                          <Save className="h-3.5 w-3.5" />
                          <span>حفظ</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingApptId(null)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
