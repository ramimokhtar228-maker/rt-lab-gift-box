import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { Globe, Lock, MessageCircle } from 'lucide-react';
import type { AppLang, LabProfile } from './types';
import { ADMIN_BOOTSTRAP_EMAIL, auth } from './firebase';
import { UI_COPY } from './i18n/translations';
import { apiClient, DEFAULT_LAB_PROFILE } from './services/apiClient';
import { formatWhatsAppPhone, resolvePublicBaseUrl } from './utils/whatsapp';
import { PatientBoxView } from './components/PatientBoxView';
import { AdminPanelView } from './components/AdminPanelView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_ASSET_LOGO = `${BASE_PATH}logo.jpg`;
const DEFAULT_ASSET_ICON = `${BASE_PATH}icon.svg`;

const PENDING_ACTIVATE_STORAGE_KEY = 'rt_hb_pending_activate';
const PENDING_SHARE_STORAGE_KEY = 'rt_hb_pending_share_text';

function readInitialUrlState(): {
  token: string | null;
  encodedData: string | null;
  wantsAdmin: boolean;
  referredBy: string | null;
  activateCode: string | null;
  shareText: string | null;
} {
  if (typeof window === 'undefined') {
    return {
      token: null,
      encodedData: null,
      wantsAdmin: false,
      referredBy: null,
      activateCode: null,
      shareText: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const token = params.get('box') || params.get('token') || params.get('t') || null;
  const encodedData = params.get('d') || null;
  const referredBy = params.get('ref') || null;
  const urlActivate = params.get('activate') || null;
  if (urlActivate) {
    try {
      window.sessionStorage.setItem(PENDING_ACTIVATE_STORAGE_KEY, urlActivate);
    } catch {
      // ignore
    }
  }
  let storedActivate: string | null = null;
  if (!urlActivate) {
    try {
      storedActivate = window.sessionStorage.getItem(PENDING_ACTIVATE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  const activateCode = urlActivate || storedActivate;

  const urlShareParts = [
    params.get('share_title'),
    params.get('share_text'),
    params.get('share_url'),
  ]
    .filter(Boolean)
    .join('\n')
    .trim();
  if (urlShareParts) {
    try {
      window.sessionStorage.setItem(PENDING_SHARE_STORAGE_KEY, urlShareParts);
    } catch {
      // ignore
    }
  }
  let storedShare: string | null = null;
  if (!urlShareParts) {
    try {
      storedShare = window.sessionStorage.getItem(PENDING_SHARE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  const shareText = urlShareParts || storedShare || null;

  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();
  const wantsAdmin =
    Boolean(urlActivate) ||
    Boolean(urlShareParts) ||
    params.get('view') === 'admin' ||
    params.get('admin') === '1' ||
    params.get('admin') === 'true' ||
    params.has('admin') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    /\/admin\/?$/.test(path);
  return { token, encodedData, wantsAdmin, referredBy, activateCode, shareText };
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Application error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="flex min-h-screen items-center justify-center bg-[#FAF7F4] p-6 text-center">
          <div className="max-w-md space-y-4 rounded-3xl border border-[#C9962D]/35 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-extrabold text-[#5C1422]">حدث خطأ غير متوقع</h1>
            <p className="text-xs leading-relaxed text-slate-600">
              يرجى تحديث الصفحة للمتابعة. التطبيق يدعم العمل أوفلاين ويحتفظ بالبيانات محلياً.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#5C1422] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#7A1C2E] cursor-pointer"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function isAuthorizedAdminUser(user: User | null): boolean {
  if (!user || !user.email || !user.emailVerified) return false;
  return user.email.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
}

function AppContent() {
  const initial = useMemo(() => readInitialUrlState(), []);
  const [lang, setLang] = useState<AppLang>(() => {
    try {
      const saved = window.localStorage.getItem('rt_hb_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });
  const [labProfile, setLabProfile] = useState<LabProfile>(DEFAULT_LAB_PROFILE);
  const [serverShareBaseUrl, setServerShareBaseUrl] = useState<string>('');
  const [boxToken, setBoxToken] = useState<string | null>(initial.token);
  const [encodedBoxData, setEncodedBoxData] = useState<string | null>(initial.encodedData);
  const [pendingActivateCode, setPendingActivateCode] = useState<string | null>(initial.activateCode);
  const [pendingShareText, setPendingShareText] = useState<string | null>(initial.shareText);

  const [authReady, setAuthReady] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [view, setView] = useState<'box' | 'admin'>('box');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem('rt_hb_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const authorized = isAuthorizedAdminUser(user);
      setIsAdminAuthed(authorized);
      setAuthReady(true);
      if (initial.wantsAdmin) {
        if (authorized) {
          setView('admin');
          setIsLoginModalOpen(false);
        } else {
          setView('box');
          setIsLoginModalOpen(true);
        }
      }
    });
    return () => unsub();
  }, [initial.wantsAdmin]);

  useEffect(() => {
    apiClient
      .getPublicConfig(initial.encodedData)
      .then((d) => {
        if (d?.labProfile) {
          setLabProfile(d.labProfile);
        }
        if (typeof d?.shareBaseUrl === 'string') {
          setServerShareBaseUrl(d.shareBaseUrl);
        }
      })
      .catch(() => undefined);

    const unsubPublic = apiClient.subscribePublicProfile((updatedProfile, updatedBase) => {
      setLabProfile((prev) => ({
        ...prev,
        ...updatedProfile,
      }));
      if (updatedBase) {
        setServerShareBaseUrl(updatedBase);
      }
    });

    return () => unsubPublic();
  }, [initial.encodedData]);

  const publicShareBaseUrl = resolvePublicBaseUrl(serverShareBaseUrl, labProfile.shareBaseUrl);

  const syncUrl = (nextView: 'box' | 'admin', nextToken: string | null) => {
    try {
      const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
      const params = new URLSearchParams();
      if (nextView === 'admin') {
        params.set('view', 'admin');
      } else if (nextToken) {
        params.set('box', nextToken);
      }
      const qs = params.toString();
      const target = `${basePath || ''}/${qs ? `?${qs}` : ''}`;
      window.history.replaceState({}, '', target);
    } catch {
      // ignore history errors
    }
  };

  const handleAdminClick = () => {
    if (authReady && isAdminAuthed) {
      setView('admin');
      syncUrl('admin', null);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAuthenticated = () => {
    setIsAdminAuthed(true);
    setIsLoginModalOpen(false);
    setView('admin');
    syncUrl('admin', null);
  };

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setIsAdminAuthed(false);
    setView('box');
    syncUrl('box', boxToken);
  }, [boxToken]);

  const handlePreviewBox = (token?: string) => {
    const nextToken = token ?? boxToken;
    setBoxToken(nextToken || null);
    setView('box');
    syncUrl('box', nextToken || null);
  };

  const whatsappHref = `https://wa.me/${formatWhatsAppPhone(
    labProfile.whatsappNumber || labProfile.hotlineNumber
  )}`;
  const copy = UI_COPY[lang];

  return (
    <div dir={lang === 'en' ? 'ltr' : 'rtl'} className="flex min-h-screen flex-col bg-[#FAF7F4] text-slate-900">
      {/* Clean 3-Zone Top Bar — RT Burgundy & Gold */}
      <header className="sticky top-0 z-30 border-b border-[#C9962D]/30 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
          {/* Zone 1: Brand Wordmark + Logo */}
          <button
            type="button"
            onClick={() => handlePreviewBox(undefined)}
            className="flex items-center gap-2.5 text-sm font-extrabold tracking-tight text-[#5C1422] whitespace-nowrap shrink-0 cursor-pointer sm:text-base"
          >
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
              className="h-9 w-9 shrink-0 rounded-xl border border-[#C9962D]/50 bg-white object-contain p-0.5"
            />
            <span className="truncate max-w-[155px] sm:max-w-none">{labProfile.labName}</span>
          </button>

          {/* Zone 2: Bilingual Brand Subtitle (Desktop) */}
          <p className="hidden text-xs font-bold text-[#7A1C2E]/80 lg:block whitespace-nowrap">
            {copy.brandSubtitle}
          </p>

          {/* Zone 3: Language Switcher + PWA Install + WhatsApp */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLang((prev) => (prev === 'ar' ? 'en' : 'ar'))}
              aria-label="Toggle language"
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-extrabold text-[#5C1422] hover:bg-[#FAF7F4] cursor-pointer whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 text-[#B8860B]" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            <PWAInstallButton lang={lang} variant="header" />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#5C1422] px-3.5 py-2 text-xs font-extrabold text-white transition-colors hover:bg-[#7A1C2E] whitespace-nowrap shrink-0"
            >
              <MessageCircle className="h-4 w-4 text-[#E7C15A]" />
              <span className="hidden sm:inline">{copy.whatsappLab}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Real-time Offline / Sync Queue Status Bar */}
      <OfflineIndicator lang={lang} />

      {/* Main Content */}
      <main className="flex-1">
        {view === 'admin' && isAdminAuthed ? (
          <AdminPanelView
            shareBaseUrl={publicShareBaseUrl}
            lang={lang}
            pendingActivateCode={pendingActivateCode}
            pendingShareText={pendingShareText}
            onActivationHandled={() => {
              setPendingActivateCode(null);
              try {
                window.sessionStorage.removeItem(PENDING_ACTIVATE_STORAGE_KEY);
              } catch {
                // ignore
              }
              syncUrl('admin', null);
            }}
            onShareHandled={() => {
              setPendingShareText(null);
              try {
                window.sessionStorage.removeItem(PENDING_SHARE_STORAGE_KEY);
              } catch {
                // ignore
              }
              syncUrl('admin', null);
            }}
            onLogout={handleLogout}
            onProfileUpdated={setLabProfile}
            onPreviewBox={(t) => {
              setEncodedBoxData(null);
              handlePreviewBox(t);
            }}
          />
        ) : (
          <PatientBoxView
            token={boxToken}
            encodedData={encodedBoxData}
            referredBy={initial.referredBy}
            lang={lang}
            labProfile={labProfile}
            shareBaseUrl={publicShareBaseUrl}
            onBoxAssigned={(t) => {
              setBoxToken(t);
              setEncodedBoxData(null);
              syncUrl('box', t);
            }}
          />
        )}
      </main>

      {/* Quiet Footer with Discreet Admin Lock Trigger */}
      <footer className="border-t border-[#C9962D]/25 bg-white py-4 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="font-extrabold text-[#5C1422]">{labProfile.labName}</span>
            <span aria-hidden="true">·</span>
            <span>{labProfile.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span dir="ltr" className="font-mono font-semibold text-slate-600">
              {labProfile.hotlineNumber}
            </span>
            <button
              type="button"
              onClick={handleAdminClick}
              aria-label={copy.adminAccess}
              className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-[#5C1422] cursor-pointer whitespace-nowrap"
            >
              <Lock className="h-3 w-3" />
              <span>{copy.adminAccess}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Google Auth Admin Gate Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        pendingActivateCode={pendingActivateCode}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
