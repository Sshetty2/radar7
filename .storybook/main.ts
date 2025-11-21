import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../app/ui/**/*.stories.@(ts|tsx)'],
  addons : [
    '@storybook/addon-a11y'
  ],
  framework: {
    name   : '@storybook/nextjs',
    options: {}
  },
  staticDirs: ['../public'],
  docs      : {}
};

export default config;
