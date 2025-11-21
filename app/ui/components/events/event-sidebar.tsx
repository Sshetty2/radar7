'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/app/ui/components/sheet';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSidebarOpen, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { selectActiveFilterCount } from '@/lib/store/slices/filtersSlice';
import type { Event } from '@/lib/db/crawler-schema';
import { EventCard } from './event-card';
import { Badge } from '@/app/ui/components/badge';

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
        className="glass z-[70] w-full sm:bottom-6 sm:right-20 sm:top-6 sm:h-auto sm:max-h-[calc(100vh-3rem)] sm:w-[15rem] sm:max-w-[15rem] md:w-[17rem] md:max-w-[17rem] lg:w-[20rem] lg:max-w-[20rem] xl:w-[24rem] xl:max-w-[24rem] 2xl:w-[26rem] 2xl:max-w-[26rem] sm:rounded-[12px] sm:shadow-2xl"
      >
        <SheetHeader>
          <SheetTitle className="glass-text">Events in New York</SheetTitle>
          <SheetDescription className="flex items-center gap-2 text-muted-foreground">
            <span>{events.length} events found</span>
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="border-border/50 bg-secondary/50 text-xs">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        <div
          className="mt-6 space-y-3 overflow-auto pr-2 sm:max-h-[calc(100vh-14rem)]"
        >
          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">
                  No events found matching your filters.
              </p>
              <p className="mt-2 text-sm text-muted-foreground/70">
                  Try adjusting your search criteria or filters.
              </p>
            </div>
          ) : events.map(event => (

            <EventCard
              event={event}
              key={event.id} />
          ))
          }
        </div>
      </SheetContent>
    </Sheet>
  );
}
