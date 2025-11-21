import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { toastError, toastWarning, toastInfo, toastSuccess, toast } from './toast-variants';
import { Toaster } from 'sonner';

const meta: Meta = {
  title     : 'UI/Toast Variants',
  parameters: { layout: 'centered' },
  tags      : ['autodocs'],
  decorators: [
    Story => (
      <>
        <Toaster position="bottom-right" />
        <Story />
      </>
    )
  ]
};

export default meta;
type Story = StoryObj;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Click buttons to show toasts</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="destructive"
          onClick={() => toastError('This is an error notification')}
        >
          Show Error Toast
        </Button>
        <Button
          onClick={() => toastWarning('This is a warning notification')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          Show Warning Toast
        </Button>
        <Button
          onClick={() => toastInfo('This is an info notification')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show Info Toast
        </Button>
        <Button
          onClick={() => toastSuccess('This is a success notification')}
          className="bg-green-600 hover:bg-green-700"
        >
          Show Success Toast
        </Button>
        <Button
          variant="outline"
          onClick={() => toast('This is a default notification')}
        >
          Show Default Toast
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
        Toasts appear in the bottom-right corner with glass morphism styling and auto-dismiss after 5 seconds.
      </p>
    </div>
  )
};

export const ErrorToast: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toastError('Failed to load data. Please try again.')}
    >
      Trigger Error Toast
    </Button>
  )
};

export const WarningToast: Story = {
  render: () => (
    <Button
      onClick={() => toastWarning('Your session will expire in 5 minutes')}
      className="bg-amber-600 hover:bg-amber-700"
    >
      Trigger Warning Toast
    </Button>
  )
};

export const InfoToast: Story = {
  render: () => (
    <Button
      onClick={() => toastInfo('No place details found at this location')}
      className="bg-blue-600 hover:bg-blue-700"
    >
      Trigger Info Toast
    </Button>
  )
};

export const SuccessToast: Story = {
  render: () => (
    <Button
      onClick={() => toastSuccess('Changes saved successfully')}
      className="bg-green-600 hover:bg-green-700"
    >
      Trigger Success Toast
    </Button>
  )
};
