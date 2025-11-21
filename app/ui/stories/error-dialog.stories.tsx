/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '@/lib/store/store';
import { showErrorDialog } from '@/lib/store/slices/uiSlice';
import { ErrorDialog } from '../components/error-dialog';

const meta: Meta = {
  title     : 'UI/Error Dialog',
  component : ErrorDialog,
  parameters: { layout: 'fullscreen' },
  tags      : ['autodocs'],
  decorators: [
    Story => (
      <Provider store={store}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
          <Story />
          <ErrorDialog />
        </div>
      </Provider>
    )
  ]
};

export default meta;
type Story = StoryObj;

export const CriticalError: Story = {
  render: () => {
    useEffect(() => {
      store.dispatch(
        showErrorDialog({
          title      : 'Critical Error',
          description: 'Failed to load essential data. Please refresh the page to continue.',
          actionLabel: 'Refresh Page',
          onAction   : () => {
            console.log('Refresh page action triggered');
          }
        })
      );
    }, []);

    return <div className="text-white">Critical Error Dialog</div>;
  }
};

export const AuthenticationError: Story = {
  render: () => {
    useEffect(() => {
      store.dispatch(
        showErrorDialog({
          title      : 'Authentication Failed',
          description: 'Your session has expired. Please sign in again to continue.',
          actionLabel: 'Sign In',
          onAction   : () => {
            console.log('Sign in action triggered');
          }
        })
      );
    }, []);

    return <div className="text-white">Authentication Error Dialog</div>;
  }
};

export const ConfigurationError: Story = {
  render: () => {
    useEffect(() => {
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
    }, []);

    return <div className="text-white">Configuration Error Dialog</div>;
  }
};

export const GenericError: Story = {
  render: () => {
    useEffect(() => {
      store.dispatch(
        showErrorDialog({
          title      : 'Error',
          description: 'An unexpected error occurred. Please try again.',
          actionLabel: 'OK'
        })
      );
    }, []);

    return <div className="text-white">Generic Error Dialog</div>;
  }
};
