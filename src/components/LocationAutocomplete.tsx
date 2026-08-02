import React, { useEffect, useId, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import {
  formatAirportLabel,
  resolveAirportInput,
  searchAirports,
  type Airport,
} from '../data/airports';

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Auto-resolve best match when the field blurs */
  resolveOnBlur?: boolean;
  inputClassName?: string;
};

const LocationAutocomplete: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder = 'City or airport code',
  className = '',
  resolveOnBlur = true,
  inputClassName = '',
}) => {
  const listId = useId();
  const rootRef = useRef<HTMLLabelElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const suggestions = value.trim().length >= 1 ? searchAirports(value, 12) : [];

  useEffect(() => {
    setHighlight(0);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (airport: Airport) => {
    onChange(formatAirportLabel(airport));
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && open) {
      e.preventDefault();
      pick(suggestions[highlight] || suggestions[0]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onBlur = () => {
    if (!resolveOnBlur || !value.trim()) return;
    // Delay so click-to-select still works
    window.setTimeout(() => {
      if (rootRef.current?.contains(document.activeElement)) return;
      setOpen(false);
      if (/\([A-Z0-9]{3,4}\)$/i.test(value.trim())) return;
      const match = resolveAirportInput(value);
      if (match) onChange(formatAirportLabel(match));
    }, 120);
  };

  return (
    <label ref={rootRef} className={`block relative ${className}`}>
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <div className="relative mt-1">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          className={`w-full rounded-xl border border-slate-200 pl-9 pr-3 py-3 sm:py-2.5 text-base sm:text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${inputClassName}`}
        />
      </div>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-56 sm:max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          {suggestions.map((airport, index) => (
            <li key={airport.code}>
              <button
                type="button"
                role="option"
                aria-selected={index === highlight}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(airport)}
                onMouseEnter={() => setHighlight(index)}
                className={`w-full text-left px-3 py-2.5 text-sm flex items-start gap-3 ${
                  index === highlight ? 'bg-orange-50' : 'hover:bg-slate-50'
                }`}
              >
                <span className="shrink-0 mt-0.5 rounded-md bg-slate-900 text-white text-[11px] font-bold px-1.5 py-0.5">
                  {airport.code}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-slate-900 truncate">
                    {airport.city}
                    <span className="font-normal text-slate-500"> · {airport.country}</span>
                  </span>
                  <span className="block text-xs text-slate-500 truncate">{airport.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
};

export default LocationAutocomplete;
