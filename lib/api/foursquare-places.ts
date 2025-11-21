/**
 * Foursquare Places API integration for POI data with photos
 * API Docs: https://docs.foursquare.com/developer/reference/places-api-overview
 */

import type {
  POI,
  POIPhoto,
  FoursquarePlace,
  FoursquarePlaceSearchResponse
} from '@/lib/types/poi';

/**
 * Construct a photo URL from Foursquare photo data
 * @param prefix - Photo URL prefix
 * @param suffix - Photo URL suffix
 * @param size - Desired size (default: 'original' or width like '300x300')
 */
export function buildFoursquarePhotoUrl (
  prefix: string,
  suffix: string,
  size = 'original'
): string {
  return `${prefix}${size}${suffix}`;
}

/**
 * Transform Foursquare photo to internal POIPhoto type
 */
function transformFoursquarePhoto (photo: any): POIPhoto {
  return {
    id             : photo.id,
    prefix         : photo.prefix,
    suffix         : photo.suffix,
    width          : photo.width,
    height         : photo.height,
    classifications: photo.classifications
  };
}

/**
 * Extract category name from Foursquare place
 */
function extractCategory (place: FoursquarePlace): string {
  if (place.categories && place.categories.length > 0) {
    return place.categories[0].short_name || place.categories[0].name;
  }

  return 'Place';
}

/**
 * Format Foursquare address
 */
function formatAddress (place: FoursquarePlace): string {
  const loc = place.location;

  if (loc.formatted_address) {
    return loc.formatted_address;
  }

  // Build address from components
  const parts: string[] = [];

  if (loc.address) {
    parts.push(loc.address);
  }

  if (loc.locality) {
    parts.push(loc.locality);
  }

  if (loc.region) {
    parts.push(loc.region);
  }

  if (loc.postcode) {
    parts.push(loc.postcode);
  }

  return parts.join(', ') || 'Address not available';
}

/**
 * Transform Foursquare Place to internal POI type
 */
function transformFoursquarePlaceToPOI (place: FoursquarePlace): POI {
  const photos = place.photos?.map(transformFoursquarePhoto) || [];
  const mainPhoto = photos.length > 0 ? photos[0] : null;

  // Generate image URL from first photo (use 500x500 size for good quality)
  const imageUrl = mainPhoto ? buildFoursquarePhotoUrl(mainPhoto.prefix, mainPhoto.suffix, '500x500') : undefined;

  // Transform tips array
  const tips = place.tips?.map(tip => ({
    text      : tip.text,
    created_at: tip.created_at
  }));

  return {
    id         : place.fsq_place_id, // Updated field name
    name       : place.name,
    address    : formatAddress(place),
    category   : extractCategory(place),
    coordinates: {
      // Use direct latitude/longitude fields (current API format)
      lat: place.latitude,
      lng: place.longitude
    },
    properties: {
      category: extractCategory(place),
      address : place.location.address
    },
    photos,
    categories: place.categories, // Full categories array
    location  : place.location, // Full location object
    imageUrl,
    rating    : place.rating,
    price     : place.price,
    hours     : place.hours?.display,
    hoursData : place.hours, // Full hours object
    openNow   : place.hours?.open_now,
    phone     : place.tel,
    website   : place.website,
    tips,

    // NOTE: Using tips array length instead of stats.total_tips
    // The Foursquare API has historical issues with tip count discrepancies
    // where stats.total_tips doesn't match the actual retrievable tips count
    tipsCount           : tips?.length || 0,
    popularity          : place.popularity,
    distance            : place.distance,
    aiDescription       : undefined,
    aiDescriptionLoading: false,
    fetchedAt           : new Date().toISOString()
  };
}

/**
 * Fetch POI data at a specific location using Foursquare Places API
 * Uses the "Place Search" endpoint with text query and location
 *
 * @param lng - Longitude
 * @param lat - Latitude
 * @param apiKey - Foursquare API key
 * @param query - Optional search query (POI name)
 * @returns POI data or null if no POI found
 */
// eslint-disable-next-line max-params, max-statements
export async function fetchPOIAtLocation (
  lng: number,
  lat: number,
  apiKey: string,
  query?: string
): Promise<POI | null> {
  try {
    // Foursquare Places API - Place Search endpoint
    // https://docs.foursquare.com/fsq-developers-places/reference/place-search
    // Search by name (query) near the location, or by proximity if no query
    const radius = 50; // meters
    const limit = 1; // Get the closest place
    const fields = [
      // Pro fields (free tier)
      'fsq_place_id',
      'name',
      'categories',
      'latitude',
      'longitude',
      'location',
      'distance',
      'tel',
      'website',

      // Premium fields (requires billing)
      'rating',
      'price',
      'hours',
      'photos',
      'tips',
      'popularity',
      'stats'
    ].join(',');

    const url = new URL('https://places-api.foursquare.com/places/search');
    url.searchParams.append('ll', `${lat},${lng}`);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('fields', fields);

    // Add query parameter if POI name is provided
    if (query) {
      url.searchParams.append('query', query);
    }

    const response = await fetch(url.toString(), {
      method : 'GET',
      headers: {
        Accept                : 'application/json',
        Authorization         : `Bearer ${apiKey}`,
        'X-Places-Api-Version': '2025-06-17' // Required API version header
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Foursquare API Error:', {
        status      : response.status,
        statusText  : response.statusText,
        url         : url.toString(),
        response    : errorText,
        apiKeyLength: apiKey?.length,
        apiKeyPrefix: `${apiKey?.substring(0, 10)}...`
      });
      throw new Error(
        `Foursquare API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data: FoursquarePlaceSearchResponse = await response.json();

    // Check if any places were returned
    if (!data.results || data.results.length === 0) {
      return null;
    }

    // Get the closest place
    const place = data.results[0];

    // If the place is too far away (> 100m), consider it a miss
    if (place.distance && place.distance > 100) {
      return null;
    }

    // Transform to internal POI type
    return transformFoursquarePlaceToPOI(place);
  } catch (error) {
    console.error('Error fetching POI from Foursquare:', error);
    throw error;
  }
}

/**
 * Fetch additional photos for a POI by FSQ ID
 * @param fsqId - Foursquare place ID
 * @param apiKey - Foursquare API key
 * @param limit - Number of photos to fetch (default: 10)
 */
export async function fetchPlacePhotos (
  fsqId: string,
  apiKey: string,
  limit = 10
): Promise<POIPhoto[]> {
  try {
    const url = `https://places-api.foursquare.com/places/${fsqId}/photos?limit=${limit}`;

    const response = await fetch(url, {
      method : 'GET',
      headers: {
        Accept                : 'application/json',
        Authorization         : `Bearer ${apiKey}`,
        'X-Places-Api-Version': '2025-06-17' // Required API version header
      }
    });

    if (!response.ok) {
      throw new Error(`Foursquare Photos API error: ${response.status}`);
    }

    const photos = await response.json();

    return photos.map(transformFoursquarePhoto);
  } catch (error) {
    console.error('Error fetching photos from Foursquare:', error);

    return [];
  }
}

/**
 * Generate sample AI description for a POI (temporary until AI generation is implemented)
 * Enhanced with Foursquare data (rating, tips, etc.)
 * @param poi - POI data
 * @returns Sample description
 */
export function generateSampleAIDescription (poi: POI): string {
  const categoryDescriptions: Record<string, string[]> = {
    restaurant: [
      'A delightful dining establishment offering a diverse menu in a welcoming atmosphere.',
      'Experience exceptional cuisine crafted with fresh, locally-sourced ingredients.',
      'An inviting eatery where culinary artistry meets warm hospitality.'
    ],
    cafe: [
      'A cozy spot perfect for your morning coffee or afternoon tea break.',
      'Relax and unwind in this charming cafe with artisanal beverages and light bites.',
      'Your neighborhood gathering place for quality coffee and conversation.'
    ],
    bar: [
      'A lively spot for cocktails, conversation, and evening entertainment.',
      'Unwind with craft beverages in a vibrant social atmosphere.',
      'Your destination for expertly mixed drinks and good times.'
    ],
    park: [
      'A serene green space offering a peaceful escape from urban life.',
      'Enjoy nature trails, recreational activities, and scenic views in this beautiful park.',
      'A community oasis perfect for picnics, walks, and outdoor enjoyment.'
    ],
    museum: [
      'Explore fascinating exhibits showcasing art, culture, and history.',
      'An enriching cultural destination with world-class collections and displays.',
      'Discover captivating stories and artifacts in this renowned institution.'
    ],
    default: [
      'An interesting location worth exploring in the area.',
      'A notable point of interest with unique characteristics.',
      'A local landmark that adds character to the neighborhood.'
    ]
  };

  const category = poi.category.toLowerCase();
  const descriptions = categoryDescriptions[category] || categoryDescriptions.default;
  let description = descriptions[Math.floor(Math.random() * descriptions.length)];

  // Add rating if available
  if (poi.rating) {
    description += ` Rated ${poi.rating.toFixed(1)}/10 by visitors.`;
  }

  // Add tips count if available
  if (poi.tipsCount && poi.tipsCount > 0) {
    description += ` Over ${poi.tipsCount} tips from the community.`;
  }

  return description;
}
