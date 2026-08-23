import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppLink } from '../constants/contact';
import { trackEvent } from '../lib/analytics';

const WhatsAppFab: React.FC = () => {
  return (
    <a
      href={getWhatsAppLink('Hi Synergy Travels, I would like help with my trip.')}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('whatsapp_click', { context: 'fab' })}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white pl-4 pr-5 py-3.5 shadow-lg tap-target safe-pb"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-semibold hidden xs:inline sm:inline">WhatsApp Us</span>
    </a>
  );
};

export default WhatsAppFab;
