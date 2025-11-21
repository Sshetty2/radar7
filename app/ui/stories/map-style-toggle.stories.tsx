import type { Meta, StoryObj } from '@storybook/react';
import { withRedux } from '@/.storybook/decorators';
import { MapStyleToggle } from '../components/map/map-style-toggle';

const meta: Meta<typeof MapStyleToggle> = {
  title     : 'Map/MapStyleToggle',
  component : MapStyleToggle,
  parameters: { layout: 'centered' },
  tags      : ['autodocs'],
  decorators: [withRedux]
};

export default meta;
type Story = StoryObj<typeof MapStyleToggle>;

export const Default: Story = {};
