import { RefreshCw, WifiOff } from 'lucide-react';
import type { AppLang } from '../types';
import { UI_COPY } from '../i18n/translations';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  lang: AppLang;
}

export function OfflineIndicator({ lang }: OfflineIndicatorProps) {
  const { isOnline, pendingCount, isSyncing, triggerSync } = useOnlineStatus();
  const copy = UI_COPY[lang];

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div
      role="status"
      className={`border-b px-4 py-2 text-xs font-bold ${
        !isOnline
          ? 'border-amber-300 bg-amber-50 text-amber-950'
          : 'border-[#C9962D]/35 bg-[#FFF8EB] text-[#5C1422]'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="h-4 w-4 shrink-0 text-amber-700" />
          ) : (
            <RefreshCw className={`h-4 w-4 shrink-0 text-[#5C1422] ${isSyncing ? 'animate-spin' : ''}`} />
          )}
          <span>
            {!isOnline ? copy.offlineBanner : copy.syncingBanner}
            {pendingCount > 0 ? ` (${pendingCount} ${copy.pendingSyncSuffix})` : ''}
          </span>
        </div>
        {isOnline && pendingCount > 0 && !isSyncing ? (
          <button
            type="button"
            onClick={() => void triggerSync()}
            className="rounded-lg bg-[#5C1422] px-3 py-1 text-[11px] font-extrabold text-white hover:bg-[#7A1C2E] cursor-pointer"
          >
            {lang === 'en' ? 'Sync Now' : 'مزامنة الآن'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
