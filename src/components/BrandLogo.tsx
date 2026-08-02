import React from 'react';
import { BRAND_NAME } from '../constants/contact';

type BrandLogoProps = {
  className?: string;
  /** 'full' = icon + wordmark, 'mark' = icon only */
  variant?: 'full' | 'mark';
  /** Prefer light text colors for dark backgrounds */
  tone?: 'default' | 'light';
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = 'h-14 w-auto',
  variant = 'full',
  tone = 'default',
}) => {
  const synergyFill = tone === 'light' ? '#F8EDE8' : '#5C1A1A';
  const tourFill = tone === 'light' ? '#FF8A3D' : '#F97316';

  return (
    <svg
      viewBox={variant === 'mark' ? '0 0 88 88' : '0 0 420 100'}
      className={className}
      role="img"
      aria-label={BRAND_NAME}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="globeShine" x1="18%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#F3D6D0" />
          <stop offset="45%" stopColor="#9A3B3B" />
          <stop offset="100%" stopColor="#4A1212" />
        </linearGradient>
        <linearGradient id="orbitGlow" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
      </defs>

      {/* Mark */}
      <g transform="translate(8,10)">
        <circle cx="36" cy="40" r="30" fill="url(#globeShine)" />
        {/* Continents */}
        <path
          d="M22 28c4-6 12-8 18-5 3 2 5 6 4 10-2 3-6 4-9 3-4-1-6 2-5 6 1 3 4 5 7 5 5 0 9 3 10 8-5 4-13 5-19 2-7-4-11-13-6-29z"
          fill="#3F1010"
          opacity="0.55"
        />
        <path
          d="M48 34c5 1 9 5 10 10 1 6-2 11-7 14-3 2-7 1-9-2-2-3 0-7 3-8 3-1 4-4 2-6-2-2-1-6 1-8z"
          fill="#3F1010"
          opacity="0.45"
        />
        {/* Orbit swoosh */}
        <path
          d="M6 48c14 14 46 18 66-2"
          fill="none"
          stroke="url(#orbitGlow)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M10 56c10 6 28 10 48 4"
          fill="none"
          stroke="#FDBA74"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Plane */}
        <g transform="translate(58,18) rotate(28)">
          <path
            d="M0 8 L22 0 L18 10 L22 14 L14 12 L8 16 Z"
            fill="#F97316"
          />
          <path d="M4 9 L14 5" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>

      {variant === 'full' && (
        <g transform="translate(100,22)">
          <text
            x="0"
            y="28"
            fill={synergyFill}
            fontFamily="Montserrat, Avenir Next, Segoe UI, sans-serif"
            fontSize="34"
            fontWeight="800"
            letterSpacing="2.5"
          >
            SYNERGY
          </text>
          <text
            x="2"
            y="58"
            fill={tourFill}
            fontFamily="Montserrat, Avenir Next, Segoe UI, sans-serif"
            fontSize="18"
            fontWeight="700"
            letterSpacing="3.2"
          >
            TRAVELS &amp; TOUR
          </text>
        </g>
      )}
    </svg>
  );
};

export default BrandLogo;
