import { toast as sonnerToast, ExternalToast } from 'sonner';

/**
 * Toast notification helpers with glass morphism styling
 * Each severity level uses corresponding glass variant classes
 */

const defaultOptions: ExternalToast = {
  duration   : 5000,
  closeButton: true
};

/**
 * Display an error toast (red glass background)
 */
export function toastError (message: string, options?: ExternalToast) {
  return sonnerToast.error(message, {
    ...defaultOptions,
    ...options,
    unstyled  : true,
    classNames: {
      toast      : 'glass-error rounded-xl p-4 flex items-center gap-3',
      title      : 'glass-text font-semibold text-sm',
      description: 'glass-text-muted text-sm',
      closeButton: 'glass-text hover:bg-black/10 dark:hover:bg-white/10 transition-all'
    }
  });
}

/**
 * Display a warning toast (amber glass background)
 */
export function toastWarning (message: string, options?: ExternalToast) {
  return sonnerToast.warning(message, {
    ...defaultOptions,
    ...options,
    unstyled  : true,
    classNames: {
      toast      : 'glass-warning rounded-xl p-4 flex items-center gap-3',
      title      : 'glass-text font-semibold text-sm',
      description: 'glass-text-muted text-sm',
      closeButton: 'glass-text hover:bg-black/10 dark:hover:bg-white/10 transition-all'
    }
  });
}

/**
 * Display an info toast (blue glass background)
 */
export function toastInfo (message: string, options?: ExternalToast) {
  return sonnerToast.info(message, {
    ...defaultOptions,
    ...options,
    unstyled  : true,
    classNames: {
      toast      : 'glass-info rounded-xl p-4 flex items-center gap-3',
      title      : 'glass-text font-semibold text-sm',
      description: 'glass-text-muted text-sm',
      closeButton: 'glass-text hover:bg-black/10 dark:hover:bg-white/10 transition-all'
    }
  });
}

/**
 * Display a success toast (green glass background)
 */
export function toastSuccess (message: string, options?: ExternalToast) {
  return sonnerToast.success(message, {
    ...defaultOptions,
    ...options,
    unstyled  : true,
    classNames: {
      toast      : 'glass-success rounded-xl p-4 flex items-center gap-3',
      title      : 'glass-text font-semibold text-sm',
      description: 'glass-text-muted text-sm',
      closeButton: 'glass-text hover:bg-black/10 dark:hover:bg-white/10 transition-all'
    }
  });
}

/**
 * Display a default toast (standard glass background)
 */
export function toast (message: string, options?: ExternalToast) {
  return sonnerToast(message, {
    ...defaultOptions,
    ...options,
    unstyled  : true,
    classNames: {
      toast      : 'glass rounded-xl p-4 flex items-center gap-3',
      title      : 'glass-text font-semibold text-sm',
      description: 'glass-text-muted text-sm',
      closeButton: 'glass-text hover:bg-secondary/50 dark:hover:bg-white/15 transition-all'
    }
  });
}
