import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
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
  whatsappNumber: '201100874444',
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
    'مرحباً {labName}، فتحت صندوق السعادة وكسبت الجائزة التالية:\nالاسم: {clientName}\nالجائزة: {prizeTitle} ({discountLabel})\nكود الجائزة: {prizeCode}\nصالحة حتى: {expiresAt}\nأرغب في تأكيد تفعيل الجائزة وحجز الموعد.',
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
  return {
    labName: String(profile.labName || DEFAULT_LAB_PROFILE.labName).slice(0, 120),
    tagline: String(profile.tagline || '').slice(0, 200),
    director: String(profile.director || '').slice(0, 160),
    hotlineNumber: String(profile.hotlineNumber || '').slice(0, 40),
    whatsappNumber: String(profile.whatsappNumber || DEFAULT_LAB_PROFILE.whatsappNumber).slice(0, 40),
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
    try {
      const snap = await getDoc(doc(db, 'publicConfig', 'labProfile'));
      if (snap.exists()) {
        const d = snap.data();
        profile.labName = String(d.labName || profile.labName);
        profile.tagline = String(d.tagline ?? profile.tagline);
        profile.director = String(d.director ?? profile.director);
        profile.hotlineNumber = String(d.hotlineNumber ?? profile.hotlineNumber);
        profile.whatsappNumber = String(d.whatsappNumber || profile.whatsappNumber);
        profile.address = String(d.address ?? profile.address);
        profile.workingHours = String(d.workingHours ?? profile.workingHours);
        profile.branches = Array.isArray(d.branches) ? d.branches.map(String) : profile.branches;
        profile.logoUrl = String(d.logoUrl || profile.logoUrl);
        profile.whatsappPatientClaimTemplate = String(
          d.whatsappPatientClaimTemplate ?? profile.whatsappPatientClaimTemplate
        );
        profile.shareBaseUrl = String(d.shareBaseUrl ?? '');
      }
    } catch (err) {
      console.warn('Using default public config:', err);
    }

    const decoded = decodeBoxData(encodedData);
    if (decoded) {
      if (decoded.ln) profile.labName = decoded.ln;
      if (decoded.wa) profile.whatsappNumber = decoded.wa;
      if (decoded.ht) profile.hotlineNumber = decoded.ht;
    }

    return {
      labProfile: profile,
      shareBaseUrl: profile.shareBaseUrl || getAppShareBase(),
    };
  },

  async getBoxByToken(
    token: string,
    encodedData?: string | null
  ): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const clean = normalizeId(token);
    if (!clean) {
      return { ok: false, message: 'رابط صندوق السعادة غير صحيح.' };
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
  ): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const clean = normalizeId(token);
    if (!clean) {
      return { ok: false, message: 'رابط صندوق السعادة غير صحيح.' };
    }

    const linkRef = doc(db, 'giftLinks', clean);
    let existingSnap;
    try {
      existingSnap = await getDoc(linkRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `giftLinks/${clean}`);
    }

    if (existingSnap.exists()) {
      const existingLnk = docToGiftLink(existingSnap.id, existingSnap.data());
      if (existingLnk.status === 'opened' || existingLnk.status === 'redeemed') {
        return { ok: true, box: toPublicBox(existingLnk) };
      }
      if (existingLnk.status === 'expired') {
        return { ok: false, message: 'انتهت صلاحية هذا الرابط.' };
      }

      const prizes = await fetchActivePrizes(encodedData);
      const chosen = pickWeightedPrize(prizes);
      const now = Date.now();
      const validHours = Math.max(1, Number(chosen.validHours || 48));
      const openedAt = new Date(now).toISOString();
      const expiresAt = new Date(now + validHours * 3600_000).toISOString();
      const prizeCode = randomCode('RTWIN-', 6);
      const prizeTerms = (chosen.terms || buildDefaultPrizeTerms(chosen)).slice(0, 1000);

      try {
        await updateDoc(linkRef, {
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
    const decoded = decodeBoxData(encodedData);
    if (!decoded && clean !== 'RTBOX-DEMO2026') {
      return { ok: false, message: 'رابط صندوق السعادة غير موجود.' };
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
    const clientPhone = (decoded?.p || '').trim().slice(0, 40);
    const visitRef = (decoded?.v || `RT-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 64);
    const branchName = (decoded?.b || DEFAULT_LAB_PROFILE.branches[0]).slice(0, 160);

    const batch = writeBatch(db);
    batch.set(linkRef, {
      id: clean,
      token: clean,
      clientName,
      visitRef,
      branchName,
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
  }): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const cleanName = payload.clientName.trim().slice(0, 120);
    const cleanPhone = payload.clientPhone.trim().slice(0, 40);
    if (!cleanName || cleanPhone.replace(/\D/g, '').length < 8) {
      return { ok: false, message: 'يرجى إدخال الاسم ورقم الواتساب بشكل صحيح.' };
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
      clientPhone: cleanPhone,
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
      box: toPublicBox({
        id: token,
        token,
        clientName: cleanName,
        clientPhone: cleanPhone,
        visitRef,
        branchName,
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
          publicProfile = {
            labName: String(d.labName || DEFAULT_LAB_PROFILE.labName),
            tagline: String(d.tagline ?? DEFAULT_LAB_PROFILE.tagline),
            director: String(d.director ?? DEFAULT_LAB_PROFILE.director),
            hotlineNumber: String(d.hotlineNumber ?? DEFAULT_LAB_PROFILE.hotlineNumber),
            whatsappNumber: String(d.whatsappNumber || DEFAULT_LAB_PROFILE.whatsappNumber),
            address: String(d.address ?? DEFAULT_LAB_PROFILE.address),
            workingHours: String(d.workingHours ?? DEFAULT_LAB_PROFILE.workingHours),
            branches: Array.isArray(d.branches) ? d.branches.map(String) : DEFAULT_LAB_PROFILE.branches,
            logoUrl: String(d.logoUrl || DEFAULT_ASSET_LOGO),
            whatsappPatientClaimTemplate: String(
              d.whatsappPatientClaimTemplate ?? DEFAULT_LAB_PROFILE.whatsappPatientClaimTemplate
            ),
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
      query(collection(db, 'giftLinks'), orderBy('createdAt', 'desc')),
      async (snap) => {
        const docs = snap.docs;
        // Fetch private phone numbers for any uncached link IDs
        const missingIds = docs.map((d) => d.id).filter((id) => !phoneCache.has(id));
        if (missingIds.length > 0) {
          await Promise.all(
            missingIds.map(async (id) => {
              try {
                const contactSnap = await getDoc(doc(db, 'giftLinks', id, 'private', 'contact'));
                if (contactSnap.exists()) {
                  phoneCache.set(id, String(contactSnap.data().clientPhone || ''));
                } else {
                  phoneCache.set(id, '');
                }
              } catch {
                phoneCache.set(id, '');
              }
            })
          );
        }

        giftLinks = docs.map((d) => docToGiftLink(d.id, d.data(), phoneCache.get(d.id) || ''));
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

    const batch = writeBatch(db);
    batch.set(doc(db, 'giftLinks', token), {
      id: token,
      token,
      clientName,
      visitRef,
      branchName,
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
      clientPhone,
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
        clientPhone,
        visitRef,
        branchName,
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
    const batch = writeBatch(db);
    batch.delete(doc(db, 'giftLinks', cleanId, 'private', 'contact'));
    batch.delete(doc(db, 'giftLinks', cleanId));
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
};
