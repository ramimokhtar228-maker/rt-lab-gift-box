import { useCallback, useEffect, useMemo, useState } from 'react';
import { Lock, MessageCircle } from 'lucide-react';
import type { LabProfile } from './types';
import { PatientBoxView } from './components/PatientBoxView';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPanelView } from './components/AdminPanelView';
import { apiClient, DEFAULT_ASSET_ICON, DEFAULT_ASSET_LOGO } from './services/apiClient';
import { formatWhatsAppPhone, resolvePublicBaseUrl } from './utils/whatsapp';

const FALLBACK_LAB_PROFILE: LabProfile = {
  labName: 'معامل RT للتحاليل التشخيصية',
  tagline: 'دقة التشخيص .. رعاية متكاملة لأجل صحتك',
  director: 'د. رامي مختار — استشاري الباثولوجيا الإكلينيكية',
  hotlineNumber: '01100046841',
  whatsappNumber: '201100874444',
  address: 'ميدان بهتيم، برج صيدلية العزبي، الدور الثالث، شبرا الخيمة',
  workingHours: 'يومياً من 10:00 صباحاً إلى 10:00 مساءً',
  branches: ['الفرع الرئيسي - شبرا الخيمة', 'وحدة السحب المنزلي السريع'],
  logoUrl: DEFAULT_ASSET_LOGO,
  whatsappInviteTemplate: '',
  whatsappWinnerReplyTemplate: '',
  whatsappPatientClaimTemplate: '',
};

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

export default function App() {
  const initial = useMemo(() => readInitialUrlState(), []);
  const [labProfile, setLabProfile] = useState<LabProfile>(FALLBACK_LAB_PROFILE);
  const [serverShareBaseUrl, setServerShareBaseUrl] = useState<string>('');
  const [boxToken, setBoxToken] = useState<string | null>(initial.token);
  const [encodedBoxData, setEncodedBoxData] = useState<string | null>(initial.encodedData);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return window.sessionStorage.getItem('rt_hb_admin_token');
    } catch {
      return null;
    }
  });
  const [view, setView] = useState<'box' | 'admin'>(() =>
    initial.wantsAdmin && adminToken ? 'admin' : 'box'
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(
    () => initial.wantsAdmin && !adminToken
  );

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
    if (adminToken) {
      setView('admin');
      syncUrl('admin', null);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAuthenticated = (token: string) => {
    setAdminToken(token);
    try {
      window.sessionStorage.setItem('rt_hb_admin_token', token);
    } catch {
      // ignore storage errors
    }
    setIsLoginModalOpen(false);
    setView('admin');
    syncUrl('admin', null);
  };

  const handleLogout = useCallback(() => {
    setAdminToken(null);
    try {
      window.sessionStorage.removeItem('rt_hb_admin_token');
    } catch {
      // ignore storage errors
    }
    setView('box');
    syncUrl('box', boxToken);
  }, [boxToken]);

  const handleSessionExpired = useCallback(() => {
    setAdminToken(null);
    try {
      window.sessionStorage.removeItem('rt_hb_admin_token');
    } catch {
      // ignore storage errors
    }
    setView('box');
    setIsLoginModalOpen(true);
  }, []);

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
              src={labProfile.logoUrl === '/logo.jpg' ? DEFAULT_ASSET_LOGO : labProfile.logoUrl || DEFAULT_ASSET_LOGO}
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
        {view === 'admin' && adminToken ? (
          <AdminPanelView
            adminToken={adminToken}
            shareBaseUrl={publicShareBaseUrl}
            onLogout={handleLogout}
            onSessionExpired={handleSessionExpired}
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

      {/* Hidden Password Gate Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}
