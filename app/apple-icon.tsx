import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width : 180,
  height: 180
};

export const contentType = 'image/png';

// Apple Icon component
export default function AppleIcon () {
  return new ImageResponse(
    (
      <div
        style={{
          width          : '100%',
          height         : '100%',
          display        : 'flex',
          alignItems     : 'center',
          justifyContent : 'center',
          backgroundColor: '#000000'
        }}
      >
        {/* Thin R with extended left leg */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="green"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">
              <stop
                offset="0%"
                stopColor="#10b981" />
              <stop
                offset="100%"
                stopColor="#34d399" />
            </linearGradient>
          </defs>

          {/* Background for contrast */}
          <path
            d="M 12 10 L 12 55 M 12 10 L 24 10 C 28 10 30 12 30 16 C 30 20 28 22 24 22 L 12 22 M 22 22 L 32 35"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          {/* Main R */}
          <path
            d="M 12 10 L 12 55 M 12 10 L 24 10 C 28 10 30 12 30 16 C 30 20 28 22 24 22 L 12 22 M 22 22 L 32 35"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Green glowing 7 background - more spacing */}
          <path
            d="M 38 10 L 53 10 L 41 55"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.4"
          />
          {/* Main 7 */}
          <path
            d="M 38 10 L 53 10 L 41 55"
            stroke="url(#green)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
