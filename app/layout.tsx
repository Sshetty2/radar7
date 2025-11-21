import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
import { ErrorDialog } from '@/components/ui/error-dialog';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://radar7.app'),
  title       : 'Radar7',
  description : 'Discover events from Meetup, Eventbrite, LinkedIn Events, and Luma with superior map-based interface and intelligent filtering.'
};

// Disable auto-zoom on mobile Safari
export const viewport = { maximumScale: 1 };

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

const SW_SCRIPT = `\
(function() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(
        function(registration) {
          console.log('Service Worker registered with scope:', registration.scope);
        },
        function(error) {
          console.log('Service Worker registration failed:', error);
        }
      );
    });
  }
})();`;

export default function RootLayout ({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"

      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_COLOR_SCRIPT }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: SW_SCRIPT }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster
            position="bottom-right"
            toastOptions={{
              unstyled  : true,
              classNames: {
                toast      : 'glass border border-border/50 rounded-xl p-4 flex items-center gap-3',
                title      : 'glass-text font-semibold text-sm',
                description: 'glass-text-muted text-sm',
                closeButton: 'glass-text hover:bg-secondary/50 dark:hover:bg-white/15 transition-all'
              }
            }}
          />
          <ErrorDialog />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
