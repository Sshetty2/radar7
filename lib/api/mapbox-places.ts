/**
 * Mapbox Places API integration for POI data
 */

import type { POI, MapboxPlacesResponse, MapboxPlaceFeature } from '@/lib/types/poi';

/**
 * Generate a unique ID for a POI based on coordinates
 */
function generatePOIId (lng: number, lat: number): string {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/**
 * Extract category from Mapbox place feature
 */
function extractCategory (feature: MapboxPlaceFeature): string {
  // Try to get category from properties first
  if (feature.properties?.category) {
    return String(feature.properties.category);
  }

  // Fall back to place_type
  if (feature.place_type && feature.place_type.length > 0) {
    return feature.place_type[0];
  }

  return 'place';
}

/**
 * Extract full address from Mapbox place feature
 */
function extractAddress (feature: MapboxPlaceFeature): string {
  // Use place_name as the full formatted address
  return feature.place_name || feature.text || 'Unknown location';
}

/**
 * Transform Mapbox Places API response to internal POI type
 */
function transformMapboxFeatureToPOI (feature: MapboxPlaceFeature): POI {
  const [lng, lat] = feature.center;
  const id = generatePOIId(lng, lat);

  return {
    id,
    name       : feature.text || 'Unknown Place',
    address    : extractAddress(feature),
    category   : extractCategory(feature),
    coordinates: {
      lat,
      lng
    },
    properties: {
      category: extractCategory(feature),
      address : feature.address,
      ...feature.properties
    },

    // AI description will be generated separately
    aiDescription       : undefined,
    aiDescriptionLoading: false,
    fetchedAt           : new Date().toISOString()
  };
}

/**
 * Fetch POI data at a specific location using Mapbox Places API
 * @param lng - Longitude
 * @param lat - Latitude
 * @param apiKey - Mapbox access token
 * @returns POI data or null if no POI found
 */
export async function fetchPOIAtLocation (
  lng: number,
  lat: number,
  apiKey: string
): Promise<POI | null> {
  try {
    // Mapbox Geocoding API (reverse geocoding)
    // https://docs.mapbox.com/api/search/geocoding/
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${apiKey}&limit=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status} ${response.statusText}`);
    }

    const data: MapboxPlacesResponse = await response.json();

    // Check if any features were returned
    if (!data.features || data.features.length === 0) {
      return null;
    }

    // Get the most relevant feature (first one)
    const feature = data.features[0];

    // Transform to internal POI type
    return transformMapboxFeatureToPOI(feature);
  } catch (error) {
    console.error('Error fetching POI from Mapbox:', error);
    throw error;
  }
}

/**
 * Generate sample AI description for a POI (temporary until AI generation is implemented)
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
    bar: [
      'A lively spot for cocktails, conversation, and evening entertainment.',
      'Unwind with craft beverages in a vibrant social atmosphere.',
      'Your destination for expertly mixed drinks and good times.'
    ],
    default: [
      'An interesting location worth exploring in the area.',
      'A notable point of interest with unique characteristics.',
      'A local landmark that adds character to the neighborhood.'
    ]
  };

  const category = poi.category.toLowerCase();
  const descriptions = categoryDescriptions[category] || categoryDescriptions.default;
  const randomIndex = Math.floor(Math.random() * descriptions.length);

  return descriptions[randomIndex];
}
