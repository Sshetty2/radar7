import { Toaster as SonnerToaster } from 'sonner';

export function Toaster () {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        unstyled  : true,
        classNames: {
          toast      : 'glass border border-border/50 rounded-xl p-4 flex items-center gap-3',
          title      : 'glass-text font-semibold text-sm',
          description: 'glass-text-muted text-sm',
          closeButton: 'glass-text hover:bg-secondary/50 dark:hover:bg-white/15 transition-all'
        }
      }}
    />
  );
}
