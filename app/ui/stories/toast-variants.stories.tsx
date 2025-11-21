import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/base/button';
import { Toaster } from '../components/toaster';
import { toastError, toastWarning, toastInfo, toastSuccess, toast } from '../util/toast-variants';

const meta: Meta = {
  title     : 'UI/Toast Variants',
  parameters: { layout: 'fullscreen' },
  tags      : ['autodocs'],
  decorators: [
    Story => (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Toaster />
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast('This is a default notification')}
    >
      Show Default Toast
    </Button>
  )
};

export const Error: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toastError('Failed to load data. Please try again.')}
    >
      Show Error Toast
    </Button>
  )
};

export const Warning: Story = {
  render: () => (
    <Button
      onClick={() => toastWarning('Your session will expire in 5 minutes')}
      className="bg-amber-600 hover:bg-amber-700"
    >
      Show Warning Toast
    </Button>
  )
};

export const Info: Story = {
  render: () => (
    <Button
      onClick={() => toastInfo('No place details found at this location')}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Show Info Toast
    </Button>
  )
};

export const Success: Story = {
  render: () => (
    <Button
      onClick={() => toastSuccess('Changes saved successfully')}
      className="bg-green-600 hover:bg-green-700"
    >
      Show Success Toast
    </Button>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Click buttons to show toasts</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => toast('Default notification')}
        >
          Default
        </Button>
        <Button
          variant="destructive"
          onClick={() => toastError('Error notification')}
        >
          Error
        </Button>
        <Button
          onClick={() => toastWarning('Warning notification')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Warning
        </Button>
        <Button
          onClick={() => toastInfo('Info notification')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Info
        </Button>
        <Button
          onClick={() => toastSuccess('Success notification')}
          className="bg-green-600 hover:bg-green-700"
        >
          Success
        </Button>
      </div>
    </div>
  )
};
