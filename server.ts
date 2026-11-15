import crypto from 'node:crypto';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import {
  bulkSavePrices,
  createAdminLink,
  createAndOpenSelfBox,
  deleteGiftLink,
  deletePriceItem,
  deletePrize,
  exportFullBackup,
  getAdminDashboard,
  getBoxByToken,
  getPublicConfig,
  importFullBackup,
  openBoxByToken,
  redeemPrize,
  updateLabProfile,
  upsertPriceItem,
  upsertPrize,
  verifyAdminPassword,
} from './server/store.ts';

const PORT = Number(process.env.PORT || 3000);
const SESSION_SECRET = process.env.SESSION_SECRET?.trim() || crypto.randomBytes(24).toString('hex');

function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ iat: Date.now(), nonce: crypto.randomBytes(8).toString('hex') })).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const headerToken = req.header('X-Admin-Token') || req.header('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!verifySessionToken(headerToken)) {
    res.status(401).json({ ok: false, message: 'انتهت جلسة الإدارة أو كلمة المرور غير صالحة.' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Public config (Lab profile & logo only - never admin password!)
  app.get('/api/public/config', async (_req, res) => {
    const config = await getPublicConfig();
    res.json(config);
  });

  // Public Box fetch (supports cross-instance hydration via ?d=)
  app.get('/api/box/:token', async (req, res) => {
    const d = typeof req.query.d === 'string' ? req.query.d : undefined;
    const result = await getBoxByToken(String(req.params.token || ''), d);
    res.status(result.ok ? 200 : 404).json(result);
  });

  // Public Box open
  app.post('/api/box/:token/open', async (req, res) => {
    const d = typeof req.body?.d === 'string' ? req.body.d : typeof req.query.d === 'string' ? req.query.d : undefined;
    const result = await openBoxByToken(String(req.params.token || ''), d);
    res.status(result.ok ? 200 : 400).json(result);
  });

  // Public self-claim & open from universal box link
  app.post('/api/box-self-open', async (req, res) => {
    const { clientName, clientPhone, branchName } = req.body || {};
    const result = await createAndOpenSelfBox({
      clientName: String(clientName || ''),
      clientPhone: String(clientPhone || ''),
      branchName: branchName ? String(branchName) : undefined,
    });
    res.status(result.ok ? 200 : 400).json(result);
  });

  // Admin Login (hidden password check)
  app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body || {};
    const valid = await verifyAdminPassword(String(password || ''));
    if (!valid) {
      res.status(401).json({ ok: false, message: 'كلمة مرور الإدارة غير صحيحة.' });
      return;
    }
    res.json({ ok: true, token: createSessionToken() });
  });

  // Admin Dashboard Snapshot
  app.get('/api/admin/dashboard', requireAdmin, async (_req, res) => {
    const data = await getAdminDashboard();
    res.json({ ok: true, ...data });
  });

  // Create Patient Box Link
  app.post('/api/admin/links', requireAdmin, async (req, res) => {
    const result = await createAdminLink(req.body || {});
    res.status(result.ok ? 201 : 400).json(result);
  });

  // Delete Patient Box Link
  app.delete('/api/admin/links/:id', requireAdmin, async (req, res) => {
    const ok = await deleteGiftLink(String(req.params.id || ''));
    res.status(ok ? 200 : 404).json({ ok });
  });

  // Redeem Prize Code
  app.post('/api/admin/redeem', requireAdmin, async (req, res) => {
    const { code, staffName } = req.body || {};
    const result = await redeemPrize(String(code || ''), staffName ? String(staffName) : undefined);
    res.status(result.ok ? 200 : 400).json(result);
  });

  // Add / Update Prize
  app.post('/api/admin/prizes', requireAdmin, async (req, res) => {
    const { title } = req.body || {};
    if (!title || !String(title).trim()) {
      res.status(400).json({ ok: false, message: 'يرجى إدخال عنوان الجائزة.' });
      return;
    }
    const prize = await upsertPrize(req.body);
    res.json({ ok: true, prize });
  });

  // Delete Prize
  app.delete('/api/admin/prizes/:id', requireAdmin, async (req, res) => {
    const ok = await deletePrize(String(req.params.id || ''));
    res.status(ok ? 200 : 404).json({ ok });
  });

  // Update Lab Profile, Logo, Templates & Password
  app.put('/api/admin/lab-profile', requireAdmin, async (req, res) => {
    const labProfile = await updateLabProfile(req.body || {});
    res.json({ ok: true, labProfile, message: 'تم حفظ بيانات المعمل والشعار بنجاح.' });
  });

  // Add / Update single Price item
  app.post('/api/admin/prices', requireAdmin, async (req, res) => {
    const { nameAr, price } = req.body || {};
    if (!nameAr || price === undefined) {
      res.status(400).json({ ok: false, message: 'يرجى إدخال اسم التحليل والسعر.' });
      return;
    }
    const item = await upsertPriceItem(req.body);
    res.json({ ok: true, item });
  });

  // Commit all modified prices at once
  app.put('/api/admin/prices/bulk', requireAdmin, async (req, res) => {
    const { prices } = req.body || {};
    if (!Array.isArray(prices)) {
      res.status(400).json({ ok: false, message: 'قائمة الأسعار غير صالحة.' });
      return;
    }
    const saved = await bulkSavePrices(prices);
    res.json({ ok: true, prices: saved, message: 'تم تثبيت وحفظ كافة الأسعار المعدلة.' });
  });

  // Delete Price item
  app.delete('/api/admin/prices/:id', requireAdmin, async (req, res) => {
    const ok = await deletePriceItem(String(req.params.id || ''));
    res.status(ok ? 200 : 404).json({ ok });
  });

  // Export Full Backup JSON
  app.get('/api/admin/export', requireAdmin, async (_req, res) => {
    const payload = await exportFullBackup();
    res.json(payload);
  });

  // Import Full Backup JSON
  app.post('/api/admin/import', requireAdmin, async (req, res) => {
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({ ok: false, message: 'ملف النسخة الاحتياطية غير صالح.' });
      return;
    }
    const result = await importFullBackup(req.body as Record<string, unknown>);
    res.json(result);
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'public')));
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Happiness Box RT LAB server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
