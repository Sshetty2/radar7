'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/lib/db/crawler-schema';
import { useAppDispatch } from '@/lib/store/hooks';
import { setSelectedEvent } from '@/lib/store/slices/uiSlice';
import { Calendar, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Partial<Event>;
}

export function EventCard ({ event }: EventCardProps) {
  const dispatch = useAppDispatch();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
      return 'TBD';
    }
    const d = new Date(date);

    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month  : 'short',
      day    : 'numeric',
      hour   : 'numeric',
      minute : '2-digit'
    });
  };

  const handleClick = () => {
    dispatch(setSelectedEvent(event.id as string));
  };

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="flex gap-3 p-3">
        {/* Left side: Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Category badge */}
          {event.category && (
            <Badge
              variant="secondary"
              className="mb-2 w-fit text-xs">
              {event.category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{event.title}</h3>

          {/* Date */}
          <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{formatDate(event.startsAt)}</span>
          </div>

          {/* Venue */}
          {event.venueName && (
            <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{event.venueName}</span>
            </div>
          )}

          {/* RSVP info */}
          <div className="mt-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>
                {event.rsvpCount || 0} attending
                {event.waitListCount && event.waitListCount > 0 ? ` • ${event.waitListCount} waitlist` : ''}
              </span>
            </div>

            {/* Price */}
            {event.price && (
              <Badge
                variant="outline"
                className="ml-2 text-xs">
                {event.price}
              </Badge>
            )}
          </div>
        </div>

        {/* Right side: Image */}
        {event.imageUrl && (
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
            <img
              src={event.imageUrl}
              alt={event.title || 'Event'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
