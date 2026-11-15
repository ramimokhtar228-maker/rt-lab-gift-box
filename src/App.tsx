import { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { Lock, MessageCircle } from 'lucide-react';
import type { LabProfile } from './types';
import { ADMIN_BOOTSTRAP_EMAIL, auth } from './firebase';
import { apiClient, DEFAULT_LAB_PROFILE } from './services/apiClient';
import { formatWhatsAppPhone, resolvePublicBaseUrl } from './utils/whatsapp';
import { PatientBoxView } from './components/PatientBoxView';
import { AdminPanelView } from './components/AdminPanelView';
import { AdminLoginModal } from './components/AdminLoginModal';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const DEFAULT_ASSET_LOGO = `${BASE_PATH}logo.jpg`;
const DEFAULT_ASSET_ICON = `${BASE_PATH}icon.svg`;

function readInitialUrlState(): { token: string | null; encodedData: string | null; wantsAdmin: boolean } {
  if (typeof window === 'undefined') return { token: null, encodedData: null, wantsAdmin: false };
  const params = new URLSearchParams(window.location.search);
  const token = params.get('box') || params.get('token') || params.get('t') || null;
  const encodedData = params.get('d') || null;
  const hash = (window.location.hash || '').toLowerCase();
  const path = (window.location.pathname || '').toLowerCase();
  const wantsAdmin =
    params.get('view') === 'admin' ||
    params.get('admin') === '1' ||
    params.get('admin') === 'true' ||
    params.has('admin') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    /\/admin\/?$/.test(path);
  return { token, encodedData, wantsAdmin };
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
        <div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
          <div className="max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-extrabold text-slate-900">حدث خطأ غير متوقع</h1>
            <p className="text-xs leading-relaxed text-slate-600">
              يرجى تحديث الصفحة للمتابعة. في حال استمرار المشكلة تأكد من اتصالك بالإنترنت وصلاحيات الحساب.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-teal-800 cursor-pointer"
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
  const [labProfile, setLabProfile] = useState<LabProfile>(DEFAULT_LAB_PROFILE);
  const [serverShareBaseUrl, setServerShareBaseUrl] = useState<string>('');
  const [boxToken, setBoxToken] = useState<string | null>(initial.token);
  const [encodedBoxData, setEncodedBoxData] = useState<string | null>(initial.encodedData);

  const [authReady, setAuthReady] = useState(false);
  const [isAdminAuthed, setIsAdminAuthed] = useState(false);
  const [view, setView] = useState<'box' | 'admin'>('box');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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

  return (
    <div dir="rtl" className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:gap-8 sm:px-6">
          {/* Zone 1: Brand Wordmark + Logo */}
          <button
            type="button"
            onClick={() => handlePreviewBox(undefined)}
            className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer sm:text-lg"
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
              className="h-9 w-9 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-0.5"
            />
            <span className="truncate max-w-[200px] sm:max-w-none">{labProfile.labName}</span>
          </button>

          {/* Zone 2: Minimalist Clean Tagline (Desktop only) */}
          <p className="hidden text-xs font-semibold text-slate-500 md:block whitespace-nowrap">
            Happiness Box · صندوق السعادة
          </p>

          {/* Zone 3: Primary WhatsApp Action */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-extrabold text-white transition-colors hover:bg-teal-800 whitespace-nowrap shrink-0"
            >
              <MessageCircle className="h-4 w-4" />
              <span>واتساب المعمل</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {view === 'admin' && isAdminAuthed ? (
          <AdminPanelView
            shareBaseUrl={publicShareBaseUrl}
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
            labProfile={labProfile}
            onBoxAssigned={(t) => {
              setBoxToken(t);
              setEncodedBoxData(null);
              syncUrl('box', t);
            }}
          />
        )}
      </main>

      {/* Quiet Footer with Discreet Admin Lock Trigger */}
      <footer className="border-t border-slate-200 bg-white py-4 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="font-bold text-slate-700">{labProfile.labName}</span>
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
              aria-label="دخول الإدارة"
              className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-slate-700 cursor-pointer whitespace-nowrap"
            >
              <Lock className="h-3 w-3" />
              <span>الإدارة</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Google Auth Admin Gate Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
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
