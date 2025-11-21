'use client';

import { useTheme } from 'next-themes';

interface Radar7LogoProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function Radar7Logo ({ variant = 'default', className = '' }: Radar7LogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // White for Radar, green for 7
  const textColor = isDark ? '#ffffff' : '#000000';
  const strokeColor = isDark ? '#000000' : '#ffffff';
  const greenStart = '#10b981'; // emerald-500
  const greenEnd = '#34d399'; // emerald-400

  if (variant === 'icon-only') {
    return (
      <svg
        viewBox="0 0 60 60"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="icon-green"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor={greenStart} />
            <stop
              offset="100%"
              stopColor={greenEnd} />
          </linearGradient>
          <filter id="green-glow">
            <feGaussianBlur
              stdDeviation="2"
              result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Thin R with extended left leg */}
        <g>
          <path
            d="M 12 10 L 12 55 M 12 10 L 24 10 C 28 10 30 12 30 16 C 30 20 28 22 24 22 L 12 22 M 22 22 L 32 35"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 12 10 L 12 55 M 12 10 L 24 10 C 28 10 30 12 30 16 C 30 20 28 22 24 22 L 12 22 M 22 22 L 32 35"
            stroke={textColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Green glowing 7 - more spacing */}
        <g filter="url(#green-glow)">
          <path
            d="M 38 10 L 53 10 L 41 55"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 38 10 L 53 10 L 41 55"
            stroke="url(#icon-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <svg
        viewBox="0 0 98 50"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="compact-green"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            <stop
              offset="0%"
              stopColor={greenStart} />
            <stop
              offset="100%"
              stopColor={greenEnd} />
          </linearGradient>
          <filter id="compact-green-glow">
            <feGaussianBlur
              stdDeviation="1.5"
              result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Thin R with extended left leg */}
        <g>
          <path
            d="M 8 8 L 8 45 M 8 8 L 20 8 C 24 8 26 10 26 14 C 26 18 24 20 20 20 L 8 20 M 18 20 L 28 33"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 8 8 L 8 45 M 8 8 L 20 8 C 24 8 26 10 26 14 C 26 18 24 20 20 20 L 8 20 M 18 20 L 28 33"
            stroke={textColor}
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Text: adar - very close to R */}
        <text
          x="25"
          y="28"
          fontFamily="sans-serif"
          fontSize="24"
          fontWeight="500"
          fill={textColor}
        >
          <tspan
            stroke={strokeColor}
            strokeWidth="0.5"
            opacity="0.35"
            paintOrder="stroke">adar</tspan>
        </text>
        <text
          x="25"
          y="28"
          fontFamily="sans-serif"
          fontSize="24"
          fontWeight="500"
          fill={textColor}
        >
          adar
        </text>

        {/* Green glowing 7 - very close to text */}
        <g filter="url(#compact-green-glow)">
          <path
            d="M 74 8 L 90 8 L 78 45"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 74 8 L 90 8 L 78 45"
            stroke="url(#compact-green)"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    );
  }

  // Default full logo
  return (
    <svg
      viewBox="0 0 132 60"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient
          id="default-green"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%">
          <stop
            offset="0%"
            stopColor={greenStart} />
          <stop
            offset="100%"
            stopColor={greenEnd} />
        </linearGradient>
        <filter id="default-green-glow">
          <feGaussianBlur
            stdDeviation="2"
            result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Thin R with extended left leg */}
      <g>
        <path
          d="M 10 10 L 10 52 M 10 10 L 24 10 C 29 10 32 13 32 18 C 32 23 29 26 24 26 L 10 26 M 22 26 L 34 42"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M 10 10 L 10 52 M 10 10 L 24 10 C 29 10 32 13 32 18 C 32 23 29 26 24 26 L 10 26 M 22 26 L 34 42"
          stroke={textColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Text: adar - very close to R */}
      <text
        x="32"
        y="35"
        fontFamily="sans-serif"
        fontSize="32"
        fontWeight="500"
        fill={textColor}
      >
        <tspan
          stroke={strokeColor}
          strokeWidth="0.6"
          opacity="0.35"
          paintOrder="stroke">adar</tspan>
      </text>
      <text
        x="32"
        y="35"
        fontFamily="sans-serif"
        fontSize="32"
        fontWeight="500"
        fill={textColor}
      >
        adar
      </text>

      {/* Green glowing 7 - very close to text */}
      <g filter="url(#default-green-glow)">
        <path
          d="M 98 10 L 120 10 L 105 52"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M 98 10 L 120 10 L 105 52"
          stroke="url(#default-green)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
