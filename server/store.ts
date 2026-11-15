import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import type {
  AdminDashboardData,
  BoxPublicResponse,
  FullBackupPayload,
  GiftLink,
  LabPriceItem,
  LabProfile,
  Prize,
  PrizeCategory,
} from '../src/types.ts';
import { INITIAL_PRICES } from './initialPrices.ts';

interface DatabaseSchema {
  adminPassword: string;
  labProfile: LabProfile;
  prizes: Prize[];
  giftLinks: GiftLink[];
  prices: LabPriceItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'happiness-box-db.json');

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
  logoUrl: '/logo.jpg',
  whatsappInviteTemplate:
    'أهلاً {clientName} 🌟\nهديتك من {labName} جاهزة الآن في صندوق السعادة 🎁\nاضغط على الرابط التالي لفتح الصندوق ومعرفة هديتك فوراً:\n{boxUrl}\n\nنتمنى لك دوام الصحة والعافية ❤️',
  whatsappWinnerReplyTemplate:
    'ألف مبروك يا {clientName} 🎉\nتم تأكيد فوزك من {labName} بجائزة:\n🎁 {prizeTitle} ({discountLabel})\n🔑 كود الجائزة: {prizeCode}\n⏳ الجائزة متاحة لوقت محدد وتنتهي صلاحيتها في: {expiresAt}\n\nيسعدنا تشريفك في أقرب فرع أو حجز السحب المنزلي قبل انتهاء الموعد!',
  whatsappPatientClaimTemplate:
    'مرحباً {labName}، فتحت صندوق السعادة وكسبت الجائزة التالية:\nالاسم: {clientName}\nالجائزة: {prizeTitle} ({discountLabel})\nكود الجائزة: {prizeCode}\nصالحة حتى: {expiresAt}\nأرغب في تأكيد تفعيل الجائزة وحجز الموعد.',
};

function createInitialSeed(): DatabaseSchema {
  const now = Date.now();
  const prizes: Prize[] = [
    {
      id: 'prz_cbc_free',
      title: 'تحليل صورة دم كاملة (CBC) مجاناً',
      description: 'تحليل صورة الدم الكاملة مجاناً بالكامل في معامل RT خلال الفترة المحددة للجائزة.',
      discountLabel: 'مجاني 100%',
      category: 'free_test',
      validHours: 72,
      weight: 22,
      stock: 50,
      usedCount: 0,
      active: true,
    },
    {
      id: 'prz_pkg_30',
      title: 'خصم 30% على باقة الفحص الشامل',
      description: 'خصم فوري 30% على باقة الاطمئنان الشاملة (كبد، كلى، دهون، وسكر تراكمي).',
      discountLabel: 'خصم 30%',
      category: 'package',
      validHours: 72,
      weight: 25,
      stock: 100,
      usedCount: 0,
      active: true,
    },
    {
      id: 'prz_hba1c_free',
      title: 'تحليل سكر تراكمي (HbA1c) مجاناً',
      description: 'تحليل السكر التراكمي مجاناً لمتابعة مستوى السكر بدقة.',
      discountLabel: 'مجاني 100%',
      category: 'free_test',
      validHours: 48,
      weight: 18,
      stock: 40,
      usedCount: 0,
      active: true,
    },
    {
      id: 'prz_home_20',
      title: 'سحب منزلي مجاني + خصم 20% على التحاليل',
      description: 'خدمة سحب عينات من المنزل مجاناً بدون رسوم انتقال مع خصم 20% على إجمالي الفاتورة.',
      discountLabel: 'سحب مجاني + 20%',
      category: 'home_visit',
      validHours: 96,
      weight: 20,
      stock: 80,
      usedCount: 0,
      active: true,
    },
    {
      id: 'prz_vitd_40',
      title: 'خصم 40% على تحليل فيتامين د (Vitamin D)',
      description: 'خصم خاص 40% على فحص فيتامين د في جميع فروع المعمل أو السحب المنزلي.',
      discountLabel: 'خصم 40%',
      category: 'discount',
      validHours: 48,
      weight: 15,
      stock: 60,
      usedCount: 0,
      active: true,
    },
  ];

  const giftLinks: GiftLink[] = [
    {
      id: 'lnk_demo_ready',
      token: 'RTBOX-DEMO2026',
      clientName: 'عميلنا العزيز',
      clientPhone: '01000000000',
      visitRef: 'RT-1001',
      branchName: DEFAULT_LAB_PROFILE.branches[0],
      status: 'pending',
      createdAt: new Date(now - 3600_000).toISOString(),
      expiresAt: new Date(now + 30 * 24 * 3600_000).toISOString(),
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
      notes: 'رابط تجريبي جاهز لاختبار فتح صندوق السعادة',
    },
  ];

  return {
    adminPassword: process.env.ADMIN_PASSWORD?.trim() || 'RTLAB2026',
    labProfile: { ...DEFAULT_LAB_PROFILE },
    prizes,
    giftLinks,
    prices: INITIAL_PRICES.map((p) => ({ ...p })),
  };
}

let operationQueue: Promise<unknown> = Promise.resolve();
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = operationQueue.then(fn, fn);
  operationQueue = next.catch(() => undefined);
  return next;
}

async function readDb(): Promise<DatabaseSchema> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    const seed = createInitialSeed();
    const db: DatabaseSchema = {
      adminPassword: parsed.adminPassword || seed.adminPassword,
      labProfile: { ...DEFAULT_LAB_PROFILE, ...(parsed.labProfile || {}) },
      prizes: Array.isArray(parsed.prizes) && parsed.prizes.length > 0 ? parsed.prizes : seed.prizes,
      giftLinks: Array.isArray(parsed.giftLinks) ? parsed.giftLinks : seed.giftLinks,
      prices: Array.isArray(parsed.prices) && parsed.prices.length > 0 ? parsed.prices : seed.prices,
    };

    // Auto-expire links whose deadline passed
    const nowMs = Date.now();
    let changed = false;
    db.giftLinks = db.giftLinks.map((lnk) => {
      if ((lnk.status === 'pending' || lnk.status === 'opened') && new Date(lnk.expiresAt).getTime() < nowMs) {
        changed = true;
        return { ...lnk, status: 'expired' };
      }
      return lnk;
    });
    if (changed) {
      await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    }
    return db;
  } catch {
    const seed = createInitialSeed();
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
    return seed;
  }
}

async function writeDb(db: DatabaseSchema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('20') && digits.length >= 12) {
    return '0' + digits.slice(2);
  }
  return digits;
}

function generateToken(): string {
  return `RTBOX-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

function generatePrizeCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const pick = (len: number) => {
    const bytes = crypto.randomBytes(len);
    let out = '';
    for (let i = 0; i < len; i++) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  };
  return `RT-${pick(4)}-${pick(4)}`;
}

function pickWeightedPrize(prizes: Prize[]): Prize | null {
  const eligible = prizes.filter((p) => p.active && p.stock > p.usedCount);
  const pool = eligible.length > 0 ? eligible : prizes.filter((p) => p.active);
  if (pool.length === 0) return null;

  const totalWeight = pool.reduce((sum, p) => sum + Math.max(1, p.weight), 0);
  let r = crypto.randomInt(0, totalWeight);
  for (const p of pool) {
    r -= Math.max(1, p.weight);
    if (r < 0) return p;
  }
  return pool[0];
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
    prize: lnk.prizeTitle
      ? {
          title: lnk.prizeTitle,
          description: lnk.prizeDescription || '',
          discountLabel: lnk.prizeDiscountLabel || 'هدية خاصة',
          category: (lnk.prizeCategory || 'discount') as PrizeCategory,
          prizeCode: lnk.prizeCode || '',
          validHours: lnk.validHours || 48,
        }
      : null,
  };
}

function resolveDefaultShareBaseUrl(): string {
  const raw = (process.env.SHARED_APP_URL || process.env.APP_URL || '').trim().replace(/\/$/, '');
  if (!raw) return '';
  if (raw.includes('://ais-dev-')) {
    return raw.replace('://ais-dev-', '://ais-pre-');
  }
  return raw;
}

function decodeEncodedBoxPayload(encoded?: string): {
  n?: string;
  p?: string;
  b?: string;
  v?: string;
  e?: string;
} | null {
  if (!encoded) return null;
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf8');
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export async function getPublicConfig(): Promise<{ labProfile: LabProfile; shareBaseUrl: string }> {
  const db = await readDb();
  const shareBaseUrl = db.labProfile.shareBaseUrl?.trim() || resolveDefaultShareBaseUrl();
  return { labProfile: db.labProfile, shareBaseUrl };
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const db = await readDb();
  const cleanInput = password.trim();
  const cleanStored = db.adminPassword.trim();
  const normalizedInput = cleanStored === 'RTLAB2026' ? cleanInput.toUpperCase() : cleanInput;
  const a = Buffer.from(normalizedInput);
  const b = Buffer.from(cleanStored);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const db = await readDb();
  const stats = {
    totalLinks: db.giftLinks.length,
    pendingLinks: db.giftLinks.filter((l) => l.status === 'pending').length,
    openedLinks: db.giftLinks.filter((l) => l.status === 'opened').length,
    redeemedLinks: db.giftLinks.filter((l) => l.status === 'redeemed').length,
    expiredLinks: db.giftLinks.filter((l) => l.status === 'expired').length,
    activePrizes: db.prizes.filter((p) => p.active).length,
    totalPrices: db.prices.length,
  };
  return {
    labProfile: db.labProfile,
    prizes: db.prizes,
    giftLinks: db.giftLinks,
    prices: db.prices,
    stats,
  };
}

function hydrateLinkIfMissing(db: DatabaseSchema, cleanToken: string, encodedData?: string): GiftLink | null {
  const decoded = decodeEncodedBoxPayload(encodedData);
  if (!decoded && !cleanToken.startsWith('RTBOX-')) {
    return null;
  }
  const nowMs = Date.now();
  const hydrated: GiftLink = {
    id: `lnk_${crypto.randomBytes(4).toString('hex')}`,
    token: cleanToken,
    clientName: String(decoded?.n || 'عميلنا العزيز').trim() || 'عميلنا العزيز',
    clientPhone: decoded?.p ? normalizePhone(String(decoded.p)) : '01000000000',
    visitRef: String(decoded?.v || `RT-${Math.floor(1000 + Math.random() * 9000)}`).trim(),
    branchName: String(decoded?.b || db.labProfile.branches[0] || 'الفرع الرئيسي').trim(),
    status: 'pending',
    createdAt: new Date(nowMs).toISOString(),
    expiresAt: decoded?.e && !Number.isNaN(new Date(decoded.e).getTime())
      ? new Date(decoded.e).toISOString()
      : new Date(nowMs + 14 * 24 * 3600_000).toISOString(),
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
  db.giftLinks.unshift(hydrated);
  return hydrated;
}

export async function getBoxByToken(
  token: string,
  encodedData?: string
): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
  return withLock(async () => {
    const db = await readDb();
    const clean = token.trim().toUpperCase();
    let found = db.giftLinks.find((l) => l.token.toUpperCase() === clean) || null;
    if (!found) {
      found = hydrateLinkIfMissing(db, clean, encodedData);
      if (found) {
        await writeDb(db);
      }
    }
    if (!found) {
      return { ok: false, message: 'رابط صندوق السعادة غير صحيح أو غير موجود.' };
    }
    return { ok: true, box: toPublicBox(found) };
  });
}

export async function openBoxByToken(
  token: string,
  encodedData?: string
): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
  return withLock(async () => {
    const db = await readDb();
    const clean = token.trim().toUpperCase();
    let lnk = db.giftLinks.find((l) => l.token.toUpperCase() === clean) || null;
    if (!lnk) {
      lnk = hydrateLinkIfMissing(db, clean, encodedData);
    }
    if (!lnk) {
      return { ok: false, message: 'رابط صندوق السعادة غير موجود.' };
    }
    if (lnk.status === 'expired') {
      return { ok: false, box: toPublicBox(lnk), message: 'انتهت مدة صلاحية هذا الرابط.' };
    }
    if (lnk.status === 'opened' || lnk.status === 'redeemed') {
      return { ok: true, box: toPublicBox(lnk) };
    }

    const chosen = pickWeightedPrize(db.prizes);
    if (!chosen) {
      return { ok: false, message: 'لا توجد جوائز نشطة داخل الصندوق حالياً.' };
    }

    const nowMs = Date.now();
    const validHours = Math.max(1, Number(chosen.validHours || 48));
    lnk.status = 'opened';
    lnk.openedAt = new Date(nowMs).toISOString();
    lnk.expiresAt = new Date(nowMs + validHours * 3600_000).toISOString();
    lnk.prizeId = chosen.id;
    lnk.prizeTitle = chosen.title;
    lnk.prizeDescription = chosen.description;
    lnk.prizeDiscountLabel = chosen.discountLabel;
    lnk.prizeCategory = chosen.category;
    lnk.prizeCode = generatePrizeCode();
    lnk.validHours = validHours;
    chosen.usedCount = (chosen.usedCount || 0) + 1;

    await writeDb(db);
    return { ok: true, box: toPublicBox(lnk) };
  });
}

export async function createAndOpenSelfBox(input: {
  clientName: string;
  clientPhone: string;
  branchName?: string;
}): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
  return withLock(async () => {
    const db = await readDb();
    const name = input.clientName.trim();
    const phone = normalizePhone(input.clientPhone);
    if (!name || phone.length < 8) {
      return { ok: false, message: 'يرجى كتابة الاسم ورقم الموبايل بشكل صحيح.' };
    }

    const chosen = pickWeightedPrize(db.prizes);
    if (!chosen) {
      return { ok: false, message: 'لا توجد جوائز متاحة حالياً.' };
    }

    const nowMs = Date.now();
    const validHours = Math.max(1, Number(chosen.validHours || 48));
    const link: GiftLink = {
      id: `lnk_${crypto.randomBytes(4).toString('hex')}`,
      token: generateToken(),
      clientName: name,
      clientPhone: phone,
      visitRef: `SELF-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      branchName: input.branchName || db.labProfile.branches[0] || 'الفرع الرئيسي',
      status: 'opened',
      createdAt: new Date(nowMs).toISOString(),
      openedAt: new Date(nowMs).toISOString(),
      expiresAt: new Date(nowMs + validHours * 3600_000).toISOString(),
      redeemedAt: null,
      redeemedBy: null,
      prizeId: chosen.id,
      prizeTitle: chosen.title,
      prizeDescription: chosen.description,
      prizeDiscountLabel: chosen.discountLabel,
      prizeCategory: chosen.category,
      prizeCode: generatePrizeCode(),
      validHours,
      notes: 'فتح مباشر من رابط صندوق السعادة العام',
    };

    chosen.usedCount = (chosen.usedCount || 0) + 1;
    db.giftLinks.unshift(link);
    await writeDb(db);
    return { ok: true, box: toPublicBox(link) };
  });
}

export async function createAdminLink(input: {
  clientName: string;
  clientPhone: string;
  visitRef?: string;
  branchName?: string;
  linkValidDays?: number;
  notes?: string;
}): Promise<{ ok: boolean; link?: GiftLink; message?: string }> {
  return withLock(async () => {
    const db = await readDb();
    const name = input.clientName.trim();
    const phone = normalizePhone(input.clientPhone);
    if (!name || phone.length < 8) {
      return { ok: false, message: 'يرجى إدخال اسم المريض ورقم الواتساب بشكل صحيح.' };
    }
    const nowMs = Date.now();
    const days = Math.max(1, Number(input.linkValidDays || 14));
    const link: GiftLink = {
      id: `lnk_${crypto.randomBytes(4).toString('hex')}`,
      token: generateToken(),
      clientName: name,
      clientPhone: phone,
      visitRef: (input.visitRef || `RT-${Math.floor(1000 + Math.random() * 9000)}`).trim().toUpperCase(),
      branchName: input.branchName || db.labProfile.branches[0] || 'الفرع الرئيسي',
      status: 'pending',
      createdAt: new Date(nowMs).toISOString(),
      expiresAt: new Date(nowMs + days * 24 * 3600_000).toISOString(),
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
      notes: input.notes?.trim() || undefined,
    };

    db.giftLinks.unshift(link);
    await writeDb(db);
    return { ok: true, link };
  });
}

export async function redeemPrize(codeOrToken: string, staffName = 'إدارة المعمل'): Promise<{ ok: boolean; message: string; link?: GiftLink }> {
  return withLock(async () => {
    const db = await readDb();
    const q = codeOrToken.trim().toUpperCase();
    const lnk = db.giftLinks.find(
      (l) => l.prizeCode?.toUpperCase() === q || l.token.toUpperCase() === q
    );
    if (!lnk) {
      return { ok: false, message: 'الكود غير موجود في السجلات.' };
    }
    if (lnk.status === 'pending') {
      return { ok: false, message: 'هذا الرابط لم يفتحه المريض بعد.' };
    }
    if (lnk.status === 'redeemed') {
      return { ok: false, message: 'تم صرف هذه الجائزة مسبقاً.', link: lnk };
    }
    if (lnk.status === 'expired' || new Date(lnk.expiresAt).getTime() < Date.now()) {
      lnk.status = 'expired';
      await writeDb(db);
      return { ok: false, message: 'انتهت مدة صلاحية هذه الجائزة.', link: lnk };
    }

    lnk.status = 'redeemed';
    lnk.redeemedAt = new Date().toISOString();
    lnk.redeemedBy = staffName.trim() || 'إدارة المعمل';
    await writeDb(db);
    return { ok: true, message: `تم تأكيد صرف الجائزة للمريض (${lnk.clientName}) بنجاح.`, link: lnk };
  });
}

export async function deleteGiftLink(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const before = db.giftLinks.length;
    db.giftLinks = db.giftLinks.filter((l) => l.id !== id);
    if (db.giftLinks.length === before) return false;
    await writeDb(db);
    return true;
  });
}

export async function upsertPrize(input: Partial<Prize> & { title: string }): Promise<Prize> {
  return withLock(async () => {
    const db = await readDb();
    if (input.id) {
      const existing = db.prizes.find((p) => p.id === input.id);
      if (existing) {
        existing.title = input.title.trim();
        existing.description = (input.description ?? existing.description).trim();
        existing.discountLabel = (input.discountLabel ?? existing.discountLabel).trim();
        existing.category = (input.category ?? existing.category) as PrizeCategory;
        existing.validHours = Math.max(1, Number(input.validHours ?? existing.validHours));
        existing.weight = Math.max(1, Number(input.weight ?? existing.weight));
        existing.stock = Math.max(0, Number(input.stock ?? existing.stock));
        existing.active = input.active ?? existing.active;
        await writeDb(db);
        return existing;
      }
    }

    const created: Prize = {
      id: `prz_${crypto.randomBytes(4).toString('hex')}`,
      title: input.title.trim(),
      description: (input.description || 'جائزة مضمونة صالحة للاستخدام خلال الوقت المحدد.').trim(),
      discountLabel: (input.discountLabel || 'هدية خاصة').trim(),
      category: (input.category || 'discount') as PrizeCategory,
      validHours: Math.max(1, Number(input.validHours ?? 48)),
      weight: Math.max(1, Number(input.weight ?? 20)),
      stock: Math.max(1, Number(input.stock ?? 50)),
      usedCount: 0,
      active: input.active ?? true,
    };
    db.prizes.unshift(created);
    await writeDb(db);
    return created;
  });
}

export async function deletePrize(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const before = db.prizes.length;
    db.prizes = db.prizes.filter((p) => p.id !== id);
    if (db.prizes.length === before) return false;
    await writeDb(db);
    return true;
  });
}

export async function updateLabProfile(
  updates: Partial<LabProfile> & { newAdminPassword?: string }
): Promise<LabProfile> {
  return withLock(async () => {
    const db = await readDb();
    const { newAdminPassword, ...profileFields } = updates;
    db.labProfile = {
      ...db.labProfile,
      ...profileFields,
      branches: Array.isArray(profileFields.branches) && profileFields.branches.length > 0
        ? profileFields.branches.map((b) => b.trim()).filter(Boolean)
        : db.labProfile.branches,
    };
    if (newAdminPassword && newAdminPassword.trim().length >= 4) {
      db.adminPassword = newAdminPassword.trim();
    }
    await writeDb(db);
    return db.labProfile;
  });
}

export async function upsertPriceItem(input: Partial<LabPriceItem> & { nameAr: string; price: number }): Promise<LabPriceItem> {
  return withLock(async () => {
    const db = await readDb();
    if (input.id) {
      const existing = db.prices.find((p) => p.id === input.id);
      if (existing) {
        existing.code = (input.code ?? existing.code).trim();
        existing.nameAr = input.nameAr.trim();
        existing.nameEn = (input.nameEn ?? existing.nameEn ?? '').trim();
        existing.category = (input.category ?? existing.category).trim();
        existing.price = Math.max(0, Number(input.price));
        existing.offerPrice = input.offerPrice !== undefined ? Math.max(0, Number(input.offerPrice)) : existing.offerPrice;
        existing.duration = (input.duration ?? existing.duration ?? '').trim();
        existing.active = input.active ?? existing.active;
        await writeDb(db);
        return existing;
      }
    }

    const created: LabPriceItem = {
      id: `t-${crypto.randomBytes(3).toString('hex')}`,
      code: (input.code || `RT-${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase(),
      nameAr: input.nameAr.trim(),
      nameEn: (input.nameEn || '').trim(),
      category: (input.category || 'general').trim(),
      price: Math.max(0, Number(input.price)),
      offerPrice: input.offerPrice !== undefined ? Math.max(0, Number(input.offerPrice)) : undefined,
      duration: (input.duration || 'نفس اليوم').trim(),
      active: input.active ?? true,
    };
    db.prices.unshift(created);
    await writeDb(db);
    return created;
  });
}

export async function bulkSavePrices(prices: LabPriceItem[]): Promise<LabPriceItem[]> {
  return withLock(async () => {
    const db = await readDb();
    db.prices = prices.map((p) => ({
      ...p,
      price: Math.max(0, Number(p.price) || 0),
      offerPrice: p.offerPrice !== undefined ? Math.max(0, Number(p.offerPrice)) : undefined,
    }));
    await writeDb(db);
    return db.prices;
  });
}

export async function deletePriceItem(id: string): Promise<boolean> {
  return withLock(async () => {
    const db = await readDb();
    const before = db.prices.length;
    db.prices = db.prices.filter((p) => p.id !== id);
    if (db.prices.length === before) return false;
    await writeDb(db);
    return true;
  });
}

export async function exportFullBackup(): Promise<FullBackupPayload> {
  const db = await readDb();
  return {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    labProfile: db.labProfile,
    prizes: db.prizes,
    giftLinks: db.giftLinks,
    prices: db.prices,
  };
}

export async function importFullBackup(rawPayload: Record<string, unknown>): Promise<{
  ok: boolean;
  message: string;
  importedCounts: { prizes: number; links: number; prices: number };
}> {
  return withLock(async () => {
    const db = await readDb();

    // Support both Happiness Box backup format and RT-LAB-PRICE / RT-LAB-PROMOCODE backups
    const incomingProfile = (rawPayload.labProfile || rawPayload.settings) as Partial<LabProfile> | undefined;
    if (incomingProfile && typeof incomingProfile === 'object') {
      db.labProfile = {
        ...db.labProfile,
        ...incomingProfile,
        whatsappNumber:
          (incomingProfile as { whatsappNumber?: string; whatsappSupportNumber?: string }).whatsappNumber ||
          (incomingProfile as { whatsappSupportNumber?: string }).whatsappSupportNumber ||
          db.labProfile.whatsappNumber,
        hotlineNumber:
          (incomingProfile as { hotlineNumber?: string; hotline?: string }).hotlineNumber ||
          (incomingProfile as { hotline?: string }).hotline ||
          db.labProfile.hotlineNumber,
      };
    }

    let prizesCount = 0;
    if (Array.isArray(rawPayload.prizes) && rawPayload.prizes.length > 0) {
      db.prizes = rawPayload.prizes as Prize[];
      prizesCount = db.prizes.length;
    }

    let linksCount = 0;
    if (Array.isArray(rawPayload.giftLinks)) {
      db.giftLinks = rawPayload.giftLinks as GiftLink[];
      linksCount = db.giftLinks.length;
    }

    const incomingPrices = (rawPayload.prices || rawPayload.tests) as Array<Record<string, unknown>> | undefined;
    let pricesCount = 0;
    if (Array.isArray(incomingPrices) && incomingPrices.length > 0) {
      db.prices = incomingPrices.map((t, idx) => ({
        id: String(t.id || `imp-${idx}`),
        code: String(t.code || `RT-${idx + 1}`),
        nameAr: String(t.nameAr || t.name || 'تحليل طبي'),
        nameEn: t.nameEn ? String(t.nameEn) : '',
        category: String(t.category || 'general'),
        price: Math.max(0, Number(t.price) || 0),
        offerPrice: t.offerPrice !== undefined ? Math.max(0, Number(t.offerPrice)) : undefined,
        duration: t.duration ? String(t.duration) : '',
        active: t.active !== false,
      }));
      pricesCount = db.prices.length;
    }

    await writeDb(db);
    return {
      ok: true,
      message: 'تم استيراد النسخة وتثبيت كافة البيانات المعدلة بنجاح.',
      importedCounts: {
        prizes: prizesCount,
        links: linksCount,
        prices: pricesCount,
      },
    };
  });
}
