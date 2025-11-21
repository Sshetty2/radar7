import * as React from 'react';
import { Button } from '@/app/ui/components/base/button';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      className={cn(
        'glass h-11 w-11 rounded-xl glass-text glass-icon-btn',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);

IconButton.displayName = 'IconButton';

export { IconButton };
