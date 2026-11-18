import { useCallback, useEffect, useState } from 'react';
import { apiClient, getOfflineQueueCount, syncOfflineQueue } from '../services/apiClient';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [pendingCount, setPendingCount] = useState<number>(() => getOfflineQueueCount());
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshQueueCount = useCallback(() => {
    setPendingCount(getOfflineQueueCount());
  }, []);

  const triggerSync = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return 0;
    setIsSyncing(true);
    try {
      const [queueSynced, cachedSynced] = await Promise.all([
        syncOfflineQueue(),
        apiClient.syncAllCachedBoxesToCloud(),
      ]);
      setPendingCount(getOfflineQueueCount());
      return queueSynced + cachedSynced;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      void triggerSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
      refreshQueueCount();
    };
    const handleQueueChange = () => {
      refreshQueueCount();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && (typeof navigator === 'undefined' || navigator.onLine)) {
        void triggerSync();
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('rt-offline-queue-updated', handleQueueChange);
    document.addEventListener('visibilitychange', handleVisibility);

    if (typeof navigator === 'undefined' || navigator.onLine) {
      void triggerSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('rt-offline-queue-updated', handleQueueChange);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshQueueCount, triggerSync]);

  useEffect(() => {
    if (!isOnline || pendingCount <= 0) return;
    const retryTimer = window.setInterval(() => {
      if (typeof navigator === 'undefined' || navigator.onLine) {
        void triggerSync();
      }
    }, 15000);
    return () => window.clearInterval(retryTimer);
  }, [isOnline, pendingCount, triggerSync]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    triggerSync,
    refreshQueueCount,
  };
}
