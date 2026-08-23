import express from 'express';
import {
  createReferral,
  listReferrals,
  trackReferralClick,
  growthStats,
} from './growthStore.mjs';

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) return res.status(503).json({ error: 'CRM admin is not configured.' });
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (list.length >= 20) return res.status(429).json({ error: 'Too many requests' });
  list.push(now);
  hits.set(ip, list);
  next();
}

router.get('/growth-stats', requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, ...(await growthStats()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load growth stats' });
  }
});

router.get('/referrals', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, referrals: await listReferrals({ limit: req.query.limit }) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list referrals' });
  }
});

router.post('/referrals', rateLimit, async (req, res) => {
  try {
    const referral = await createReferral(req.body || {});
    res.status(201).json({ ok: true, referral });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create referral' });
  }
});

router.post('/referrals/:code/click', rateLimit, async (req, res) => {
  try {
    res.json(await trackReferralClick(req.params.code));
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to track referral' });
  }
});

export default router;
