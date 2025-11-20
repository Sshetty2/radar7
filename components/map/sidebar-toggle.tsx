'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';
import { cn } from '@/lib/utils';

export function SidebarToggle () {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <div
      className={cn(
        'absolute right-4 top-1/2 z-[60] -translate-y-1/2 transition-[right] duration-300',
        sidebarOpen && 'md:right-[calc(26rem+6.5rem)]'
      )}
    >
      <Button
        onClick={() => dispatch(toggleSidebar())}
        size="icon"
        variant="outline"
        aria-pressed={sidebarOpen}
        aria-label={sidebarOpen ? 'Close event sidebar' : 'Open event sidebar'}
        className="h-11 w-11 rounded-xl border-[rgba(35,34,34,0.59)] text-white hover:bg-white/10"
        style={GLASS_EFFECT_STYLE}
      >
        {sidebarOpen ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
