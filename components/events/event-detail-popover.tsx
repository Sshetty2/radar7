'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSelectedEvent, selectSelectedEventId, selectSidebarOpen } from '@/lib/store/slices/uiSlice';
import { cn } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Navigation,
  User,
  Clock,
  X
} from 'lucide-react';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

export function EventDetailPopover () {
  const dispatch = useAppDispatch();
  const selectedEventId = useAppSelector(selectSelectedEventId);
  const allEvents = useAppSelector(state => state.events.allEvents);
  const sidebarOpen = useAppSelector(selectSidebarOpen);

  const selectedEvent = allEvents.find(e => e.id === selectedEventId);

  const handleClose = () => {
    dispatch(setSelectedEvent(null));
  };

  if (!selectedEvent) {
    return null;
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
      return 'TBD';
    }
    const dateObj = new Date(date);

    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      month  : 'long',
      day    : 'numeric',
      year   : 'numeric',
      hour   : 'numeric',
      minute : '2-digit'
    });
  };

  const formatTime = (start: Date | string | null | undefined, end: Date | string | null | undefined) => {
    if (!start) {
      return 'TBD';
    }
    const startDate = new Date(start);
    const startTime = startDate.toLocaleTimeString('en-US', {
      hour  : 'numeric',
      minute: '2-digit'
    });

    if (!end) {
      return startTime;
    }

    const endDate = new Date(end);
    const endTime = endDate.toLocaleTimeString('en-US', {
      hour  : 'numeric',
      minute: '2-digit'
    });

    return `${startTime} - ${endTime}`;
  };

  const getDirectionsUrl = () => {
    if (!selectedEvent.venueAddress) {
      return '#';
    }
    const query = encodeURIComponent(selectedEvent.venueAddress);

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getSourceName = (source: string | null | undefined) => {
    if (!source) {
      return 'External';
    }

    return source.charAt(0).toUpperCase() + source.slice(1);
  };

  /**
   * EVENT DETAIL MODAL INTERACTION DOCUMENTATION
   * ============================================
   *
   * REQUIREMENTS:
   * 1. Modal should be closeable by clicking outside (standard modal behavior)
   * 2. Sidebar should remain clickable/interactive when both are open
   * 3. Clicking events in the sidebar should update this modal's content
   * 4. Modal should shift left when sidebar is open to avoid overlap
   *
   * IMPLEMENTATION:
   * - Use custom overlay with pointer-events-none to allow clicks through
   * - Add click handler to overlay div that closes modal (simulates backdrop click)
   * - Exclude sidebar and modal content from closing (via stopPropagation)
   * - Sidebar has z-[70], modal content has z-[60], overlay has z-[55]
   *
   * KEY CLASSES:
   * - Overlay: pointer-events-auto on parent, but children control their own pointer-events
   * - Modal Content: pointer-events-auto to capture clicks
   * - Sidebar: Already has pointer-events-auto (inherent in its implementation)
   *
   * RELATED FILES:
   * - components/events/event-sidebar.tsx (z-[70] for Sheet content)
   * - components/ui/sheet.tsx (Sidebar base component)
   */

  // Handle clicking outside modal (but not on sidebar)
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the overlay (not bubbled from modal content)
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!selectedEventId || !selectedEvent) {
    return null;
  }

  return (
    <>
      {/* Custom Modal Overlay - allows clicks through to sidebar */}
      <div
        className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        onClick={handleOverlayClick}
        data-state={selectedEventId ? 'open' : 'closed'}
      />

      {/* Modal Content - positioned and interactive */}
      <div
        className={cn(
          'fixed top-[45%] z-[60] w-full max-w-2xl -translate-y-1/2 overflow-hidden border-[rgba(35,34,34,0.59)] bg-transparent p-0 text-white transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200 sm:rounded-[12px]',

          // // Center by default, shift left when sidebar is open
          sidebarOpen ? 'left-1/3 -translate-x-1/3' : 'left-1/2 -translate-x-1/2',

          // Prevent clicks from closing modal (stopPropagation handled inline below)
          'pointer-events-auto'
        )}
        style={GLASS_EFFECT_STYLE}
        data-state={selectedEventId ? 'open' : 'closed'}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm text-white opacity-90 transition-opacity hover:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {/* Hero Image + Title */}
        {selectedEvent.imageUrl ? (
          <div className="relative aspect-[2.5/1] w-full overflow-hidden rounded-t-[12px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title || 'Event'}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-6 bottom-3 flex items-end justify-between gap-4">
              <div className="max-w-[70%]">
                <h2 className="text-xl font-semibold leading-tight text-white">
                  {selectedEvent.title}
                </h2>
              </div>
              {selectedEvent.category && (
                <div className="shrink-0 rounded-full border border-white/60 bg-white/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                  {selectedEvent.category}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-6 pt-4">
            <h2 className="text-xl font-semibold leading-tight text-white">
              {selectedEvent.title}
            </h2>
            {selectedEvent.category && (
              <div className="mt-2 w-fit rounded-full border border-white/60 bg-white/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
                {selectedEvent.category}
              </div>
            )}
          </div>
        )}

        {/* Content - all sections compact and visible */}
        <div className="px-6 pb-5">
          <div className="space-y-4 pt-4">
            {/* Compact Info Grid */}
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {/* Date & Time */}
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{formatDate(selectedEvent.startsAt)}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatTime(selectedEvent.startsAt, selectedEvent.endsAt)}
                  </p>
                </div>
              </div>

              {/* Venue & Location */}
              {selectedEvent.venueName && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{selectedEvent.venueName}</p>
                    {selectedEvent.venueAddress && (
                      <>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {selectedEvent.venueAddress}
                        </p>
                        <Button
                          variant="link"
                          size="sm"
                          className="mt-0.5 h-auto p-0 text-xs text-blue-400 hover:text-blue-300"
                          asChild
                        >
                          <a
                            href={getDirectionsUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Navigation className="mr-1 h-3 w-3" />
                            Get Directions
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Organizer */}
              {selectedEvent.organizer && (
                <div className="flex items-start gap-2.5">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400">Organized by</p>
                    <p className="mt-0.5 font-medium text-white">{selectedEvent.organizer}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description - Only this scrolls */}
            {selectedEvent.description && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-white">About this event</h3>
                <div className="max-h-32 overflow-y-auto pr-2">
                  <p className="whitespace-pre-wrap text-xs leading-relaxed text-gray-300">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            )}

            {/* RSVP Stats - Compact */}
            {(selectedEvent.rsvpCount || selectedEvent.waitListCount) && (
              <div className="grid grid-cols-2 gap-2.5">
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400">Attending</p>
                        <p className="text-lg font-bold leading-tight text-white">
                          {selectedEvent.rsvpCount || 0}
                          {selectedEvent.rsvpTotal && (
                            <span className="text-xs font-normal text-gray-400">
                              {' '}/ {selectedEvent.rsvpTotal}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedEvent.waitListCount && selectedEvent.waitListCount > 0 ? (
                  <Card className="border-white/10 bg-white/5">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400">Waitlist</p>
                          <p className="text-lg font-bold leading-tight text-white">{selectedEvent.waitListCount}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            )}

            {/* Metadata: Price, Type, Source */}
            {(selectedEvent.price || selectedEvent.eventType || selectedEvent.source) && (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedEvent.price && (
                  <Badge className="border-white/20 bg-emerald-500/20 text-[10px] text-emerald-200">
                    {selectedEvent.price}
                  </Badge>
                )}
                {selectedEvent.eventType && (
                  <Badge className="border-white/20 bg-white/10 text-[10px] text-gray-300">
                    {selectedEvent.eventType}
                  </Badge>
                )}
                {selectedEvent.source && (
                  <Badge className="border-white/20 bg-white/10 text-[10px] text-gray-400">
                    via {getSourceName(selectedEvent.source)}
                  </Badge>
                )}
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-2.5 pt-1">
              {selectedEvent.eventUrl && (
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-white text-black hover:bg-gray-200">
                  <a
                    href={selectedEvent.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on {getSourceName(selectedEvent.source)}
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
              {selectedEvent.ticketUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-white/30 text-white hover:bg-white/10">
                  <a
                    href={selectedEvent.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Tickets
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
