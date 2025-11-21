import { Radar7Logo } from '@/app/ui/logo/radar7-logo';

export default function LogoPreviewPage () {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Radar7 Logo Mockups - Option B</h1>

      <div className="space-y-12">
        {/* Default Full Logo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Default (Full Logo)</h2>
          <p className="text-muted-foreground">
            Use in header, landing pages, and prominent placements
          </p>
          <div className="p-8 rounded-lg border bg-card">
            <Radar7Logo
              variant="default"
              className="w-full max-w-md" />
          </div>
          <div className="p-8 rounded-lg border bg-card">
            <div className="relative h-64 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-122.4,37.8,12,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded">
              <div className="absolute top-4 left-4">
                <Radar7Logo
                  variant="default"
                  className="w-64" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Preview over map background</p>
          </div>
        </section>

        {/* Compact Logo */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Compact</h2>
          <p className="text-muted-foreground">
            Use in navigation bars, sidebars, and space-constrained areas
          </p>
          <div className="p-8 rounded-lg border bg-card">
            <Radar7Logo
              variant="compact"
              className="w-full max-w-xs" />
          </div>
          <div className="p-8 rounded-lg border bg-card">
            <div className="relative h-64 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-122.4,37.8,12,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded">
              <div className="absolute top-4 left-4">
                <Radar7Logo
                  variant="compact"
                  className="w-48" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Preview over dark map</p>
          </div>
        </section>

        {/* Icon Only */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Icon Only</h2>
          <p className="text-muted-foreground">
            Use as favicon, app icon, or when space is very limited
          </p>
          <div className="flex gap-4 items-start">
            <div className="p-8 rounded-lg border bg-card">
              <Radar7Logo
                variant="icon-only"
                className="w-20 h-20" />
            </div>
            <div className="p-8 rounded-lg border bg-card">
              <Radar7Logo
                variant="icon-only"
                className="w-16 h-16" />
            </div>
            <div className="p-8 rounded-lg border bg-card">
              <Radar7Logo
                variant="icon-only"
                className="w-12 h-12" />
            </div>
          </div>
          <div className="p-8 rounded-lg border bg-card">
            <div className="relative h-64 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-122.4,37.8,12,0/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center rounded">
              <div className="absolute top-4 right-4">
                <Radar7Logo
                  variant="icon-only"
                  className="w-16 h-16" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Preview over satellite map</p>
          </div>
        </section>

        {/* Size Variations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Size Variations (Compact)</h2>
          <div className="flex flex-wrap gap-8 items-center p-8 rounded-lg border bg-card">
            <Radar7Logo
              variant="compact"
              className="w-48" />
            <Radar7Logo
              variant="compact"
              className="w-40" />
            <Radar7Logo
              variant="compact"
              className="w-32" />
            <Radar7Logo
              variant="compact"
              className="w-24" />
          </div>
        </section>

        {/* Theme Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Theme Modes</h2>
          <p className="text-muted-foreground">
            Logo automatically adapts to light/dark theme
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-8 rounded-lg border bg-white">
              <Radar7Logo
                variant="default"
                className="w-64" />
              <p className="text-sm text-gray-600 mt-2">Light mode</p>
            </div>
            <div className="p-8 rounded-lg border bg-gray-900">
              <Radar7Logo
                variant="default"
                className="w-64" />
              <p className="text-sm text-gray-400 mt-2">Dark mode</p>
            </div>
          </div>
        </section>

        {/* Design Notes */}
        <section className="space-y-4 p-6 rounded-lg border bg-muted/50">
          <h2 className="text-2xl font-semibold">Design Notes</h2>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li><strong>Extended R leg:</strong> Points diagonally like a radar pointer/arrow, with arrow tip for emphasis</li>
            <li><strong>Stylized 7:</strong> Blue-to-purple gradient suggests scanning/signal waves</li>
            <li><strong>Radar wave accents:</strong> Subtle curved lines on the 7 reinforce the radar theme</li>
            <li><strong>No background:</strong> Transparent design works over any surface</li>
            <li><strong>Stroke outline:</strong> Subtle border ensures visibility over maps</li>
            <li><strong>Glow effect:</strong> Soft SVG filter adds depth without being heavy</li>
            <li><strong>Theme-aware:</strong> Colors automatically adjust for light/dark mode</li>
            <li><strong>Scalable:</strong> Vector SVG scales perfectly at any size</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
