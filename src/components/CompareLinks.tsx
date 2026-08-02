import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { CompareLink } from '../constants/integrations';

interface CompareLinksProps {
  links: CompareLink[];
  title?: string;
  className?: string;
  compact?: boolean;
}

const CompareLinks: React.FC<CompareLinksProps> = ({
  links,
  title = 'Compare live prices',
  className = '',
  compact = false,
}) => {
  if (!links.length) return null;

  return (
    <div className={`${className}`}>
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1">
          <ExternalLink className="h-3 w-3" />
          {title}
        </p>
      )}
      <div className={`flex flex-wrap gap-2 ${compact ? 'justify-center' : ''}`}>
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${link.accent}`}
            aria-label={`Open ${link.label} in a new tab`}
          >
            <span>{link.label}</span>
            <ExternalLink className="h-3 w-3 opacity-70" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompareLinks;
