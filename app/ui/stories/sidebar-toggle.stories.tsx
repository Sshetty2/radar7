import type { Meta, StoryObj } from '@storybook/react';
import { withRedux } from '@/.storybook/decorators';
import { SidebarToggle } from '../components/sidebar-toggle';

const meta: Meta<typeof SidebarToggle> = {
  title     : 'Map/SidebarToggle',
  component : SidebarToggle,
  parameters: { layout: 'centered' },
  tags      : ['autodocs'],
  decorators: [withRedux]
};

export default meta;
type Story = StoryObj<typeof SidebarToggle>;

export const Default: Story = {};
