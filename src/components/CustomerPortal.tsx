import React, { useEffect, useState } from 'react';
import { FileUp, ShieldAlert } from 'lucide-react';
import { fetchPortalSession, portalUploadDocument } from '../lib/portalApi';
import { getWhatsAppLink } from '../constants/contact';

type PortalProps = { token: string };

const CustomerPortal: React.FC<PortalProps> = ({ token }) => {
  const [data, setData] = useState<{
    customer?: { id: string; name: string; email?: string; phone?: string; passportExpiry?: string };
    cases?: Array<{ id: string; destination: string; status: string; visaType: string; checklist: string[] }>;
    documents?: Array<{ id: string; docType: string; fileName: string; status: string }>;
    payments?: Array<{ id: string; amount: number; currency: string; status: string; reference: string }>;
    notifications?: Array<{ id: string; title: string; body: string; createdAt: string }>;
    disclaimer?: string;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [docForm, setDocForm] = useState({ docType: 'passport_scan', fileName: '', notes: '' });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await fetchPortalSession(token));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Portal unavailable');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [token]);

  const onUploadMeta = async () => {
    if (!docForm.fileName.trim()) {
      alert('Enter the file name you will send (or already sent) to Synergy');
      return;
    }
    try {
      await portalUploadDocument(token, {
        docType: docForm.docType,
        fileName: docForm.fileName,
        notes: docForm.notes,
        status: 'RECEIVED',
      });
      setDocForm({ docType: 'passport_scan', fileName: '', notes: '' });
      await load();
      alert('Document noted on your case. For large files, also send via WhatsApp.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-slate-600">Loading portal…</div>;
  }

  if (error || !data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Portal unavailable</h1>
        <p className="mt-2 text-slate-600">{error}</p>
      </div>
    );
  }

  const money = (n: number, c = 'GBP') =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: c }).format(n || 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="bg-slate-950 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-orange-300 text-sm font-semibold">CUSTOMER PORTAL</p>
          <h1 className="mt-2 text-3xl font-bold">Hello, {data.customer?.name || 'traveller'}</h1>
          <p className="mt-2 text-slate-300 text-sm">Track visa assistance, documents and payments with Synergy.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4 space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex gap-3 text-sm text-amber-950">
          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{data.disclaimer}</p>
        </div>

        {data.customer?.passportExpiry && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="font-bold">Passport reminder</h2>
            <p className="text-sm text-slate-600 mt-1">
              On file expiry: {new Date(data.customer.passportExpiry).toLocaleDateString()}. Ensure validity covers your
              travel dates.
            </p>
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Visa assistance cases</h2>
          <div className="mt-3 space-y-3">
            {(data.cases || []).map((c) => (
              <article key={c.id} className="rounded-xl border border-slate-100 p-3">
                <div className="font-mono text-xs text-orange-600">{c.id}</div>
                <div className="font-semibold">
                  {c.destination} · {c.visaType || 'Visa assistance'}
                </div>
                <div className="text-sm text-slate-600">Status: {c.status}</div>
                {c.checklist?.length > 0 && (
                  <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                    {c.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
            {(data.cases || []).length === 0 && <p className="text-sm text-slate-500">No open visa cases.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Document vault</h2>
          <p className="text-sm text-slate-600 mt-1">
            Register documents here. Large files should also be sent on WhatsApp for processing.
          </p>
          <div className="mt-3 grid sm:grid-cols-3 gap-2">
            <select
              value={docForm.docType}
              onChange={(e) => setDocForm((p) => ({ ...p, docType: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="passport_scan">Passport bio page</option>
              <option value="photo">Photograph</option>
              <option value="bank_statement">Bank statement</option>
              <option value="invitation">Invitation letter</option>
              <option value="other">Other</option>
            </select>
            <input
              placeholder="File name"
              value={docForm.fileName}
              onChange={(e) => setDocForm((p) => ({ ...p, fileName: e.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => void onUploadMeta()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold"
            >
              <FileUp className="h-4 w-4" /> Note document
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {(data.documents || []).map((d) => (
              <div key={d.id} className="flex justify-between text-sm border-b border-slate-100 py-2">
                <span>
                  {d.fileName || d.docType} · {d.docType}
                </span>
                <span className="font-semibold">{d.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Payments</h2>
          <div className="mt-3 space-y-2">
            {(data.payments || []).map((p) => (
              <div key={p.id} className="flex justify-between text-sm border-b border-slate-100 py-2">
                <span>
                  {p.reference || p.id} · {money(p.amount, p.currency)}
                </span>
                <span className="font-semibold">{p.status}</span>
              </div>
            ))}
            {(data.payments || []).length === 0 && <p className="text-sm text-slate-500">No payments on file.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-bold text-lg">Updates</h2>
          <div className="mt-3 space-y-2">
            {(data.notifications || []).map((n) => (
              <div key={n.id} className="text-sm border-b border-slate-100 py-2">
                <div className="font-semibold">{n.title}</div>
                <div className="text-slate-600">{n.body}</div>
                <div className="text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <a
            href={getWhatsAppLink(`Hi Synergy, I am checking my customer portal for ${data.customer?.id || ''}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold"
          >
            WhatsApp Synergy
          </a>
        </section>
      </div>
    </div>
  );
};

export default CustomerPortal;
