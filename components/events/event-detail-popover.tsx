'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSelectedEvent, selectSelectedEventId } from '@/lib/store/slices/uiSlice';
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  Navigation,
  User,
  Clock
} from 'lucide-react';
import { GLASS_EFFECT_STYLE } from '@/lib/constants/styles';

export function EventDetailPopover () {
  const dispatch = useAppDispatch();
  const selectedEventId = useAppSelector(selectSelectedEventId);
  const allEvents = useAppSelector(state => state.events.allEvents);

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
    const d = new Date(date);

    return d.toLocaleString('en-US', {
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

  return (
    <Dialog
      open={!!selectedEventId}
      onOpenChange={handleClose}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto border-[rgba(35,34,34,0.59)] text-white data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-300 data-[state=closed]:duration-200 left-[40%] translate-x-[-50%]"
        style={GLASS_EFFECT_STYLE}
      >
        {/* Hero Image */}
        {selectedEvent.imageUrl && (
          <div className="relative -m-6 mb-4 aspect-video w-[calc(100%+3rem)] overflow-hidden">
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title || 'Event'}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl">{selectedEvent.title}</DialogTitle>
            {selectedEvent.category && (
              <Badge>{selectedEvent.category}</Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date & Time */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDate(selectedEvent.startsAt)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(selectedEvent.startsAt, selectedEvent.endsAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Venue & Location */}
          {selectedEvent.venueName && (
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">{selectedEvent.venueName}</p>
                  {selectedEvent.venueAddress && (
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent.venueAddress}
                    </p>
                  )}
                  {selectedEvent.venueAddress && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
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
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Organizer */}
          {selectedEvent.organizer && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Organized by</p>
                <p className="text-sm text-muted-foreground">{selectedEvent.organizer}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {selectedEvent.description && (
            <div className="space-y-2">
              <h3 className="font-semibold">About this event</h3>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {selectedEvent.description}
              </p>
            </div>
          )}

          {/* RSVP Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Attending</p>
                    <p className="text-2xl font-bold">
                      {selectedEvent.rsvpCount || 0}
                      {selectedEvent.rsvpTotal && (
                        <span className="text-sm font-normal text-muted-foreground">
                          {' '}
                          / {selectedEvent.rsvpTotal}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedEvent.waitListCount && selectedEvent.waitListCount > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Waitlist</p>
                      <p className="text-2xl font-bold">{selectedEvent.waitListCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price & Event Type */}
          <div className="flex items-center gap-2">
            {selectedEvent.price && (
              <Badge
                variant="secondary"
                className="text-sm">
                {selectedEvent.price}
              </Badge>
            )}
            {selectedEvent.eventType && (
              <Badge
                variant="outline"
                className="text-sm">
                {selectedEvent.eventType}
              </Badge>
            )}
            {selectedEvent.source && (
              <Badge
                variant="outline"
                className="text-sm">
                via {getSourceName(selectedEvent.source)}
              </Badge>
            )}
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            {selectedEvent.eventUrl && (
              <Button
                asChild
                className="flex-1">
                <a
                  href={selectedEvent.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on {getSourceName(selectedEvent.source)}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {selectedEvent.ticketUrl && (
              <Button
                variant="outline"
                asChild>
                <a
                  href={selectedEvent.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Tickets
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
