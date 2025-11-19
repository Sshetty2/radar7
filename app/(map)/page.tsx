'use client';

import dynamic from 'next/dynamic';

// Dynamically import MapContainer to avoid SSR issues with Mapbox GL
const MapContainer = dynamic(
  () => import('@/components/map/map-container').then(mod => mod.MapContainer),
  { ssr: false }
);

export default function MapPage () {
  return (
    <main className="h-screen w-full overflow-hidden">
      <MapContainer />
    </main>
  );
}
