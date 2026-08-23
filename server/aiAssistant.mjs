/**
 * Phase 5 AI assistance — productivity helpers, not autonomous booking/visa decisions.
 * Uses deterministic heuristics by default; optional OpenAI when OPENAI_API_KEY is set.
 * Never invents live inventory prices or visa outcomes.
 */
import { createHash } from 'crypto';

function sanitize(value, max = 2000) {
  return String(value || '')
    .trim()
    .slice(0, max);
}

export function aiStatus() {
  const key = String(process.env.OPENAI_API_KEY || '').trim();
  const model = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  return {
    ok: true,
    llmConfigured: Boolean(key),
    model: key ? model : null,
    mode: key ? 'llm+heuristics' : 'heuristics',
    disclaimer:
      'AI suggestions assist Synergy staff and travellers. Humans confirm quotes, payments, and visa filings. No live fares or immigration outcomes are invented.',
  };
}

async function optionalLlmComplete(system, user) {
  const key = String(process.env.OPENAI_API_KEY || '').trim();
  if (!key) return null;
  const model = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 700,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

function scoreLeadHeuristic(input = {}) {
  let score = 10;
  const reasons = [];
  if (input.phone || input.whatsapp) {
    score += 15;
    reasons.push('Phone/WhatsApp present');
  }
  if (input.email) {
    score += 8;
    reasons.push('Email present');
  }
  if (input.origin && input.destination) {
    score += 12;
    reasons.push('Route specified');
  }
  if (input.departDate) {
    score += 10;
    reasons.push('Travel date provided');
  }
  if (input.budget) {
    score += 10;
    reasons.push('Budget guidance provided');
  }
  if (input.service === 'flights' || input.service === 'visa' || input.service === 'packages') {
    score += 8;
    reasons.push(`High-intent service: ${input.service}`);
  }
  if (input.departDate) {
    const when = new Date(input.departDate);
    if (!Number.isNaN(when.getTime())) {
      const days = (when.getTime() - Date.now()) / 86400000;
      if (days >= 0 && days <= 14) {
        score += 20;
        reasons.push('Travel within 14 days');
      } else if (days > 14 && days <= 45) {
        score += 10;
        reasons.push('Travel within 45 days');
      }
    }
  }
  score = Math.min(100, score);
  const band = score >= 90 ? 'Very Hot' : score >= 70 ? 'Hot' : score >= 40 ? 'Warm' : 'Cold';
  const nextAction =
    score >= 70
      ? 'Call/WhatsApp within 1 hour; prepare indicative options (no invented fares).'
      : score >= 40
        ? 'Qualify missing dates/pax/budget today; schedule follow-up.'
        : 'Acknowledge enquiry; request missing essentials before quoting.';
  return { score, band, reasons, nextAction };
}

export async function qualifyLead(body = {}) {
  const heuristic = scoreLeadHeuristic(body);
  const llm = await optionalLlmComplete(
    'You are a travel CRM assistant for Synergy Travels. Suggest brief human-reviewed next steps. Never invent prices or visa approvals. Reply in plain text under 120 words.',
    `Lead: ${JSON.stringify({
      name: body.name,
      service: body.service,
      origin: body.origin,
      destination: body.destination,
      departDate: body.departDate,
      budget: body.budget,
      message: sanitize(body.message, 500),
      heuristic,
    })}`
  );
  return {
    ...aiStatus(),
    ...heuristic,
    llmSuggestion: llm,
    humanRequired: true,
  };
}

export async function consultTravel(body = {}) {
  const destination = sanitize(body.destination || body.query, 120) || 'your destination';
  const nights = Math.max(1, Math.min(21, Number(body.nights) || 5));
  const style = sanitize(body.style || 'balanced', 40);
  const origin = sanitize(body.origin, 80);

  const heuristic = {
    destination,
    nights,
    style,
    outline: [
      `Day 1: Arrive ${destination}, light orientation`,
      `Days 2–${Math.max(2, nights - 1)}: Mix of highlights suited to ${style} travel`,
      `Day ${nights}: Departure buffer and transfer`,
    ],
    questionsForQuote: [
      'Exact travel dates and flexible ± days?',
      'Adults / children / infants?',
      'Preferred cabin or hotel star band?',
      'Budget guidance (currency)?',
    ],
    warnings: [
      'Itinerary ideas are guidance only — not a confirmed booking.',
      'Visa rules vary; Synergy provides assistance, not immigration decisions.',
      'No live package price is shown until an authorised quote is issued.',
    ],
    suggestedEnquiry: [
      origin ? `From ${origin}` : null,
      `To ${destination}`,
      `${nights} nights`,
      `Style: ${style}`,
      'Please quote flights + hotel options.',
    ]
      .filter(Boolean)
      .join(' · '),
  };

  const llm = await optionalLlmComplete(
    'You are Synergy Travels AI consultant. Give helpful planning tips. Never invent live fares, availability, or visa approvals. Keep under 160 words. End with: "Synergy team will confirm quotes."',
    `Traveller request: ${JSON.stringify({ destination, nights, style, origin, notes: sanitize(body.notes, 400) })}`
  );

  return {
    ...aiStatus(),
    ...heuristic,
    llmSuggestion: llm,
    humanRequired: true,
  };
}

export async function assistQuote(body = {}) {
  const sell = Number(body.sellTotal) || 0;
  const cost = Number(body.costTotal) || 0;
  const profit = Math.round((sell - cost) * 100) / 100;
  const margin = sell > 0 ? Math.round((profit / sell) * 1000) / 10 : 0;
  const deposit = Number(body.depositAmount) || Math.round(sell * 0.3 * 100) / 100;

  const tips = [];
  if (sell <= 0) tips.push('Set a sell total before sending — do not invent competitor live fares.');
  if (cost <= 0) tips.push('Record supplier cost privately for margin tracking.');
  if (margin < 8 && sell > 0) tips.push('Margin under 8% — review supplier cost or inclusions.');
  if (margin >= 8 && margin < 15) tips.push('Margin is moderate; confirm inclusions clearly.');
  if (margin >= 15) tips.push('Healthy margin band — still require human approval before send.');
  if (!body.validUntil) tips.push('Set a validity date (e.g. 7 days).');
  tips.push('Customer-facing quote must never expose supplier cost.');
  tips.push('WhatsApp follow-up 24–48h after send if unopened/unaccepted.');

  const followUpScript = `Hi ${sanitize(body.customerName || 'there', 40)}, sharing your Synergy quotation ${sanitize(body.quoteId || '', 40)}. Please review the inclusions and validity. Reply here with questions — we confirm everything before payment.`;

  const llm = await optionalLlmComplete(
    'You help travel agents improve quotation wording. Never invent prices. Never expose cost. Under 100 words.',
    `Quote draft: title=${sanitize(body.title, 120)} sell=${sell} currency=${sanitize(body.currency || 'GBP', 8)} summary=${sanitize(body.summary, 400)}`
  );

  return {
    ...aiStatus(),
    profit,
    marginPercent: margin,
    suggestedDeposit: deposit,
    tips,
    followUpScript,
    llmSuggestion: llm,
    humanRequired: true,
  };
}

export async function suggestFollowUps(body = {}) {
  const items = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const suggestions = items.map((item) => {
    const status = String(item.status || '');
    const id = String(item.id || item.quoteId || item.leadId || 'item');
    let action = 'Review manually';
    let priority = 'normal';
    if (status === 'NEW' || status === 'SENT') {
      action = 'First contact / confirm quote received';
      priority = 'high';
    } else if (status === 'VIEWED' || status === 'PAYMENT_PENDING') {
      action = 'Nudge payment with reference; offer WhatsApp help';
      priority = 'high';
    } else if (status === 'DOCUMENTS_REQUESTED') {
      action = 'Remind customer of outstanding documents via portal/WhatsApp';
      priority = 'high';
    } else if (status === 'QUALIFIED' || status === 'CONTACTED') {
      action = 'Prepare quote draft from lead details';
      priority = 'normal';
    }
    return {
      id,
      status,
      priority,
      action,
      channel: 'whatsapp',
    };
  });

  const llm = await optionalLlmComplete(
    'Prioritise travel sales follow-ups briefly. No invented prices. Under 100 words.',
    `Queue: ${JSON.stringify(suggestions.slice(0, 12))}`
  );

  return {
    ...aiStatus(),
    suggestions,
    llmSuggestion: llm,
    humanRequired: true,
  };
}

export async function businessInsights(body = {}) {
  const stats = body.stats || {};
  const leads = Number(stats.leadsTotal) || 0;
  const hot = Number(stats.hot) || 0;
  const quotesOpen = Number(stats.quotesOpen) || 0;
  const pipeline = Number(stats.pipelineSell) || 0;
  const visaOpen = Number(stats.visaOpen) || 0;
  const payPending = Number(stats.paymentsPending) || 0;

  const bullets = [
    `${leads} leads in view · ${hot} hot/very hot — prioritise those first.`,
    `${quotesOpen} open quotes · pipeline sell ${pipeline} (not realised revenue).`,
    `${visaOpen} open visa assistance cases (not approvals).`,
    `${payPending} payments awaiting proof/confirmation.`,
  ];
  if (hot > 0 && quotesOpen === 0) {
    bullets.push('Hot leads without quotes — create quotations today.');
  }
  if (payPending > 0) {
    bullets.push('Chase payment proofs on WhatsApp with bank reference.');
  }

  const llm = await optionalLlmComplete(
    'You are Synergy IQ assistant. Give 3 short operational suggestions. No invented revenue. Under 90 words.',
    JSON.stringify({ leads, hot, quotesOpen, pipeline, visaOpen, payPending })
  );

  return {
    ...aiStatus(),
    bullets,
    llmSuggestion: llm,
    fingerprint: createHash('sha1').update(JSON.stringify(stats)).digest('hex').slice(0, 10),
    humanRequired: true,
  };
}
