import { ReduxProvider } from '@/lib/store/provider';
import { auth } from '../(auth)/auth';

export default async function MapLayout ({ children }: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <ReduxProvider>{children}</ReduxProvider>;
}
