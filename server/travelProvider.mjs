/**
 * Live travel provider gateway (server-side).
 * Never invents prices. Returns clear status when credentials / adapters are missing.
 */
function providerConfig() {
  const id = String(process.env.TRAVEL_PROVIDER || '').trim().toLowerCase();
  const apiKey = String(process.env.TRAVEL_PROVIDER_API_KEY || '').trim();
  const apiSecret = String(process.env.TRAVEL_PROVIDER_API_SECRET || '').trim();
  const affiliateId = String(process.env.TRAVEL_PROVIDER_AFFILIATE_ID || '').trim();
  const liveFlag = String(process.env.TRAVEL_PROVIDER_LIVE || '').toLowerCase() === 'true';
  return { id, apiKey, apiSecret, affiliateId, liveFlag };
}

export function travelProviderStatus() {
  const cfg = providerConfig();
  const credentialsPresent = Boolean(cfg.apiKey);
  const named = Boolean(cfg.id);
  return {
    ok: true,
    configured: credentialsPresent && named && cfg.liveFlag,
    provider: cfg.id || null,
    credentialsPresent,
    liveFlag: cfg.liveFlag,
    affiliateConfigured: Boolean(cfg.affiliateId),
    adapters: {
      // Real adapters are added only when an authorised API is contracted.
      // Until then, searches never invent inventory.
      flights: false,
      hotels: false,
      packages: false,
    },
    message: !named
      ? 'TRAVEL_PROVIDER is not set. Using Synergy enquiry + partner deeplinks.'
      : !credentialsPresent
        ? `Provider "${cfg.id}" is named but TRAVEL_PROVIDER_API_KEY is missing.`
        : !cfg.liveFlag
          ? `Provider "${cfg.id}" credentials exist but TRAVEL_PROVIDER_LIVE is not true.`
          : `Provider "${cfg.id}" is flagged live, but no authorised inventory adapter is implemented yet. Contact Synergy engineering to wire the contracted API — no fake prices will be returned.`,
  };
}

function emptyLiveResult(message, mode = 'enquiry') {
  return {
    mode,
    offers: [],
    deeplinks: [],
    message,
    isLiveInventory: false,
  };
}

/**
 * Attempt live flight search. Returns inventory only from a real adapter.
 */
export async function searchFlightsLive(body) {
  const status = travelProviderStatus();
  if (!status.configured) {
    return {
      ...emptyLiveResult(status.message),
      providerStatus: status,
    };
  }

  // Future: switch(status.provider) { case 'amadeus': ... }
  // Do not invent offers when an adapter is missing.
  return {
    ...emptyLiveResult(
      `Live flight adapter for "${status.provider}" is not implemented yet. No prices were invented. Request a Synergy quote or use partner deeplinks.`,
      'enquiry'
    ),
    providerStatus: status,
    httpStatus: 501,
  };
}

export async function searchHotelsLive(body) {
  const status = travelProviderStatus();
  if (!status.configured) {
    return {
      ...emptyLiveResult(status.message),
      providerStatus: status,
    };
  }

  return {
    ...emptyLiveResult(
      `Live hotel adapter for "${status.provider}" is not implemented yet. No prices were invented. Request a Synergy hotel arrangement or browse partner links.`,
      'enquiry'
    ),
    providerStatus: status,
    httpStatus: 501,
  };
}

export function buildHolidayDraft(body = {}) {
  const destination = String(body.destination || '').trim();
  const nights = Math.max(1, Math.min(30, Number(body.nights) || 7));
  const adults = Math.max(1, Number(body.adults) || 2);
  const children = Math.max(0, Number(body.children) || 0);
  const departDate = String(body.departDate || '').trim();
  const origin = String(body.origin || '').trim();
  const budget = String(body.budget || '').trim();
  const style = String(body.style || 'balanced').trim();

  if (!destination) {
    const err = new Error('destination is required');
    err.status = 400;
    throw err;
  }

  const returnHint = departDate
    ? new Date(new Date(departDate).getTime() + nights * 86400000).toISOString().slice(0, 10)
    : '';

  return {
    id: `HB-${Date.now().toString(36).toUpperCase()}`,
    mode: 'enquiry',
    destination,
    nights,
    adults,
    children,
    origin,
    departDate,
    returnDate: returnHint,
    budget,
    style,
    components: {
      flights: {
        status: 'pending_enquiry',
        summary: origin
          ? `${origin} → ${destination}${departDate ? ` · ${departDate}` : ''}`
          : `Flights to ${destination}`,
      },
      hotels: {
        status: 'pending_enquiry',
        summary: `${nights} night(s) in ${destination}`,
      },
      activities: {
        status: 'optional',
        summary: 'Activities can be added after Synergy confirms the base package.',
      },
    },
    // Never invent a package price
    pricedTotal: null,
    currency: null,
    enquiryPayload: {
      service: 'packages',
      destination,
      origin,
      departDate,
      returnDate: returnHint,
      adults: String(adults),
      children: String(children),
      budget,
      message: [
        `Holiday builder draft for ${destination} (${nights} nights).`,
        style ? `Travel style: ${style}.` : '',
        budget ? `Budget guidance: ${budget}.` : '',
        'Please quote flights + hotel (and optional activities).',
      ]
        .filter(Boolean)
        .join(' '),
    },
    message:
      'Holiday draft created for Synergy quotation. Live package pricing is unavailable until authorised flight and hotel APIs are connected.',
  };
}
