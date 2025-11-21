import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/base/button';
import { withRedux } from '@/.storybook/decorators';
import { store } from '@/lib/store/store';
import { showErrorDialog } from '@/lib/store/slices/uiSlice';
import { ErrorDialog } from '../components/error-dialog';

const meta: Meta = {
  title     : 'UI/Error Dialog',
  component : ErrorDialog,
  parameters: { layout: 'centered' },
  tags      : ['autodocs'],
  decorators: [
    withRedux,
    Story => (
      <>
        <Story />
        <ErrorDialog />
      </>
    )
  ]
};

export default meta;
type Story = StoryObj;

export const CriticalError: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => {
        store.dispatch(
          showErrorDialog({
            title      : 'Critical Error',
            description: 'Failed to load essential data. Please refresh the page to continue.',
            actionLabel: 'Refresh Page',
            onAction   : () => {
              console.log('Refresh page action triggered');

              // In real app: window.location.reload()
            }
          })
        );
      }}
    >
      Show Critical Error
    </Button>
  )
};

export const AuthenticationError: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => {
        store.dispatch(
          showErrorDialog({
            title      : 'Authentication Failed',
            description: 'Your session has expired. Please sign in again to continue.',
            actionLabel: 'Sign In',
            onAction   : () => {
              console.log('Sign in action triggered');

              // In real app: router.push('/login')
            }
          })
        );
      }}
    >
      Show Auth Error
    </Button>
  )
};

export const MissingAPIKey: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => {
        store.dispatch(
          showErrorDialog({
            title      : 'Configuration Error',
            description: 'Required API key is missing. Please check your environment configuration.',
            actionLabel: 'Contact Support',
            onAction   : () => {
              console.log('Contact support action triggered');
            }
          })
        );
      }}
    >
      Show Config Error
    </Button>
  )
};

export const GenericError: Story = {
  render: () => (
    <Button
      variant="destructive"
      onClick={() => {
        store.dispatch(
          showErrorDialog({
            title      : 'Error',
            description: 'An unexpected error occurred. Please try again.',
            actionLabel: 'OK'
          })
        );
      }}
    >
      Show Generic Error
    </Button>
  )
};
