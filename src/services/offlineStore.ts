import type {
  AdminDashboardData,
  BoxPublicResponse,
  LabProfile,
  OfflineSyncMutation,
  Prize,
} from '../types';

const PROFILE_CACHE_KEY = 'rt_hb_offline_profile_v1';
const PRIZES_CACHE_KEY = 'rt_hb_offline_prizes_v1';
const DASHBOARD_CACHE_KEY = 'rt_hb_offline_dashboard_v1';
const QUEUE_STORAGE_KEY = 'rt_hb_offline_queue_v1';

function dispatchQueueEvent(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rt-offline-queue-updated'));
  }
}

export function saveCachedPublicProfile(profile: LabProfile): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
}

export function loadCachedPublicProfile(): LabProfile | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? (JSON.parse(raw) as LabProfile) : null;
  } catch {
    return null;
  }
}

export function saveCachedPrizes(prizes: Prize[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(PRIZES_CACHE_KEY, JSON.stringify(prizes));
  } catch {
    // ignore quota errors
  }
}

export function loadCachedPrizes(): Prize[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(PRIZES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as Prize[]) : null;
  } catch {
    return null;
  }
}

export function saveCachedDashboard(data: AdminDashboardData): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));
    saveCachedPublicProfile(data.labProfile);
    saveCachedPrizes(data.prizes);
  } catch {
    // ignore quota errors
  }
}

export function loadCachedDashboard(): AdminDashboardData | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(DASHBOARD_CACHE_KEY);
    return raw ? (JSON.parse(raw) as AdminDashboardData) : null;
  } catch {
    return null;
  }
}

export function saveCachedBox(box: BoxPublicResponse): void {
  if (typeof window === 'undefined' || !window.localStorage || !box.token) return;
  try {
    window.localStorage.setItem(`rt_hb_won_${box.token.toUpperCase()}`, JSON.stringify(box));
  } catch {
    // ignore
  }
}

export function loadCachedBox(token: string): BoxPublicResponse | null {
  if (typeof window === 'undefined' || !window.localStorage || !token) return null;
  try {
    const raw = window.localStorage.getItem(`rt_hb_won_${token.toUpperCase()}`);
    return raw ? (JSON.parse(raw) as BoxPublicResponse) : null;
  } catch {
    return null;
  }
}

export function loadOfflineQueue(): OfflineSyncMutation[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = window.localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OfflineSyncMutation[]) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: OfflineSyncMutation[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    dispatchQueueEvent();
  } catch {
    // ignore
  }
}

export function enqueueOfflineMutation(
  type: OfflineSyncMutation['type'],
  payload: Record<string, unknown>
): void {
  const queue = loadOfflineQueue();
  queue.push({
    id: `mut_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    createdAt: new Date().toISOString(),
    payload,
  });
  saveOfflineQueue(queue);
}
