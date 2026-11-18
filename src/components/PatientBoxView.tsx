import { useCallback, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  Award,
  Ban,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Gift,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { AppLang, BoxPublicResponse, GameMode, LabProfile } from '../types';
import { PRIZE_CATEGORY_META, resolvePrizeTermsLines } from '../data/defaultPrizes';
import { GAME_MODE_META, getStatusLabel, UI_COPY } from '../i18n/translations';
import { apiClient } from '../services/apiClient';
import { normalizeCanonicalPhone } from '../utils/phoneHash';
import {
  buildFriendReferralWhatsAppUrl,
  buildPatientClaimWhatsAppUrl,
  copyToClipboard,
  formatArabicDate,
  formatWhatsAppPhone,
  getTimeRemaining,
} from '../utils/whatsapp';
import { playBoxOpenChime } from '../utils/sound';
import { InteractiveGameStage } from './InteractiveGameStage';
import openedBoxImg from '../assets/images/opened_happiness_box_1794768644943.jpg';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_ASSET_LOGO = `${BASE_PATH}logo.jpg`;
const DEFAULT_ASSET_ICON = `${BASE_PATH}icon.svg`;

const OPENED_BOX_IMG = openedBoxImg;

const ALL_GAME_MODES: GameMode[] = [
  'box',
  'three_boxes',
  'wheel',
  'scratch',
  'secret',
  'seasonal',
];

interface PatientBoxViewProps {
  token: string | null;
  encodedData?: string | null;
  referredBy?: string | null;
  lang: AppLang;
  labProfile: LabProfile;
  shareBaseUrl: string;
  onBoxAssigned: (newToken: string) => void;
}

export function PatientBoxView({
  token,
  encodedData,
  referredBy,
  lang,
  labProfile,
  shareBaseUrl,
  onBoxAssigned,
}: PatientBoxViewProps) {
  const copy = UI_COPY[lang];

  const [box, setBox] = useState<BoxPublicResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(token));
  const [opening, setOpening] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadyClaimedMsg, setAlreadyClaimedMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [muted, setMuted] = useState(false);
  const [openedImgError, setOpenedImgError] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<boolean | null>(null);
  const [retryingCloud, setRetryingCloud] = useState(false);
  const [, setTick] = useState(0);

  // Interactive game state
  const [selfGameMode, setSelfGameMode] = useState<GameMode>(
    labProfile.defaultGameMode || 'box'
  );
  const [pendingBoxPick, setPendingBoxPick] = useState<number | undefined>(undefined);

  // Self-claim state when opened from universal link without ?box=
  const [showSelfForm, setShowSelfForm] = useState(false);
  const [selfName, setSelfName] = useState('');
  const [selfPhone, setSelfPhone] = useState('');
  const [selfBranch, setSelfBranch] = useState(labProfile.branches[0] || '');
  const [selfBirthday, setSelfBirthday] = useState(false);

  useEffect(() => {
    if (!selfBranch && labProfile.branches[0]) {
      setSelfBranch(labProfile.branches[0]);
    }
  }, [labProfile.branches, selfBranch]);

  useEffect(() => {
    if (!token && labProfile.defaultGameMode) {
      setSelfGameMode(labProfile.defaultGameMode);
    }
  }, [labProfile.defaultGameMode, token]);

  const loadBox = useCallback(
    async (targetToken: string) => {
      setLoading(true);
      setErrorMsg(null);
      const cacheKey = `rt_hb_won_${targetToken.toUpperCase()}`;
      let cachedParsed: BoxPublicResponse | null = null;
      try {
        const cached = window.localStorage.getItem(cacheKey);
        if (cached) {
          cachedParsed = JSON.parse(cached) as BoxPublicResponse;
        }
      } catch {
        // ignore invalid cache
      }

      try {
        const data = await apiClient.getBoxByToken(targetToken, encodedData);
        if (!data.ok || !data.box) {
          if (data.deleted) {
            try {
              window.localStorage.removeItem(cacheKey);
            } catch {
              // ignore
            }
            setBox(null);
            setErrorMsg(data.message || 'تم حذف هذا السجل أو إلغاؤه من قِبل إدارة المعمل.');
            return;
          }
          if (cachedParsed) {
            setBox(cachedParsed);
            void apiClient.syncCachedBoxToCloud(cachedParsed).then((ok) => setCloudSynced(ok));
            return;
          }
          setBox(null);
          setErrorMsg(data.message || 'لم يتم العثور على رابط صندوق الفرحة.');
        } else if (
          data.box.status === 'pending' &&
          cachedParsed &&
          (cachedParsed.status === 'opened' || cachedParsed.status === 'redeemed') &&
          cachedParsed.prize
        ) {
          setBox(cachedParsed);
          void apiClient.syncCachedBoxToCloud(cachedParsed).then((ok) => setCloudSynced(ok));
        } else {
          setBox(data.box);
          if (data.fromLocalCache && (data.box.status === 'opened' || data.box.status === 'redeemed')) {
            setCloudSynced(false);
            void apiClient.syncCachedBoxToCloud(data.box).then((ok) => setCloudSynced(ok));
          } else if (data.box.status === 'opened' || data.box.status === 'redeemed') {
            setCloudSynced(true);
          }
          if (
            (data.box.status === 'opened' || data.box.status === 'redeemed') &&
            data.box.prize
          ) {
            try {
              window.localStorage.setItem(cacheKey, JSON.stringify(data.box));
            } catch {
              // ignore
            }
          }
        }
      } catch {
        if (cachedParsed) {
          setBox(cachedParsed);
          void apiClient.syncCachedBoxToCloud(cachedParsed);
          return;
        }
        setErrorMsg('تعذر الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    },
    [encodedData]
  );

  useEffect(() => {
    if (token) {
      void loadBox(token);
    } else {
      setBox(null);
      setLoading(false);
      setErrorMsg(null);
    }
  }, [token, loadBox]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || navigator.onLine) {
      void apiClient.syncAllCachedBoxesToCloud();
    }
  }, []);

  useEffect(() => {
    if (!box || (box.status !== 'opened' && box.status !== 'redeemed')) return;
    const timer = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [box]);

  useEffect(() => {
    if (!box || cloudSynced !== false) return;
    if (box.status !== 'opened' && box.status !== 'redeemed') return;

    let stopped = false;
    const attemptCloudRetry = async () => {
      if (stopped || (typeof navigator !== 'undefined' && !navigator.onLine)) return;
      let savedPhone = selfPhone.trim();
      if (!savedPhone) {
        try {
          savedPhone = window.localStorage.getItem(`rt_hb_phone_${box.token.toUpperCase()}`) || '';
        } catch {
          // ignore
        }
      }
      const ok = await apiClient.syncCachedBoxToCloud(box, savedPhone);
      if (!stopped && ok) {
        setCloudSynced(true);
      }
    };

    const retryInterval = window.setInterval(() => {
      void attemptCloudRetry();
    }, 10000);
    const onOnline = () => {
      void attemptCloudRetry();
    };
    window.addEventListener('online', onOnline);

    return () => {
      stopped = true;
      window.clearInterval(retryInterval);
      window.removeEventListener('online', onOnline);
    };
  }, [box, cloudSynced, selfPhone]);

  const fireCelebration = () => {
    playBoxOpenChime(muted);
    try {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.58 },
        colors: ['#5C1422', '#C9962D', '#B8860B', '#7A1C2E', '#FFFFFF'],
      });
    } catch {
      // ignore confetti errors
    }
  };

  const activeGameMode: GameMode = box?.gameMode || selfGameMode || labProfile.defaultGameMode || 'box';

  const handleOpenAssignedBox = async (selectedGameBox?: number) => {
    if (!box || opening) return;
    setOpening(true);
    setErrorMsg(null);
    setAlreadyClaimedMsg(null);
    try {
      await new Promise((r) => setTimeout(r, activeGameMode === 'wheel' ? 1150 : 650));
      const data = await apiClient.openBoxByToken(box.token, encodedData, {
        selectedGameBox,
        gameMode: activeGameMode,
      });
      if (!data.ok || !data.box) {
        setErrorMsg(data.message || 'تعذر فتح الصندوق حالياً.');
      } else {
        setBox(data.box);
        setCloudSynced(data.alreadyClaimed ? true : Boolean(data.cloudSynced));
        if (data.alreadyClaimed && data.message) {
          setAlreadyClaimedMsg(data.message);
          onBoxAssigned(data.box.token);
        }
        try {
          window.localStorage.setItem(
            `rt_hb_won_${data.box.token.toUpperCase()}`,
            JSON.stringify(data.box)
          );
        } catch {
          // ignore
        }
        if (!data.alreadyClaimed) {
          fireCelebration();
        }
      }
    } catch {
      setErrorMsg('حدث خطأ أثناء فتح الصندوق.');
    } finally {
      setOpening(false);
    }
  };

  const handleSelfOpenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const canonical = normalizeCanonicalPhone(selfPhone);
    if (!selfName.trim() || canonical.length < 8) {
      setErrorMsg(
        lang === 'en'
          ? 'Please enter your full name and valid mobile number.'
          : 'يرجى إدخال الاسم ورقم الموبايل بشكل صحيح لاستلام الجائزة.'
      );
      return;
    }
    setOpening(true);
    setErrorMsg(null);
    setAlreadyClaimedMsg(null);
    try {
      await new Promise((r) => setTimeout(r, activeGameMode === 'wheel' ? 1150 : 650));
      const data = await apiClient.createAndOpenSelfBox({
        clientName: selfName.trim(),
        clientPhone: canonical,
        branchName: selfBranch || labProfile.branches[0],
        gameMode: selfGameMode,
        selectedGameBox: pendingBoxPick,
        referredBy: referredBy || undefined,
        isBirthdayGift: selfBirthday,
      });
      if (!data.ok || !data.box) {
        setErrorMsg(data.message || 'تعذر فتح الصندوق.');
      } else {
        setBox(data.box);
        setCloudSynced(data.alreadyClaimed ? true : Boolean(data.cloudSynced));
        if (data.alreadyClaimed && data.message) {
          setAlreadyClaimedMsg(data.message);
        }
        try {
          const tokUpper = data.box.token.toUpperCase();
          window.localStorage.setItem(`rt_hb_won_${tokUpper}`, JSON.stringify(data.box));
          window.localStorage.setItem(`rt_hb_phone_${tokUpper}`, canonical);
        } catch {
          // ignore
        }
        setShowSelfForm(false);
        onBoxAssigned(data.box.token);
        if (!data.alreadyClaimed) {
          fireCelebration();
        }
      }
    } catch {
      setErrorMsg('تعذر الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى.');
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

  const handleCopyReferral = async (code: string) => {
    const ok = await copyToClipboard(code);
    if (ok) {
      setCopiedRef(true);
      window.setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const remaining = box ? getTimeRemaining(box.expiresAt) : null;
  const isExpired = Boolean(
    box && (box.status === 'expired' || (box.status === 'opened' && remaining?.expired))
  );

  // Slide 2 5-step active index (0..4)
  const journeyActiveIdx = box?.status === 'redeemed' ? 4 : box?.prize ? 3 : 1;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      {/* Slide 2: 5-Step Journey Tracker */}
      <section className="rounded-2xl border border-[#C9962D]/30 bg-white px-4 py-3.5 shadow-2xs">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-extrabold text-[#5C1422]">{copy.journeyTitle}</span>
          <span className="text-[11px] font-bold text-[#B8860B]">{copy.precommitNote}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {copy.journeySteps.map((st, idx) => {
            const doneOrCurrent = idx <= journeyActiveIdx;
            return (
              <div
                key={st.num}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-colors ${
                  doneOrCurrent
                    ? 'border-[#5C1422]/25 bg-[#FAF7F4] text-[#5C1422]'
                    : 'border-slate-100 bg-slate-50/70 text-slate-400'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg font-mono text-[11px] font-extrabold ${
                    doneOrCurrent ? 'bg-[#5C1422] text-[#E7C15A]' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {st.num}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[11px] font-extrabold">{st.title}</div>
                  <div className="truncate text-[10px] opacity-80">{st.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Main Focal Card: Happiness Box */}
        <section className="flex flex-col justify-between rounded-3xl border border-[#C9962D]/35 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
          {loading ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-slate-500">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-[#5C1422]" />
              <p className="text-sm font-semibold">
                {lang === 'en' ? 'Preparing your Happiness Box...' : 'جاري تجهيز صندوق الفرحة...'}
              </p>
            </div>
          ) : box && box.status === 'cancelled' ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Ban className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">{copy.statusCancelledTitle}</h1>
              <p className="max-w-md text-sm text-slate-600">
                {lang === 'en'
                  ? 'Please contact RT LAB reception on WhatsApp if you have any inquiries.'
                  : 'يرجى التواصل مع استقبال معامل RT عبر الواتساب لأي استفسار حول هذا الكود.'}
              </p>
              <a
                href={`https://wa.me/${formatWhatsAppPhone(labProfile.whatsappNumber || labProfile.hotlineNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#5C1422] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#7A1C2E]"
              >
                <MessageCircle className="h-4 w-4 text-[#E7C15A]" />
                <span>{copy.whatsappLab}</span>
              </a>
            </div>
          ) : box && (box.status === 'opened' || box.status === 'redeemed') && box.prize ? (
            /* STATE 2: PRIZE REVEALED + FULL TERMS + LIVE COUNTDOWN + LOYALTY + WHATSAPP */
            <div className="space-y-6">
              {alreadyClaimedMsg ? (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <div className="space-y-1 text-xs leading-relaxed">
                    <p className="text-sm font-extrabold">
                      تم الدخول بهذا الرقم من قبل — لا يمكن الحصول على جائزة جديدة الآن
                    </p>
                    <p className="text-amber-900">{alreadyClaimedMsg}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span className="font-extrabold text-[#5C1422]">
                  {lang === 'en' ? `Congratulations, ${box.clientName}` : `تهانينا يا ${box.clientName}`}
                </span>
                <div className="flex items-center gap-2">
                  <span>{box.branchName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{box.visitRef}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-2xl border-2 border-[#C9962D]/50 bg-[#FFF8EB]">
                  {!openedImgError ? (
                    <img
                      src={OPENED_BOX_IMG}
                      alt={lang === 'en' ? 'Opened Happiness Box' : 'صندوق الفرحة مفتوح'}
                      referrerPolicy="no-referrer"
                      onError={() => setOpenedImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#5C1422] to-[#3B0A13] p-4 text-center text-white">
                      <Gift className="h-12 w-12 text-[#E7C15A]" />
                      <span className="text-xs font-bold">{box.prize.discountLabel}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2.5 text-center sm:text-start">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold ${
                        (PRIZE_CATEGORY_META[box.prize.category] || PRIZE_CATEGORY_META.DISCOUNT).badgeClass
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>
                        {(PRIZE_CATEGORY_META[box.prize.category] || PRIZE_CATEGORY_META.DISCOUNT).shortLabel}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-lg border border-[#C9962D]/50 bg-[#FFF8EB] px-2.5 py-1 text-[11px] font-extrabold text-[#7A5600]">
                      {box.prize.discountLabel}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      · {getStatusLabel(isExpired && box.status === 'opened' ? 'expired' : box.status, lang)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold leading-snug text-[#5C1422]">
                    {box.prize.title}
                  </h1>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {box.prize.description}
                  </p>
                </div>
              </div>

              {/* Official Prize Terms & Conditions Card for Full Credibility */}
              <div className="rounded-2xl border border-[#C9962D]/30 bg-[#FAF7F4] p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                    <FileText className="h-4 w-4 text-[#5C1422]" />
                    <span>{copy.termsTitle}</span>
                  </h2>
                  <span className="text-[11px] font-bold text-[#5C1422]">
                    {copy.validFor}: {box.prize.validHours} {copy.hours}
                  </span>
                </div>

                <ul className="space-y-2 text-xs leading-relaxed text-slate-700">
                  {resolvePrizeTermsLines({
                    title: box.prize.title,
                    category: box.prize.category,
                    terms: box.prize.terms,
                    validHours: box.prize.validHours,
                  }).map((term, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5C1422]" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-slate-200/80 pt-3 text-[11px] text-slate-600 sm:grid-cols-3">
                  <div>
                    <span className="block text-slate-400">
                      {lang === 'en' ? 'Registered Beneficiary' : 'المستفيد المسجل'}
                    </span>
                    <span className="font-bold text-slate-800">{box.clientName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">
                      {lang === 'en' ? 'Opened Date' : 'تاريخ ووقت الفتح'}
                    </span>
                    <span className="font-bold text-slate-800">{formatArabicDate(box.openedAt)}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-slate-400">
                      {lang === 'en' ? 'Branch / Ref' : 'الفرع / المرجع'}
                    </span>
                    <span className="font-bold text-slate-800">
                      {box.branchName || labProfile.branches[0]} ({box.visitRef})
                    </span>
                  </div>
                </div>
              </div>

              {/* Scheduled Appointment Banner */}
              {box.appointmentAt ? (
                <div className="flex items-start gap-3 rounded-2xl border border-[#5C1422]/25 bg-[#5C1422]/5 p-4 text-[#5C1422]">
                  <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[#5C1422]" />
                  <div className="text-sm">
                    <p className="font-extrabold">
                      {lang === 'en' ? 'Your Scheduled Lab Appointment' : 'تم تحديد موعدك بالمعمل'}
                    </p>
                    <p className="mt-0.5 text-xs font-bold">{box.appointmentAt}</p>
                    {box.appointmentNote ? (
                      <p className="mt-1 text-xs opacity-85">{box.appointmentNote}</p>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Countdown Timer */}
              {box.status === 'redeemed' ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-900">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-700" />
                  <div className="text-sm">
                    <p className="font-bold">{copy.statusRedeemedTitle}</p>
                    <p className="text-xs text-emerald-800">
                      {formatArabicDate(box.redeemedAt)}
                    </p>
                  </div>
                </div>
              ) : isExpired ? (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-rose-900">
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-700" />
                  <div className="text-sm">
                    <p className="font-bold">{copy.statusExpiredTitle}</p>
                    <p className="text-xs text-rose-800">
                      {formatArabicDate(box.expiresAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#C9962D]/40 bg-[#FFF8EB]/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#5C1422]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#B8860B]" />
                      <span>{copy.remainingTimeTitle}</span>
                    </span>
                    <span className="text-[#7A5600]">
                      {copy.expiresAtPrefix}: {formatArabicDate(box.expiresAt)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
                    {[
                      { label: lang === 'en' ? 'Days' : 'يوم', val: remaining?.days ?? 0 },
                      { label: lang === 'en' ? 'Hrs' : 'ساعة', val: remaining?.hours ?? 0 },
                      { label: lang === 'en' ? 'Min' : 'دقيقة', val: remaining?.minutes ?? 0 },
                      { label: lang === 'en' ? 'Sec' : 'ثانية', val: remaining?.seconds ?? 0 },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="rounded-xl border border-[#C9962D]/40 bg-white px-2 py-2.5"
                      >
                        <div className="font-mono text-xl font-extrabold text-[#5C1422] tabular-nums sm:text-2xl">
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
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#C9962D]/35 bg-[#FAF7F4] px-4 py-3">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {copy.prizeCodeLabel}
                    </div>
                    <div
                      dir="ltr"
                      className="font-mono text-lg font-extrabold tracking-wider text-[#5C1422] tabular-nums"
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
                        <span>{copy.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>{copy.copyCode}</span>
                      </>
                    )}
                  </button>
                </div>

                {cloudSynced === false ? (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-950">
                    <span className="font-bold">
                      {lang === 'en'
                        ? 'Saved locally — tap Retry Sync or send WhatsApp to confirm activation.'
                        : 'تم حفظ جائزتك محلياً — اضغط إعادة المزامنة أو أرسل رسالة الواتساب لتأكيد التفعيل فوراً.'}
                    </span>
                    <button
                      type="button"
                      disabled={retryingCloud}
                      onClick={async () => {
                        if (!box || retryingCloud) return;
                        setRetryingCloud(true);
                        try {
                          let savedPhone = selfPhone.trim();
                          if (!savedPhone) {
                            try {
                              savedPhone =
                                window.localStorage.getItem(`rt_hb_phone_${box.token.toUpperCase()}`) || '';
                            } catch {
                              // ignore
                            }
                          }
                          const ok = await apiClient.syncCachedBoxToCloud(box, savedPhone);
                          setCloudSynced(ok);
                        } finally {
                          setRetryingCloud(false);
                        }
                      }}
                      className="rounded-xl bg-[#5C1422] px-3 py-1.5 text-[11px] font-extrabold text-white hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
                    >
                      {retryingCloud
                        ? lang === 'en'
                          ? 'Syncing...'
                          : 'جاري المزامنة...'
                        : lang === 'en'
                          ? 'Retry Sync'
                          : 'إعادة مزامنة الحجز الآن'}
                    </button>
                  </div>
                ) : cloudSynced === true ? (
                  <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3.5 py-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                    <span>
                      {lang === 'en'
                        ? 'Your prize booking is registered in RT LAB system.'
                        : 'تم تسجيل وتفعيل حجز جائزتك بنجاح في نظام معامل RT.'}
                    </span>
                  </div>
                ) : null}

                <a
                  href={(() => {
                    let savedPhone = selfPhone.trim();
                    if (!savedPhone && box) {
                      try {
                        savedPhone =
                          window.localStorage.getItem(`rt_hb_phone_${box.token.toUpperCase()}`) || '';
                      } catch {
                        // ignore
                      }
                    }
                    return buildPatientClaimWhatsAppUrl(box, labProfile, savedPhone);
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-[#5C1422] px-6 py-3.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#7A1C2E]"
                >
                  <MessageCircle className="h-5 w-5 text-[#E7C15A]" />
                  <span>{copy.sendWhatsApp}</span>
                </a>
              </div>

              {/* Slide 10: Loyalty Card + Friend Referral */}
              {box.referralCode ? (
                <div className="space-y-3 rounded-2xl border border-[#5C1422]/15 bg-gradient-to-br from-[#FAF7F4] to-[#FFF8EB] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#5C1422]">
                      <Award className="h-4 w-4 text-[#B8860B]" />
                      <span>
                        {copy.loyaltyTitle}:{' '}
                        <span className="rounded-md bg-[#5C1422] px-2 py-0.5 text-[11px] text-[#E7C15A]">
                          {box.loyaltyTier || 'Basic'}
                        </span>
                      </span>
                    </div>
                    <span className="font-mono text-xs font-extrabold text-[#7A5600] tabular-nums">
                      {box.loyaltyPoints ?? 50} {copy.loyaltyPointsLabel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#C9962D]/25 pt-2.5 text-xs">
                    <span className="font-bold text-slate-700">{copy.referralTitle}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopyReferral(box.referralCode!)}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#5C1422] hover:bg-slate-50 cursor-pointer"
                      >
                        {copiedRef ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        <span>{box.referralCode}</span>
                      </button>
                      <a
                        href={buildFriendReferralWhatsAppUrl(
                          box.referralCode,
                          box.clientName,
                          labProfile,
                          shareBaseUrl
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-lg bg-[#C9962D] px-3 py-1 text-[11px] font-extrabold text-[#3A0A14] hover:bg-[#B8860B]"
                      >
                        <Share2 className="h-3 w-3" />
                        <span>{lang === 'en' ? 'Invite Friend' : 'دعوة صديق'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : box && box.status === 'expired' ? (
            /* EXPIRED BEFORE OPENING */
            <div className="flex min-h-[360px] flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                <Clock className="h-8 w-8" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900">
                {copy.statusExpiredTitle}
              </h1>
              <p className="max-w-md text-sm text-slate-600">
                {formatArabicDate(box.expiresAt)}
              </p>
              <a
                href={`https://wa.me/${formatWhatsAppPhone(labProfile.whatsappNumber || labProfile.hotlineNumber)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#5C1422] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#7A1C2E]"
              >
                <MessageCircle className="h-4 w-4 text-[#E7C15A]" />
                <span>{copy.whatsappLab}</span>
              </a>
            </div>
          ) : (
            /* STATE 1: SEALED / INTERACTIVE GAME STAGE (READY TO PLAY) */
            <div className="relative flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-[#FAF7F4] text-slate-500 hover:bg-slate-100 hover:text-[#5C1422] cursor-pointer"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>

              <p className="mb-2 text-xs font-extrabold tracking-wide text-[#B8860B]">
                {box
                  ? lang === 'en'
                    ? `Special Gift For: ${box.clientName}`
                    : `هدية خاصة باسم: ${box.clientName}`
                  : copy.brandSubtitle}
              </p>

              <h1 className="mb-2 text-2xl font-extrabold text-[#5C1422] sm:text-3xl">
                {copy.patientModeTitle}
              </h1>
              <p className="mb-5 max-w-md text-sm leading-relaxed text-slate-600">
                {copy.patientModeLead}
              </p>

              {/* Mode Selector on Universal Mode (Slide 5: 6 interactive experiences) */}
              {!box ? (
                <div className="mb-6 w-full space-y-2">
                  <div className="text-[11px] font-bold text-slate-500">{copy.switchGameLabel}</div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {ALL_GAME_MODES.map((gm) => {
                      const active = selfGameMode === gm;
                      const gmMeta = GAME_MODE_META[gm];
                      return (
                        <button
                          key={gm}
                          type="button"
                          onClick={() => setSelfGameMode(gm)}
                          className={`min-h-[36px] rounded-xl border px-3 py-1.5 text-xs font-extrabold transition-colors cursor-pointer ${
                            active
                              ? 'border-[#5C1422] bg-[#5C1422] text-white shadow-2xs'
                              : 'border-slate-200 bg-[#FAF7F4] text-slate-700 hover:border-[#C9962D]'
                          }`}
                        >
                          {lang === 'en' ? gmMeta.nameEn : gmMeta.nameAr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {errorMsg ? (
                <div className="mb-4 flex w-full max-w-md items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              ) : null}

              {!box && showSelfForm ? (
                <form
                  onSubmit={handleSelfOpenSubmit}
                  className="mt-2 w-full max-w-md space-y-3 rounded-2xl border border-[#C9962D]/40 bg-[#FAF7F4] p-5 text-start"
                >
                  <p className="text-xs font-extrabold text-[#5C1422]">
                    {lang === 'en'
                      ? 'Register your name & WhatsApp to lock and reveal your guaranteed prize:'
                      : 'سجّل اسمك ورقم الواتساب لتثبيت الجائزة وكشفها فوراً:'}
                  </p>
                  {referredBy ? (
                    <div className="rounded-lg border border-[#C9962D]/40 bg-[#FFF8EB] px-3 py-1.5 text-[11px] font-bold text-[#7A5600]">
                      {lang === 'en' ? `Invited by code: ${referredBy}` : `دعوة صديق عبر الكود: ${referredBy}`}
                    </div>
                  ) : null}
                  <input
                    type="text"
                    required
                    value={selfName}
                    onChange={(e) => setSelfName(e.target.value)}
                    placeholder={copy.fullNamePlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#5C1422] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={selfPhone}
                    onChange={(e) => setSelfPhone(e.target.value)}
                    placeholder={copy.phonePlaceholder}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left font-mono text-sm text-slate-900 focus:border-[#5C1422] focus:outline-none"
                  />
                  {labProfile.branches.length > 0 ? (
                    <select
                      value={selfBranch}
                      onChange={(e) => setSelfBranch(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#5C1422] focus:outline-none"
                    >
                      {labProfile.branches.map((br) => (
                        <option key={br} value={br}>
                          {br}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfBirthday}
                      onChange={(e) => setSelfBirthday(e.target.checked)}
                      className="h-4 w-4 accent-[#5C1422]"
                    />
                    <span>
                      {lang === 'en'
                        ? 'My birthday is this month (bonus loyalty points!)'
                        : 'عيد ميلادي هذا الشهر (نقاط ولاء إضافية!)'}
                    </span>
                  </label>
                  <button
                    type="submit"
                    disabled={opening}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#5C1422] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#7A1C2E] disabled:opacity-60 cursor-pointer"
                  >
                    <Gift className="h-5 w-5 text-[#E7C15A]" />
                    <span>
                      {opening
                        ? lang === 'en'
                          ? 'Opening...'
                          : 'جاري الفتح والكشف...'
                        : copy.startPlayBtn}
                    </span>
                  </button>
                </form>
              ) : (
                <div className="flex w-full justify-center py-2">
                  <InteractiveGameStage
                    mode={activeGameMode}
                    lang={lang}
                    opening={opening}
                    campaignName={box?.campaignName || labProfile.activeCampaign}
                    wheelLabels={box?.wheelLabels}
                    onPlay={(pickedIdx) => {
                      if (box) {
                        void handleOpenAssignedBox(pickedIdx);
                      } else {
                        setPendingBoxPick(pickedIdx);
                        setShowSelfForm(true);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* Secondary Column: Guide, Ethics Notice & RT LAB Info */}
        <aside className="flex flex-col justify-between gap-6 rounded-3xl border border-[#C9962D]/30 bg-white p-6 sm:p-8 lg:col-span-5">
          <div className="space-y-5">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
              <img
                src={
                  labProfile.logoUrl === '/logo.jpg'
                    ? DEFAULT_ASSET_LOGO
                    : labProfile.logoUrl || DEFAULT_ASSET_LOGO
                }
                alt={labProfile.labName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = DEFAULT_ASSET_ICON;
                }}
                className="h-14 w-14 shrink-0 rounded-2xl border border-[#C9962D]/40 bg-white object-contain p-1"
              />
              <div>
                <h2 className="text-base font-extrabold text-[#5C1422]">
                  {labProfile.labName}
                </h2>
                <p className="text-xs font-medium text-slate-500">
                  {labProfile.director}
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <h3 className="text-sm font-extrabold text-slate-900">
                {lang === 'en' ? 'How to Claim Your Reward' : 'خطوات استلام هديتك بكل سهولة'}
              </h3>
              <ol className="space-y-2.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#5C1422]/10 font-mono text-xs font-bold text-[#5C1422]">
                    1
                  </span>
                  <span>
                    {lang === 'en'
                      ? 'Play the interactive Happiness Box to unveil your pre-locked reward and unique code.'
                      : 'افتح صندوق الفرحة أو العب اللعبة التفاعلية لإظهار هديتك المخصصة وكود التفعيل.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#5C1422]/10 font-mono text-xs font-bold text-[#5C1422]">
                    2
                  </span>
                  <span>
                    {lang === 'en'
                      ? 'Tap the WhatsApp button to send your prize & terms directly to RT LAB reception.'
                      : 'أرسل رسالة الجائزة بكل شروطها لواتساب المعمل بضغطة واحدة لتأكيد الموعد.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#5C1422]/10 font-mono text-xs font-bold text-[#5C1422]">
                    3
                  </span>
                  <span>
                    {lang === 'en'
                      ? 'Redeem at any RT branch or home visit before the countdown expires.'
                      : 'استفد من الجائزة بالفرع أو السحب المنزلي قبل انتهاء العداد الزمني المحدد.'}
                  </span>
                </li>
              </ol>
            </div>

            {/* Slide 9: Ethical & Medical Transparency Box */}
            <div className="rounded-2xl border border-[#C9962D]/35 bg-[#FFF8EB]/70 p-4 text-xs leading-relaxed text-slate-700">
              <div className="mb-1 flex items-center gap-1.5 font-extrabold text-[#5C1422]">
                <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
                <span>{lang === 'en' ? 'Medical Integrity & Clarity' : 'ميثاق المصداقية والشفافية الطبية'}</span>
              </div>
              <p>{copy.ethicsNote}</p>
            </div>
          </div>

          <div className="space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#5C1422]" />
              <span>{labProfile.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-[#5C1422]" />
              <span>{labProfile.workingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-[#5C1422]" />
              <span dir="ltr" className="font-mono font-bold text-[#5C1422]">
                {labProfile.hotlineNumber}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
