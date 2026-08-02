import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Mail, ChevronDown } from 'lucide-react';
import { getContactLinks } from '../constants/contact';

interface ContactChoiceProps {
  message: string;
  subject?: string;
  label?: string;
  className?: string;
  buttonClassName?: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'orange' | 'green' | 'gradient' | 'pink' | 'purple';
}

const variantClasses: Record<NonNullable<ContactChoiceProps['variant']>, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  orange: 'bg-orange-600 hover:bg-orange-700 text-white',
  green: 'bg-green-600 hover:bg-green-700 text-white',
  pink: 'bg-pink-600 hover:bg-pink-700 text-white',
  purple: 'bg-purple-600 hover:bg-purple-700 text-white',
  gradient:
    'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white',
};

const ContactChoice: React.FC<ContactChoiceProps> = ({
  message,
  subject = 'Booking Enquiry - Synergy Travels & Tour',
  label = 'Book Now',
  className = '',
  buttonClassName = '',
  fullWidth = false,
  variant = 'primary',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const links = getContactLinks(message, subject);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${fullWidth ? 'w-full' : ''} ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${fullWidth ? 'w-full' : ''} ${buttonClassName || variantClasses[variant]} px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg text-sm lg:text-base inline-flex items-center justify-center space-x-2`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${label} - choose WhatsApp or Email`}
      >
        <span>{label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-xl"
        >
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-gray-500">
            Choose how to contact us
          </p>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            <span>WhatsApp</span>
          </a>
          <a
            href={links.email}
            role="menuitem"
            className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Mail className="h-4 w-4 text-blue-600" />
            <span>Email</span>
          </a>
        </div>
      )}
    </div>
  );
};

export const ContactLinksRow: React.FC<{
  message: string;
  subject?: string;
  className?: string;
}> = ({ message, subject = 'Enquiry - Synergy Travels & Tour', className = '' }) => {
  const links = getContactLinks(message, subject);

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center space-x-1"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="h-3 w-3" />
        <span>WhatsApp</span>
      </a>
      <span className="text-gray-300">|</span>
      <a
        href={links.email}
        className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center space-x-1"
        aria-label="Contact via Email"
      >
        <Mail className="h-3 w-3" />
        <span>Email</span>
      </a>
    </div>
  );
};

export default ContactChoice;
