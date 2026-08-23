import express from 'express';
import {
  travelProviderStatus,
  searchFlightsLive,
  searchHotelsLive,
  buildHolidayDraft,
} from './travelProvider.mjs';

const router = express.Router();

router.get('/travel/status', (_req, res) => {
  res.json(travelProviderStatus());
});

router.post('/travel/flights', async (req, res) => {
  try {
    const result = await searchFlightsLive(req.body || {});
    const code = result.httpStatus || 200;
    delete result.httpStatus;
    res.status(code === 501 ? 200 : code).json({ ok: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Flight search failed' });
  }
});

router.post('/travel/hotels', async (req, res) => {
  try {
    const result = await searchHotelsLive(req.body || {});
    const code = result.httpStatus || 200;
    delete result.httpStatus;
    res.status(code === 501 ? 200 : code).json({ ok: true, ...result });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Hotel search failed' });
  }
});

router.post('/travel/holiday-draft', (req, res) => {
  try {
    const draft = buildHolidayDraft(req.body || {});
    res.status(201).json({ ok: true, draft });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Unable to build holiday draft' });
  }
});

export default router;
