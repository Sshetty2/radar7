/**
 * Category-based color mapping for events and POIs
 * Used for marker colors, badges, and other category-specific styling
 */

/**
 * Event category colors
 */
export const eventCategoryColors: Record<string, string> = {
  'Social Activities'       : '#ef4444', // red-500
  Technology                : '#3b82f6', // blue-500
  'Food & Drink'            : '#f59e0b', // amber-500
  'Sports & Fitness'        : '#10b981', // emerald-500
  'Arts & Culture'          : '#8b5cf6', // violet-500
  'Professional Development': '#06b6d4', // cyan-500
  'Professional Networking' : '#06b6d4', // cyan-500
  'Music & Arts'            : '#ec4899', // pink-500
  'Health & Wellness'       : '#14b8a6' // teal-500
};

/**
 * POI category colors (Mapbox Places API categories)
 */
export const poiCategoryColors: Record<string, string> = {
  // Food & Drink
  restaurant: '#f59e0b', // amber-500
  cafe      : '#f59e0b',
  bar       : '#f97316', // orange-500
  food      : '#f59e0b',

  // Shopping
  shop : '#ec4899', // pink-500
  store: '#ec4899',
  mall : '#d946ef', // fuchsia-500

  // Entertainment
  entertainment: '#8b5cf6', // violet-500
  museum       : '#8b5cf6',
  theater      : '#8b5cf6',
  cinema       : '#8b5cf6',

  // Recreation
  park      : '#10b981', // emerald-500
  recreation: '#10b981',
  sports    : '#10b981',
  fitness   : '#14b8a6', // teal-500

  // Transportation
  transit       : '#3b82f6', // blue-500
  transportation: '#3b82f6',
  station       : '#3b82f6',

  // Accommodation
  hotel  : '#06b6d4', // cyan-500
  lodging: '#06b6d4',

  // Services
  bank    : '#64748b', // slate-500
  atm     : '#64748b',
  hospital: '#ef4444', // red-500
  pharmacy: '#ef4444',

  // Default
  default: '#6b7280' // gray-500
};

/**
 * Get color for an event category
 * @param category - Event category string
 * @returns Hex color code
 */
export function getEventCategoryColor (category: string | null | undefined): string {
  if (!category) {
    return '#6b7280'; // gray-500 default
  }

  return eventCategoryColors[category] || '#6b7280';
}

/**
 * Get color for a POI category
 * @param category - POI category string (from Mapbox Places API)
 * @returns Hex color code
 */
export function getPOICategoryColor (category: string | null | undefined): string {
  if (!category) {
    return poiCategoryColors.default;
  }

  // Try exact match first
  if (poiCategoryColors[category.toLowerCase()]) {
    return poiCategoryColors[category.toLowerCase()];
  }

  // Try partial match
  const lowerCategory = category.toLowerCase();

  for (const key in poiCategoryColors) {
    if (lowerCategory.includes(key) || key.includes(lowerCategory)) {
      return poiCategoryColors[key];
    }
  }

  return poiCategoryColors.default;
}
