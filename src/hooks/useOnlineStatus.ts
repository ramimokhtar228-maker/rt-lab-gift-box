import { useCallback, useEffect, useState } from 'react';
import { getOfflineQueueCount, syncOfflineQueue } from '../services/apiClient';

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
    const count = getOfflineQueueCount();
    if (count === 0) return 0;
    setIsSyncing(true);
    try {
      const synced = await syncOfflineQueue();
      setPendingCount(getOfflineQueueCount());
      return synced;
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

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('rt-offline-queue-updated', handleQueueChange);

    if (typeof navigator !== 'undefined' && navigator.onLine && getOfflineQueueCount() > 0) {
      void triggerSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('rt-offline-queue-updated', handleQueueChange);
    };
  }, [refreshQueueCount, triggerSync]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    triggerSync,
    refreshQueueCount,
  };
}
