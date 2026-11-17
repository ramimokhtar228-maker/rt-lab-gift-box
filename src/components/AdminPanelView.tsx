import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  DatabaseBackup,
  Gift,
  Link2,
  LogOut,
  RefreshCw,
  Settings,
} from 'lucide-react';
import type { AdminDashboardData, LabProfile } from '../types';
import { apiClient } from '../services/apiClient';
import { copyToClipboard } from '../utils/whatsapp';
import { AdminLinksTab } from './AdminLinksTab';
import { AdminPrizesTab } from './AdminPrizesTab';
import { AdminPricesBackupTab } from './AdminPricesBackupTab';
import { AdminSettingsTab } from './AdminSettingsTab';

type AdminTab = 'links' | 'prizes' | 'settings' | 'prices';

interface AdminPanelViewProps {
  shareBaseUrl: string;
  onLogout: () => void;
  onProfileUpdated: (profile: LabProfile) => void;
  onPreviewBox: (token?: string) => void;
}

export function AdminPanelView({
  shareBaseUrl,
  onLogout,
  onProfileUpdated,
  onPreviewBox,
}: AdminPanelViewProps) {
  const [tab, setTab] = useState<AdminTab>('links');
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<'admin' | 'patient' | null>(null);
  const [toast, setToast] = useState<{ text: string; isError: boolean } | null>(null);

  const callbacksRef = useRef({ onProfileUpdated });
  callbacksRef.current = { onProfileUpdated };

  const showToast = useCallback((text: string, isError = false) => {
    setToast({ text, isError });
    window.setTimeout(() => {
      setToast((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  }, []);

  const runForceSync = useCallback(
    async (silent = false) => {
      setSyncing(true);
      try {
        const res = await apiClient.forceSyncServerDashboard();
        setData(res.dashboardData);
        callbacksRef.current.onProfileUpdated(res.dashboardData.labProfile);
        setLastSyncedAt(
          new Date().toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
        if (!silent) {
          if (res.recoveredLocalCount > 0) {
            showToast(
              `تم تنشيط المزامنة وجلب ${res.dashboardData.stats.totalLinks} سجل، وتم تفعيل ${res.recoveredLocalCount} حجز محلي غير مسمّع.`
            );
          } else {
            showToast(
              `تم تنشيط المزامنة المباشرة بنجاح — إجمالي السجلات المحدثة من السحابة: ${res.dashboardData.stats.totalLinks}.`
            );
          }
        } else if (res.recoveredLocalCount > 0) {
          showToast(
            `تم اكتشاف ومزامنة ${res.recoveredLocalCount} حجز محلي غير مسمّع في السجل بنجاح.`
          );
        }
      } catch (err) {
        console.error('Force sync error:', err);
        if (!silent) {
          showToast('تعذر تنشيط المزامنة من السحابة حالياً. تحقق من الاتصال أو صلاحية الحساب.', true);
        }
      } finally {
        setSyncing(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      try {
        await apiClient.ensureInitialSeed();
      } catch (err) {
        if (!cancelled) {
          console.error('Seed check error:', err);
          showToast('تعذر تهيئة قاعدة البيانات السحابية. تأكد من تسجيل الدخول بالحساب المصرح.', true);
        }
      }

      if (cancelled) return;

      unsub = apiClient.subscribeAdminDashboard(
        (snapshotData) => {
          setData(snapshotData);
          callbacksRef.current.onProfileUpdated(snapshotData.labProfile);
          setLastSyncedAt(
            new Date().toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          );
          setLoading(false);
        },
        (err) => {
          console.error('Dashboard subscription error:', err);
          showToast('تعذر قراءة بيانات المرضى من السحابة — تأكد من صلاحية الحساب.', true);
          setLoading(false);
        }
      );

      // Run one authoritative server sync + localStorage booking recovery in background
      void runForceSync(true);
    })();

    return () => {
      cancelled = true;
      if (unsub) unsub();
    };
  }, [runForceSync, showToast]);

  const handleTabRefresh = useCallback(async () => {
    await runForceSync(true);
  }, [runForceSync]);

  if (loading || !data) {
    return (
      <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-teal-700" />
          <span className="text-sm font-semibold">جاري مزامنة بيانات المرضى ولوحة الإدارة...</span>
        </div>
      </div>
    );
  }

  const normalizedPublicBase = (
    shareBaseUrl ||
    data.labProfile.shareBaseUrl ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/$/, '');

  const currentOrigin =
    typeof window !== 'undefined'
      ? `${window.location.origin}${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}`
      : normalizedPublicBase;
  const authorizedAdminOrigin = currentOrigin.includes('://ais-dev-')
    ? currentOrigin.replace('://ais-dev-', '://ais-pre-')
    : currentOrigin;
  const directAdminSyncUrl = `${authorizedAdminOrigin}/?view=admin`;
  const patientSyncUrl = normalizedPublicBase;

  const tabs: { id: AdminTab; label: string; icon: typeof Link2 }[] = [
    { id: 'links', label: 'المرضى والروابط والمواعيد', icon: Link2 },
    { id: 'prizes', label: 'جوائز البوكس', icon: Gift },
    { id: 'settings', label: 'بيانات المعمل واللوجو', icon: Settings },
    { id: 'prices', label: 'النسخ الاحتياطي والأسعار', icon: DatabaseBackup },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {/* Admin Subheader */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">
              إدارة برنامج Happiness Box · {data.labProfile.labName}
            </h1>
            <p className="text-xs text-slate-500">
              مزامنة سحابية مباشرة: كل مريض يفتح الصندوق يظهر هنا فوراً لتأكيد فوزه وتحديد الموعد أو التصدير إلى Excel.
              {lastSyncedAt ? ` (آخر تحديث: ${lastSyncedAt})` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={syncing}
              onClick={() => void runForceSync(false)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-teal-700 px-3.5 py-2 text-xs font-extrabold text-white shadow-xs transition-colors hover:bg-teal-800 disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'جاري التنشيط والمزامنة...' : 'تنشيط المزامنة وجلب الحجوزات'}</span>
            </button>
            <button
              type="button"
              onClick={() => onPreviewBox()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>عرض صفحة المريض</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Active Sync Links Strip */}
        <div className="grid grid-cols-1 gap-2.5 border-t border-slate-100 pt-3.5 md:grid-cols-2">
          <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-slate-500">
                رابط المزامنة العام للمرضى (يسمّع تلقائياً هنا)
              </span>
              <span dir="ltr" className="block truncate font-mono text-xs font-semibold text-slate-800">
                {patientSyncUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(patientSyncUrl);
                if (ok) {
                  setCopiedKey('patient');
                  window.setTimeout(() => setCopiedKey(null), 1800);
                  showToast('تم نسخ رابط المزامنة العام للمرضى.');
                }
              }}
              className="inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {copiedKey === 'patient' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'patient' ? 'نُسخ' : 'نسخ'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-xl border border-teal-200 bg-teal-50/50 px-3 py-2">
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-teal-800">
                رابط المزامنة المباشر للوحة الإدارة (المصرح)
              </span>
              <span dir="ltr" className="block truncate font-mono text-xs font-semibold text-teal-950">
                {directAdminSyncUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(directAdminSyncUrl);
                if (ok) {
                  setCopiedKey('admin');
                  window.setTimeout(() => setCopiedKey(null), 1800);
                  showToast('تم نسخ رابط لوحة الإدارة المباشر.');
                }
              }}
              className="inline-flex min-h-[34px] shrink-0 items-center gap-1 rounded-lg border border-teal-200 bg-white px-2.5 py-1 text-xs font-bold text-teal-900 hover:bg-teal-100 cursor-pointer"
            >
              {copiedKey === 'admin' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'admin' ? 'نُسخ' : 'نسخ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'إجمالي السجلات والروابط', value: data.stats.totalLinks, accent: 'text-slate-900' },
          { label: 'كسب (بانتظار الصرف)', value: data.stats.openedLinks, accent: 'text-amber-700' },
          { label: 'تم صرفها بالمعمل', value: data.stats.redeemedLinks, accent: 'text-emerald-700' },
          { label: 'جوائز نشطة بالبوكس', value: data.stats.activePrizes, accent: 'text-teal-800' },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
          >
            <div className="text-xs font-semibold text-slate-500">{kpi.label}</div>
            <div className={`mt-1 font-mono text-2xl font-extrabold tabular-nums ${kpi.accent}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toast ? (
        <div
          role="status"
          className={`rounded-2xl border px-4 py-3 text-xs font-bold ${
            toast.isError
              ? 'border-rose-200 bg-rose-50 text-rose-800'
              : 'border-emerald-200 bg-emerald-50 text-emerald-900'
          }`}
        >
          {toast.text}
        </div>
      ) : null}

      {/* Active Tab Content */}
      {tab === 'links' ? (
        <AdminLinksTab
          links={data.giftLinks}
          prizes={data.prizes}
          labProfile={data.labProfile}
          shareBaseUrl={shareBaseUrl}
          onRefresh={handleTabRefresh}
          onPreviewBox={(t) => onPreviewBox(t)}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'prizes' ? (
        <AdminPrizesTab
          prizes={data.prizes}
          onRefresh={handleTabRefresh}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'prices' ? (
        <AdminPricesBackupTab
          dashboardData={data}
          onRefresh={handleTabRefresh}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'settings' ? (
        <AdminSettingsTab
          labProfile={data.labProfile}
          onProfileSaved={(updated) => {
            setData((prev) => (prev ? { ...prev, labProfile: updated } : prev));
            onProfileUpdated(updated);
          }}
          onNotify={showToast}
        />
      ) : null}
    </div>
  );
}
