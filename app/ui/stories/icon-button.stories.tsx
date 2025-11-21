import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '../components/icon-button';
import { ChevronLeft, ChevronRight, User, Settings, Plus, X, Menu, Sun, Moon } from 'lucide-react';

const meta: Meta<typeof IconButton> = {
  title     : 'UI/IconButton',
  component : IconButton,
  parameters: { layout: 'centered' },
  tags      : ['autodocs']
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    children    : <User className="h-5 w-5" />,
    'aria-label': 'User profile'
  }
};

export const ChevronLeftIcon: Story = {
  args: {
    children    : <ChevronLeft className="h-5 w-5" />,
    'aria-label': 'Previous'
  }
};

export const ChevronRightIcon: Story = {
  args: {
    children    : <ChevronRight className="h-5 w-5" />,
    'aria-label': 'Next'
  }
};

export const PlusIcon: Story = {
  args: {
    children    : <Plus className="h-5 w-5" />,
    'aria-label': 'Add'
  }
};

export const SettingsIcon: Story = {
  args: {
    children    : <Settings className="h-5 w-5" />,
    'aria-label': 'Settings'
  }
};

export const CloseIcon: Story = {
  args: {
    children    : <X className="h-5 w-5" />,
    'aria-label': 'Close'
  }
};

export const MenuIcon: Story = {
  args: {
    children    : <Menu className="h-5 w-5" />,
    'aria-label': 'Menu'
  }
};

export const AllIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <IconButton aria-label="User">
        <User className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Settings">
        <Settings className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Add">
        <Plus className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Close">
        <X className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Previous">
        <ChevronLeft className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Next">
        <ChevronRight className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Sun">
        <Sun className="h-5 w-5" />
      </IconButton>
      <IconButton aria-label="Moon">
        <Moon className="h-5 w-5" />
      </IconButton>
    </div>
  )
};
