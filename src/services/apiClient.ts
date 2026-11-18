import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getDocsFromServer,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { buildDefaultPrizeTerms, DEFAULT_PRIZES } from '../data/defaultPrizes';
import { INITIAL_PRICES } from '../data/initialPrices';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { hashPhoneNumber, normalizeCanonicalPhone } from '../utils/phoneHash';
import { formatWhatsAppPhone } from '../utils/whatsapp';
import type {
  AdminDashboardData,
  BoxPublicResponse,
  FullBackupPayload,
  GiftLink,
  LabPriceItem,
  LabProfile,
  LinkStatus,
  Prize,
  PrizeCategory,
} from '../types';

const DEFAULT_ASSET_LOGO = `${import.meta.env.BASE_URL || '/'}logo.jpg`;

export const DEFAULT_LAB_PROFILE: LabProfile = {
  labName: 'معامل RT للتحاليل التشخيصية',
  tagline: 'دقة التشخيص .. رعاية متكاملة لأجل صحتك',
  director: 'د. رامي مختار — استشاري الباثولوجيا الإكلينيكية',
  hotlineNumber: '01100046841',
  whatsappNumber: '201124485444',
  address: 'ميدان بهتيم، برج صيدلية العزبي، الدور الثالث، شبرا الخيمة',
  workingHours: 'يومياً من 10:00 صباحاً إلى 10:00 مساءً',
  branches: [
    'الفرع الرئيسي - شبرا الخيمة',
    'وحدة السحب المنزلي السريع',
    'فرع المعادي - شارع النصر',
    'فرع مدينة نصر - عباس العقاد',
  ],
  logoUrl: DEFAULT_ASSET_LOGO,
  whatsappInviteTemplate:
    'أهلاً {clientName} 🌟\nهديتك من {labName} جاهزة الآن في صندوق السعادة 🎁\nاضغط على الرابط التالي لفتح الصندوق ومعرفة هديتك فوراً:\n{boxUrl}\n\nنتمنى لك دوام الصحة والعافية ❤️',
  whatsappWinnerReplyTemplate:
    'ألف مبروك يا {clientName} 🎉\nتم تأكيد فوزك من {labName} بجائزة:\n🎁 {prizeTitle} ({discountLabel})\n🔑 كود الجائزة: {prizeCode}\n⏳ الجائزة متاحة لوقت محدد وتنتهي صلاحيتها في: {expiresAt}\n📅 الموعد المحدد: {appointmentAt}\n\nيسعدنا تشريفك في أقرب فرع أو حجز السحب المنزلي قبل انتهاء الموعد!',
  whatsappPatientClaimTemplate:
    'مرحباً {labName}، فتحت صندوق السعادة وكسبت الجائزة التالية:\nالاسم: {clientName}\nالجائزة: {prizeTitle} ({discountLabel})\nكود الجائزة: {prizeCode}\nالفرع: {branchName}\nصالحة حتى: {expiresAt}\n\n📋 شروط الجائزة وضوابط الاستفادة الكاملة:\n{prizeTerms}\n\nأرغب في تأكيد تفعيل الجائزة وحجز الموعد.',
  shareBaseUrl: 'https://ramimokhtar228-maker.github.io/rt-lab-gift-box',
};

export { DEFAULT_PRIZES };

interface DecodedBoxPayload {
  n?: string;
  p?: string;
  b?: string;
  v?: string;
  e?: string;
  ln?: string;
  wa?: string;
  ht?: string;
  pz?: Array<[string, string, number, number]>;
}

function decodeBoxData(encoded?: string | null): DecodedBoxPayload | null {
  if (!encoded) return null;
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
    const bin = atob(b64 + pad);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as DecodedBoxPayload;
  } catch {
    return null;
  }
}

function normalizeId(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, '')
    .slice(0, 64);
}

function normalizeDocId(raw: string): string {
  return raw
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 128);
}

const DELETED_TOKENS_STORAGE_KEY = 'rt_hb_deleted_tokens';

function getDeletedTokensSet(): Set<string> {
  if (typeof window === 'undefined' || !window.localStorage) return new Set();
  try {
    const raw = window.localStorage.getItem(DELETED_TOKENS_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map((t) => normalizeId(String(t))).filter(Boolean));
  } catch {
    return new Set();
  }
}

function addDeletedTokensLocally(tokens: string[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const cleanList = tokens.map((t) => normalizeId(t)).filter(Boolean);
  if (cleanList.length === 0) return;
  try {
    const set = getDeletedTokensSet();
    cleanList.forEach((t) => set.add(t));
    window.localStorage.setItem(DELETED_TOKENS_STORAGE_KEY, JSON.stringify(Array.from(set).slice(-500)));

    for (const tok of cleanList) {
      window.localStorage.removeItem(`rt_hb_won_${tok}`);
    }

    // Scrub deleted tokens from any legacy/backup caches stored in localStorage
    const deletedSet = new Set(cleanList);
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || key === DELETED_TOKENS_STORAGE_KEY) continue;
      if (key.includes('giftLinks') || key.includes('happiness')) {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const filtered = parsed.filter(
              (item) => !deletedSet.has(normalizeId(String(item?.token || item?.id || '')))
            );
            if (filtered.length !== parsed.length) {
              window.localStorage.setItem(key, JSON.stringify(filtered));
            }
          } else if (parsed && typeof parsed === 'object') {
            const obj = parsed as Record<string, unknown>;
            if (Array.isArray(obj.giftLinks)) {
              const filtered = (obj.giftLinks as Array<Record<string, unknown>>).filter(
                (item) => !deletedSet.has(normalizeId(String(item?.token || item?.id || '')))
              );
              if (filtered.length !== obj.giftLinks.length) {
                window.localStorage.setItem(key, JSON.stringify({ ...obj, giftLinks: filtered }));
              }
            } else if (deletedSet.has(normalizeId(String(obj.token || obj.id || '')))) {
              window.localStorage.removeItem(key);
            }
          }
        } catch {
          // ignore non-JSON entries
        }
      }
    }
  } catch {
    // ignore storage errors
  }
}

function randomCode(prefix: string, len: number): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}${out}`;
}

function timestampToIso(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val !== null && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate().toISOString();
  }
  return new Date().toISOString();
}

function docToGiftLink(id: string, data: Record<string, unknown>, clientPhone = ''): GiftLink {
  const rawStatus = (data.status as LinkStatus) || 'pending';
  const expiresAt = String(data.expiresAt || new Date().toISOString());
  const isExpired =
    (rawStatus === 'pending' || rawStatus === 'opened') &&
    !Number.isNaN(new Date(expiresAt).getTime()) &&
    new Date(expiresAt).getTime() < Date.now();

  return {
    id,
    token: String(data.token || id),
    clientName: String(data.clientName || 'عميلنا العزيز'),
    clientPhone,
    visitRef: String(data.visitRef || ''),
    branchName: String(data.branchName || ''),
    phoneHash: data.phoneHash ? String(data.phoneHash) : null,
    status: isExpired ? 'expired' : rawStatus,
    createdAt: timestampToIso(data.createdAt),
    expiresAt,
    openedAt: data.openedAt ? String(data.openedAt) : null,
    redeemedAt: data.redeemedAt ? String(data.redeemedAt) : null,
    redeemedBy: data.redeemedBy ? String(data.redeemedBy) : null,
    appointmentAt: data.appointmentAt ? String(data.appointmentAt) : null,
    appointmentNote: data.appointmentNote ? String(data.appointmentNote) : null,
    prizeId: data.prizeId ? String(data.prizeId) : null,
    prizeTitle: data.prizeTitle ? String(data.prizeTitle) : null,
    prizeDescription: data.prizeDescription ? String(data.prizeDescription) : null,
    prizeTerms: data.prizeTerms ? String(data.prizeTerms) : null,
    prizeDiscountLabel: data.prizeDiscountLabel ? String(data.prizeDiscountLabel) : null,
    prizeCategory: (data.prizeCategory as PrizeCategory) || null,
    prizeCode: data.prizeCode ? String(data.prizeCode) : null,
    validHours: typeof data.validHours === 'number' ? data.validHours : null,
  };
}

function toPublicBox(lnk: GiftLink): BoxPublicResponse {
  return {
    token: lnk.token,
    clientName: lnk.clientName,
    visitRef: lnk.visitRef,
    branchName: lnk.branchName,
    status: lnk.status,
    createdAt: lnk.createdAt,
    expiresAt: lnk.expiresAt,
    openedAt: lnk.openedAt,
    redeemedAt: lnk.redeemedAt,
    appointmentAt: lnk.appointmentAt ?? null,
    appointmentNote: lnk.appointmentNote ?? null,
    prize: lnk.prizeTitle
      ? {
          title: lnk.prizeTitle,
          description: lnk.prizeDescription || '',
          terms: lnk.prizeTerms || undefined,
          discountLabel: lnk.prizeDiscountLabel || 'هدية خاصة',
          category: (lnk.prizeCategory || 'discount') as PrizeCategory,
          prizeCode: lnk.prizeCode || '',
          validHours: lnk.validHours || 48,
        }
      : null,
  };
}

function pickWeightedPrize(prizes: Prize[]): Prize {
  const active = prizes.filter((p) => p.active);
  const pool = active.length > 0 ? active : DEFAULT_PRIZES;
  const totalW = pool.reduce((s, p) => s + Math.max(1, p.weight), 0);
  let r = Math.random() * totalW;
  for (const p of pool) {
    r -= Math.max(1, p.weight);
    if (r <= 0) return p;
  }
  return pool[0];
}

async function fetchActivePrizes(encodedData?: string | null): Promise<Prize[]> {
  try {
    const q = query(collection(db, 'prizes'), where('active', '==', true));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => {
        const data = d.data();
        const title = String(data.title || '');
        const category = (data.category as PrizeCategory) || 'DISCOUNT';
        const validHours = Number(data.validHours || 48);
        const defaultMatch = DEFAULT_PRIZES.find((p) => p.id === d.id || p.title === title);
        const terms = data.terms
          ? String(data.terms)
          : defaultMatch?.terms || buildDefaultPrizeTerms({ title, category, validHours });
        return {
          id: d.id,
          title,
          description: String(data.description || ''),
          terms,
          discountLabel: String(data.discountLabel || 'هدية خاصة'),
          category,
          validHours,
          weight: Number(data.weight || 20),
          stock: Number(data.stock || 50),
          usedCount: Number(data.usedCount || 0),
          active: Boolean(data.active),
        };
      });
    }
  } catch (err) {
    console.warn('Fallback to default prizes:', err);
  }

  const decoded = decodeBoxData(encodedData);
  if (Array.isArray(decoded?.pz) && decoded.pz.length > 0) {
    return decoded.pz.map(([title, discountLabel, validHours, weight], idx) => ({
      id: `prz_url_${idx}`,
      title,
      description: `${title} — جائزة صالحة للاستخدام خلال الوقت المحدد.`,
      terms: buildDefaultPrizeTerms({
        title,
        category: 'DISCOUNT',
        validHours: Math.max(1, Number(validHours) || 48),
      }),
      discountLabel,
      category: 'discount',
      validHours: Math.max(1, Number(validHours) || 48),
      weight: Math.max(1, Number(weight) || 20),
      stock: 100,
      usedCount: 0,
      active: true,
    }));
  }

  return DEFAULT_PRIZES;
}

function getAppShareBase(): string {
  if (typeof window === 'undefined') return '';
  const base = import.meta.env.BASE_URL || '/';
  const origin = window.location.origin.includes('://ais-dev-')
    ? window.location.origin.replace('://ais-dev-', '://ais-pre-')
    : window.location.origin;
  return `${origin}${base === '/' ? '' : base.replace(/\/$/, '')}`;
}

function buildPublicProfilePayload(profile: LabProfile) {
  const normalizedWa =
    formatWhatsAppPhone(profile.whatsappNumber || '') ||
    String(profile.whatsappNumber || DEFAULT_LAB_PROFILE.whatsappNumber).trim();
  return {
    labName: String(profile.labName || DEFAULT_LAB_PROFILE.labName).slice(0, 120),
    tagline: String(profile.tagline || '').slice(0, 200),
    director: String(profile.director || '').slice(0, 160),
    hotlineNumber: String(profile.hotlineNumber || '').slice(0, 40),
    whatsappNumber: normalizedWa.slice(0, 40),
    address: String(profile.address || '').slice(0, 300),
    workingHours: String(profile.workingHours || '').slice(0, 200),
    branches: Array.isArray(profile.branches)
      ? profile.branches.slice(0, 20).map((b) => String(b).slice(0, 160))
      : DEFAULT_LAB_PROFILE.branches,
    logoUrl: String(profile.logoUrl || DEFAULT_ASSET_LOGO).slice(0, 500000),
    whatsappPatientClaimTemplate: String(profile.whatsappPatientClaimTemplate || '').slice(0, 2000),
    shareBaseUrl: String(profile.shareBaseUrl || '').slice(0, 300),
    updatedAt: serverTimestamp(),
  };
}

function buildAdminTemplatesPayload(profile: LabProfile) {
  return {
    whatsappInviteTemplate: String(profile.whatsappInviteTemplate || '').slice(0, 2000),
    whatsappWinnerReplyTemplate: String(profile.whatsappWinnerReplyTemplate || '').slice(0, 2000),
    updatedAt: serverTimestamp(),
  };
}

function mergePricesWithInitial(overrides: LabPriceItem[]): LabPriceItem[] {
  const map = new Map<string, LabPriceItem>();
  for (const base of INITIAL_PRICES) {
    map.set(base.id, { ...base });
  }
  for (const ov of overrides) {
    if (!ov.active) {
      map.delete(ov.id);
    } else {
      map.set(ov.id, { ...ov });
    }
  }
  return Array.from(map.values());
}

export const apiClient = {
  async getPublicConfig(encodedData?: string | null): Promise<{ labProfile: LabProfile; shareBaseUrl: string }> {
    const profile: LabProfile = { ...DEFAULT_LAB_PROFILE };
    let hasServerProfile = false;
    let hasServerWhatsapp = false;
    try {
      let snap;
      try {
        snap = await getDocFromServer(doc(db, 'publicConfig', 'labProfile'));
      } catch {
        snap = await getDoc(doc(db, 'publicConfig', 'labProfile'));
      }
      if (snap.exists()) {
        hasServerProfile = true;
        const d = snap.data();
        profile.labName = String(d.labName || profile.labName);
        profile.tagline = String(d.tagline ?? profile.tagline);
        profile.director = String(d.director ?? profile.director);
        profile.hotlineNumber = String(d.hotlineNumber ?? profile.hotlineNumber);
        const serverWa = String(d.whatsappNumber || '').trim();
        const normalizedServerWa = serverWa ? formatWhatsAppPhone(serverWa) || serverWa : '';
        if (normalizedServerWa) {
          profile.whatsappNumber =
            normalizedServerWa === '201100874444'
              ? DEFAULT_LAB_PROFILE.whatsappNumber
              : normalizedServerWa;
          hasServerWhatsapp = true;
        }
        profile.address = String(d.address ?? profile.address);
        profile.workingHours = String(d.workingHours ?? profile.workingHours);
        profile.branches = Array.isArray(d.branches) ? d.branches.map(String) : profile.branches;
        profile.logoUrl = String(d.logoUrl || profile.logoUrl);
        const serverClaimTpl = String(
          d.whatsappPatientClaimTemplate ?? profile.whatsappPatientClaimTemplate
        );
        profile.whatsappPatientClaimTemplate = serverClaimTpl.includes('{prizeTerms}')
          ? serverClaimTpl
          : DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate;
        profile.shareBaseUrl = String(d.shareBaseUrl ?? '');
      }
    } catch (err) {
      console.warn('Using default public config:', err);
    }

    const decoded = decodeBoxData(encodedData);
    if (decoded) {
      if (decoded.ln && !hasServerProfile) profile.labName = decoded.ln;
      if (decoded.wa && !hasServerWhatsapp) {
        const decodedWa = formatWhatsAppPhone(decoded.wa) || decoded.wa;
        profile.whatsappNumber =
          decodedWa === '201100874444' ? DEFAULT_LAB_PROFILE.whatsappNumber : decodedWa;
      }
      if (decoded.ht && !hasServerProfile) profile.hotlineNumber = decoded.ht;
    }

    return {
      labProfile: profile,
      shareBaseUrl: profile.shareBaseUrl || getAppShareBase(),
    };
  },

  subscribePublicProfile(onProfile: (profile: LabProfile, shareBaseUrl: string) => void): () => void {
    return onSnapshot(
      doc(db, 'publicConfig', 'labProfile'),
      (snap) => {
        if (!snap.exists()) return;
        const d = snap.data();
        const serverWa = String(d.whatsappNumber || '').trim();
        const normalizedWa = serverWa ? formatWhatsAppPhone(serverWa) || serverWa : '';
        const resolvedWa =
          !normalizedWa || normalizedWa === '201100874444'
            ? DEFAULT_LAB_PROFILE.whatsappNumber
            : normalizedWa;
        const serverClaimTpl = String(
          d.whatsappPatientClaimTemplate ?? DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate
        );
        const profile: LabProfile = {
          ...DEFAULT_LAB_PROFILE,
          labName: String(d.labName || DEFAULT_LAB_PROFILE.labName),
          tagline: String(d.tagline ?? DEFAULT_LAB_PROFILE.tagline),
          director: String(d.director ?? DEFAULT_LAB_PROFILE.director),
          hotlineNumber: String(d.hotlineNumber ?? DEFAULT_LAB_PROFILE.hotlineNumber),
          whatsappNumber: resolvedWa,
          address: String(d.address ?? DEFAULT_LAB_PROFILE.address),
          workingHours: String(d.workingHours ?? DEFAULT_LAB_PROFILE.workingHours),
          branches: Array.isArray(d.branches) ? d.branches.map(String) : DEFAULT_LAB_PROFILE.branches,
          logoUrl: String(d.logoUrl || DEFAULT_ASSET_LOGO),
          whatsappPatientClaimTemplate: serverClaimTpl.includes('{prizeTerms}')
            ? serverClaimTpl
            : DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate,
          shareBaseUrl: String(d.shareBaseUrl ?? ''),
        };
        onProfile(profile, profile.shareBaseUrl || getAppShareBase());
      },
      () => {
        // ignore transient snapshot errors on public read
      }
    );
  },

  async getBoxByToken(
    token: string,
    encodedData?: string | null
  ): Promise<{ ok: boolean; deleted?: boolean; box?: BoxPublicResponse; message?: string }> {
    const clean = normalizeId(token);
    if (!clean) {
      return { ok: false, message: 'رابط صندوق السعادة غير صحيح.' };
    }

    if (getDeletedTokensSet().has(clean)) {
      addDeletedTokensLocally([clean]);
      return { ok: false, deleted: true, message: 'تم حذف هذا السجل أو إلغاؤه من قِبل إدارة المعمل.' };
    }

    try {
      const delSnap = await getDoc(doc(db, 'deletedLinks', clean));
      if (delSnap.exists()) {
        addDeletedTokensLocally([clean]);
        return { ok: false, deleted: true, message: 'تم حذف هذا السجل أو إلغاؤه من قِبل إدارة المعمل.' };
      }
    } catch {
      // continue if deletedLinks check failed offline
    }

    const path = `giftLinks/${clean}`;
    try {
      const snap = await getDoc(doc(db, 'giftLinks', clean));
      if (snap.exists()) {
        const lnk = docToGiftLink(snap.id, snap.data());
        return { ok: true, box: toPublicBox(lnk) };
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }

    const decoded = decodeBoxData(encodedData);
    if (decoded || clean === 'RTBOX-DEMO2026') {
      const now = Date.now();
      const preview: GiftLink = {
        id: clean,
        token: clean,
        clientName: decoded?.n || 'عميلنا العزيز',
        clientPhone: decoded?.p || '',
        visitRef: decoded?.v || `RT-${Math.floor(1000 + Math.random() * 9000)}`,
        branchName: decoded?.b || DEFAULT_LAB_PROFILE.branches[0],
        status: 'pending',
        createdAt: new Date(now).toISOString(),
        expiresAt:
          decoded?.e && !Number.isNaN(new Date(decoded.e).getTime())
            ? new Date(decoded.e).toISOString()
            : new Date(now + 14 * 24 * 3600_000).toISOString(),
        openedAt: null,
        redeemedAt: null,
        redeemedBy: null,
        prizeId: null,
        prizeTitle: null,
        prizeDescription: null,
        prizeDiscountLabel: null,
        prizeCategory: null,
        prizeCode: null,
        validHours: null,
      };
      return { ok: true, box: toPublicBox(preview) };
    }

    return { ok: false, message: 'رابط صندوق السعادة غير صحيح أو غير موجود.' };
  },

  async openBoxByToken(
    token: string,
    encodedData?: string | null
  ): Promise<{ ok: boolean; alreadyClaimed?: boolean; box?: BoxPublicResponse; message?: string }> {
    const clean = normalizeId(token);
    if (!clean) {
      return { ok: false, message: 'رابط صندوق السعادة غير صحيح.' };
    }

    if (getDeletedTokensSet().has(clean)) {
      addDeletedTokensLocally([clean]);
      return { ok: false, message: 'تم حذف هذا السجل أو إلغاؤه من قِبل إدارة المعمل.' };
    }
    try {
      const delSnap = await getDoc(doc(db, 'deletedLinks', clean));
      if (delSnap.exists()) {
        addDeletedTokensLocally([clean]);
        return { ok: false, message: 'تم حذف هذا السجل أو إلغاؤه من قِبل إدارة المعمل.' };
      }
    } catch {
      // continue
    }

    const linkRef = doc(db, 'giftLinks', clean);
    let existingSnap;
    try {
      existingSnap = await getDoc(linkRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `giftLinks/${clean}`);
    }

    const checkActivePhoneLock = async (phoneHash: string): Promise<{
      locked: boolean;
      activeBox?: BoxPublicResponse;
    }> => {
      if (!phoneHash) return { locked: false };
      try {
        const lockSnap = await getDoc(doc(db, 'phoneLocks', phoneHash));
        if (!lockSnap.exists()) return { locked: false };
        const lockData = lockSnap.data();
        const activeToken = normalizeId(String(lockData.activeToken || ''));
        if (!activeToken) return { locked: false };
        const activeSnap = await getDoc(doc(db, 'giftLinks', activeToken));
        if (!activeSnap.exists()) return { locked: false };
        const activeLink = docToGiftLink(activeSnap.id, activeSnap.data());
        const expiresMs = new Date(activeLink.expiresAt).getTime();
        const lockUntilMs =
          lockData.lockUntil instanceof Timestamp ? lockData.lockUntil.toMillis() : expiresMs;
        const activeUntilMs = Math.max(Number.isNaN(expiresMs) ? 0 : expiresMs, lockUntilMs);
        if (
          (activeLink.status === 'opened' || activeLink.status === 'redeemed') &&
          Date.now() < activeUntilMs
        ) {
          return { locked: true, activeBox: toPublicBox(activeLink) };
        }
      } catch {
        // ignore read error and allow fallback
      }
      return { locked: false };
    };

    const decoded = decodeBoxData(encodedData);

    if (existingSnap.exists()) {
      const existingLnk = docToGiftLink(existingSnap.id, existingSnap.data());
      if (existingLnk.status === 'opened' || existingLnk.status === 'redeemed') {
        return { ok: true, box: toPublicBox(existingLnk) };
      }
      if (existingLnk.status === 'expired') {
        return { ok: false, message: 'انتهت صلاحية هذا الرابط.' };
      }

      const phoneHash =
        existingLnk.phoneHash || (decoded?.p ? await hashPhoneNumber(decoded.p) : '');
      if (phoneHash) {
        const lockCheck = await checkActivePhoneLock(phoneHash);
        if (lockCheck.locked && lockCheck.activeBox && lockCheck.activeBox.token !== clean) {
          return {
            ok: true,
            alreadyClaimed: true,
            box: lockCheck.activeBox,
            message:
              'تم الدخول مسبقاً بنفس رقم الهاتف وحصلت على جائزتك السارية. يُسمح بالدخول والحصول على جائزة جديدة فقط بعد انتهاء مدة صلاحية الجائزة الأولى.',
          };
        }
      }

      const prizes = await fetchActivePrizes(encodedData);
      const chosen = pickWeightedPrize(prizes);
      const now = Date.now();
      const validHours = Math.max(1, Number(chosen.validHours || 48));
      const openedAt = new Date(now).toISOString();
      const expiresAt = new Date(now + validHours * 3600_000).toISOString();
      const prizeCode = randomCode('RTWIN-', 6);
      const prizeTerms = (chosen.terms || buildDefaultPrizeTerms(chosen)).slice(0, 1000);

      const batch = writeBatch(db);
      batch.update(linkRef, {
        status: 'opened',
        openedAt,
        expiresAt,
        prizeId: chosen.id.slice(0, 128),
        prizeTitle: chosen.title.slice(0, 200),
        prizeDescription: chosen.description.slice(0, 600),
        prizeTerms,
        prizeDiscountLabel: chosen.discountLabel.slice(0, 80),
        prizeCategory: chosen.category.slice(0, 40),
        prizeCode,
        validHours,
        updatedAt: serverTimestamp(),
      });
      if (phoneHash) {
        batch.set(doc(db, 'phoneLocks', phoneHash), {
          id: phoneHash,
          activeToken: clean,
          expiresAt,
          lockUntil: Timestamp.fromMillis(now + validHours * 3600_000),
          updatedAt: serverTimestamp(),
        });
      }

      try {
        await batch.commit();
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `giftLinks/${clean}`);
      }

      const updated: GiftLink = {
        ...existingLnk,
        status: 'opened',
        openedAt,
        expiresAt,
        prizeId: chosen.id,
        prizeTitle: chosen.title,
        prizeDescription: chosen.description,
        prizeTerms,
        prizeDiscountLabel: chosen.discountLabel,
        prizeCategory: chosen.category,
        prizeCode,
        validHours,
      };
      return { ok: true, box: toPublicBox(updated) };
    }

    // Hydrate legacy ?d= link or demo link into Firestore atomically so Admin sees it immediately
    if (!decoded && clean !== 'RTBOX-DEMO2026') {
      return { ok: false, message: 'رابط صندوق السعادة غير موجود.' };
    }

    const decodedPhone = (decoded?.p || '').trim().slice(0, 40);
    const decodedPhoneHash = decodedPhone ? await hashPhoneNumber(decodedPhone) : '';
    if (decodedPhoneHash) {
      const lockCheck = await checkActivePhoneLock(decodedPhoneHash);
      if (lockCheck.locked && lockCheck.activeBox) {
        return {
          ok: true,
          alreadyClaimed: true,
          box: lockCheck.activeBox,
          message:
            'تم الدخول مسبقاً بنفس رقم الهاتف وحصلت على جائزتك السارية. يُسمح بالدخول والحصول على جائزة جديدة فقط بعد انتهاء مدة صلاحية الجائزة الأولى.',
        };
      }
    }

    const prizes = await fetchActivePrizes(encodedData);
    const chosen = pickWeightedPrize(prizes);
    const now = Date.now();
    const validHours = Math.max(1, Number(chosen.validHours || 48));
    const openedAt = new Date(now).toISOString();
    const expiresAt = new Date(now + validHours * 3600_000).toISOString();
    const prizeCode = randomCode('RTWIN-', 6);
    const prizeTerms = (chosen.terms || buildDefaultPrizeTerms(chosen)).slice(0, 1000);

    const clientName = (decoded?.n || 'عميلنا العزيز').trim().slice(0, 120);
    const clientPhone = normalizeCanonicalPhone(decodedPhone) || decodedPhone;
    const visitRef = (decoded?.v || `RT-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 64);
    const branchName = (decoded?.b || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160);

    const batch = writeBatch(db);
    batch.set(linkRef, {
      id: clean,
      token: clean,
      clientName,
      visitRef,
      branchName,
      ...(decodedPhoneHash ? { phoneHash: decodedPhoneHash } : {}),
      status: 'opened',
      createdAt: serverTimestamp(),
      expiresAt,
      openedAt,
      redeemedAt: null,
      redeemedBy: null,
      appointmentAt: null,
      appointmentNote: null,
      prizeId: chosen.id.slice(0, 128),
      prizeTitle: chosen.title.slice(0, 200),
      prizeDescription: chosen.description.slice(0, 600),
      prizeTerms,
      prizeDiscountLabel: chosen.discountLabel.slice(0, 80),
      prizeCategory: chosen.category.slice(0, 40),
      prizeCode,
      validHours,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'giftLinks', clean, 'private', 'contact'), {
      clientPhone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (decodedPhoneHash) {
      batch.set(doc(db, 'phoneLocks', decodedPhoneHash), {
        id: decodedPhoneHash,
        activeToken: clean,
        expiresAt,
        lockUntil: Timestamp.fromMillis(now + validHours * 3600_000),
        updatedAt: serverTimestamp(),
      });
    }

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `giftLinks/${clean}`);
    }

    return {
      ok: true,
      box: toPublicBox({
        id: clean,
        token: clean,
        clientName,
        clientPhone,
        visitRef,
        branchName,
        phoneHash: decodedPhoneHash || null,
        status: 'opened',
        createdAt: openedAt,
        expiresAt,
        openedAt,
        redeemedAt: null,
        redeemedBy: null,
        prizeId: chosen.id,
        prizeTitle: chosen.title,
        prizeDescription: chosen.description,
        prizeTerms,
        prizeDiscountLabel: chosen.discountLabel,
        prizeCategory: chosen.category,
        prizeCode,
        validHours,
      }),
    };
  },

  async createAndOpenSelfBox(payload: {
    clientName: string;
    clientPhone: string;
    branchName?: string;
  }): Promise<{ ok: boolean; alreadyClaimed?: boolean; box?: BoxPublicResponse; message?: string }> {
    const cleanName = payload.clientName.trim().slice(0, 120);
    const canonicalPhone = normalizeCanonicalPhone(payload.clientPhone).slice(0, 40);
    if (!cleanName || canonicalPhone.length < 8) {
      return { ok: false, message: 'يرجى إدخال الاسم ورقم الواتساب بشكل صحيح.' };
    }

    const phoneHash = await hashPhoneNumber(canonicalPhone);
    if (phoneHash) {
      try {
        const lockSnap = await getDoc(doc(db, 'phoneLocks', phoneHash));
        if (lockSnap.exists()) {
          const lockData = lockSnap.data();
          const activeToken = normalizeId(String(lockData.activeToken || ''));
          if (activeToken) {
            const activeSnap = await getDoc(doc(db, 'giftLinks', activeToken));
            if (activeSnap.exists()) {
              const activeLink = docToGiftLink(activeSnap.id, activeSnap.data(), canonicalPhone);
              const expiresMs = new Date(activeLink.expiresAt).getTime();
              const lockUntilMs =
                lockData.lockUntil instanceof Timestamp ? lockData.lockUntil.toMillis() : expiresMs;
              const activeUntilMs = Math.max(Number.isNaN(expiresMs) ? 0 : expiresMs, lockUntilMs);
              if (
                (activeLink.status === 'opened' || activeLink.status === 'redeemed') &&
                Date.now() < activeUntilMs
              ) {
                return {
                  ok: true,
                  alreadyClaimed: true,
                  box: toPublicBox(activeLink),
                  message:
                    'تم الدخول مسبقاً بنفس رقم الهاتف، وهذه هي جائزتك الأولى السارية حالياً. يُسمح بالدخول مرة أخرى بعد انتهاء مدة صلاحية هذه الجائزة.',
                };
              }
            }
          }
        }
      } catch (err) {
        console.warn('Phone lock lookup warning:', err);
      }
    }

    const prizes = await fetchActivePrizes();
    const chosen = pickWeightedPrize(prizes);
    const now = Date.now();
    const validHours = Math.max(1, Number(chosen.validHours || 48));
    const openedAt = new Date(now).toISOString();
    const expiresAt = new Date(now + validHours * 3600_000).toISOString();
    const token = randomCode('RTBOX-', 6);
    const prizeCode = randomCode('RTWIN-', 6);
    const visitRef = `RT-${Math.floor(1000 + Math.random() * 9000)}`;
    const branchName = (payload.branchName || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160);
    const prizeTerms = (chosen.terms || buildDefaultPrizeTerms(chosen)).slice(0, 1000);

    const batch = writeBatch(db);
    batch.set(doc(db, 'giftLinks', token), {
      id: token,
      token,
      clientName: cleanName,
      visitRef,
      branchName,
      ...(phoneHash ? { phoneHash } : {}),
      status: 'opened',
      createdAt: serverTimestamp(),
      expiresAt,
      openedAt,
      redeemedAt: null,
      redeemedBy: null,
      appointmentAt: null,
      appointmentNote: null,
      prizeId: chosen.id.slice(0, 128),
      prizeTitle: chosen.title.slice(0, 200),
      prizeDescription: chosen.description.slice(0, 600),
      prizeTerms,
      prizeDiscountLabel: chosen.discountLabel.slice(0, 80),
      prizeCategory: chosen.category.slice(0, 40),
      prizeCode,
      validHours,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'giftLinks', token, 'private', 'contact'), {
      clientPhone: canonicalPhone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    if (phoneHash) {
      batch.set(doc(db, 'phoneLocks', phoneHash), {
        id: phoneHash,
        activeToken: token,
        expiresAt,
        lockUntil: Timestamp.fromMillis(now + validHours * 3600_000),
        updatedAt: serverTimestamp(),
      });
    }

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `giftLinks/${token}`);
    }

    return {
      ok: true,
      box: toPublicBox({
        id: token,
        token,
        clientName: cleanName,
        clientPhone: canonicalPhone,
        visitRef,
        branchName,
        phoneHash: phoneHash || null,
        status: 'opened',
        createdAt: openedAt,
        expiresAt,
        openedAt,
        redeemedAt: null,
        redeemedBy: null,
        prizeId: chosen.id,
        prizeTitle: chosen.title,
        prizeDescription: chosen.description,
        prizeTerms,
        prizeDiscountLabel: chosen.discountLabel,
        prizeCategory: chosen.category,
        prizeCode,
        validHours,
      }),
    };
  },

  async ensureInitialSeed(): Promise<void> {
    try {
      const [profileSnap, templatesSnap, prizesSnap] = await Promise.all([
        getDoc(doc(db, 'publicConfig', 'labProfile')),
        getDoc(doc(db, 'adminSettings', 'templates')),
        getDocs(collection(db, 'prizes')),
      ]);

      const batch = writeBatch(db);
      let hasWrites = false;

      if (!profileSnap.exists()) {
        batch.set(doc(db, 'publicConfig', 'labProfile'), buildPublicProfilePayload(DEFAULT_LAB_PROFILE));
        hasWrites = true;
      } else {
        const pData = profileSnap.data();
        const curWa = formatWhatsAppPhone(String(pData.whatsappNumber || '')) || String(pData.whatsappNumber || '');
        const curTpl = String(pData.whatsappPatientClaimTemplate || '');
        const needsWaUpgrade = !curWa || curWa === '201100874444';
        const needsTplUpgrade = !curTpl.includes('{prizeTerms}');
        if (needsWaUpgrade || needsTplUpgrade) {
          const upgradedProfile: LabProfile = {
            ...DEFAULT_LAB_PROFILE,
            labName: String(pData.labName || DEFAULT_LAB_PROFILE.labName),
            tagline: String(pData.tagline ?? DEFAULT_LAB_PROFILE.tagline),
            director: String(pData.director ?? DEFAULT_LAB_PROFILE.director),
            hotlineNumber: String(pData.hotlineNumber ?? DEFAULT_LAB_PROFILE.hotlineNumber),
            whatsappNumber: needsWaUpgrade ? DEFAULT_LAB_PROFILE.whatsappNumber : curWa,
            address: String(pData.address ?? DEFAULT_LAB_PROFILE.address),
            workingHours: String(pData.workingHours ?? DEFAULT_LAB_PROFILE.workingHours),
            branches: Array.isArray(pData.branches)
              ? pData.branches.map(String)
              : DEFAULT_LAB_PROFILE.branches,
            logoUrl: String(pData.logoUrl || DEFAULT_ASSET_LOGO),
            whatsappPatientClaimTemplate: needsTplUpgrade
              ? DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate
              : curTpl,
            shareBaseUrl: String(pData.shareBaseUrl ?? DEFAULT_LAB_PROFILE.shareBaseUrl),
          };
          batch.set(doc(db, 'publicConfig', 'labProfile'), buildPublicProfilePayload(upgradedProfile));
          hasWrites = true;
        }
      }

      if (!templatesSnap.exists()) {
        batch.set(doc(db, 'adminSettings', 'templates'), buildAdminTemplatesPayload(DEFAULT_LAB_PROFILE));
        hasWrites = true;
      }

      const starterIds = new Set([
        'prz_cbc_free',
        'prz_pkg_30',
        'prz_hba1c_free',
        'prz_home_20',
        'prz_vitd_40',
      ]);
      const onlyOldStarter =
        !prizesSnap.empty && prizesSnap.docs.every((d) => starterIds.has(d.id));

      if (prizesSnap.empty || onlyOldStarter) {
        if (onlyOldStarter) {
          for (const oldDoc of prizesSnap.docs) {
            batch.delete(doc(db, 'prizes', oldDoc.id));
          }
        }
        for (const p of DEFAULT_PRIZES) {
          batch.set(doc(db, 'prizes', p.id), {
            ...p,
            updatedAt: serverTimestamp(),
          });
        }
        hasWrites = true;
      } else {
        // Backfill missing terms on already-seeded prizes & add newly added default SURPRISE prizes if absent
        const existingIds = new Set(prizesSnap.docs.map((d) => d.id));
        for (const d of prizesSnap.docs) {
          const data = d.data();
          if (!data.terms) {
            const title = String(data.title || '');
            const category = (data.category as PrizeCategory) || 'DISCOUNT';
            const validHours = Number(data.validHours || 48);
            const matched = DEFAULT_PRIZES.find((p) => p.id === d.id || p.title === title);
            const terms = matched?.terms || buildDefaultPrizeTerms({ title, category, validHours });
            batch.update(doc(db, 'prizes', d.id), {
              terms: terms.slice(0, 1000),
              updatedAt: serverTimestamp(),
            });
            hasWrites = true;
          }
        }
        const newlyAddedIds = ['prz_surp_lucky_rt', 'prz_surp_dr_rami', 'prz_surp_monthly_draw'];
        if (prizesSnap.size >= 70 && newlyAddedIds.every((nid) => !existingIds.has(nid))) {
          for (const nid of newlyAddedIds) {
            const p = DEFAULT_PRIZES.find((item) => item.id === nid);
            if (p) {
              batch.set(doc(db, 'prizes', p.id), {
                ...p,
                updatedAt: serverTimestamp(),
              });
              hasWrites = true;
            }
          }
        }
      }

      if (hasWrites) {
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'initialSeed');
    }
  },

  subscribeAdminDashboard(
    onData: (data: AdminDashboardData) => void,
    onError: (err: Error) => void
  ): () => void {
    let publicProfile: Partial<LabProfile> = {};
    let adminTemplates: Partial<LabProfile> = {};
    let prizes: Prize[] = DEFAULT_PRIZES;
    let giftLinks: GiftLink[] = [];
    let priceOverrides: LabPriceItem[] = [];
    const phoneCache = new Map<string, string>();

    const emit = () => {
      const labProfile: LabProfile = {
        ...DEFAULT_LAB_PROFILE,
        ...publicProfile,
        ...adminTemplates,
      };
      const prices = mergePricesWithInitial(priceOverrides);

      // Compute usedCount per prize dynamically from giftLinks
      const usedMap = new Map<string, number>();
      for (const lnk of giftLinks) {
        if (lnk.prizeId) {
          usedMap.set(lnk.prizeId, (usedMap.get(lnk.prizeId) || 0) + 1);
        }
      }
      const enrichedPrizes = prizes.map((p) => ({
        ...p,
        usedCount: Math.max(p.usedCount, usedMap.get(p.id) || 0),
      }));

      onData({
        labProfile,
        prizes: enrichedPrizes,
        giftLinks,
        prices,
        stats: {
          totalLinks: giftLinks.length,
          pendingLinks: giftLinks.filter((l) => l.status === 'pending').length,
          openedLinks: giftLinks.filter((l) => l.status === 'opened').length,
          redeemedLinks: giftLinks.filter((l) => l.status === 'redeemed').length,
          expiredLinks: giftLinks.filter((l) => l.status === 'expired').length,
          activePrizes: enrichedPrizes.filter((p) => p.active).length,
          totalPrices: prices.filter((p) => p.active).length,
        },
      });
    };

    const unsubProfile = onSnapshot(
      doc(db, 'publicConfig', 'labProfile'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const curWa = formatWhatsAppPhone(String(d.whatsappNumber || '')) || String(d.whatsappNumber || '');
          const curTpl = String(d.whatsappPatientClaimTemplate ?? DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate);
          publicProfile = {
            labName: String(d.labName || DEFAULT_LAB_PROFILE.labName),
            tagline: String(d.tagline ?? DEFAULT_LAB_PROFILE.tagline),
            director: String(d.director ?? DEFAULT_LAB_PROFILE.director),
            hotlineNumber: String(d.hotlineNumber ?? DEFAULT_LAB_PROFILE.hotlineNumber),
            whatsappNumber:
              !curWa || curWa === '201100874444' ? DEFAULT_LAB_PROFILE.whatsappNumber : curWa,
            address: String(d.address ?? DEFAULT_LAB_PROFILE.address),
            workingHours: String(d.workingHours ?? DEFAULT_LAB_PROFILE.workingHours),
            branches: Array.isArray(d.branches) ? d.branches.map(String) : DEFAULT_LAB_PROFILE.branches,
            logoUrl: String(d.logoUrl || DEFAULT_ASSET_LOGO),
            whatsappPatientClaimTemplate: curTpl.includes('{prizeTerms}')
              ? curTpl
              : DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate,
            shareBaseUrl: String(d.shareBaseUrl ?? ''),
          };
        }
        emit();
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.GET, 'publicConfig/labProfile');
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    );

    const unsubTemplates = onSnapshot(
      doc(db, 'adminSettings', 'templates'),
      (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          adminTemplates = {
            whatsappInviteTemplate: String(
              d.whatsappInviteTemplate ?? DEFAULT_LAB_PROFILE.whatsappInviteTemplate
            ),
            whatsappWinnerReplyTemplate: String(
              d.whatsappWinnerReplyTemplate ?? DEFAULT_LAB_PROFILE.whatsappWinnerReplyTemplate
            ),
          };
        }
        emit();
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.GET, 'adminSettings/templates');
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    );

    const unsubPrizes = onSnapshot(
      collection(db, 'prizes'),
      (snap) => {
        if (!snap.empty) {
          prizes = snap.docs.map((d) => {
            const data = d.data();
            const title = String(data.title || '');
            const category = (data.category as PrizeCategory) || 'DISCOUNT';
            const validHours = Number(data.validHours || 48);
            const matched = DEFAULT_PRIZES.find((p) => p.id === d.id || p.title === title);
            return {
              id: d.id,
              title,
              description: String(data.description || ''),
              terms: data.terms
                ? String(data.terms)
                : matched?.terms || buildDefaultPrizeTerms({ title, category, validHours }),
              discountLabel: String(data.discountLabel || 'هدية خاصة'),
              category,
              validHours,
              weight: Number(data.weight || 20),
              stock: Number(data.stock || 50),
              usedCount: Number(data.usedCount || 0),
              active: Boolean(data.active),
            };
          });
        }
        emit();
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'prizes');
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    );

    const unsubLinks = onSnapshot(
      collection(db, 'giftLinks'),
      async (snap) => {
        const docs = snap.docs;
        // Fetch private phone numbers for any uncached link IDs (or empty cache retries)
        const missingIds = docs
          .map((d) => d.id)
          .filter((id) => !phoneCache.has(id) || !phoneCache.get(id));
        if (missingIds.length > 0) {
          await Promise.all(
            missingIds.map(async (id) => {
              try {
                const contactSnap = await getDoc(doc(db, 'giftLinks', id, 'private', 'contact'));
                if (contactSnap.exists()) {
                  phoneCache.set(id, String(contactSnap.data().clientPhone || ''));
                } else if (!phoneCache.has(id)) {
                  phoneCache.set(id, '');
                }
              } catch {
                if (!phoneCache.has(id)) phoneCache.set(id, '');
              }
            })
          );
        }

        giftLinks = docs
          .map((d) => docToGiftLink(d.id, d.data(), phoneCache.get(d.id) || ''))
          .sort((a, b) => {
            const ta = new Date(a.openedAt || a.createdAt).getTime() || 0;
            const tb = new Date(b.openedAt || b.createdAt).getTime() || 0;
            return tb - ta;
          });
        emit();
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'giftLinks');
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    );

    const unsubPrices = onSnapshot(
      collection(db, 'prices'),
      (snap) => {
        priceOverrides = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            code: String(data.code || ''),
            nameAr: String(data.nameAr || ''),
            nameEn: data.nameEn ? String(data.nameEn) : undefined,
            category: String(data.category || 'general'),
            price: Number(data.price || 0),
            offerPrice: typeof data.offerPrice === 'number' ? data.offerPrice : undefined,
            duration: data.duration ? String(data.duration) : undefined,
            active: data.active !== false,
          };
        });
        emit();
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'prices');
        } catch (wrapped) {
          onError(wrapped as Error);
        }
      }
    );

    return () => {
      unsubProfile();
      unsubTemplates();
      unsubPrizes();
      unsubLinks();
      unsubPrices();
    };
  },

  async createAdminLink(body: {
    clientName: string;
    clientPhone: string;
    branchName?: string;
    visitRef?: string;
    linkValidDays?: number;
  }): Promise<{ ok: boolean; link?: GiftLink; message?: string }> {
    const clientName = String(body.clientName || '').trim().slice(0, 120);
    const clientPhone = String(body.clientPhone || '').trim().slice(0, 40);
    if (!clientName) {
      return { ok: false, message: 'يرجى إدخال اسم المريض.' };
    }

    const now = Date.now();
    const days = Math.max(1, Number(body.linkValidDays || 14));
    const token = randomCode('RTBOX-', 6);
    const visitRef = String(body.visitRef || `RT-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 64);
    const branchName = String(body.branchName || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160);
    const expiresAt = new Date(now + days * 24 * 3600_000).toISOString();
    const canonicalPhone = normalizeCanonicalPhone(clientPhone);
    const phoneHash = canonicalPhone.length >= 8 ? await hashPhoneNumber(canonicalPhone) : '';

    const batch = writeBatch(db);
    batch.set(doc(db, 'giftLinks', token), {
      id: token,
      token,
      clientName,
      visitRef,
      branchName,
      ...(phoneHash ? { phoneHash } : {}),
      status: 'pending',
      createdAt: serverTimestamp(),
      expiresAt,
      openedAt: null,
      redeemedAt: null,
      redeemedBy: null,
      appointmentAt: null,
      appointmentNote: null,
      prizeId: null,
      prizeTitle: null,
      prizeDescription: null,
      prizeDiscountLabel: null,
      prizeCategory: null,
      prizeCode: null,
      validHours: null,
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(db, 'giftLinks', token, 'private', 'contact'), {
      clientPhone: canonicalPhone || clientPhone,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `giftLinks/${token}`);
    }

    return {
      ok: true,
      link: {
        id: token,
        token,
        clientName,
        clientPhone: canonicalPhone || clientPhone,
        visitRef,
        branchName,
        phoneHash: phoneHash || null,
        status: 'pending',
        createdAt: new Date(now).toISOString(),
        expiresAt,
        openedAt: null,
        redeemedAt: null,
        redeemedBy: null,
        appointmentAt: null,
        appointmentNote: null,
        prizeId: null,
        prizeTitle: null,
        prizeDescription: null,
        prizeDiscountLabel: null,
        prizeCategory: null,
        prizeCode: null,
        validHours: null,
      },
    };
  },

  async updateAppointment(
    id: string,
    appointmentAt: string,
    appointmentNote?: string
  ): Promise<{ ok: boolean; message?: string }> {
    const cleanId = normalizeId(id);
    if (!cleanId) return { ok: false, message: 'معرف الرابط غير صالح.' };

    try {
      await updateDoc(doc(db, 'giftLinks', cleanId), {
        appointmentAt: appointmentAt.trim() ? appointmentAt.trim().slice(0, 120) : null,
        appointmentNote: appointmentNote?.trim() ? appointmentNote.trim().slice(0, 300) : null,
        updatedAt: serverTimestamp(),
      });
      return { ok: true, message: 'تم حفظ وتحديث موعد المريض بنجاح.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `giftLinks/${cleanId}`);
    }
  },

  async deleteGiftLink(id: string): Promise<boolean> {
    const cleanId = normalizeId(id);
    if (!cleanId) return false;

    // Immediately record local tombstone & scrub localStorage caches so deleted record can never resurrect
    addDeletedTokensLocally([cleanId]);

    let phoneHash = '';
    try {
      const linkSnap = await getDoc(doc(db, 'giftLinks', cleanId));
      if (linkSnap.exists() && linkSnap.data().phoneHash) {
        phoneHash = String(linkSnap.data().phoneHash);
      } else {
        const contactSnap = await getDoc(doc(db, 'giftLinks', cleanId, 'private', 'contact'));
        if (contactSnap.exists() && contactSnap.data().clientPhone) {
          phoneHash = await hashPhoneNumber(String(contactSnap.data().clientPhone));
        }
      }
    } catch {
      // continue deleting link
    }

    const batch = writeBatch(db);
    if (phoneHash) {
      try {
        const lockSnap = await getDoc(doc(db, 'phoneLocks', phoneHash));
        if (lockSnap.exists() && lockSnap.data().activeToken === cleanId) {
          batch.delete(doc(db, 'phoneLocks', phoneHash));
        }
      } catch {
        // ignore
      }
    }
    batch.delete(doc(db, 'giftLinks', cleanId, 'private', 'contact'));
    batch.delete(doc(db, 'giftLinks', cleanId));
    batch.set(doc(db, 'deletedLinks', cleanId), {
      id: cleanId,
      deletedAt: serverTimestamp(),
    });
    try {
      await batch.commit();
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `giftLinks/${cleanId}`);
    }
  },

  async redeemPrize(code: string, staffName = 'استقبال المعمل'): Promise<{ ok: boolean; message: string }> {
    const q = code.trim().toUpperCase();
    if (!q) return { ok: false, message: 'يرجى إدخال كود الجائزة.' };

    try {
      const snap = await getDocs(collection(db, 'giftLinks'));
      const matched = snap.docs.find((d) => {
        const data = d.data();
        return (
          String(data.prizeCode || '').toUpperCase() === q ||
          String(data.token || '').toUpperCase() === q ||
          d.id.toUpperCase() === q
        );
      });

      if (!matched) {
        return { ok: false, message: 'كود الجائزة أو الرابط غير موجود.' };
      }

      const data = matched.data();
      if (data.status === 'redeemed') {
        return { ok: false, message: `تم صرف هذه الجائزة مسبقاً للمريض (${data.clientName}).` };
      }

      await updateDoc(doc(db, 'giftLinks', matched.id), {
        status: 'redeemed',
        redeemedAt: new Date().toISOString(),
        redeemedBy: staffName.slice(0, 120),
        updatedAt: serverTimestamp(),
      });
      return { ok: true, message: `تم تأكيد صرف الجائزة للمريض (${data.clientName}) بنجاح.` };
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'giftLinks/redeem');
    }
  },

  async upsertPrize(prize: Partial<Prize>): Promise<{ ok: boolean; message?: string }> {
    const id = prize.id ? normalizeDocId(prize.id) : `prz_${Date.now().toString(36)}`;
    if (!id) return { ok: false, message: 'معرف الجائزة غير صالح.' };

    const title = String(prize.title || '').trim().slice(0, 200);
    const category = (prize.category || 'DISCOUNT') as PrizeCategory;
    const validHours = Math.min(2160, Math.max(1, Number(prize.validHours || 48)));
    const termsRaw = String(prize.terms || '').trim();
    const terms = (termsRaw || buildDefaultPrizeTerms({ title, category, validHours })).slice(0, 1000);

    const payload = {
      id,
      title,
      description: String(prize.description || '').trim().slice(0, 600),
      terms,
      discountLabel: String(prize.discountLabel || 'هدية خاصة').trim().slice(0, 80),
      category,
      validHours,
      weight: Math.min(1000, Math.max(1, Number(prize.weight || 20))),
      stock: Math.min(100000, Math.max(1, Number(prize.stock || 50))),
      usedCount: Math.min(100000, Math.max(0, Number(prize.usedCount || 0))),
      active: prize.active ?? true,
      updatedAt: serverTimestamp(),
    };

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'prizes', id), payload);
      await batch.commit();
      return { ok: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `prizes/${id}`);
    }
  },

  async bulkImportPrizes(
    items: Array<{
      title: string;
      category: PrizeCategory;
      discountLabel?: string;
      description?: string;
      terms?: string;
      validHours?: number;
      weight?: number;
      stock?: number;
    }>
  ): Promise<{ ok: boolean; count: number }> {
    if (items.length === 0) return { ok: true, count: 0 };
    try {
      const now = Date.now().toString(36);
      for (let i = 0; i < items.length; i += 350) {
        const chunk = items.slice(i, i + 350);
        const batch = writeBatch(db);
        chunk.forEach((item, idx) => {
          const id = `prz_${now}_${i + idx}`;
          const validHours = Math.min(2160, Math.max(1, Number(item.validHours || 72)));
          const terms = String(
            item.terms || buildDefaultPrizeTerms({ title: item.title, category: item.category, validHours })
          )
            .trim()
            .slice(0, 1000);
          batch.set(doc(db, 'prizes', id), {
            id,
            title: String(item.title || '').trim().slice(0, 200),
            description: String(item.description || item.title || '').trim().slice(0, 600),
            terms,
            discountLabel: String(item.discountLabel || 'هدية خاصة').trim().slice(0, 80),
            category: item.category,
            validHours,
            weight: Math.min(1000, Math.max(1, Number(item.weight || 15))),
            stock: Math.min(100000, Math.max(1, Number(item.stock || 50))),
            usedCount: 0,
            active: true,
            updatedAt: serverTimestamp(),
          });
        });
        await batch.commit();
      }
      return { ok: true, count: items.length };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'prizes/bulk');
    }
  },

  async seedFullPrizeCatalog(): Promise<{ ok: boolean; count: number }> {
    try {
      for (let i = 0; i < DEFAULT_PRIZES.length; i += 350) {
        const chunk = DEFAULT_PRIZES.slice(i, i + 350);
        const batch = writeBatch(db);
        for (const p of chunk) {
          batch.set(doc(db, 'prizes', p.id), {
            ...p,
            updatedAt: serverTimestamp(),
          });
        }
        await batch.commit();
      }
      return { ok: true, count: DEFAULT_PRIZES.length };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'prizes/seed');
    }
  },

  async setPrizesActiveBatch(prizesList: Prize[], active: boolean): Promise<void> {
    if (prizesList.length === 0) return;
    try {
      for (let i = 0; i < prizesList.length; i += 350) {
        const chunk = prizesList.slice(i, i + 350);
        const batch = writeBatch(db);
        for (const p of chunk) {
          const cleanId = normalizeDocId(p.id);
          if (!cleanId) continue;
          batch.update(doc(db, 'prizes', cleanId), {
            active,
            updatedAt: serverTimestamp(),
          });
        }
        await batch.commit();
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'prizes/toggleBatch');
    }
  },

  async deletePrize(id: string): Promise<boolean> {
    const cleanId = normalizeDocId(id);
    if (!cleanId) return false;
    try {
      await deleteDoc(doc(db, 'prizes', cleanId));
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prizes/${cleanId}`);
    }
  },

  async updateLabProfile(
    payload: LabProfile
  ): Promise<{ ok: boolean; labProfile?: LabProfile; message?: string }> {
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'publicConfig', 'labProfile'), buildPublicProfilePayload(payload));
      batch.set(doc(db, 'adminSettings', 'templates'), buildAdminTemplatesPayload(payload));
      await batch.commit();
      return { ok: true, labProfile: payload, message: 'تم حفظ بيانات المعمل والشعار في السحابة بنجاح.' };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'publicConfig/labProfile');
    }
  },

  async upsertPriceItem(item: Partial<LabPriceItem>): Promise<{ ok: boolean; message?: string }> {
    const id = item.id ? normalizeDocId(item.id) : `t-${Date.now().toString(36)}`;
    if (!id) return { ok: false, message: 'معرف التحليل غير صالح.' };

    const docData: Record<string, unknown> = {
      id,
      code: String(item.code || `RT-${Math.floor(100 + Math.random() * 900)}`).slice(0, 64),
      nameAr: String(item.nameAr || 'تحليل طبي').trim().slice(0, 200),
      category: String(item.category || 'general').slice(0, 80),
      price: Math.max(0, Number(item.price || 0)),
      active: item.active !== false,
      updatedAt: serverTimestamp(),
    };
    if (item.nameEn) docData.nameEn = String(item.nameEn).slice(0, 200);
    if (typeof item.offerPrice === 'number') docData.offerPrice = Math.max(0, item.offerPrice);
    if (item.duration) docData.duration = String(item.duration).slice(0, 120);

    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'prices', id), docData);
      await batch.commit();
      return { ok: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `prices/${id}`);
    }
  },

  async bulkSavePrices(
    changedPrices: LabPriceItem[]
  ): Promise<{ ok: boolean; message?: string }> {
    const baseMap = new Map(INITIAL_PRICES.map((p) => [p.id, p]));
    const modified = changedPrices.filter((item) => {
      const orig = baseMap.get(item.id);
      if (!orig) return true;
      return (
        orig.price !== item.price ||
        orig.offerPrice !== item.offerPrice ||
        orig.nameAr !== item.nameAr ||
        orig.active !== item.active
      );
    });

    if (modified.length === 0) {
      return { ok: true, message: 'الأسعار محدثة بالفعل.' };
    }

    try {
      // Commit in batches of 400 to respect Firestore 500-op limit
      for (let i = 0; i < modified.length; i += 400) {
        const chunk = modified.slice(i, i + 400);
        const batch = writeBatch(db);
        for (const item of chunk) {
          const cleanId = normalizeDocId(item.id) || `t-${Date.now().toString(36)}`;
          const docData: Record<string, unknown> = {
            id: cleanId,
            code: String(item.code || cleanId).slice(0, 64),
            nameAr: String(item.nameAr || 'تحليل طبي').slice(0, 200),
            category: String(item.category || 'general').slice(0, 80),
            price: Math.max(0, Number(item.price || 0)),
            active: item.active !== false,
            updatedAt: serverTimestamp(),
          };
          if (item.nameEn) docData.nameEn = String(item.nameEn).slice(0, 200);
          if (typeof item.offerPrice === 'number') docData.offerPrice = Math.max(0, item.offerPrice);
          if (item.duration) docData.duration = String(item.duration).slice(0, 120);
          batch.set(doc(db, 'prices', cleanId), docData);
        }
        await batch.commit();
      }
      return { ok: true };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'prices/bulk');
    }
  },

  async deletePriceItem(id: string): Promise<boolean> {
    const cleanId = normalizeDocId(id);
    if (!cleanId) return false;
    const isInitial = INITIAL_PRICES.some((p) => p.id === cleanId);
    try {
      if (isInitial) {
        const orig = INITIAL_PRICES.find((p) => p.id === cleanId)!;
        const batch = writeBatch(db);
        batch.set(doc(db, 'prices', cleanId), {
          id: cleanId,
          code: orig.code,
          nameAr: orig.nameAr,
          category: orig.category,
          price: orig.price,
          active: false,
          updatedAt: serverTimestamp(),
        });
        await batch.commit();
      } else {
        await deleteDoc(doc(db, 'prices', cleanId));
      }
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prices/${cleanId}`);
    }
  },

  async exportFullBackup(currentData: AdminDashboardData): Promise<FullBackupPayload> {
    return {
      version: '3.0',
      exportedAt: new Date().toISOString(),
      labProfile: currentData.labProfile,
      prizes: currentData.prizes,
      giftLinks: currentData.giftLinks,
      prices: currentData.prices,
    };
  },

  async importFullBackup(parsed: Record<string, unknown>): Promise<{
    ok: boolean;
    message?: string;
    importedCounts?: { prizes: number; links: number; prices: number };
  }> {
    let prizesCount = 0;
    let linksCount = 0;
    let pricesCount = 0;

    try {
      const incomingProfile = (parsed.labProfile || parsed.settings) as Partial<LabProfile> | undefined;
      if (incomingProfile && typeof incomingProfile === 'object') {
        const mergedProfile: LabProfile = {
          ...DEFAULT_LAB_PROFILE,
          ...incomingProfile,
        };
        const batch = writeBatch(db);
        batch.set(doc(db, 'publicConfig', 'labProfile'), buildPublicProfilePayload(mergedProfile));
        batch.set(doc(db, 'adminSettings', 'templates'), buildAdminTemplatesPayload(mergedProfile));
        await batch.commit();
      }

      if (Array.isArray(parsed.prizes) && parsed.prizes.length > 0) {
        const batch = writeBatch(db);
        for (const p of parsed.prizes as Prize[]) {
          const cleanId = normalizeDocId(String(p.id || `prz_${Date.now().toString(36)}`));
          if (!cleanId) continue;
          batch.set(doc(db, 'prizes', cleanId), {
            id: cleanId,
            title: String(p.title || '').slice(0, 200),
            description: String(p.description || '').slice(0, 600),
            terms: String(p.terms || '').slice(0, 1000),
            discountLabel: String(p.discountLabel || 'هدية خاصة').slice(0, 80),
            category: (p.category || 'DISCOUNT') as PrizeCategory,
            validHours: Math.min(2160, Math.max(1, Number(p.validHours || 48))),
            weight: Math.min(1000, Math.max(1, Number(p.weight || 20))),
            stock: Math.min(100000, Math.max(1, Number(p.stock || 50))),
            usedCount: Math.min(100000, Math.max(0, Number(p.usedCount || 0))),
            active: p.active !== false,
            updatedAt: serverTimestamp(),
          });
          prizesCount++;
        }
        await batch.commit();
      }

      if (Array.isArray(parsed.giftLinks) && parsed.giftLinks.length > 0) {
        const links = parsed.giftLinks as GiftLink[];
        for (let i = 0; i < links.length; i += 150) {
          const chunk = links.slice(i, i + 150);
          const batch = writeBatch(db);
          for (const lnk of chunk) {
            const cleanId = normalizeId(String(lnk.token || lnk.id || randomCode('RTBOX-', 6)));
            if (!cleanId) continue;
            batch.set(doc(db, 'giftLinks', cleanId), {
              id: cleanId,
              token: cleanId,
              clientName: String(lnk.clientName || 'عميل').slice(0, 120),
              visitRef: String(lnk.visitRef || '').slice(0, 64),
              branchName: String(lnk.branchName || '').slice(0, 160),
              status: lnk.status || 'pending',
              createdAt: serverTimestamp(),
              expiresAt: String(lnk.expiresAt || new Date(Date.now() + 14 * 86400_000).toISOString()).slice(0, 64),
              openedAt: lnk.openedAt || null,
              redeemedAt: lnk.redeemedAt || null,
              redeemedBy: lnk.redeemedBy || null,
              appointmentAt: lnk.appointmentAt || null,
              appointmentNote: lnk.appointmentNote || null,
              prizeId: lnk.prizeId || null,
              prizeTitle: lnk.prizeTitle || null,
              prizeDescription: lnk.prizeDescription || null,
              prizeTerms: lnk.prizeTerms ? String(lnk.prizeTerms).slice(0, 1000) : null,
              prizeDiscountLabel: lnk.prizeDiscountLabel || null,
              prizeCategory: lnk.prizeCategory || null,
              prizeCode: lnk.prizeCode || null,
              validHours: typeof lnk.validHours === 'number' ? lnk.validHours : null,
              updatedAt: serverTimestamp(),
            });
            batch.set(doc(db, 'giftLinks', cleanId, 'private', 'contact'), {
              clientPhone: String(lnk.clientPhone || '').slice(0, 40),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            linksCount++;
          }
          await batch.commit();
        }
      }

      const incomingPrices = (parsed.prices || parsed.tests) as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(incomingPrices) && incomingPrices.length > 0) {
        const normalizedPrices: LabPriceItem[] = incomingPrices.map((t, idx) => ({
          id: normalizeDocId(String(t.id || `imp-${idx}`)) || `imp-${idx}`,
          code: String(t.code || `RT-${idx + 1}`).slice(0, 64),
          nameAr: String(t.nameAr || t.name || 'تحليل طبي').slice(0, 200),
          nameEn: t.nameEn ? String(t.nameEn).slice(0, 200) : undefined,
          category: String(t.category || 'general').slice(0, 80),
          price: Math.max(0, Number(t.price) || 0),
          offerPrice: t.offerPrice !== undefined ? Math.max(0, Number(t.offerPrice)) : undefined,
          duration: t.duration ? String(t.duration).slice(0, 120) : undefined,
          active: t.active !== false,
        }));
        await this.bulkSavePrices(normalizedPrices);
        pricesCount = normalizedPrices.length;
      }

      return {
        ok: true,
        message: 'تم استيراد النسخة ومزامنتها سحابياً بنجاح.',
        importedCounts: {
          prizes: prizesCount,
          links: linksCount,
          prices: pricesCount,
        },
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'importFullBackup');
    }
  },

  async syncCachedBoxToCloud(cachedBox: BoxPublicResponse): Promise<boolean> {
    const clean = normalizeId(cachedBox.token || '');
    if (!clean || !cachedBox.prize || (cachedBox.status !== 'opened' && cachedBox.status !== 'redeemed')) {
      return false;
    }
    if (getDeletedTokensSet().has(clean)) {
      addDeletedTokensLocally([clean]);
      return false;
    }
    try {
      const delSnap = await getDoc(doc(db, 'deletedLinks', clean));
      if (delSnap.exists()) {
        addDeletedTokensLocally([clean]);
        return false;
      }

      const snap = await getDoc(doc(db, 'giftLinks', clean));
      if (snap.exists()) {
        const existing = snap.data();
        if (existing.status === 'opened' || existing.status === 'redeemed') {
          return false;
        }
      }

      const validHours = Math.max(1, Number(cachedBox.prize.validHours || 48));
      const openedAt = cachedBox.openedAt || new Date().toISOString();
      const expiresAt =
        cachedBox.expiresAt && !Number.isNaN(new Date(cachedBox.expiresAt).getTime())
          ? cachedBox.expiresAt
          : new Date(Date.now() + validHours * 3600_000).toISOString();
      const prizeTerms = (
        cachedBox.prize.terms ||
        buildDefaultPrizeTerms({
          title: cachedBox.prize.title,
          category: cachedBox.prize.category,
          validHours,
        })
      ).slice(0, 1000);

      const batch = writeBatch(db);
      if (snap.exists()) {
        batch.update(doc(db, 'giftLinks', clean), {
          status: 'opened',
          openedAt,
          expiresAt,
          prizeId: 'prz_cached',
          prizeTitle: cachedBox.prize.title.slice(0, 200),
          prizeDescription: (cachedBox.prize.description || '').slice(0, 600),
          prizeTerms,
          prizeDiscountLabel: (cachedBox.prize.discountLabel || 'هدية خاصة').slice(0, 80),
          prizeCategory: String(cachedBox.prize.category || 'DISCOUNT').slice(0, 40),
          prizeCode: (cachedBox.prize.prizeCode || randomCode('RTWIN-', 6)).slice(0, 64),
          validHours,
          updatedAt: serverTimestamp(),
        });
      } else {
        batch.set(doc(db, 'giftLinks', clean), {
          id: clean,
          token: clean,
          clientName: String(cachedBox.clientName || 'عميلنا العزيز').slice(0, 120),
          visitRef: String(cachedBox.visitRef || `RT-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 64),
          branchName: String(cachedBox.branchName || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160),
          status: 'opened',
          createdAt: serverTimestamp(),
          expiresAt,
          openedAt,
          redeemedAt: null,
          redeemedBy: null,
          appointmentAt: cachedBox.appointmentAt || null,
          appointmentNote: cachedBox.appointmentNote || null,
          prizeId: 'prz_cached',
          prizeTitle: cachedBox.prize.title.slice(0, 200),
          prizeDescription: (cachedBox.prize.description || '').slice(0, 600),
          prizeTerms,
          prizeDiscountLabel: (cachedBox.prize.discountLabel || 'هدية خاصة').slice(0, 80),
          prizeCategory: String(cachedBox.prize.category || 'DISCOUNT').slice(0, 40),
          prizeCode: (cachedBox.prize.prizeCode || randomCode('RTWIN-', 6)).slice(0, 64),
          validHours,
          updatedAt: serverTimestamp(),
        });
        batch.set(doc(db, 'giftLinks', clean, 'private', 'contact'), {
          clientPhone: '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
      return true;
    } catch {
      return false;
    }
  },

  async forceSyncServerDashboard(): Promise<{
    dashboardData: AdminDashboardData;
    recoveredLocalCount: number;
  }> {
    // Step 1: Fetch authoritative server state for giftLinks & permanent deletion tombstones
    const [initialLinksSnap, deletedSnap] = await Promise.all([
      getDocsFromServer(collection(db, 'giftLinks')),
      getDocsFromServer(collection(db, 'deletedLinks')).catch(() => null),
    ]);
    let linksSnap = initialLinksSnap;
    const existingIds = new Set(linksSnap.docs.map((d) => d.id));
    const deletedIds = getDeletedTokensSet();
    if (deletedSnap) {
      const serverDeletedTokens = deletedSnap.docs.map((d) => d.id);
      serverDeletedTokens.forEach((id) => deletedIds.add(normalizeId(id)));
      if (serverDeletedTokens.length > 0) {
        addDeletedTokensLocally(serverDeletedTokens);
      }
    }
    let recoveredLocalCount = 0;

    // Step 2: Recover any locally-cached bookings from this browser's localStorage that never reached Firestore
    // (explicitly skipping any token that has been deleted)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const localCandidates: Array<Record<string, unknown>> = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (!key || key === DELETED_TOKENS_STORAGE_KEY) continue;
          if (key.startsWith('rt_hb_won_') || key.includes('giftLinks') || key.includes('happiness')) {
            const raw = window.localStorage.getItem(key);
            if (!raw) continue;
            try {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                parsed.forEach((item) => {
                  if (item && typeof item === 'object') localCandidates.push(item as Record<string, unknown>);
                });
              } else if (parsed && typeof parsed === 'object') {
                if (Array.isArray((parsed as Record<string, unknown>).giftLinks)) {
                  ((parsed as Record<string, unknown>).giftLinks as Array<Record<string, unknown>>).forEach(
                    (item) => localCandidates.push(item)
                  );
                } else if ((parsed as Record<string, unknown>).token) {
                  localCandidates.push(parsed as Record<string, unknown>);
                }
              }
            } catch {
              // ignore non-JSON entries
            }
          }
        }

        const toRecover = localCandidates.filter((c) => {
          const tok = normalizeId(String(c.token || c.id || ''));
          return Boolean(tok && !existingIds.has(tok) && !deletedIds.has(tok) && (c.prize || c.prizeTitle));
        });

        if (toRecover.length > 0) {
          for (let i = 0; i < toRecover.length; i += 100) {
            const chunk = toRecover.slice(i, i + 100);
            const batch = writeBatch(db);
            for (const c of chunk) {
              const tok = normalizeId(String(c.token || c.id || ''));
              if (!tok || existingIds.has(tok)) continue;
              existingIds.add(tok);
              const prizeObj = (c.prize as Record<string, unknown> | undefined) || {};
              const title = String(c.prizeTitle || prizeObj.title || '').trim().slice(0, 200);
              if (!title) continue;
              const category = (c.prizeCategory || prizeObj.category || 'DISCOUNT') as PrizeCategory;
              const validHours = Math.min(2160, Math.max(1, Number(c.validHours || prizeObj.validHours || 48)));
              const openedAt = String(c.openedAt || new Date().toISOString()).slice(0, 64);
              const expiresAt = String(
                c.expiresAt || new Date(Date.now() + validHours * 3600_000).toISOString()
              ).slice(0, 64);
              const phone = normalizeCanonicalPhone(String(c.clientPhone || ''));
              const phoneHash = phone.length >= 8 ? await hashPhoneNumber(phone) : '';
              const prizeTerms = String(
                c.prizeTerms || prizeObj.terms || buildDefaultPrizeTerms({ title, category, validHours })
              ).slice(0, 1000);

              batch.set(doc(db, 'giftLinks', tok), {
                id: tok,
                token: tok,
                clientName: String(c.clientName || 'عميلنا العزيز').slice(0, 120),
                visitRef: String(c.visitRef || `RT-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 64),
                branchName: String(c.branchName || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160),
                ...(phoneHash ? { phoneHash } : {}),
                status: 'opened',
                createdAt: serverTimestamp(),
                expiresAt,
                openedAt,
                redeemedAt: null,
                redeemedBy: null,
                appointmentAt: c.appointmentAt ? String(c.appointmentAt).slice(0, 120) : null,
                appointmentNote: c.appointmentNote ? String(c.appointmentNote).slice(0, 300) : null,
                prizeId: String(c.prizeId || 'prz_recovered').slice(0, 128),
                prizeTitle: title,
                prizeDescription: String(c.prizeDescription || prizeObj.description || title).slice(0, 600),
                prizeTerms,
                prizeDiscountLabel: String(c.prizeDiscountLabel || prizeObj.discountLabel || 'هدية خاصة').slice(0, 80),
                prizeCategory: String(category).slice(0, 40),
                prizeCode: String(c.prizeCode || prizeObj.prizeCode || randomCode('RTWIN-', 6)).slice(0, 64),
                validHours,
                updatedAt: serverTimestamp(),
              });
              batch.set(doc(db, 'giftLinks', tok, 'private', 'contact'), {
                clientPhone: phone || '',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              recoveredLocalCount++;
            }
            await batch.commit();
          }
          linksSnap = await getDocsFromServer(collection(db, 'giftLinks'));
        }
      } catch (err) {
        console.warn('Local recovery check warning:', err);
      }
    }

    // Step 3: Fetch remaining collections directly from server
    const [profileSnap, templatesSnap, prizesSnap, pricesSnap] = await Promise.all([
      getDocFromServer(doc(db, 'publicConfig', 'labProfile')).catch(() => null),
      getDocFromServer(doc(db, 'adminSettings', 'templates')).catch(() => null),
      getDocsFromServer(collection(db, 'prizes')),
      getDocsFromServer(collection(db, 'prices')),
    ]);

    const labProfile: LabProfile = { ...DEFAULT_LAB_PROFILE };
    if (profileSnap?.exists()) {
      const d = profileSnap.data();
      const curWa = formatWhatsAppPhone(String(d.whatsappNumber || '')) || String(d.whatsappNumber || '');
      const curTpl = String(d.whatsappPatientClaimTemplate ?? labProfile.whatsappPatientClaimTemplate);
      labProfile.labName = String(d.labName || labProfile.labName);
      labProfile.tagline = String(d.tagline ?? labProfile.tagline);
      labProfile.director = String(d.director ?? labProfile.director);
      labProfile.hotlineNumber = String(d.hotlineNumber ?? labProfile.hotlineNumber);
      labProfile.whatsappNumber =
        !curWa || curWa === '201100874444' ? DEFAULT_LAB_PROFILE.whatsappNumber : curWa;
      labProfile.address = String(d.address ?? labProfile.address);
      labProfile.workingHours = String(d.workingHours ?? labProfile.workingHours);
      labProfile.branches = Array.isArray(d.branches) ? d.branches.map(String) : labProfile.branches;
      labProfile.logoUrl = String(d.logoUrl || DEFAULT_ASSET_LOGO);
      labProfile.whatsappPatientClaimTemplate = curTpl.includes('{prizeTerms}')
        ? curTpl
        : DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate;
      labProfile.shareBaseUrl = String(d.shareBaseUrl ?? '');
    }
    if (templatesSnap?.exists()) {
      const d = templatesSnap.data();
      labProfile.whatsappInviteTemplate = String(
        d.whatsappInviteTemplate ?? labProfile.whatsappInviteTemplate
      );
      labProfile.whatsappWinnerReplyTemplate = String(
        d.whatsappWinnerReplyTemplate ?? labProfile.whatsappWinnerReplyTemplate
      );
    }

    const prizes: Prize[] = prizesSnap.empty
      ? DEFAULT_PRIZES
      : prizesSnap.docs.map((d) => {
          const data = d.data();
          const title = String(data.title || '');
          const category = (data.category as PrizeCategory) || 'DISCOUNT';
          const validHours = Number(data.validHours || 48);
          const matched = DEFAULT_PRIZES.find((p) => p.id === d.id || p.title === title);
          return {
            id: d.id,
            title,
            description: String(data.description || ''),
            terms: data.terms
              ? String(data.terms)
              : matched?.terms || buildDefaultPrizeTerms({ title, category, validHours }),
            discountLabel: String(data.discountLabel || 'هدية خاصة'),
            category,
            validHours,
            weight: Number(data.weight || 20),
            stock: Number(data.stock || 50),
            usedCount: Number(data.usedCount || 0),
            active: Boolean(data.active),
          };
        });

    const phones = new Map<string, string>();
    await Promise.all(
      linksSnap.docs.map(async (d) => {
        try {
          const c = await getDocFromServer(doc(db, 'giftLinks', d.id, 'private', 'contact'));
          if (c.exists()) phones.set(d.id, String(c.data().clientPhone || ''));
        } catch {
          // ignore
        }
      })
    );

    const giftLinks = linksSnap.docs
      .map((d) => docToGiftLink(d.id, d.data(), phones.get(d.id) || ''))
      .sort((a, b) => {
        const ta = new Date(a.openedAt || a.createdAt).getTime() || 0;
        const tb = new Date(b.openedAt || b.createdAt).getTime() || 0;
        return tb - ta;
      });

    const priceOverrides: LabPriceItem[] = pricesSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        code: String(data.code || ''),
        nameAr: String(data.nameAr || ''),
        nameEn: data.nameEn ? String(data.nameEn) : undefined,
        category: String(data.category || 'general'),
        price: Number(data.price || 0),
        offerPrice: typeof data.offerPrice === 'number' ? data.offerPrice : undefined,
        duration: data.duration ? String(data.duration) : undefined,
        active: data.active !== false,
      };
    });
    const prices = mergePricesWithInitial(priceOverrides);

    const usedMap = new Map<string, number>();
    for (const lnk of giftLinks) {
      if (lnk.prizeId) usedMap.set(lnk.prizeId, (usedMap.get(lnk.prizeId) || 0) + 1);
    }
    const enrichedPrizes = prizes.map((p) => ({
      ...p,
      usedCount: Math.max(p.usedCount, usedMap.get(p.id) || 0),
    }));

    return {
      recoveredLocalCount,
      dashboardData: {
        labProfile,
        prizes: enrichedPrizes,
        giftLinks,
        prices,
        stats: {
          totalLinks: giftLinks.length,
          pendingLinks: giftLinks.filter((l) => l.status === 'pending').length,
          openedLinks: giftLinks.filter((l) => l.status === 'opened').length,
          redeemedLinks: giftLinks.filter((l) => l.status === 'redeemed').length,
          expiredLinks: giftLinks.filter((l) => l.status === 'expired').length,
          activePrizes: enrichedPrizes.filter((p) => p.active).length,
          totalPrices: prices.filter((p) => p.active).length,
        },
      },
    };
  },

  async importRecoveredBookings(
    items: Array<{
      clientName: string;
      clientPhone?: string;
      prizeTitle: string;
      discountLabel?: string;
      prizeCode?: string;
      branchName?: string;
      status?: 'opened' | 'redeemed';
      validHours?: number;
    }>,
    existingLinks: GiftLink[],
    prizesCatalog: Prize[]
  ): Promise<{ ok: boolean; importedCount: number; skippedDuplicates: number }> {
    const existingCodes = new Set(
      existingLinks.map((l) => (l.prizeCode || '').trim().toUpperCase()).filter(Boolean)
    );
    const allPrizes = prizesCatalog.length > 0 ? prizesCatalog : DEFAULT_PRIZES;
    let importedCount = 0;
    let skippedDuplicates = 0;

    try {
      const now = Date.now();
      for (let i = 0; i < items.length; i += 100) {
        const chunk = items.slice(i, i + 100);
        const batch = writeBatch(db);
        let batchOps = 0;

        for (const item of chunk) {
          const cleanName = String(item.clientName || '').trim().slice(0, 120);
          const cleanPrizeTitle = String(item.prizeTitle || '').trim().slice(0, 200);
          if (!cleanName || !cleanPrizeTitle) continue;

          const codeUpper = String(item.prizeCode || '').trim().toUpperCase();
          if (codeUpper && existingCodes.has(codeUpper)) {
            skippedDuplicates++;
            continue;
          }

          const matchedPrize =
            allPrizes.find((p) => p.title.trim() === cleanPrizeTitle) ||
            allPrizes.find(
              (p) =>
                cleanPrizeTitle.includes(p.title.trim()) || p.title.trim().includes(cleanPrizeTitle)
            );

          const validHours = Math.min(
            2160,
            Math.max(1, Number(item.validHours || matchedPrize?.validHours || 72))
          );
          const category = matchedPrize?.category || 'DISCOUNT';
          const discountLabel = String(
            item.discountLabel || matchedPrize?.discountLabel || 'هدية خاصة'
          ).slice(0, 80);
          const description = String(
            matchedPrize?.description || `${cleanPrizeTitle} — جائزة صندوق السعادة من معامل RT.`
          ).slice(0, 600);
          const prizeTerms = String(
            matchedPrize?.terms ||
              buildDefaultPrizeTerms({ title: cleanPrizeTitle, category, validHours })
          ).slice(0, 1000);

          const token = randomCode('RTBOX-', 6);
          const prizeCode = (codeUpper || randomCode('RTWIN-', 6)).slice(0, 64);
          existingCodes.add(prizeCode);
          const openedAt = new Date(now).toISOString();
          const expiresAt = new Date(now + validHours * 3600_000).toISOString();
          const canonicalPhone = normalizeCanonicalPhone(String(item.clientPhone || '')).slice(0, 40);
          const phoneHash = canonicalPhone.length >= 8 ? await hashPhoneNumber(canonicalPhone) : '';
          const status = item.status === 'redeemed' ? 'redeemed' : 'opened';

          batch.set(doc(db, 'giftLinks', token), {
            id: token,
            token,
            clientName: cleanName,
            visitRef: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
            branchName: String(item.branchName || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160),
            ...(phoneHash ? { phoneHash } : {}),
            status,
            createdAt: serverTimestamp(),
            expiresAt,
            openedAt,
            redeemedAt: status === 'redeemed' ? openedAt : null,
            redeemedBy: status === 'redeemed' ? 'استيراد وتفعيل من الإدارة' : null,
            appointmentAt: null,
            appointmentNote: null,
            prizeId: (matchedPrize?.id || 'prz_imported').slice(0, 128),
            prizeTitle: cleanPrizeTitle,
            prizeDescription: description,
            prizeTerms,
            prizeDiscountLabel: discountLabel,
            prizeCategory: String(category).slice(0, 40),
            prizeCode,
            validHours,
            updatedAt: serverTimestamp(),
          });
          batch.set(doc(db, 'giftLinks', token, 'private', 'contact'), {
            clientPhone: canonicalPhone,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          if (phoneHash) {
            batch.set(doc(db, 'phoneLocks', phoneHash), {
              id: phoneHash,
              activeToken: token,
              expiresAt,
              lockUntil: Timestamp.fromMillis(now + validHours * 3600_000),
              updatedAt: serverTimestamp(),
            });
          }
          batchOps++;
          importedCount++;
        }

        if (batchOps > 0) {
          await batch.commit();
        }
      }

      return { ok: true, importedCount, skippedDuplicates };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'giftLinks/importRecovered');
    }
  },
};
