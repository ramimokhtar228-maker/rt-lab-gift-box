import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Link2,
  MessageCircle,
  Plus,
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
  formatArabicDate,
  getTimeRemaining,
} from '../utils/whatsapp';

interface AdminLinksTabProps {
  links: GiftLink[];
  prizes: Prize[];
  labProfile: LabProfile;
  adminToken: string;
  shareBaseUrl: string;
  onRefresh: () => Promise<void>;
  onPreviewBox: (token: string) => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function AdminLinksTab({
  links,
  prizes,
  labProfile,
  adminToken,
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'opened' | 'pending' | 'redeemed' | 'expired'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publicBase = shareBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

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
      const data = await apiClient.createAdminLink(adminToken, {
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
        onNotify('تم إنشاء رابط صندوق السعادة بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بالخادم.', true);
    } finally {
      setCreating(false);
    }
  };

  const handleRedeem = async (code: string) => {
    const clean = code.trim();
    if (!clean || redeeming) return;
    setRedeeming(true);
    try {
      const data = await apiClient.redeemPrize(adminToken, clean, 'استقبال المعمل');
      if (!data.ok) {
        onNotify(data.message || 'تعذر صرف الجائزة.', true);
      } else {
        setRedeemCode('');
        await onRefresh();
        onNotify(data.message || 'تم تأكيد الصرف بنجاح.');
      }
    } catch {
      onNotify('تعذر الاتصال بالخادم.', true);
    } finally {
      setRedeeming(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const ok = await apiClient.deleteGiftLink(adminToken, id);
      if (ok) {
        await onRefresh();
        onNotify('تم حذف السجل.');
      }
    } catch {
      onNotify('تعذر حذف السجل.', true);
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
                أنشئ رابطاً خاصاً بالمريض وأرسله عبر واتساب بضغطة واحدة.
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
                <label className="mb-1 block text-xs font-bold text-slate-700">رقم الفاتورة</label>
                <input
                  type="text"
                  dir="ltr"
                  value={visitRef}
                  onChange={(e) => setVisitRef(e.target.value)}
                  placeholder="اختياري"
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
                <span>{creating ? 'جاري الإنشاء...' : 'إنشاء رابط صندوق السعادة'}</span>
              </button>
            </div>
          </form>

          {lastCreated ? (
            <div className="mt-4 rounded-2xl border border-teal-200 bg-teal-50/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-bold text-teal-900">
                  الرابط جاهز للمريض: {lastCreated.clientName}
                </span>
                <span dir="ltr" className="font-mono font-bold text-teal-800">
                  {lastCreated.token}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={buildAdminInviteWhatsAppUrl(lastCreated, labProfile, publicBase, prizes)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-extrabold text-white hover:bg-teal-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>إرسال الرابط للمريض واتساب</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyText(getPatientLink(lastCreated), lastCreated.id)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-teal-300 bg-white px-3.5 py-2 text-xs font-bold text-teal-900 hover:bg-teal-50 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedId === lastCreated.id ? 'تم نسخ الرابط' : 'نسخ الرابط'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyText(buildAdminInviteText(lastCreated, labProfile, publicBase, prizes), `${lastCreated.id}-msg`)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{copiedId === `${lastCreated.id}-msg` ? 'تم نسخ الرسالة' : 'نسخ نص الرسالة'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPreviewBox(lastCreated.token)}
                  className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>معاينة البوكس</span>
                </button>
              </div>
            </div>
          ) : null}
        </section>

        {/* Quick Reception Verify & Redeem */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 lg:col-span-5">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                تأكيد وصرف الجائزة بالاستقبال
              </h2>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-slate-500">
              عند إرسال المريض كود الجائزة عبر واتساب أو حضوره للمعمل، أدخل الكود هنا للتحقق وصرف الجائزة وإغلاقها لمرة واحدة.
            </p>
            <div className="space-y-3">
              <input
                type="text"
                dir="ltr"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="RT-XXXX-XXXX"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-center font-mono text-base font-bold tracking-wider text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
              <button
                type="button"
                disabled={redeeming || !redeemCode.trim()}
                onClick={() => handleRedeem(redeemCode)}
                className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{redeeming ? 'جاري الصرف...' : 'تأكيد صرف الجائزة'}</span>
              </button>
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            نصيحة: يمكنك أيضاً الرد على أي مريض كسب جائزة مباشرة من الجدول بالأسفل بزر <strong>&quot;رد بالمبروك والوقت&quot;</strong>.
          </div>
        </section>
      </div>

      {/* Winners & Links Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            سجل الروابط والفائزين ({filteredLinks.length})
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-64 sm:flex-initial">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث بالاسم، الهاتف، أو الكود..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-9 pl-3 text-xs text-slate-900 focus:border-teal-700 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
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
            لا توجد روابط مطابقة للبحث الحالي.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLinks.map((lnk) => {
              const rem = getTimeRemaining(lnk.expiresAt);
              return (
                <div
                  key={lnk.id}
                  className="flex flex-col justify-between gap-4 py-4 lg:flex-row lg:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-extrabold text-slate-900">{lnk.clientName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span dir="ltr" className="font-mono text-xs text-slate-600 tabular-nums">
                        {lnk.clientPhone}
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

                    {lnk.prizeTitle ? (
                      <a
                        href={buildAdminWinnerReplyWhatsAppUrl(lnk, labProfile)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-700 whitespace-nowrap"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>رد بالمبروك والوقت (واتساب)</span>
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
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
