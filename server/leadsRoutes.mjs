import express from 'express';
import { createLead, listLeads, updateLead, leadStats, STATUSES } from './leadsStore.mjs';

const router = express.Router();

/** Simple in-memory rate limit: IP → timestamps */
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60_000;
  const max = Number(process.env.LEADS_RATE_LIMIT_PER_MIN || 20);
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (list.length >= max) {
    return res.status(429).json({ error: 'Too many requests. Please try again shortly.' });
  }
  list.push(now);
  hits.set(ip, list);
  next();
}

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) {
    return res.status(503).json({
      error: 'CRM admin is not configured. Set CRM_ADMIN_TOKEN on the API host.',
    });
  }
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.post('/leads', rateLimit, async (req, res) => {
  try {
    const lead = await createLead(req.body || {});
    res.status(201).json({
      ok: true,
      lead: {
        id: lead.id,
        status: lead.status,
        leadScore: lead.leadScore,
        leadBand: lead.leadBand,
        createdAt: lead.createdAt,
        customerId: lead.customerId,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create lead' });
  }
});

router.get('/leads', requireAdmin, async (req, res) => {
  try {
    const leads = await listLeads({
      status: req.query.status,
      q: req.query.q,
      limit: req.query.limit,
    });
    res.json({ ok: true, leads, statuses: STATUSES });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list leads' });
  }
});

router.patch('/leads/:id', requireAdmin, async (req, res) => {
  try {
    const lead = await updateLead(req.params.id, req.body || {});
    res.json({ ok: true, lead });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update lead' });
  }
});

router.get('/leads-stats', requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, ...(await leadStats()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load stats' });
  }
});

export default router;
