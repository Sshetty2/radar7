'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleMapStyle, selectMapStyle } from '@/lib/store/slices/uiSlice';
import { Sun, Moon } from 'lucide-react';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

export function MapStyleToggle () {
  const dispatch = useAppDispatch();
  const mapStyle = useAppSelector(selectMapStyle);

  return (
    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
      <div
        className="flex items-center gap-2 p-1"
        style={GLASS_EFFECT_STYLE}>
        <Button
          size="sm"
          variant={mapStyle === 'day' ? 'default' : 'ghost'}
          className={`h-8 rounded-full px-3 ${
            mapStyle === 'day' ? 'bg-white text-black hover:bg-white/90' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => dispatch(toggleMapStyle())}
        >
          <Sun className="mr-1.5 h-4 w-4" />
          Day
        </Button>
        <Button
          size="sm"
          variant={mapStyle === 'night' ? 'default' : 'ghost'}
          className={`h-8 rounded-full px-3 ${
            mapStyle === 'night' ? 'bg-white text-black hover:bg-white/90' : 'text-white hover:bg-white/10'
          }`}
          onClick={() => dispatch(toggleMapStyle())}
        >
          <Moon className="mr-1.5 h-4 w-4" />
          Night
        </Button>
      </div>
    </div>
  );
}
