import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';

export const withRedux = (Story: React.ComponentType) => (
  <Provider store={store}>
    <Story />
  </Provider>
);
