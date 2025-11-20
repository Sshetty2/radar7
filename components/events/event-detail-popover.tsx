'use client';

import { useState } from 'react';
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
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';

export function EventDetailPopover () {
  const dispatch = useAppDispatch();
  const selectedEventId = useAppSelector(selectSelectedEventId);
  const allEvents = useAppSelector(state => state.events.allEvents);
  const sidebarOpen = useAppSelector(selectSidebarOpen);
  const [isMinimized, setIsMinimized] = useState(false);

  const selectedEvent = allEvents.find(e => e.id === selectedEventId);

  const handleClose = () => {
    dispatch(setSelectedEvent(null));
    setIsMinimized(false); // Reset to full view when closing
  };

  const toggleMinimize = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsMinimized(!isMinimized);

    // Remove focus from the button to prevent focus ring
    e.currentTarget.blur();
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
   * 1. FULL VIEW: Modal closeable by clicking outside (standard modal behavior)
   * 2. MINIMIZED VIEW: Modal only closeable via close button (not by clicking outside)
   * 3. Sidebar should remain clickable/interactive when modal is open
   * 4. Clicking events in sidebar should update modal content
   * 5. Modal should shift left when sidebar is open to avoid overlap
   * 6. Smooth transition between full and minimized views
   *
   * VIEW STATES:
   * - FULL: Center screen, larger card, all details visible, backdrop-dismissible
   * - MINIMIZED: Bottom-left corner, compact card, key info only, not backdrop-dismissible
   *
   * IMPLEMENTATION:
   * - Custom overlay that only closes modal when in FULL view
   * - Toggle button (Minimize2/Maximize2 icons) to switch views
   * - Sidebar has z-[70], modal content has z-[60], overlay has z-[55]
   * - CSS transitions for smooth view changes
   *
   * KEY CLASSES:
   * - Overlay: Only active (clickable to close) when isMinimized === false
   * - Modal Content: pointer-events-auto, position changes based on isMinimized
   * - Sidebar: z-[70] ensures it's always interactive
   *
   * RELATED FILES:
   * - components/events/event-sidebar.tsx (z-[70] for Sheet content)
   * - docs/MODAL_SIDEBAR_INTERACTIONS.md (Full interaction documentation)
   */

  // Handle clicking outside modal (but not on sidebar)
  // Only closes modal when in FULL view
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isMinimized && e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!selectedEventId || !selectedEvent) {
    return null;
  }

  return (
    <>
      {/* Custom Modal Overlay - only visible in full view */}
      {!isMinimized && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[2px] transition-all duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={handleOverlayClick}
          data-state={selectedEventId ? 'open' : 'closed'}
        />
      )}

      {/* Modal Content - switches between full and minimized views */}
      <div
        className={cn(
          'glass fixed z-[60] overflow-hidden bg-transparent p-0 glass-text transition-all duration-300 pointer-events-auto',

          // View-specific positioning and sizing
          isMinimized ? [
            // Minimized: Below logo area, more to the right, wider and shorter
            'left-[8vw] top-[12vh] w-[clamp(520px,38vw,640px)] h-[clamp(220px,28vh,300px)]',
            'sm:rounded-[12px] shadow-2xl'
          ] : [
            // Full: Center screen, larger size
            'top-[45%] -translate-y-1/2 w-full max-w-2xl',
            sidebarOpen ? 'left-1/3 -translate-x-1/3' : 'left-1/2 -translate-x-1/2',
            'sm:rounded-[12px]'
          ]
        )}
        data-state={selectedEventId ? 'open' : 'closed'}
        onClick={e => e.stopPropagation()}
      >
        {/* Control buttons - always top-right, but minimize on left in minimized view */}
        {isMinimized ? (
          <>
            {/* Minimize toggle - top left */}
            <button
              onClick={toggleMinimize}
              className="glass absolute left-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              title="Maximize"
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Maximize</span>
            </button>
            {/* Close button - top right */}
            <button
              onClick={handleClose}
              className="glass absolute right-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              title="Close"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </>
        ) : (
          <>
            {/* Minimize button - left side */}
            <button
              onClick={toggleMinimize}
              className="glass absolute left-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              title="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
              <span className="sr-only">Minimize</span>
            </button>
            {/* Close button - right side */}
            <button
              onClick={handleClose}
              className="glass absolute right-3 top-3 z-10 rounded-xl p-2 glass-text hover:bg-secondary/50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
              title="Close"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </>
        )}

        {/* MINIMIZED VIEW - Compact card with photo on right side */}
        {isMinimized ? (
          <div className="flex h-full overflow-hidden">
            {/* Left side - Event info (62%) */}
            <div className="flex w-[62%] flex-col p-6">
              {/* Title and category - with left padding for minimize button */}
              <div className="mb-3 pl-8">
                <h3 className="line-clamp-2 text-sm font-semibold leading-tight glass-text">
                  {selectedEvent.title}
                </h3>

                {selectedEvent.category && (
                  <div className="mt-1.5 w-fit rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider glass-text shadow-lg">
                    {selectedEvent.category}
                  </div>
                )}
              </div>

              {/* Event details - Date/Time and Venue side by side */}
              <div className="flex gap-3 text-xs glass-text-muted">
                {/* Date & Time - Left side */}
                <div className="flex flex-1 items-start gap-1.5">
                  <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 glass-icon" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium glass-text">
                      {new Date(selectedEvent.startsAt || '').toLocaleDateString('en-US', {
                        weekday: 'short',
                        month  : 'short',
                        day    : 'numeric'
                      })}
                    </p>
                    <p className="text-[10px] glass-text-muted">
                      {formatTime(selectedEvent.startsAt, selectedEvent.endsAt)}
                    </p>
                  </div>
                </div>

                {/* Venue - Right side */}
                {selectedEvent.venueName && (
                  <div className="flex flex-1 items-start gap-1.5">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 glass-icon" />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium glass-text">{selectedEvent.venueName}</p>
                      {selectedEvent.venueAddress && (
                        <p className="truncate text-[10px] glass-text-muted">
                          {selectedEvent.venueAddress}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description - scrollable */}
              {selectedEvent.description && (
                <div className="mt-2 flex-1 overflow-y-auto pr-2">
                  <p className="text-[11px] leading-relaxed glass-text-muted">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* RSVP & Price - inline at the bottom */}
              <div className="mt-auto flex items-center gap-3 pt-2">
                {selectedEvent.rsvpCount && selectedEvent.rsvpCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 shrink-0 glass-icon" />
                    <span className="text-[11px]">
                      <span className="font-semibold glass-text">{selectedEvent.rsvpCount}</span>
                      {selectedEvent.rsvpTotal && <span className="glass-text-muted"> / {selectedEvent.rsvpTotal}</span>}
                    </span>
                  </div>
                )}

                {selectedEvent.price && (
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                    {selectedEvent.price}
                  </div>
                )}
              </div>
            </div>

            {/* Right side - Event photo (38%) - Full height, responsive object-fit */}
            {selectedEvent.imageUrl && (
              <div className="w-[38%] overflow-hidden rounded-r-[12px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title || 'Event'}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            )}
          </div>
        ) : (

          // FULL VIEW - Complete details
          <>
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
                    <h2 className="text-xl font-semibold leading-tight glass-text">
                      {selectedEvent.title}
                    </h2>
                  </div>
                  {selectedEvent.category && (
                    <div className="shrink-0 rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider glass-text shadow-lg">
                      {selectedEvent.category}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-6 pt-4">
                <h2 className="text-xl font-semibold leading-tight glass-text">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.category && (
                  <div className="mt-2 w-fit rounded-full border border-border/60 bg-secondary/35 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider glass-text shadow-lg">
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
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium glass-text">{formatDate(selectedEvent.startsAt)}</p>
                      <p className="mt-0.5 text-xs glass-text-muted">
                        {formatTime(selectedEvent.startsAt, selectedEvent.endsAt)}
                      </p>
                    </div>
                  </div>

                  {/* Venue & Location */}
                  {selectedEvent.venueName && (
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium glass-text">{selectedEvent.venueName}</p>
                        {selectedEvent.venueAddress && (
                          <>
                            <p className="mt-0.5 text-xs glass-text-muted">
                              {selectedEvent.venueAddress}
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              className="mt-0.5 h-auto p-0 text-xs text-blue-400 hover:text-blue-300 dark:text-blue-300 dark:hover:text-blue-200"
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
                      <User className="mt-0.5 h-4 w-4 shrink-0 glass-icon" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs glass-text-muted">Organized by</p>
                        <p className="mt-0.5 font-medium glass-text">{selectedEvent.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description - Only this scrolls */}
                {selectedEvent.description && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold glass-text">About this event</h3>
                    <div className="max-h-32 overflow-y-auto pr-2">
                      <p className="whitespace-pre-wrap text-xs leading-relaxed glass-text-muted">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* RSVP Stats - Compact */}
                {(selectedEvent.rsvpCount || selectedEvent.waitListCount) && (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Card className="border-border/50 bg-secondary/20">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 glass-icon" />
                          <div>
                            <p className="text-[10px] glass-text-muted">Attending</p>
                            <p className="text-lg font-bold leading-tight glass-text">
                              {selectedEvent.rsvpCount || 0}
                              {selectedEvent.rsvpTotal && (
                                <span className="text-xs font-normal glass-text-muted">
                                  {' '}/ {selectedEvent.rsvpTotal}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {selectedEvent.waitListCount && selectedEvent.waitListCount > 0 ? (
                      <Card className="border-border/50 bg-secondary/20">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 glass-icon" />
                            <div>
                              <p className="text-[10px] glass-text-muted">Waitlist</p>
                              <p className="text-lg font-bold leading-tight glass-text">{selectedEvent.waitListCount}</p>
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
                      <Badge className="border-emerald-400/30 bg-emerald-500/20 text-[10px] text-emerald-200">
                        {selectedEvent.price}
                      </Badge>
                    )}
                    {selectedEvent.eventType && (
                      <Badge className="border-border/50 bg-secondary/50 text-[10px]">
                        {selectedEvent.eventType}
                      </Badge>
                    )}
                    {selectedEvent.source && (
                      <Badge className="border-border/50 bg-secondary/50 text-[10px] text-muted-foreground">
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
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
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
                      className="border-border/50 glass-text hover:bg-secondary/50">
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
          </>
        )}
      </div>
    </>
  );
}
