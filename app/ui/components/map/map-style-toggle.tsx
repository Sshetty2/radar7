'use client';

import { Button } from '@/app/ui/components/base/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleMapStyle, selectMapStyle } from '@/lib/store/slices/uiSlice';
import { Sun, Moon } from 'lucide-react';

export function MapStyleToggle () {
  const dispatch = useAppDispatch();
  const mapStyle = useAppSelector(selectMapStyle);

  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <div
        className="glass flex items-center gap-2 rounded-full p-1">
        <Button
          size="sm"
          variant={mapStyle === 'day' ? 'default' : 'ghost'}
          className={`h-8 cursor-pointer rounded-full px-3 transition-all duration-200 ${
            mapStyle === 'day' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105' : 'glass-text hover:bg-secondary/50 dark:hover:bg-white/15 hover:scale-105'
          }`}
          onClick={() => dispatch(toggleMapStyle())}
        >
          <Sun className="mr-1.5 h-4 w-4 transition-all duration-200" />
          Day
        </Button>
        <Button
          size="sm"
          variant={mapStyle === 'night' ? 'default' : 'ghost'}
          className={`h-8 cursor-pointer rounded-full px-3 transition-all duration-200 ${
            mapStyle === 'night' ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105' : 'glass-text hover:bg-secondary/50 dark:hover:bg-white/15 hover:scale-105'
          }`}
          onClick={() => dispatch(toggleMapStyle())}
        >
          <Moon className="mr-1.5 h-4 w-4 transition-all duration-200" />
          Night
        </Button>
      </div>
    </div>
  );
}
