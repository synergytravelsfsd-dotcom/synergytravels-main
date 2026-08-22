/**
 * Placeholder slot for an official KAYAK Affiliate Network widget / search box.
 * Insert provider-supplied markup/script here only after approval — no scraping.
 */
import React from 'react';
import { getKayakAffiliateId } from '../../travel/config';

type Props = {
  className?: string;
};

const KayakWidgetSlot: React.FC<Props> = ({ className = '' }) => {
  const affiliateId = getKayakAffiliateId();

  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center ${className}`}
      data-kayak-widget-slot
      data-affiliate-id={affiliateId || undefined}
    >
      <p className="text-sm font-semibold text-slate-800">KAYAK widget slot</p>
      <p className="mt-2 text-xs text-slate-500 max-w-md mx-auto">
        {affiliateId
          ? `Affiliate ID configured (${affiliateId}). Paste the official KAYAK widget script here when approved.`
          : 'Set VITE_KAYAK_AFFILIATE_ID when your KAYAK Affiliate Network account is approved, then insert the official widget.'}
      </p>
    </div>
  );
};

export default KayakWidgetSlot;
