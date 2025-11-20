import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width : 32,
  height: 32
};

export const contentType = 'image/png';

// Icon component
export default function Icon () {
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
          width="32"
          height="32"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 6 5 L 6 28 M 6 5 L 12 5 C 14 5 15 6 15 8 C 15 10 14 11 12 11 L 6 11 M 11 11 L 16 17"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Green glowing 7 - more spacing */}
          <path
            d="M 19 5 L 27 5 L 21 28"
            stroke="#10b981"
            strokeWidth="1.5"
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
