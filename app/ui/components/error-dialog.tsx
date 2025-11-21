'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/app/ui/components/base/alert-dialog';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeErrorDialog, selectErrorDialog } from '@/lib/store/slices/uiSlice';

/**
 * Global error dialog for critical errors
 * Managed via Redux UI state
 *
 * Usage:
 * dispatch(showErrorDialog({
 *   title: 'Critical Error',
 *   description: 'Failed to load essential data.',
 *   actionLabel: 'Refresh Page',
 *   onAction: () => window.location.reload()
 * }));
 */
export function ErrorDialog () {
  const dispatch = useAppDispatch();
  const errorDialog = useAppSelector(selectErrorDialog);

  const handleAction = () => {
    if (errorDialog.onAction) {
      errorDialog.onAction();
    }
    dispatch(closeErrorDialog());
  };

  return (
    <AlertDialog
      open={errorDialog.open}
      onOpenChange={() => dispatch(closeErrorDialog())}>
      <AlertDialogContent className="glass-error border-border/50 !bg-transparent">
        <AlertDialogHeader>
          <AlertDialogTitle className="glass-text">
            {errorDialog.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="glass-text-muted">
            {errorDialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAction}>
            {errorDialog.actionLabel || 'OK'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
