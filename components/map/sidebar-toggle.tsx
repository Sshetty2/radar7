'use client';

import { IconButton } from '@/components/ui/icon-button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SidebarToggle () {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <div
      className={cn(
        'absolute right-4 top-1/2 z-[60] -translate-y-1/2 transition-[right] duration-300',
        sidebarOpen && 'sm:right-[calc(15rem+6.5rem)] md:right-[calc(17rem+6.5rem)] lg:right-[calc(20rem+6.5rem)] xl:right-[calc(24rem+6.5rem)] 2xl:right-[calc(26rem+6.5rem)]'
      )}
    >
      <IconButton
        onClick={() => dispatch(toggleSidebar())}
        aria-pressed={sidebarOpen}
        aria-label={sidebarOpen ? 'Close event sidebar' : 'Open event sidebar'}
      >
        {sidebarOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </IconButton>
    </div>
  );
}
