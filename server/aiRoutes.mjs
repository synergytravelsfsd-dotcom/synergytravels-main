import express from 'express';
import {
  aiStatus,
  qualifyLead,
  consultTravel,
  assistQuote,
  suggestFollowUps,
  businessInsights,
} from './aiAssistant.mjs';

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) return res.status(503).json({ error: 'CRM admin is not configured.' });
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

/** Simple IP rate limit for public AI consultant */
const hits = new Map();
function publicRateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (list.length >= Number(process.env.AI_RATE_LIMIT_PER_MIN || 12)) {
    return res.status(429).json({ error: 'Too many AI requests. Please try again shortly.' });
  }
  list.push(now);
  hits.set(ip, list);
  next();
}

router.get('/ai/status', (_req, res) => {
  res.json(aiStatus());
});

router.post('/ai/consult', publicRateLimit, async (req, res) => {
  try {
    res.json({ ok: true, ...(await consultTravel(req.body || {})) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Consultant unavailable' });
  }
});

router.post('/ai/qualify-lead', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, ...(await qualifyLead(req.body || {})) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Qualification failed' });
  }
});

router.post('/ai/assist-quote', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, ...(await assistQuote(req.body || {})) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Quote assist failed' });
  }
});

router.post('/ai/follow-ups', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, ...(await suggestFollowUps(req.body || {})) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Follow-up assist failed' });
  }
});

router.post('/ai/insights', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, ...(await businessInsights(req.body || {})) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Insights unavailable' });
  }
});

export default router;
