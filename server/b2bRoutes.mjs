import express from 'express';
import {
  createAccount,
  listAccounts,
  updateAccount,
  createStaff,
  listStaff,
  createAgentPortalLink,
  resolveAgentPortal,
  createTravelRequest,
  listRequests,
  updateTravelRequest,
  createCommission,
  listCommissions,
  b2bStats,
  ACCOUNT_STATUSES,
  REQUEST_STATUSES,
} from './b2bStore.mjs';

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) return res.status(503).json({ error: 'CRM admin is not configured.' });
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.get('/b2b-stats', requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, ...(await b2bStats()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load B2B stats' });
  }
});

router.get('/b2b/accounts', requireAdmin, async (req, res) => {
  try {
    res.json({
      ok: true,
      accounts: await listAccounts({ status: req.query.status, q: req.query.q, limit: req.query.limit }),
      statuses: ACCOUNT_STATUSES,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list accounts' });
  }
});

router.post('/b2b/accounts', requireAdmin, async (req, res) => {
  try {
    res.status(201).json({ ok: true, account: await createAccount(req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create account' });
  }
});

router.patch('/b2b/accounts/:id', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, account: await updateAccount(req.params.id, req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update account' });
  }
});

router.get('/b2b/staff', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, staff: await listStaff(req.query.accountId) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list staff' });
  }
});

router.post('/b2b/staff', requireAdmin, async (req, res) => {
  try {
    res.status(201).json({ ok: true, staff: await createStaff(req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create staff' });
  }
});

router.post('/b2b/portal-links', requireAdmin, async (req, res) => {
  try {
    res.status(201).json({ ok: true, link: await createAgentPortalLink(req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create portal link' });
  }
});

router.get('/b2b/requests', requireAdmin, async (req, res) => {
  try {
    res.json({
      ok: true,
      requests: await listRequests({
        accountId: req.query.accountId,
        status: req.query.status,
        limit: req.query.limit,
      }),
      statuses: REQUEST_STATUSES,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list requests' });
  }
});

router.patch('/b2b/requests/:id', requireAdmin, async (req, res) => {
  try {
    res.json({ ok: true, request: await updateTravelRequest(req.params.id, req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update request' });
  }
});

router.get('/b2b/commissions', requireAdmin, async (req, res) => {
  try {
    res.json({
      ok: true,
      commissions: await listCommissions({ accountId: req.query.accountId, limit: req.query.limit }),
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list commissions' });
  }
});

router.post('/b2b/commissions', requireAdmin, async (req, res) => {
  try {
    res.status(201).json({ ok: true, commission: await createCommission(req.body || {}) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create commission' });
  }
});

/** Public agent portal */
router.get('/public/b2b/:token', async (req, res) => {
  try {
    res.json({ ok: true, ...(await resolveAgentPortal(req.params.token)) });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Portal unavailable' });
  }
});

router.post('/public/b2b/:token/requests', async (req, res) => {
  try {
    const session = await resolveAgentPortal(req.params.token);
    const request = await createTravelRequest({
      ...(req.body || {}),
      accountId: session.account.id,
    });
    res.status(201).json({ ok: true, request });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to submit request' });
  }
});

router.patch('/public/b2b/:token/requests/:id', async (req, res) => {
  try {
    const session = await resolveAgentPortal(req.params.token);
    const all = await listRequests({ accountId: session.account.id, limit: 500 });
    const existing = all.find((r) => r.id === req.params.id);
    if (!existing) return res.status(404).json({ error: 'Request not found' });
    // Agents may only move DRAFT/SUBMITTED → MANAGER_REVIEW or cancel; managers APPROVE via note path limited
    const allowed = ['MANAGER_REVIEW', 'CANCELLED', 'SUBMITTED'];
    const status = req.body?.status;
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ error: 'Agents cannot set that status. Synergy/admin completes booking approvals involving credit.' });
    }
    const patch = {
      status,
      managerNote: req.body?.managerNote,
    };
    // Manager role staff can approve within credit if role is MANAGER
    const staffId = session.staff?.[0]?.id;
    const manager = (session.staff || []).find((s) => s.role === 'MANAGER' || s.role === 'ADMIN');
    if (manager && (status === 'APPROVED' || status === 'REJECTED')) {
      patch.status = status;
      if (req.body?.estimatedCost != null) patch.estimatedCost = req.body.estimatedCost;
    }
    const request = await updateTravelRequest(req.params.id, patch);
    res.json({ ok: true, request, staffId });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update request' });
  }
});

export default router;
