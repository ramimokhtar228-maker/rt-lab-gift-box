import type {
  AdminDashboardData,
  BoxPublicResponse,
  FullBackupPayload,
  GiftLink,
  LabPriceItem,
  LabProfile,
  Prize,
  PrizeCategory,
} from '../types';
import { INITIAL_PRICES } from '../../server/initialPrices';

const STATIC_DB_KEY = 'rt_hb_static_db_v2';
const DEFAULT_ADMIN_HASH = '5a0cce5b4dcbf23b13fc696bb87cd4b2d1eab6ffb993a824099938725ec5d54c';

export const DEFAULT_ASSET_LOGO = `${import.meta.env.BASE_URL}logo.jpg`;
export const DEFAULT_ASSET_ICON = `${import.meta.env.BASE_URL}icon.svg`;

const DEFAULT_STATIC_PROFILE: LabProfile = {
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
    'ألف مبروك يا {clientName} 🎉\nتم تأكيد فوزك من {labName} بجائزة:\n🎁 {prizeTitle} ({discountLabel})\n🔑 كود الجائزة: {prizeCode}\n⏳ الجائزة متاحة لوقت محدد وتنتهي صلاحيتها في: {expiresAt}\n\nيسعدنا تشريفك في أقرب فرع أو حجز السحب المنزلي قبل انتهاء الموعد!',
  whatsappPatientClaimTemplate:
    'مرحباً {labName}، فتحت صندوق السعادة وكسبت الجائزة التالية:\nالاسم: {clientName}\nالجائزة: {prizeTitle} ({discountLabel})\nكود الجائزة: {prizeCode}\nصالحة حتى: {expiresAt}\nأرغب في تأكيد تفعيل الجائزة وحجز الموعد.',
};

const DEFAULT_STATIC_PRIZES: Prize[] = [
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

interface StaticDb {
  adminHash: string;
  labProfile: LabProfile;
  prizes: Prize[];
  giftLinks: GiftLink[];
  prices: LabPriceItem[];
}

function isStaticHostOnly(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.endsWith('.github.io');
}

function sha256Fallback(ascii: string): string {
  const bytes = new TextEncoder().encode(ascii);
  const words: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    words[i >> 2] |= bytes[i] << (24 - (i % 4) * 8);
  }
  const bitLen = bytes.length * 8;
  words[bitLen >> 5] |= 0x80 << (24 - (bitLen % 32));
  words[(((bitLen + 64) >> 9) << 4) + 15] = bitLen;

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const rr = (n: number, c: number) => (n >>> c) | (n << (32 - c));

  for (let i = 0; i < words.length; i += 16) {
    const w = new Array<number>(64);
    for (let t = 0; t < 16; t++) w[t] = words[i + t] | 0;
    for (let t = 16; t < 64; t++) {
      const s0 = rr(w[t - 15], 7) ^ rr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rr(w[t - 2], 17) ^ rr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, j] = h;
    for (let t = 0; t < 64; t++) {
      const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (j + S1 + ch + k[t] + w[t]) | 0;
      const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      j = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + j) | 0;
  }
  return h.map((v) => (v >>> 0).toString(16).padStart(8, '0')).join('');
}

async function sha256Hex(text: string): Promise<string> {
  const clean = text.trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(clean));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch {
      return sha256Fallback(clean);
    }
  }
  return sha256Fallback(clean);
}

function readStaticDb(): StaticDb {
  const now = Date.now();
  const seed: StaticDb = {
    adminHash: DEFAULT_ADMIN_HASH,
    labProfile: { ...DEFAULT_STATIC_PROFILE },
    prizes: DEFAULT_STATIC_PRIZES.map((p) => ({ ...p })),
    giftLinks: [
      {
        id: 'lnk_demo_ready',
        token: 'RTBOX-DEMO2026',
        clientName: 'عميلنا العزيز',
        clientPhone: '01000000000',
        visitRef: 'RT-1001',
        branchName: DEFAULT_STATIC_PROFILE.branches[0],
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
      },
    ],
    prices: INITIAL_PRICES.map((p) => ({ ...p })),
  };

  try {
    const raw = window.localStorage.getItem(STATIC_DB_KEY);
    if (!raw) {
      window.localStorage.setItem(STATIC_DB_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as Partial<StaticDb>;
    return {
      adminHash: parsed.adminHash || seed.adminHash,
      labProfile: { ...DEFAULT_STATIC_PROFILE, ...(parsed.labProfile || {}) },
      prizes: Array.isArray(parsed.prizes) && parsed.prizes.length > 0 ? parsed.prizes : seed.prizes,
      giftLinks: Array.isArray(parsed.giftLinks) ? parsed.giftLinks : seed.giftLinks,
      prices: Array.isArray(parsed.prices) && parsed.prices.length > 3 ? parsed.prices : seed.prices,
    };
  } catch {
    return seed;
  }
}

function writeStaticDb(db: StaticDb): void {
  try {
    window.localStorage.setItem(STATIC_DB_KEY, JSON.stringify(db));
  } catch {
    // ignore storage quota errors
  }
}

function decodeBoxData(encoded?: string | null): {
  n?: string;
  p?: string;
  b?: string;
  v?: string;
  e?: string;
  ln?: string;
  wa?: string;
  ht?: string;
  pz?: Array<[string, string, number, number]>;
} | null {
  if (!encoded) return null;
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
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

function hydrateStaticLink(db: StaticDb, token: string, encodedData?: string | null): GiftLink | null {
  const clean = token.trim().toUpperCase();
  const decoded = decodeBoxData(encodedData);
  if (!decoded && !clean.startsWith('RTBOX-')) return null;

  if (decoded?.ln) db.labProfile.labName = decoded.ln;
  if (decoded?.wa) db.labProfile.whatsappNumber = decoded.wa;
  if (decoded?.ht) db.labProfile.hotlineNumber = decoded.ht;
  if (Array.isArray(decoded?.pz) && decoded.pz.length > 0) {
    db.prizes = decoded.pz.map(([title, discountLabel, validHours, weight], idx) => ({
      id: `prz_url_${idx}`,
      title,
      description: `${title} — جائزة صالحة للاستخدام خلال الوقت المحدد.`,
      discountLabel,
      category: 'discount',
      validHours: Math.max(1, Number(validHours) || 48),
      weight: Math.max(1, Number(weight) || 20),
      stock: 100,
      usedCount: 0,
      active: true,
    }));
  }

  const now = Date.now();
  const lnk: GiftLink = {
    id: `lnk_${Date.now().toString(36)}`,
    token: clean,
    clientName: decoded?.n || 'عميلنا العزيز',
    clientPhone: decoded?.p || '01000000000',
    visitRef: decoded?.v || `RT-${Math.floor(1000 + Math.random() * 9000)}`,
    branchName: decoded?.b || db.labProfile.branches[0] || 'الفرع الرئيسي',
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
  db.giftLinks.unshift(lnk);
  writeStaticDb(db);
  return lnk;
}

async function fetchJsonSafe(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; data: Record<string, unknown> } | null> {
  if (isStaticHostOnly()) return null;
  try {
    const res = await fetch(url, init);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch {
    return null;
  }
}

function getStaticShareBase(): string {
  if (typeof window === 'undefined') return '';
  const base = import.meta.env.BASE_URL || '/';
  return `${window.location.origin}${base === '/' ? '' : base.replace(/\/$/, '')}`;
}

export const apiClient = {
  async getPublicConfig(encodedData?: string | null): Promise<{ labProfile: LabProfile; shareBaseUrl: string }> {
    const remote = await fetchJsonSafe('/api/public/config');
    if (remote && remote.data?.labProfile) {
      return {
        labProfile: remote.data.labProfile as LabProfile,
        shareBaseUrl: String(remote.data.shareBaseUrl || ''),
      };
    }
    const db = readStaticDb();
    const decoded = decodeBoxData(encodedData);
    if (decoded) {
      if (decoded.ln) db.labProfile.labName = decoded.ln;
      if (decoded.wa) db.labProfile.whatsappNumber = decoded.wa;
      if (decoded.ht) db.labProfile.hotlineNumber = decoded.ht;
    }
    return { labProfile: db.labProfile, shareBaseUrl: getStaticShareBase() };
  },

  async getBoxByToken(token: string, encodedData?: string | null): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const qs = encodedData ? `?d=${encodeURIComponent(encodedData)}` : '';
    const remote = await fetchJsonSafe(`/api/box/${encodeURIComponent(token)}${qs}`);
    if (remote) {
      return remote.data as { ok: boolean; box?: BoxPublicResponse; message?: string };
    }
    const db = readStaticDb();
    const clean = token.trim().toUpperCase();
    let lnk = db.giftLinks.find((l) => l.token.toUpperCase() === clean) || null;
    if (!lnk) lnk = hydrateStaticLink(db, clean, encodedData);
    if (!lnk) return { ok: false, message: 'رابط صندوق السعادة غير صحيح أو غير موجود.' };
    if ((lnk.status === 'pending' || lnk.status === 'opened') && new Date(lnk.expiresAt).getTime() < Date.now()) {
      lnk.status = 'expired';
      writeStaticDb(db);
    }
    return { ok: true, box: toPublicBox(lnk) };
  },

  async openBoxByToken(token: string, encodedData?: string | null): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const remote = await fetchJsonSafe(`/api/box/${encodeURIComponent(token)}/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ d: encodedData || undefined }),
    });
    if (remote) {
      return remote.data as { ok: boolean; box?: BoxPublicResponse; message?: string };
    }
    const db = readStaticDb();
    const clean = token.trim().toUpperCase();
    let lnk = db.giftLinks.find((l) => l.token.toUpperCase() === clean) || null;
    if (!lnk) lnk = hydrateStaticLink(db, clean, encodedData);
    if (!lnk) return { ok: false, message: 'رابط صندوق السعادة غير موجود.' };
    if (lnk.status === 'opened' || lnk.status === 'redeemed') return { ok: true, box: toPublicBox(lnk) };

    const active = db.prizes.filter((p) => p.active);
    if (active.length === 0) return { ok: false, message: 'لا توجد جوائز نشطة داخل الصندوق حالياً.' };
    const totalW = active.reduce((s, p) => s + Math.max(1, p.weight), 0);
    let r = Math.random() * totalW;
    let chosen = active[0];
    for (const p of active) {
      r -= Math.max(1, p.weight);
      if (r <= 0) {
        chosen = p;
        break;
      }
    }

    const now = Date.now();
    const validHours = Math.max(1, Number(chosen.validHours || 48));
    lnk.status = 'opened';
    lnk.openedAt = new Date(now).toISOString();
    lnk.expiresAt = new Date(now + validHours * 3600_000).toISOString();
    lnk.prizeId = chosen.id;
    lnk.prizeTitle = chosen.title;
    lnk.prizeDescription = chosen.description;
    lnk.prizeDiscountLabel = chosen.discountLabel;
    lnk.prizeCategory = chosen.category;
    lnk.prizeCode = `${randomCode('RT-', 4)}-${randomCode('', 4)}`;
    lnk.validHours = validHours;
    chosen.usedCount = (chosen.usedCount || 0) + 1;
    writeStaticDb(db);
    return { ok: true, box: toPublicBox(lnk) };
  },

  async createAndOpenSelfBox(input: { clientName: string; clientPhone: string; branchName?: string }): Promise<{ ok: boolean; box?: BoxPublicResponse; message?: string }> {
    const remote = await fetchJsonSafe('/api/box-self-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (remote) {
      return remote.data as { ok: boolean; box?: BoxPublicResponse; message?: string };
    }
    const db = readStaticDb();
    const token = randomCode('RTBOX-', 6);
    const now = Date.now();
    const lnk: GiftLink = {
      id: `lnk_${now.toString(36)}`,
      token,
      clientName: input.clientName.trim(),
      clientPhone: input.clientPhone.trim(),
      visitRef: randomCode('SELF-', 4),
      branchName: input.branchName || db.labProfile.branches[0] || 'الفرع الرئيسي',
      status: 'pending',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 14 * 24 * 3600_000).toISOString(),
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
    db.giftLinks.unshift(lnk);
    writeStaticDb(db);
    return this.openBoxByToken(token);
  },

  async adminLogin(password: string): Promise<{ ok: boolean; token?: string; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (remote) {
      return remote.data as { ok: boolean; token?: string; message?: string };
    }
    const db = readStaticDb();
    const hash = await sha256Hex(password);
    const upperHash = await sha256Hex(password.trim().toUpperCase());
    const matchesDefault = db.adminHash === DEFAULT_ADMIN_HASH && upperHash === DEFAULT_ADMIN_HASH;
    if (hash !== db.adminHash && !matchesDefault) {
      return { ok: false, message: 'كلمة مرور الإدارة غير صحيحة.' };
    }
    return { ok: true, token: `static_${Date.now()}` };
  },

  async getAdminDashboard(adminToken: string): Promise<{ ok: boolean; status?: number } & Partial<AdminDashboardData>> {
    const remote = await fetchJsonSafe('/api/admin/dashboard', {
      headers: { 'X-Admin-Token': adminToken },
    });
    if (remote) {
      return { status: remote.status, ...(remote.data as { ok: boolean } & Partial<AdminDashboardData>) };
    }
    const db = readStaticDb();
    return {
      ok: true,
      labProfile: db.labProfile,
      prizes: db.prizes,
      giftLinks: db.giftLinks,
      prices: db.prices,
      stats: {
        totalLinks: db.giftLinks.length,
        pendingLinks: db.giftLinks.filter((l) => l.status === 'pending').length,
        openedLinks: db.giftLinks.filter((l) => l.status === 'opened').length,
        redeemedLinks: db.giftLinks.filter((l) => l.status === 'redeemed').length,
        expiredLinks: db.giftLinks.filter((l) => l.status === 'expired').length,
        activePrizes: db.prizes.filter((p) => p.active).length,
        totalPrices: db.prices.length,
      },
    };
  },

  async createAdminLink(adminToken: string, body: Record<string, unknown>): Promise<{ ok: boolean; link?: GiftLink; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(body),
    });
    if (remote) return remote.data as { ok: boolean; link?: GiftLink; message?: string };

    const db = readStaticDb();
    const now = Date.now();
    const days = Math.max(1, Number(body.linkValidDays || 14));
    const link: GiftLink = {
      id: `lnk_${now.toString(36)}`,
      token: randomCode('RTBOX-', 6),
      clientName: String(body.clientName || '').trim(),
      clientPhone: String(body.clientPhone || '').trim(),
      visitRef: String(body.visitRef || `RT-${Math.floor(1000 + Math.random() * 9000)}`),
      branchName: String(body.branchName || db.labProfile.branches[0] || ''),
      status: 'pending',
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + days * 24 * 3600_000).toISOString(),
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
    db.giftLinks.unshift(link);
    writeStaticDb(db);
    return { ok: true, link };
  },

  async deleteGiftLink(adminToken: string, id: string): Promise<boolean> {
    const remote = await fetchJsonSafe(`/api/admin/links/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': adminToken },
    });
    if (remote) return Boolean(remote.ok);
    const db = readStaticDb();
    db.giftLinks = db.giftLinks.filter((l) => l.id !== id);
    writeStaticDb(db);
    return true;
  },

  async redeemPrize(adminToken: string, code: string, staffName = 'استقبال المعمل'): Promise<{ ok: boolean; message: string }> {
    const remote = await fetchJsonSafe('/api/admin/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ code, staffName }),
    });
    if (remote) return remote.data as { ok: boolean; message: string };
    const db = readStaticDb();
    const q = code.trim().toUpperCase();
    const lnk = db.giftLinks.find((l) => l.prizeCode?.toUpperCase() === q || l.token.toUpperCase() === q);
    if (!lnk) return { ok: false, message: 'الكود غير موجود.' };
    lnk.status = 'redeemed';
    lnk.redeemedAt = new Date().toISOString();
    lnk.redeemedBy = staffName;
    writeStaticDb(db);
    return { ok: true, message: `تم تأكيد صرف الجائزة للمريض (${lnk.clientName}).` };
  },

  async upsertPrize(adminToken: string, prize: Partial<Prize>): Promise<{ ok: boolean; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/prizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(prize),
    });
    if (remote) return remote.data as { ok: boolean; message?: string };
    const db = readStaticDb();
    if (prize.id) {
      db.prizes = db.prizes.map((p) => (p.id === prize.id ? { ...p, ...prize } as Prize : p));
    } else {
      db.prizes.unshift({
        id: `prz_${Date.now().toString(36)}`,
        title: String(prize.title || ''),
        description: String(prize.description || ''),
        discountLabel: String(prize.discountLabel || 'هدية خاصة'),
        category: (prize.category || 'discount') as PrizeCategory,
        validHours: Math.max(1, Number(prize.validHours || 48)),
        weight: Math.max(1, Number(prize.weight || 20)),
        stock: Math.max(1, Number(prize.stock || 50)),
        usedCount: 0,
        active: prize.active ?? true,
      });
    }
    writeStaticDb(db);
    return { ok: true };
  },

  async deletePrize(adminToken: string, id: string): Promise<boolean> {
    const remote = await fetchJsonSafe(`/api/admin/prizes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': adminToken },
    });
    if (remote) return Boolean(remote.ok);
    const db = readStaticDb();
    db.prizes = db.prizes.filter((p) => p.id !== id);
    writeStaticDb(db);
    return true;
  },

  async updateLabProfile(adminToken: string, payload: Record<string, unknown>): Promise<{ ok: boolean; labProfile?: LabProfile; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/lab-profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(payload),
    });
    if (remote) return remote.data as { ok: boolean; labProfile?: LabProfile; message?: string };
    const db = readStaticDb();
    const { newAdminPassword, ...fields } = payload;
    db.labProfile = { ...db.labProfile, ...(fields as Partial<LabProfile>) };
    if (typeof newAdminPassword === 'string' && newAdminPassword.trim().length >= 4) {
      db.adminHash = await sha256Hex(newAdminPassword.trim());
    }
    writeStaticDb(db);
    return { ok: true, labProfile: db.labProfile };
  },

  async upsertPriceItem(adminToken: string, item: Record<string, unknown>): Promise<{ ok: boolean; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(item),
    });
    if (remote) return remote.data as { ok: boolean; message?: string };
    const db = readStaticDb();
    db.prices.unshift({
      id: `t-${Date.now().toString(36)}`,
      code: String(item.code || `RT-${Math.floor(100 + Math.random() * 900)}`),
      nameAr: String(item.nameAr || ''),
      category: 'general',
      price: Number(item.price || 0),
      offerPrice: item.offerPrice ? Number(item.offerPrice) : undefined,
      active: true,
    });
    writeStaticDb(db);
    return { ok: true };
  },

  async bulkSavePrices(adminToken: string, prices: LabPriceItem[]): Promise<{ ok: boolean; message?: string }> {
    const remote = await fetchJsonSafe('/api/admin/prices/bulk', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify({ prices }),
    });
    if (remote) return remote.data as { ok: boolean; message?: string };
    const db = readStaticDb();
    db.prices = prices;
    writeStaticDb(db);
    return { ok: true };
  },

  async deletePriceItem(adminToken: string, id: string): Promise<boolean> {
    const remote = await fetchJsonSafe(`/api/admin/prices/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Admin-Token': adminToken },
    });
    if (remote) return Boolean(remote.ok);
    const db = readStaticDb();
    db.prices = db.prices.filter((p) => p.id !== id);
    writeStaticDb(db);
    return true;
  },

  async exportFullBackup(adminToken: string): Promise<FullBackupPayload | null> {
    const remote = await fetchJsonSafe('/api/admin/export', {
      headers: { 'X-Admin-Token': adminToken },
    });
    if (remote && remote.ok) return remote.data as unknown as FullBackupPayload;
    const db = readStaticDb();
    return {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      labProfile: db.labProfile,
      prizes: db.prizes,
      giftLinks: db.giftLinks,
      prices: db.prices,
    };
  },

  async importFullBackup(adminToken: string, parsed: Record<string, unknown>): Promise<{ ok: boolean; message?: string; importedCounts?: { prizes: number; links: number; prices: number } }> {
    const remote = await fetchJsonSafe('/api/admin/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
      body: JSON.stringify(parsed),
    });
    if (remote) return remote.data as { ok: boolean; message?: string; importedCounts?: { prizes: number; links: number; prices: number } };
    const db = readStaticDb();
    if (parsed.labProfile) db.labProfile = { ...db.labProfile, ...(parsed.labProfile as Partial<LabProfile>) };
    if (Array.isArray(parsed.prizes)) db.prizes = parsed.prizes as Prize[];
    if (Array.isArray(parsed.giftLinks)) db.giftLinks = parsed.giftLinks as GiftLink[];
    if (Array.isArray(parsed.prices)) db.prices = parsed.prices as LabPriceItem[];
    writeStaticDb(db);
    return {
      ok: true,
      importedCounts: {
        prizes: db.prizes.length,
        links: db.giftLinks.length,
        prices: db.prices.length,
      },
    };
  },
};
