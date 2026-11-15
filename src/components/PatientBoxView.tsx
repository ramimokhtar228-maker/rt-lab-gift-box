import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Check,
  Clock,
  Copy,
  Gift,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { BoxPublicResponse, LabProfile } from '../types';
import {
  buildPatientClaimWhatsAppUrl,
  copyToClipboard,
  formatArabicDate,
  getTimeRemaining,
} from '../utils/whatsapp';
import { apiClient, DEFAULT_ASSET_ICON, DEFAULT_ASSET_LOGO } from '../services/apiClient';
import { playBoxOpenChime } from '../utils/sound';
import SEALED_BOX_IMG from '../assets/images/sealed_happiness_box_1794768643734.jpg';
import OPENED_BOX_IMG from '../assets/images/opened_happiness_box_1794768644943.jpg';

interface PatientBoxViewProps {
  token: string | null;
  encodedData?: string | null;
  labProfile: LabProfile;
  onBoxAssigned: (token: string) => void;
}

export function PatientBoxView({
  token,
  encodedData,
  labProfile,
  onBoxAssigned,
}: PatientBoxViewProps) {
  const [box, setBox] = useState<BoxPublicResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showSelfForm, setShowSelfForm] = useState(false);
  const [selfName, setSelfName] = useState('');
  const [selfPhone, setSelfPhone] = useState('');
  const [selfBranch, setSelfBranch] = useState(labProfile.branches[0] || '');
  const [sealedImgError, setSealedImgError] = useState(false);
  const [openedImgError, setOpenedImgError] = useState(false);
  const [muted, setMuted] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!selfBranch && labProfile.branches.length > 0) {
      setSelfBranch(labProfile.branches[0]);
    }
  }, [labProfile.branches, selfBranch]);

  const loadBox = useCallback(async (targetToken: string) => {
    setLoading(true);
    setErrorMsg(null);
    const cacheKey = `rt_hb_won_${targetToken.toUpperCase()}`;
    try {
      const data = await apiClient.getBoxByToken(targetToken, encodedData);
      if (!data.ok || !data.box) {
        try {
          const cached = window.localStorage.getItem(cacheKey);
          if (cached) {
            setBox(JSON.parse(cached));
            return;
          }
        } catch {
          // ignore
        }
        setBox(null);
        setErrorMsg(data.message || 'لم يتم العثور على رابط صندوق السعادة.');
      } else {
        let resolvedBox: BoxPublicResponse = data.box;
        if (resolvedBox.status === 'pending') {
          try {
            const cached = window.localStorage.getItem(cacheKey);
            if (cached) {
              const parsed = JSON.parse(cached) as BoxPublicResponse;
              if (parsed.status === 'opened' || parsed.status === 'redeemed') {
                resolvedBox = parsed;
              }
            }
          } catch {
            // ignore
          }
        }
        setBox(resolvedBox);
      }
    } catch {
      try {
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) {
          setBox(JSON.parse(cached));
          return;
        }
      } catch {
        // ignore
      }
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  }, [encodedData]);

  useEffect(() => {
    if (token) {
      void loadBox(token);
    } else {
      setBox(null);
      setLoading(false);
      setErrorMsg(null);
    }
  }, [token, loadBox]);

  // Live 1-second countdown ticker when a prize is revealed
  useEffect(() => {
    if (!box || (box.status !== 'opened' && box.status !== 'redeemed')) return;
    const timer = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [box]);

  const fireCelebration = () => {
    playBoxOpenChime(muted);
    try {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;
      confetti({
        particleCount: 75,
        spread: 68,
        origin: { y: 0.58 },
        colors: ['#0F766E', '#D97706', '#10B981', '#F59E0B', '#FFFFFF'],
      });
    } catch {
      // ignore confetti errors
    }
  };

  const handleOpenAssignedBox = async () => {
    if (!box || opening) return;
    setOpening(true);
    setErrorMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const data = await apiClient.openBoxByToken(box.token, encodedData);
      if (!data.ok || !data.box) {
        setErrorMsg(data.message || 'تعذر فتح الصندوق حالياً.');
      } else {
        setBox(data.box);
        try {
          window.localStorage.setItem(`rt_hb_won_${data.box.token.toUpperCase()}`, JSON.stringify(data.box));
        } catch {
          // ignore
        }
        fireCelebration();
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء فتح الصندوق.');
    } finally {
      setOpening(false);
    }
  };

  const handleSelfOpenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfName.trim() || selfPhone.replace(/\D/g, '').length < 8) {
      setErrorMsg('يرجى إدخال الاسم ورقم الموبايل بشكل صحيح لاستلام الجائزة.');
      return;
    }
    setOpening(true);
    setErrorMsg(null);
    try {
      await new Promise((r) => setTimeout(r, 650));
      const data = await apiClient.createAndOpenSelfBox({
        clientName: selfName.trim(),
        clientPhone: selfPhone.trim(),
        branchName: selfBranch || labProfile.branches[0],
      });
      if (!data.ok || !data.box) {
        setErrorMsg(data.message || 'تعذر فتح الصندوق.');
      } else {
        setBox(data.box);
        try {
          window.localStorage.setItem(`rt_hb_won_${data.box.token.toUpperCase()}`, JSON.stringify(data.box));
        } catch {
          // ignore
        }
        setShowSelfForm(false);
        onBoxAssigned(data.box.token);
        fireCelebration();
      }
    } catch {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setOpening(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const remaining = box ? getTimeRemaining(box.expiresAt) : null;
  const isExpired = Boolean(box && (box.status === 'expired' || (box.status === 'opened' && remaining?.expired)));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Main Focal Card: Happiness Box */}
        <section className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
          {loading ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-slate-500">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-teal-700" />
              <p className="text-sm font-semibold">جاري تجهيز صندوق السعادة...</p>
            </div>
          ) : box && (box.status === 'opened' || box.status === 'redeemed') && box.prize ? (
            /* STATE 2: PRIZE REVEALED + LIVE COUNTDOWN + WHATSAPP */
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-teal-800">
                  تهانينا يا {box.clientName}
                </span>
                <div className="flex items-center gap-2">
                  <span>{box.branchName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{box.visitRef}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40">
                  {!openedImgError ? (
                    <img
                      src={OPENED_BOX_IMG}
                      alt="صندوق السعادة مفتوح"
                      referrerPolicy="no-referrer"
                      onError={() => setOpenedImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-teal-800 to-emerald-950 p-4 text-center text-white">
                      <Gift className="h-12 w-12 text-amber-300" />
                      <span className="text-xs font-bold">{box.prize.discountLabel}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-right">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-700 sm:justify-start">
                    <Sparkles className="h-4 w-4" />
                    <span>{box.prize.discountLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {box.status === 'redeemed'
                        ? 'تم الصرف بالمعمل'
                        : isExpired
                          ? 'انتهت المدة المحددة'
                          : 'جاهز للاستخدام'}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold leading-snug text-slate-900">
                    {box.prize.title}
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {box.prize.description}
                  </p>
                </div>
              </div>

              {/* Countdown Timer ("الجائزة ليها وقت محدد") */}
              {box.status === 'redeemed' ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" />
                  <div className="text-sm">
                    <p className="font-bold">تم صرف الجائزة وتفعيلها بالمعمل بنجاح</p>
                    <p className="text-xs text-emerald-800">
                      تاريخ الصرف: {formatArabicDate(box.redeemedAt)}
                    </p>
                  </div>
                </div>
              ) : isExpired ? (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-700" />
                  <div className="text-sm">
                    <p className="font-bold">انتهت المدة المحددة لصلاحية هذه الجائزة</p>
                    <p className="text-xs text-rose-800">
                      انتهت في: {formatArabicDate(box.expiresAt)} — يمكنك التواصل مع المعمل عبر واتساب للعروض الحالية.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-amber-700" />
                      <span>الوقت المتبقي لاستخدام الجائزة</span>
                    </span>
                    <span className="text-amber-800">
                      ينتهي في: {formatArabicDate(box.expiresAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
                    {[
                      { label: 'يوم', val: remaining?.days ?? 0 },
                      { label: 'ساعة', val: remaining?.hours ?? 0 },
                      { label: 'دقيقة', val: remaining?.minutes ?? 0 },
                      { label: 'ثانية', val: remaining?.seconds ?? 0 },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="rounded-xl border border-amber-200/80 bg-white px-2 py-2.5"
                      >
                        <div className="font-mono text-xl font-extrabold text-slate-900 tabular-nums sm:text-2xl">
                          {String(unit.val).padStart(2, '0')}
                        </div>
                        <div className="mt-0.5 text-[11px] font-semibold text-slate-500">
                          {unit.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prize Code + WhatsApp Claim */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      كود الجائزة الخاص بك
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono text-lg font-extrabold tracking-wider text-slate-900 tabular-nums"
                    >
                      {box.prize.prizeCode}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(box.prize!.prizeCode)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>نسخ الكود</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={buildPatientClaimWhatsAppUrl(box, labProfile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-teal-800"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>أرسل جائزتك إلى واتساب المعمل الآن</span>
                </a>
              </div>
            </div>
          ) : box && box.status === 'expired' ? (
            /* EXPIRED BEFORE OPENING */
            <div className="flex min-h-[360px] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Clock className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">
                انتهت صلاحية رابط صندوق السعادة
              </h1>
              <p className="max-w-md text-sm text-slate-600">
                انتهت المهلة المحددة لهذا الرابط بتاريخ {formatArabicDate(box.expiresAt)}. يمكنك التواصل مع المعمل للحصول على رابط جديد.
              </p>
              <a
                href={`https://wa.me/${labProfile.whatsappNumber.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
              >
                <MessageCircle className="h-4 w-4" />
                <span>تواصل مع واتساب المعمل</span>
              </a>
            </div>
          ) : (
            /* STATE 1: SEALED HAPPINESS BOX (READY TO OPEN) */
            <div className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
                title={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <div className="mb-4 space-y-1">
                <p className="text-xs font-bold text-teal-700">
                  {box ? `أهلاً ${box.clientName}` : labProfile.labName}
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  صندوق السعادة بانتظارك
                </h1>
                <p className="mx-auto max-w-md text-sm text-slate-600">
                  اضغط على الصندوق لفتحه والكشف عن جائزتك الفورية والمحددة بوقت من {labProfile.labName}.
                </p>
              </div>

              {/* Interactive Gift Box Visual */}
              <button
                type="button"
                onClick={() => {
                  if (box) {
                    void handleOpenAssignedBox();
                  } else {
                    setShowSelfForm(true);
                  }
                }}
                disabled={opening}
                aria-label="افتح صندوق السعادة"
                className={`group relative my-4 h-60 w-60 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer sm:h-64 sm:w-64 ${
                  opening ? 'animate-box-shake' : 'animate-gentle-float'
                }`}
              >
                {!sealedImgError ? (
                  <img
                    src={SEALED_BOX_IMG}
                    alt="صندوق السعادة المغلق"
                    referrerPolicy="no-referrer"
                    onError={() => setSealedImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-teal-800 to-emerald-950 text-white">
                    <Gift className="h-16 w-16 text-amber-300" />
                    <span className="text-sm font-bold">صندوق السعادة</span>
                  </div>
                )}
              </button>

              {errorMsg ? (
                <div className="mb-4 flex w-full max-w-md items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              ) : null}

              {!box && showSelfForm ? (
                <form
                  onSubmit={handleSelfOpenSubmit}
                  className="mt-2 w-full max-w-md space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-right"
                >
                  <p className="text-xs font-bold text-slate-800">
                    سجّل اسمك ورقم الواتساب لفتح الصندوق وحفظ جائزتك:
                  </p>
                  <input
                    type="text"
                    required
                    value={selfName}
                    onChange={(e) => setSelfName(e.target.value)}
                    placeholder="الاسم بالكامل"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={selfPhone}
                    onChange={(e) => setSelfPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left font-mono text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                  />
                  {labProfile.branches.length > 0 ? (
                    <select
                      value={selfBranch}
                      onChange={(e) => setSelfBranch(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-teal-700 focus:outline-none"
                    >
                      {labProfile.branches.map((br) => (
                        <option key={br} value={br}>
                          {br}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <button
                    type="submit"
                    disabled={opening}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
                  >
                    <Gift className="h-5 w-5" />
                    <span>{opening ? 'جاري فتح الصندوق...' : 'افتح الصندوق واكشف جائزتك'}</span>
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  disabled={opening}
                  onClick={() => {
                    if (box) {
                      void handleOpenAssignedBox();
                    } else {
                      setShowSelfForm(true);
                    }
                  }}
                  className="mt-2 flex min-h-[50px] w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3.5 text-base font-extrabold text-white shadow-sm transition-colors hover:bg-teal-800 disabled:opacity-60 cursor-pointer"
                >
                  <Gift className="h-5 w-5" />
                  <span>{opening ? 'جاري فتح صندوق السعادة...' : 'اضغط لفتح صندوق السعادة'}</span>
                </button>
              )}
            </div>
          )}
        </section>

        {/* Secondary Column: Simple 3-Step Guide & Lab Contact Info */}
        <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-5">
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
              <img
                src={labProfile.logoUrl === '/logo.jpg' ? DEFAULT_ASSET_LOGO : labProfile.logoUrl || DEFAULT_ASSET_LOGO}
                alt={labProfile.labName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_ASSET_ICON;
                }}
                className="h-14 w-14 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-1"
              />
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  {labProfile.labName}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  {labProfile.director}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                خطوات استلام هديتك بكل سهولة
              </h3>
              <ol className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-bold text-teal-800">
                    1
                  </span>
                  <span>اضغط على صندوق السعادة لفتح هديتك وظهور كود الجائزة.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-bold text-teal-800">
                    2
                  </span>
                  <span>أرسل رسالة الجائزة لواتساب المعمل بضغطة واحدة لتأكيدها.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-50 font-mono text-xs font-bold text-teal-800">
                    3
                  </span>
                  <span>استفد من الجائزة قبل انتهاء العداد الزمني المحدد لها.</span>
                </li>
              </ol>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              <span>{labProfile.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-teal-700" />
              <span>{labProfile.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-teal-700" />
              <span dir="ltr" className="font-mono font-bold text-slate-800">
                {labProfile.hotlineNumber}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
