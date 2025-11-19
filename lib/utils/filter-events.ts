/* eslint-disable max-params */
import type { Event } from '@/lib/db/crawler-schema';
import type { FiltersState } from '@/lib/store/slices/filtersSlice';

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
function calculateDistance (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if a point is within map bounds
 */
function isInBounds (
  lat: number,
  lng: number,
  bounds: [[number, number], [number, number]]
): boolean {
  const [[swLng, swLat], [neLng, neLat]] = bounds;

  return lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng;
}

/**
 * Filter events based on active filters
 */
export function filterEvents (
  events: Partial<Event>[],
  filters: FiltersState,
  mapCenter?: [number, number],
  mapBounds?: [[number, number], [number, number]]
): Partial<Event>[] {
  return events.filter(event => {
    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      if (!event.startsAt) {
        return false;
      }
      const eventDate = new Date(event.startsAt);

      if (filters.dateRange.start && eventDate < filters.dateRange.start) {
        return false;
      }

      if (filters.dateRange.end && eventDate > filters.dateRange.end) {
        return false;
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!event.category || !filters.categories.includes(event.category)) {
        return false;
      }
    }

    // Event type filter
    if (filters.eventTypes.length > 0) {
      if (!event.eventType || !filters.eventTypes.includes(event.eventType as any)) {
        return false;
      }
    }

    // Price filter
    if (filters.price !== 'all') {
      const isFree = event.price?.toLowerCase().includes('free');

      if (filters.price === 'free' && !isFree) {
        return false;
      }

      if (filters.price === 'paid' && isFree) {
        return false;
      }
    }

    // Source filter
    if (filters.sources.length > 0) {
      if (!event.source || !filters.sources.includes(event.source as any)) {
        return false;
      }
    }

    // Distance filter (only for physical events with coordinates)
    if (mapCenter && event.latitude && event.longitude && event.eventType === 'PHYSICAL') {
      const lat = parseFloat(event.latitude as string);
      const lng = parseFloat(event.longitude as string);

      if (!isNaN(lat) && !isNaN(lng)) {
        // Use map bounds if enabled
        if (filters.useMapBounds && mapBounds) {
          if (!isInBounds(lat, lng, mapBounds)) {
            return false;
          }
        } else {
          // Use distance radius
          const distance = calculateDistance(mapCenter[1], mapCenter[0], lat, lng);

          if (distance > filters.distance) {
            return false;
          }
        }
      }
    }

    // Available spots filter
    if (filters.hasAvailableSpots) {
      const total = event.rsvpTotal || 0;
      const count = event.rsvpCount || 0;

      if (count >= total) {
        return false;
      }
    }

    // Waitlist filter
    if (!filters.showWaitlist) {
      const total = event.rsvpTotal || 0;
      const count = event.rsvpCount || 0;

      if (count >= total) {
        return false;
      }
    }

    return true;
  });
}
