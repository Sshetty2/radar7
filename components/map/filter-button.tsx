'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { toggleFilterModal } from '@/lib/store/slices/uiSlice';
import { selectActiveFilterCount } from '@/lib/store/slices/filtersSlice';
import { SlidersHorizontal } from 'lucide-react';

export function FilterButton () {
  const dispatch = useAppDispatch();
  const activeFilterCount = useAppSelector(selectActiveFilterCount);

  return (
    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 md:hidden">
      <Button
        onClick={() => dispatch(toggleFilterModal())}
        size="lg"
        className="relative h-12 gap-2 rounded-full bg-primary/90 shadow-lg backdrop-blur-sm hover:bg-primary"
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <Badge
            variant="secondary"
            className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
