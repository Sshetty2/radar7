'use client';

import { Card } from '@/app/ui/components/base/card';
import { Badge } from '@/app/ui/components/badge';
import type { Event } from '@/lib/db/crawler-schema';
import { useAppDispatch } from '@/lib/store/hooks';
import { setSelectedEvent } from '@/lib/store/slices/uiSlice';
import { Calendar, MapPin, Users } from 'lucide-react';

interface EventCardProps {
  event: Partial<Event>;
}

export function EventCard ({ event }: EventCardProps) {
  const dispatch = useAppDispatch();

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) {
      return 'TBD';
    }
    const eventDate = new Date(date);

    return eventDate.toLocaleDateString('en-US', {
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
      className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg h-36"
      onClick={handleClick}
    >
      <div className="flex h-full gap-0">
        {/* Left side: Content - 62% width to match image */}
        <div className="flex w-[62%] min-w-0 flex-col justify-between p-2.5 overflow-hidden">
          <div className="overflow-hidden">
            {/* Category badge */}
            {event.category && (
              <Badge
                variant="secondary"
                className="mb-1.5 w-fit text-[10px] py-0">
                {event.category}
              </Badge>
            )}

            {/* Title */}
            <h3 className="mb-1.5 line-clamp-2 text-[0.8125rem] font-semibold leading-snug">{event.title}</h3>

            {/* Date */}
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3 shrink-0" />
              <span className="truncate">{formatDate(event.startsAt)}</span>
            </div>

            {/* Venue */}
            {event.venueName && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{event.venueName}</span>
              </div>
            )}
          </div>

          {/* RSVP info */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              <span className="truncate">
                {event.rsvpCount || 0}
                {event.waitListCount && event.waitListCount > 0 ? ` • ${event.waitListCount} wait` : ''}
              </span>
            </div>

            {/* Price */}
            {event.price && (
              <Badge
                variant="outline"
                className="text-[10px] py-0">
                {event.price}
              </Badge>
            )}
          </div>
        </div>

        {/* Right side: Image - full height */}
        {event.imageUrl && (
          <div className="h-full w-[38%] shrink-0 overflow-hidden rounded-r-[calc(var(--radius)-1px)] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
