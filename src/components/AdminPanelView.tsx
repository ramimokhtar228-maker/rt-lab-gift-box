import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  DatabaseBackup,
  Gift,
  Link2,
  LogOut,
  Settings,
} from 'lucide-react';
import type { AdminDashboardData, LabProfile } from '../types';
import { apiClient } from '../services/apiClient';
import { copyToClipboard } from '../utils/whatsapp';
import { AdminLinksTab } from './AdminLinksTab';
import { AdminPrizesTab } from './AdminPrizesTab';
import { AdminPricesBackupTab } from './AdminPricesBackupTab';
import { AdminSettingsTab } from './AdminSettingsTab';

interface AdminPanelViewProps {
  adminToken: string;
  shareBaseUrl: string;
  onLogout: () => void;
  onSessionExpired: () => void;
  onProfileUpdated: (profile: LabProfile) => void;
  onPreviewBox: (token?: string) => void;
}

type AdminTab = 'links' | 'prizes' | 'prices' | 'settings';

export function AdminPanelView({
  adminToken,
  shareBaseUrl,
  onLogout,
  onSessionExpired,
  onProfileUpdated,
  onPreviewBox,
}: AdminPanelViewProps) {
  const [tab, setTab] = useState<AdminTab>('links');
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [toast, setToast] = useState<{ text: string; isError: boolean } | null>(null);

  const callbacksRef = useRef({ onSessionExpired, onProfileUpdated });
  callbacksRef.current = { onSessionExpired, onProfileUpdated };

  const showToast = useCallback((text: string, isError = false) => {
    setToast({ text, isError });
    window.setTimeout(() => {
      setToast((curr) => (curr?.text === text ? null : curr));
    }, 3600);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const json = await apiClient.getAdminDashboard(adminToken);
      if (json.status === 401) {
        callbacksRef.current.onSessionExpired();
        return;
      }
      if (json.ok && json.labProfile && json.prizes && json.giftLinks && json.prices && json.stats) {
        setData({
          labProfile: json.labProfile,
          prizes: json.prizes,
          giftLinks: json.giftLinks,
          prices: json.prices,
          stats: json.stats,
        });
        callbacksRef.current.onProfileUpdated(json.labProfile);
      }
    } catch {
      showToast('تعذر تحميل بيانات لوحة الإدارة.', true);
    } finally {
      setLoading(false);
    }
  }, [adminToken, showToast]);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  if (loading || !data) {
    return (
      <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-slate-200 border-t-teal-700" />
          <span className="text-sm font-semibold">جاري تحميل لوحة الإدارة...</span>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Link2 }[] = [
    { id: 'links', label: 'الروابط والردود', icon: Link2 },
    { id: 'prizes', label: 'جوائز البوكس', icon: Gift },
    { id: 'settings', label: 'بيانات المعمل واللوجو', icon: Settings },
    { id: 'prices', label: 'النسخ الاحتياطي والأسعار', icon: DatabaseBackup },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      {/* Admin Subheader */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">
            إدارة برنامج Happiness Box · {data.labProfile.labName}
          </h1>
          <p className="text-xs text-slate-500">
            أنشئ روابط المرضى، عدّل الجوائز ومدتها، ثبّت الأسعار، وصدّر أو استورد نسخة كاملة بسهولة.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={async () => {
              const adminUrl = `${(shareBaseUrl || window.location.origin).replace(/\/$/, '')}/?view=admin`;
              const ok = await copyToClipboard(adminUrl);
              if (ok) {
                setCopiedAdminLink(true);
                window.setTimeout(() => setCopiedAdminLink(false), 1800);
                showToast('تم نسخ رابط لوحة الإدارة المباشر.');
              }
            }}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-900 hover:bg-teal-100 cursor-pointer whitespace-nowrap"
          >
            {copiedAdminLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedAdminLink ? 'تم نسخ رابط الإدارة' : 'نسخ رابط الإدارة'}</span>
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
            <span>قفل الإدارة</span>
          </button>
        </div>
      </div>

      {/* KPI Row (4 clean metrics, tabular-nums) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'إجمالي الروابط', value: data.stats.totalLinks, accent: 'text-slate-900' },
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
          adminToken={adminToken}
          shareBaseUrl={shareBaseUrl}
          onRefresh={fetchDashboard}
          onPreviewBox={(t) => onPreviewBox(t)}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'prizes' ? (
        <AdminPrizesTab
          prizes={data.prizes}
          adminToken={adminToken}
          onRefresh={fetchDashboard}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'prices' ? (
        <AdminPricesBackupTab
          prices={data.prices}
          adminToken={adminToken}
          onRefresh={fetchDashboard}
          onNotify={showToast}
        />
      ) : null}

      {tab === 'settings' ? (
        <AdminSettingsTab
          labProfile={data.labProfile}
          adminToken={adminToken}
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
