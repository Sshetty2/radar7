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
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
        onClick={handleClick}
      >
        {/* Event image */}
        {event.imageUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted">
            <img
              src={event.imageUrl}
              alt={event.title || 'Event'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <CardContent className="p-4">
          {/* Category badge */}
          {event.category && (
            <Badge
              variant="secondary"
              className="mb-2">
              {event.category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="mb-2 line-clamp-2 font-semibold">{event.title}</h3>

          {/* Date */}
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">{formatDate(event.startsAt)}</span>
          </div>

          {/* Venue */}
          {event.venueName && (
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{event.venueName}</span>
            </div>
          )}

          {/* RSVP info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event.rsvpCount || 0} attending
                {event.waitListCount && event.waitListCount > 0 ? ` • ${event.waitListCount} waitlist` : ''}
              </span>
            </div>

            {/* Price */}
            {event.price && (
              <Badge
                variant="outline"
                className="ml-2">
                {event.price}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
