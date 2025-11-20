'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSidebarOpen, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { selectActiveFilterCount } from '@/lib/store/slices/filtersSlice';
import type { Event } from '@/lib/db/crawler-schema';
import { EventCard } from './event-card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

interface EventSidebarProps {
  events: Partial<Event>[];
}

export function EventSidebar ({ events }: EventSidebarProps) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const activeFilterCount = useAppSelector(selectActiveFilterCount);

  return (
    <Sheet
      modal={false}
      open={sidebarOpen}
      onOpenChange={open => dispatch(setSidebarOpen(open))}>
      <SheetContent
        side="right"
        hideOverlay
        onInteractOutside={event => event.preventDefault()}
        className="w-full border-[rgba(35,34,34,0.59)] text-white sm:bottom-6 sm:right-20 sm:top-6 sm:h-auto sm:max-h-[calc(100vh-3rem)] sm:w-[26rem] sm:max-w-[26rem] sm:rounded-[12px] sm:border-white/20 sm:shadow-2xl"
        style={GLASS_EFFECT_STYLE}
      >
        <SheetHeader>
          <SheetTitle className="text-white">Events in New York</SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-gray-400">
            <span>{events.length} events found</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="border-white/20 bg-white/10 text-xs text-white">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="mt-6 h-[calc(100vh-8rem)]">
          <div className="space-y-4 pr-4">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-400">
                  No events found matching your filters.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            ) : events.map(event => (
              <EventCard
                key={event.id}
                event={event} />
            ))
            }
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
