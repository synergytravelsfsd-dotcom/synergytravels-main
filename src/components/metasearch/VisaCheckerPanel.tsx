import React, { useMemo, useState } from 'react';
import { CheckCircle2, FileText, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { checkVisa } from '../../metasearch/services/visaChecker';

const PASSPORTS = ['Pakistan', 'United Kingdom', 'United Arab Emirates', 'Saudi Arabia', 'United States'];
const DESTINATIONS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Turkey',
  'Malaysia',
  'Thailand',
  'United Kingdom',
  'United States',
  'Qatar',
  'Pakistan',
];

const STATUS_LABEL: Record<string, string> = {
  'visa-free': 'Visa free',
  evisa: 'eVisa',
  'visa-on-arrival': 'Visa on arrival',
  'embassy-visa': 'Embassy visa',
  restricted: 'Restricted',
};

const VisaCheckerPanel: React.FC = () => {
  const [passport, setPassport] = useState('Pakistan');
  const [destination, setDestination] = useState('United Arab Emirates');

  const result = useMemo(() => checkVisa(passport, destination), [passport, destination]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Dynamic visa checker</h3>
      <p className="text-sm text-slate-500 mb-4">
        Indicative guidance — confirm with embassy. Synergy can assist with documents.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Passport</span>
          <select
            value={passport}
            onChange={(e) => setPassport(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
          >
            {PASSPORTS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Destination</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
          >
            {DESTINATIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-2xl bg-orange-50 border border-orange-100 px-4 py-3 mb-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-slate-900">
            {STATUS_LABEL[result.status] || result.status}
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{result.embassyTip}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-4 text-sm">
        <div className="rounded-xl bg-slate-50 p-3 flex gap-2">
          <DollarSign className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-500">Fees</div>
            <div className="font-semibold">{result.feesUsd}</div>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 flex gap-2">
          <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-500">Processing</div>
            <div className="font-semibold">{result.processing}</div>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 flex gap-2">
          <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs text-slate-500">Documents</div>
            <div className="font-semibold">{result.documents.length} items</div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold mb-2">Required documents</div>
          <ul className="space-y-1.5 text-slate-600">
            {result.documents.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-orange-500">•</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Success tips
          </div>
          <ul className="space-y-1.5 text-slate-600">
            {result.successTips.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="text-orange-500">•</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisaCheckerPanel;
