/**
 * Shared utility functions for detail popovers (events, POIs, etc.)
 */

/**
 * Formats a date into a human-readable string
 * @param date - Date object, string, or null/undefined
 * @returns Formatted date string or 'TBD' if date is invalid
 */
export function formatDate (date: Date | string | null | undefined): string {
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
}

/**
 * Formats start and end times into a readable time range
 * @param start - Start date/time
 * @param end - End date/time (optional)
 * @returns Formatted time range string
 */
export function formatTime (
  start: Date | string | null | undefined,
  end?: Date | string | null | undefined
): string {
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
}

/**
 * Generates a Google Maps directions URL for a given address
 * @param address - Address string
 * @returns Google Maps URL or '#' if address is invalid
 */
export function getDirectionsUrl (address: string | null | undefined): string {
  if (!address) {
    return '#';
  }
  const query = encodeURIComponent(address);

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Capitalizes the first letter of a source name
 * @param source - Source string (e.g., 'meetup', 'eventbrite')
 * @returns Capitalized source name or 'External' if invalid
 */
export function getSourceName (source: string | null | undefined): string {
  if (!source) {
    return 'External';
  }

  return source.charAt(0).toUpperCase() + source.slice(1);
}
