import express from 'express';
import {
  createVisaCase,
  listVisaCases,
  updateVisaCase,
  upsertDocument,
  listDocuments,
  updateDocument,
  createPortalLink,
  resolvePortalSession,
  recordPayment,
  listPayments,
  updatePayment,
  updateCustomerPassport,
  listPassportReminders,
  markPassportReminderSent,
  listNotifications,
  phase4Stats,
  VISA_STATUSES,
  DOC_STATUSES,
  PAYMENT_STATUSES,
} from './phase4Store.mjs';

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = process.env.CRM_ADMIN_TOKEN || '';
  if (!token) {
    return res.status(503).json({ error: 'CRM admin is not configured. Set CRM_ADMIN_TOKEN.' });
  }
  const header = req.headers['x-crm-token'] || req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (header !== token) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

router.get('/phase4-stats', requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, ...(await phase4Stats()) });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to load Phase 4 stats' });
  }
});

router.get('/visa-cases', requireAdmin, async (req, res) => {
  try {
    const cases = await listVisaCases({
      status: req.query.status,
      q: req.query.q,
      limit: req.query.limit,
    });
    res.json({ ok: true, cases, statuses: VISA_STATUSES });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list visa cases' });
  }
});

router.post('/visa-cases', requireAdmin, async (req, res) => {
  try {
    const visaCase = await createVisaCase(req.body || {});
    res.status(201).json({ ok: true, case: visaCase });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create visa case' });
  }
});

router.patch('/visa-cases/:id', requireAdmin, async (req, res) => {
  try {
    const visaCase = await updateVisaCase(req.params.id, req.body || {});
    res.json({ ok: true, case: visaCase });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update visa case' });
  }
});

router.get('/documents', requireAdmin, async (req, res) => {
  try {
    const documents = await listDocuments({
      visaCaseId: req.query.visaCaseId,
      customerId: req.query.customerId,
      limit: req.query.limit,
    });
    res.json({ ok: true, documents, statuses: DOC_STATUSES });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list documents' });
  }
});

router.post('/documents', requireAdmin, async (req, res) => {
  try {
    const document = await upsertDocument(req.body || {});
    res.status(201).json({ ok: true, document });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to save document' });
  }
});

router.patch('/documents/:id', requireAdmin, async (req, res) => {
  try {
    const document = await updateDocument(req.params.id, req.body || {});
    res.json({ ok: true, document });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update document' });
  }
});

router.post('/portal-links', requireAdmin, async (req, res) => {
  try {
    const link = await createPortalLink(req.body || {});
    res.status(201).json({ ok: true, link });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to create portal link' });
  }
});

router.get('/payments', requireAdmin, async (req, res) => {
  try {
    const payments = await listPayments({
      status: req.query.status,
      q: req.query.q,
      limit: req.query.limit,
    });
    res.json({ ok: true, payments, statuses: PAYMENT_STATUSES });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list payments' });
  }
});

router.post('/payments', requireAdmin, async (req, res) => {
  try {
    const payment = await recordPayment(req.body || {});
    res.status(201).json({ ok: true, payment });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to record payment' });
  }
});

router.patch('/payments/:id', requireAdmin, async (req, res) => {
  try {
    const payment = await updatePayment(req.params.id, req.body || {});
    res.json({ ok: true, payment });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update payment' });
  }
});

router.patch('/customers/:id/passport', requireAdmin, async (req, res) => {
  try {
    const result = await updateCustomerPassport(req.params.id, req.body || {});
    res.json({ ok: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to update passport fields' });
  }
});

router.get('/passport-reminders', requireAdmin, async (req, res) => {
  try {
    const reminders = await listPassportReminders({ withinDays: req.query.withinDays });
    res.json({ ok: true, reminders });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list passport reminders' });
  }
});

router.post('/passport-reminders/:customerId/sent', requireAdmin, async (req, res) => {
  try {
    await markPassportReminderSent(req.params.customerId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to mark reminder sent' });
  }
});

router.get('/notifications', requireAdmin, async (req, res) => {
  try {
    const notifications = await listNotifications({ limit: req.query.limit });
    res.json({ ok: true, notifications });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Unable to list notifications' });
  }
});

/** Public customer portal (token in path) */
router.get('/public/portal/:token', async (req, res) => {
  try {
    const session = await resolvePortalSession(req.params.token);
    res.json({ ok: true, ...session });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Portal unavailable' });
  }
});

router.post('/public/portal/:token/documents', async (req, res) => {
  try {
    const session = await resolvePortalSession(req.params.token);
    const document = await upsertDocument({
      ...(req.body || {}),
      customerId: session.customer.id,
      uploadedBy: 'customer',
      status: 'RECEIVED',
    });
    res.status(201).json({ ok: true, document });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to upload document metadata' });
  }
});

export default router;
