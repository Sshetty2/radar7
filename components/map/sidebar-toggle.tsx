'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleSidebar, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { ChevronLeft } from 'lucide-react';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

export function SidebarToggle () {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  // Only show toggle when sidebar is closed
  if (sidebarOpen) {
    return null;
  }

  return (
    <div className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
      <Button
        onClick={() => dispatch(toggleSidebar())}
        size="icon"
        variant="outline"
        className="h-12 w-12 rounded-2xl border-[rgba(35,34,34,0.59)] text-white hover:bg-white/10"
        style={GLASS_EFFECT_STYLE}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
    </div>
  );
}
