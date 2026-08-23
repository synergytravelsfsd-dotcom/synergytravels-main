import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import {
  createQuote,
  fetchAdminLeads,
  fetchCustomers,
  fetchFollowUps,
  fetchLeadStats,
  fetchQuotes,
  fetchSalesStats,
  patchAdminLead,
  patchQuote,
  quotePublicUrl,
} from '../../lib/leadsApi';
import {
  createPortalLink,
  createVisaCase,
  fetchDocuments,
  fetchNotifications,
  fetchPassportReminders,
  fetchPayments,
  fetchPhase4Stats,
  fetchVisaCases,
  markPassportReminderSent,
  patchCustomerPassport,
  patchPayment,
  patchVisaCase,
  portalPublicUrl,
  createDocument,
} from '../../lib/portalApi';
import { aiAssistQuote, aiFollowUps, aiInsights, aiQualifyLead, fetchAiStatus } from '../../lib/aiApi';
import { getWhatsAppLink } from '../../constants/contact';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  leadScore: number;
  leadBand: string;
  channel?: string;
  createdAt: string;
  notes?: string;
  assignedAgent?: string | null;
  payload?: Record<string, string>;
};

type Quote = {
  id: string;
  leadId?: string | null;
  publicToken: string;
  status: string;
  currency: string;
  sellTotal: number;
  costTotal: number;
  profit: number;
  depositAmount: number;
  title: string;
  assignedAgent?: string | null;
  followUpAt?: string | null;
  followUpNote?: string;
  createdAt: string;
};

type Tab = 'leads' | 'quotes' | 'followups' | 'customers' | 'visa' | 'payments' | 'portal' | 'ai';

const TOKEN_KEY = 'synergy_crm_token_v1';

const LeadsAdmin: React.FC = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [tokenInput, setTokenInput] = useState(token);
  const [tab, setTab] = useState<Tab>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Record<string, unknown>[]>([]);
  const [followUps, setFollowUps] = useState<Quote[]>([]);
  const [visaCases, setVisaCases] = useState<Record<string, unknown>[]>([]);
  const [visaStatuses, setVisaStatuses] = useState<string[]>([]);
  const [paymentsList, setPaymentsList] = useState<Record<string, unknown>[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Record<string, unknown>[]>([]);
  const [notifications, setNotifications] = useState<Record<string, unknown>[]>([]);
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [phase4, setPhase4] = useState<Record<string, unknown> | null>(null);
  const [visaForm, setVisaForm] = useState({
    leadId: '',
    customerId: '',
    destination: '',
    nationality: '',
    visaType: '',
    assignedAgent: '',
  });
  const [portalForm, setPortalForm] = useState({ customerId: '', daysValid: '14' });
  const [passportForm, setPassportForm] = useState({
    customerId: '',
    passportExpiry: '',
    passportCountry: '',
  });
  const [aiOut, setAiOut] = useState<Record<string, unknown> | null>(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiMode, setAiMode] = useState('');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [quoteStatuses, setQuoteStatuses] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [q, setQ] = useState('');
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [sales, setSales] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    leadId: '',
    title: '',
    summary: '',
    sellTotal: '',
    costTotal: '',
    assignedAgent: '',
  });

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [list, st, qt, ss, fu, cu, vc, pay, rem, notes, p4, docs] = await Promise.all([
        fetchAdminLeads(token, { status: statusFilter || undefined, q: q || undefined }),
        fetchLeadStats(token),
        fetchQuotes(token, { q: q || undefined }),
        fetchSalesStats(token),
        fetchFollowUps(token),
        fetchCustomers(token, q || undefined),
        fetchVisaCases(token, { q: q || undefined }),
        fetchPayments(token, { q: q || undefined }),
        fetchPassportReminders(token),
        fetchNotifications(token),
        fetchPhase4Stats(token),
        fetchDocuments(token),
      ]);
      setLeads((list.leads || []) as Lead[]);
      setStatuses(list.statuses || []);
      setQuotes((qt.quotes || []) as Quote[]);
      setQuoteStatuses(qt.statuses || []);
      setStats(st);
      setSales(ss);
      setFollowUps((fu.followUps || []) as Quote[]);
      setCustomers(cu.customers || []);
      setVisaCases(vc.cases || []);
      setVisaStatuses(vc.statuses || []);
      setPaymentsList(pay.payments || []);
      setPaymentStatuses(pay.statuses || []);
      setReminders(rem.reminders || []);
      setNotifications(notes.notifications || []);
      setPhase4(p4);
      setDocuments(docs.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CRM');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter, q]);

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const saveToken = () => {
    localStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await patchAdminLead(token, id, { status });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const assignAgent = async (id: string, assignedAgent: string) => {
    try {
      await patchAdminLead(token, id, { assignedAgent });
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assign failed');
    }
  };

  const onCreateQuote = async () => {
    if (!quoteForm.leadId || !quoteForm.sellTotal) {
      alert('Lead ID and sell total are required');
      return;
    }
    try {
      const data = await createQuote(token, {
        leadId: quoteForm.leadId,
        title: quoteForm.title || 'Travel quotation',
        summary: quoteForm.summary,
        sellTotal: Number(quoteForm.sellTotal),
        costTotal: Number(quoteForm.costTotal || 0),
        assignedAgent: quoteForm.assignedAgent || undefined,
        lineItems: [
          {
            label: quoteForm.title || 'Package / itinerary',
            quantity: 1,
            unitSell: Number(quoteForm.sellTotal),
            unitCost: Number(quoteForm.costTotal || 0),
          },
        ],
      });
      const sent = await patchQuote(token, data.quote.id, { status: 'SENT' });
      const url = quotePublicUrl(sent.quote.publicToken || data.quote.publicToken);
      await load();
      setTab('quotes');
      alert(`Quote created and marked SENT.\nShare link:\n${url}`);
      setQuoteForm({ leadId: '', title: '', summary: '', sellTotal: '', costTotal: '', assignedAgent: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Quote create failed');
    }
  };

  const money = (n: number, currency = 'GBP') =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(Number(n) || 0);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16">
        <div className="max-w-md mx-auto px-4 pt-10">
          <h1 className="text-2xl font-bold text-slate-900">Synergy Sales CRM</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the CRM admin token (`CRM_ADMIN_TOKEN`). Staff only.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2.5"
            placeholder="CRM admin token"
          />
          <button
            type="button"
            onClick={saveToken}
            className="mt-3 w-full rounded-xl bg-orange-600 text-white py-3 font-semibold"
          >
            Unlock CRM
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Sales CRM</h1>
            <p className="text-slate-300 text-sm mt-1">
              Phase 4 — leads → quotes → visa → portal → payments
              {sales?.storage ? ` · storage: ${String(sales.storage)}` : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken('');
              }}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold"
            >
              Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Stat label="Leads" value={String(stats?.total ?? 0)} />
          <Stat label="Hot" value={String(stats?.hot ?? 0)} accent="text-orange-600" />
          <Stat label="Open quotes" value={String(sales?.quotesOpen ?? 0)} />
          <Stat label="Visa open" value={String(phase4?.visaOpen ?? 0)} />
          <Stat label="Pay pending" value={String(phase4?.paymentsPending ?? 0)} accent="text-rose-600" />
          <Stat label="Passport due" value={String(phase4?.passportRemindersDue ?? 0)} accent="text-amber-600" />
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ['leads', 'Leads'],
              ['quotes', 'Quotes'],
              ['followups', 'Follow-ups'],
              ['customers', 'Customers'],
              ['visa', 'Visa'],
              ['payments', 'Payments'],
              ['portal', 'Portal'],
              ['ai', 'AI'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                tab === id ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="Search"
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-2.5 bg-white"
            />
          </label>
          {tab === 'leads' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 bg-white"
            >
              <option value="">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
          <button type="button" onClick={load} className="rounded-xl bg-orange-600 text-white px-5 py-2.5 font-semibold">
            Filter
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>
        )}

        {tab === 'leads' && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <h2 className="font-bold text-slate-900">Create quote from lead</h2>
              <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  placeholder="Lead ID (e.g. ST-…)"
                  value={quoteForm.leadId}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, leadId: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5"
                />
                <input
                  placeholder="Title"
                  value={quoteForm.title}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, title: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5"
                />
                <input
                  placeholder="Agent name"
                  value={quoteForm.assignedAgent}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, assignedAgent: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5"
                />
                <input
                  placeholder="Sell total"
                  type="number"
                  value={quoteForm.sellTotal}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, sellTotal: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5"
                />
                <input
                  placeholder="Cost total (internal)"
                  type="number"
                  value={quoteForm.costTotal}
                  onChange={(e) => setQuoteForm((p) => ({ ...p, costTotal: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-2.5"
                />
                <button
                  type="button"
                  onClick={() => void onCreateQuote()}
                  className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold"
                >
                  Create &amp; send quote
                </button>
              </div>
              <textarea
                placeholder="Summary / inclusions for customer"
                value={quoteForm.summary}
                onChange={(e) => setQuoteForm((p) => ({ ...p, summary: e.target.value }))}
                className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2.5 min-h-[80px]"
              />
            </div>

            {leads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="font-mono text-xs font-semibold text-orange-600"
                        onClick={() => setQuoteForm((p) => ({ ...p, leadId: lead.id, title: `${lead.service} for ${lead.name}` }))}
                        title="Use for quote"
                      >
                        {lead.id}
                      </button>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold">{lead.service}</span>
                      <span className="rounded-full bg-orange-50 text-orange-800 px-2 py-0.5 text-xs font-semibold">
                        {lead.leadBand} ({lead.leadScore})
                      </span>
                    </div>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">{lead.name}</h2>
                    <p className="text-sm text-slate-600">
                      {lead.email} · {lead.phone}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(lead.createdAt).toLocaleString()} · {lead.channel || 'website'}
                      {lead.assignedAgent ? ` · Agent: ${lead.assignedAgent}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <input
                      placeholder="Assign agent"
                      defaultValue={lead.assignedAgent || ''}
                      onBlur={(e) => {
                        if (e.target.value !== (lead.assignedAgent || '')) {
                          void assignAgent(lead.id, e.target.value);
                        }
                      }}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    />
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <a
                      href={getWhatsAppLink(`Hi ${lead.name}, regarding your Synergy enquiry ${lead.id}…`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            ))}
            {!loading && leads.length === 0 && !error && (
              <p className="text-center text-slate-500 py-12">No leads yet.</p>
            )}
          </div>
        )}

        {tab === 'quotes' && (
          <div className="space-y-3">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-mono text-xs font-semibold text-orange-600">{quote.id}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold">{quote.status}</span>
                      {quote.leadId && <span className="text-xs text-slate-500">Lead {quote.leadId}</span>}
                    </div>
                    <h2 className="mt-1 font-bold text-slate-900">{quote.title}</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Sell {money(quote.sellTotal, quote.currency)} · Cost {money(quote.costTotal, quote.currency)} ·{' '}
                      <span className="font-semibold text-emerald-700">Profit {money(quote.profit, quote.currency)}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {quote.assignedAgent ? `Agent ${quote.assignedAgent} · ` : ''}
                      {new Date(quote.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={quote.status}
                      onChange={(e) => void patchQuote(token, quote.id, { status: e.target.value }).then(load)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    >
                      {quoteStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        const url = quotePublicUrl(quote.publicToken);
                        void navigator.clipboard?.writeText(url);
                        alert(`Customer link copied:\n${url}`);
                      }}
                      className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold"
                    >
                      Copy customer link
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {!loading && quotes.length === 0 && <p className="text-center text-slate-500 py-12">No quotes yet.</p>}
          </div>
        )}

        {tab === 'followups' && (
          <div className="space-y-3">
            {followUps.map((q) => (
              <article
                key={q.id}
                className={`rounded-2xl border p-4 sm:p-5 ${
                  (q as Quote & { overdue?: boolean }).overdue
                    ? 'border-rose-200 bg-rose-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-orange-600">{q.id}</div>
                    <h2 className="font-bold">{q.title}</h2>
                    <p className="text-sm text-slate-600">{q.followUpNote}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Due {q.followUpAt ? new Date(q.followUpAt).toLocaleString() : '—'} · {q.status}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      void patchQuote(token, q.id, {
                        followUpAt: new Date(Date.now() + 2 * 86400000).toISOString(),
                        followUpNote: 'Follow-up completed / rescheduled +2 days',
                      }).then(load)
                    }
                    className="rounded-xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold h-fit"
                  >
                    Snooze +2d
                  </button>
                </div>
              </article>
            ))}
            {!loading && followUps.length === 0 && (
              <p className="text-center text-slate-500 py-12">No follow-ups due.</p>
            )}
          </div>
        )}

        {tab === 'customers' && (
          <div className="space-y-3">
            {customers.map((c) => (
              <article key={String(c.id)} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      className="font-mono text-xs text-orange-600"
                      onClick={() => {
                        setPortalForm((p) => ({ ...p, customerId: String(c.id) }));
                        setPassportForm((p) => ({ ...p, customerId: String(c.id) }));
                        setVisaForm((p) => ({ ...p, customerId: String(c.id) }));
                        setTab('portal');
                      }}
                    >
                      {String(c.id)}
                    </button>
                    <h2 className="font-bold text-slate-900">{String(c.name)}</h2>
                    <p className="text-sm text-slate-600">
                      {String(c.email || '')} · {String(c.phone || '')}
                    </p>
                    {c.country ? <p className="text-xs text-slate-500 mt-1">{String(c.country)}</p> : null}
                  </div>
                </div>
              </article>
            ))}
            {!loading && customers.length === 0 && (
              <p className="text-center text-slate-500 py-12">No customers yet.</p>
            )}
          </div>
        )}

        {tab === 'visa' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
              Visa statuses track Synergy assistance only. Never mark immigration approval/refusal here.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                placeholder="Customer ID"
                value={visaForm.customerId}
                onChange={(e) => setVisaForm((p) => ({ ...p, customerId: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                placeholder="Lead ID (optional)"
                value={visaForm.leadId}
                onChange={(e) => setVisaForm((p) => ({ ...p, leadId: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                placeholder="Destination *"
                value={visaForm.destination}
                onChange={(e) => setVisaForm((p) => ({ ...p, destination: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                placeholder="Nationality"
                value={visaForm.nationality}
                onChange={(e) => setVisaForm((p) => ({ ...p, nationality: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                placeholder="Visa type"
                value={visaForm.visaType}
                onChange={(e) => setVisaForm((p) => ({ ...p, visaType: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <button
                type="button"
                onClick={() =>
                  void createVisaCase(token, visaForm)
                    .then(load)
                    .catch((err) => alert(err instanceof Error ? err.message : 'Failed'))
                }
                className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold"
              >
                Open visa case
              </button>
            </div>
            {visaCases.map((c) => (
              <article key={String(c.id)} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-orange-600">{String(c.id)}</div>
                    <h2 className="font-bold">
                      {String(c.destination)} · {String(c.visaType || 'Assistance')}
                    </h2>
                    <p className="text-sm text-slate-600">
                      Customer {String(c.customerId || '—')} · Lead {String(c.leadId || '—')}
                    </p>
                  </div>
                  <select
                    value={String(c.status)}
                    onChange={(e) => void patchVisaCase(token, String(c.id), { status: e.target.value }).then(load)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm h-fit"
                  >
                    {visaStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-orange-700"
                  onClick={() =>
                    void createDocument(token, {
                      customerId: c.customerId,
                      visaCaseId: c.id,
                      docType: 'passport_scan',
                      fileName: 'Requested: passport bio page',
                      status: 'REQUESTED',
                    }).then(load)
                  }
                >
                  + Request passport document
                </button>
              </article>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-bold">Documents</h3>
              <div className="mt-2 space-y-2">
                {documents.slice(0, 30).map((d) => (
                  <div key={String(d.id)} className="text-sm flex justify-between gap-2 border-b border-slate-100 py-2">
                    <span>
                      {String(d.id)} · {String(d.fileName || d.docType)} · case {String(d.visaCaseId || '—')}
                    </span>
                    <span className="font-semibold">{String(d.status)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'payments' && (
          <div className="space-y-3">
            {paymentsList.map((p) => (
              <article key={String(p.id)} className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-mono text-xs text-orange-600">{String(p.id)}</div>
                  <div className="font-bold">
                    {money(Number(p.amount), String(p.currency || 'GBP'))} · {String(p.method)}
                  </div>
                  <p className="text-sm text-slate-600">
                    Ref {String(p.reference || '—')} · Quote {String(p.quoteId || '—')}
                  </p>
                </div>
                <select
                  value={String(p.status)}
                  onChange={(e) => void patchPayment(token, String(p.id), { status: e.target.value }).then(load)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm h-fit"
                >
                  {paymentStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </article>
            ))}
            {!loading && paymentsList.length === 0 && (
              <p className="text-center text-slate-500 py-12">No payments recorded yet.</p>
            )}
          </div>
        )}

        {tab === 'portal' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-3 gap-3">
              <input
                placeholder="Customer ID *"
                value={portalForm.customerId}
                onChange={(e) => setPortalForm((p) => ({ ...p, customerId: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                placeholder="Days valid"
                value={portalForm.daysValid}
                onChange={(e) => setPortalForm((p) => ({ ...p, daysValid: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <button
                type="button"
                onClick={() =>
                  void createPortalLink(token, {
                    customerId: portalForm.customerId,
                    daysValid: Number(portalForm.daysValid) || 14,
                  })
                    .then((data) => {
                      const url = portalPublicUrl(data.link.token);
                      void navigator.clipboard?.writeText(url);
                      alert(`Portal link created (copied):\n${url}\n\nSave this token now — it is shown once.`);
                      return load();
                    })
                    .catch((err) => alert(err instanceof Error ? err.message : 'Failed'))
                }
                className="rounded-xl bg-orange-600 text-white px-4 py-2.5 font-semibold"
              >
                Create portal link
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 grid sm:grid-cols-3 gap-3">
              <input
                placeholder="Customer ID"
                value={passportForm.customerId}
                onChange={(e) => setPassportForm((p) => ({ ...p, customerId: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <input
                type="date"
                value={passportForm.passportExpiry}
                onChange={(e) => setPassportForm((p) => ({ ...p, passportExpiry: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5"
              />
              <button
                type="button"
                onClick={() =>
                  void patchCustomerPassport(token, passportForm.customerId, {
                    passportExpiry: passportForm.passportExpiry,
                    passportCountry: passportForm.passportCountry,
                  })
                    .then(load)
                    .catch((err) => alert(err instanceof Error ? err.message : 'Failed'))
                }
                className="rounded-xl bg-slate-900 text-white px-4 py-2.5 font-semibold"
              >
                Save passport expiry
              </button>
              <input
                placeholder="Passport country"
                value={passportForm.passportCountry}
                onChange={(e) => setPassportForm((p) => ({ ...p, passportCountry: e.target.value }))}
                className="rounded-xl border border-slate-200 px-3 py-2.5 sm:col-span-3"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-bold">Passport reminders (≤180 days)</h3>
              <div className="mt-3 space-y-2">
                {reminders.map((r) => (
                  <div key={String(r.id)} className="flex flex-wrap justify-between gap-2 text-sm border-b border-slate-100 py-2">
                    <span>
                      {String(r.name)} · expires {String(r.passportExpiry)}
                      {r.overdue ? ' · OVERDUE' : ''}
                    </span>
                    <button
                      type="button"
                      className="font-semibold text-orange-700"
                      onClick={() => void markPassportReminderSent(token, String(r.id)).then(load)}
                    >
                      Mark reminder sent
                    </button>
                  </div>
                ))}
                {reminders.length === 0 && <p className="text-sm text-slate-500">No reminders due.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="font-bold">Notification log</h3>
              <div className="mt-3 space-y-2">
                {notifications.slice(0, 20).map((n) => (
                  <div key={String(n.id)} className="text-sm border-b border-slate-100 py-2">
                    <div className="font-semibold">{String(n.title)}</div>
                    <div className="text-slate-600">{String(n.body)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'ai' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
              AI assists staff only — humans confirm quotes, payments and visa filings. Optional{' '}
              <code className="text-xs">OPENAI_API_KEY</code> upgrades wording; heuristics always work.
              {aiMode ? ` Current mode: ${aiMode}.` : ''}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={aiBusy}
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                onClick={() =>
                  void (async () => {
                    setAiBusy(true);
                    try {
                      const st = await fetchAiStatus();
                      setAiMode(String(st.mode || ''));
                      const data = await aiInsights(token, {
                        stats: {
                          leadsTotal: stats?.total,
                          hot: stats?.hot,
                          quotesOpen: sales?.quotesOpen,
                          pipelineSell: sales?.pipelineSell,
                          visaOpen: phase4?.visaOpen,
                          paymentsPending: phase4?.paymentsPending,
                        },
                      });
                      setAiOut(data);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'AI failed');
                    } finally {
                      setAiBusy(false);
                    }
                  })()
                }
              >
                Synergy IQ insights
              </button>
              <button
                type="button"
                disabled={aiBusy || leads.length === 0}
                className="rounded-xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                onClick={() =>
                  void (async () => {
                    setAiBusy(true);
                    try {
                      const lead = leads[0];
                      const data = await aiQualifyLead(token, {
                        name: lead.name,
                        service: lead.service,
                        origin: lead.payload?.origin,
                        destination: lead.payload?.destination,
                        departDate: lead.payload?.departDate,
                        budget: lead.payload?.budget,
                        phone: lead.phone,
                        email: lead.email,
                        message: lead.notes,
                      });
                      setAiOut({ ...data, leadId: lead.id });
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'AI failed');
                    } finally {
                      setAiBusy(false);
                    }
                  })()
                }
              >
                Qualify top lead
              </button>
              <button
                type="button"
                disabled={aiBusy || quotes.length === 0}
                className="rounded-xl bg-sky-700 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                onClick={() =>
                  void (async () => {
                    setAiBusy(true);
                    try {
                      const quote = quotes[0];
                      const data = await aiAssistQuote(token, {
                        quoteId: quote.id,
                        title: quote.title,
                        sellTotal: quote.sellTotal,
                        costTotal: quote.costTotal,
                        depositAmount: quote.depositAmount,
                        currency: quote.currency,
                      });
                      setAiOut({ ...data, quoteId: quote.id });
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'AI failed');
                    } finally {
                      setAiBusy(false);
                    }
                  })()
                }
              >
                Assist latest quote
              </button>
              <button
                type="button"
                disabled={aiBusy}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
                onClick={() =>
                  void (async () => {
                    setAiBusy(true);
                    try {
                      const data = await aiFollowUps(token, {
                        items: [
                          ...leads.slice(0, 10).map((l) => ({ id: l.id, status: l.status })),
                          ...quotes.slice(0, 10).map((q) => ({ id: q.id, status: q.status })),
                          ...visaCases.slice(0, 10).map((c) => ({ id: c.id, status: c.status })),
                        ],
                      });
                      setAiOut(data);
                    } catch (err) {
                      alert(err instanceof Error ? err.message : 'AI failed');
                    } finally {
                      setAiBusy(false);
                    }
                  })()
                }
              >
                Follow-up queue
              </button>
            </div>
            {aiOut && (
              <pre className="rounded-2xl border border-slate-200 bg-white p-4 text-xs overflow-auto max-h-[480px]">
                {JSON.stringify(aiOut, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-xl font-bold ${accent || ''}`}>{value}</div>
    </div>
  );
}

export default LeadsAdmin;
