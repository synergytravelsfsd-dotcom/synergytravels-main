import React, { useMemo, useState } from 'react';
import { Download, Loader2, Sparkles, X } from 'lucide-react';
import { useMetaSearchStore } from '../../metasearch/store';
import LocationAutocomplete from '../LocationAutocomplete';

type Props = {
  onClose?: () => void;
};

const DURATIONS = [1, 3, 5, 7, 15, 30] as const;

const AiTravelAssistant: React.FC<Props> = ({ onClose }) => {
  const { query, patchQuery, aiPlan, planWithAi } = useMetaSearchStore();
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(false);

  const canGenerate = useMemo(() => Boolean(query.destination?.trim()), [query.destination]);

  const run = async () => {
    if (!canGenerate) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      planWithAi(days);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = () => {
    if (!aiPlan) return;
    const lines = [
      `Synergy Travels & Tour — AI Itinerary`,
      aiPlan.summary,
      `Destination: ${aiPlan.destination} | ${aiPlan.days} days | Style: ${aiPlan.style}`,
      `Budget (USD): low $${aiPlan.budgetEstimateUsd.low} · mid $${aiPlan.budgetEstimateUsd.mid} · high $${aiPlan.budgetEstimateUsd.high}`,
      `Best months: ${aiPlan.bestMonth}`,
      `Visa: ${aiPlan.visaNote}`,
      '',
      ...aiPlan.itinerary.flatMap((d) => [
        `Day ${d.day}: ${d.title}`,
        `  Morning: ${d.morning}`,
        `  Afternoon: ${d.afternoon}`,
        `  Evening: ${d.evening}`,
        `  Meals: ${d.meals.join(', ')}`,
        ...d.tips.map((t) => `  Tip: ${t}`),
        '',
      ]),
      'Packing:',
      ...aiPlan.packing.map((t) => `- ${t}`),
      '',
      'Warnings:',
      ...aiPlan.warnings.map((t) => `- ${t}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `synergy-${aiPlan.destination.replace(/\s+/g, '-').toLowerCase()}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-3xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-white shadow-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-600" />
          <div>
            <h3 className="font-bold text-slate-900">AI Trip Planner</h3>
            <p className="text-xs text-slate-500">Itineraries, budget, packing & local tips</p>
          </div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-orange-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <LocationAutocomplete
            className="sm:col-span-1"
            label="Destination"
            value={query.destination}
            onChange={(destination) => patchQuery({ destination })}
            placeholder="e.g. Dubai or DXB"
          />
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Duration</span>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} day{d > 1 ? 's' : ''}
                </option>
              ))}
              <option value={10}>Custom (10 days)</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Travel style</span>
            <select
              value={query.travelStyle || 'family'}
              onChange={(e) =>
                patchQuery({ travelStyle: e.target.value as typeof query.travelStyle })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
            >
              {['family', 'luxury', 'budget', 'adventure', 'business', 'honeymoon', 'spiritual'].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={!canGenerate || loading}
          className="inline-flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate itinerary
        </button>

        {aiPlan && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{aiPlan.summary}</h4>
                <p className="text-sm text-slate-600">
                  Est. ${aiPlan.budgetEstimateUsd.low}–${aiPlan.budgetEstimateUsd.high} · Best:{' '}
                  {aiPlan.bestMonth}
                </p>
                <p className="text-xs text-slate-500 mt-1">{aiPlan.visaNote}</p>
              </div>
              <button
                type="button"
                onClick={downloadTxt}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download / share
              </button>
            </div>

            <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-1">
              {aiPlan.itinerary.map((d) => (
                <div key={d.day} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="font-semibold text-slate-900 mb-2">
                    Day {d.day}: {d.title}
                  </div>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li>
                      <span className="text-orange-600 font-medium">Morning</span> — {d.morning}
                    </li>
                    <li>
                      <span className="text-orange-600 font-medium">Afternoon</span> — {d.afternoon}
                    </li>
                    <li>
                      <span className="text-orange-600 font-medium">Evening</span> — {d.evening}
                    </li>
                    <li className="text-slate-400">Meals: {d.meals.join(', ')}</li>
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold mb-2">Packing</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {aiPlan.packing.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold mb-2">Warnings</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {aiPlan.warnings.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTravelAssistant;
