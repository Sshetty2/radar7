import type { Preview } from '@storybook/react';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls   : { expanded: true },
    backgrounds: {
      default: 'dark',
      values : [
        {
          name : 'dark',
          value: '#0f0f0f'
        },
        {
          name : 'light',
          value: '#ffffff'
        }
      ]
    },
    viewport: {
      viewports: {
        mobile: {
          name  : 'Mobile',
          styles: {
            width : '375px',
            height: '667px'
          }
        },
        tablet: {
          name  : 'Tablet',
          styles: {
            width : '768px',
            height: '1024px'
          }
        },
        desktop: {
          name  : 'Desktop',
          styles: {
            width : '1920px',
            height: '1080px'
          }
        }
      }
    }
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value !== '#ffffff';

      useEffect(() => {
        const html = document.documentElement;

        if (isDark) {
          html.classList.add('dark');
        } else {
          html.classList.remove('dark');
        }
      }, [isDark]);

      return (
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme={isDark ? 'dark' : 'light'}>
          <div className="p-8">
            <Story />
          </div>
        </ThemeProvider>
      );
    }
  ]
};

export default preview;
