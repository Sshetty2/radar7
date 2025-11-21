/**
 * POI (Point of Interest) type definitions
 * Based on Mapbox Places API with AI-generated descriptions
 */

/**
 * POI coordinates
 */
export interface POICoordinates {
  lat: number;
  lng: number;
}

/**
 * Mapbox place context (address components)
 */
export interface POIContext {
  id: string;
  text: string;
  shortCode?: string;
}

/**
 * Mapbox place properties
 */
export interface POIProperties {

  /** Place category (e.g., 'restaurant', 'cafe', 'park') */
  category?: string;

  /** Address */
  address?: string;

  /** Additional metadata from Mapbox */
  [key: string]: unknown;
}

/**
 * POI Photo from Foursquare
 */
export interface POIPhoto {

  /** Photo ID */
  id: string;

  /** Photo URL prefix */
  prefix: string;

  /** Photo URL suffix */
  suffix: string;

  /** Photo width */
  width: number;

  /** Photo height */
  height: number;

  /** Classifications (e.g., 'outdoor', 'indoor', 'food') */
  classifications?: string[];
}

/**
 * Main POI interface
 */
export interface POI {

  /** Unique identifier (Foursquare FSQ ID or generated from lat,lng) */
  id: string;

  /** Place name from Foursquare */
  name: string;

  /** Full formatted address */
  address: string;

  /** Primary category (e.g., 'restaurant', 'cafe', 'park') */
  category: string;

  /** Coordinates */
  coordinates: POICoordinates;

  /** Additional properties from Foursquare Places API */
  properties: POIProperties;

  /** Photos from Foursquare */
  photos?: POIPhoto[];

  /** Full categories array from Foursquare */
  categories?: FoursquareCategory[];

  /** Full location object from Foursquare */
  location?: FoursquareLocation;

  /** Main photo URL (constructed from first photo) */
  imageUrl?: string;

  /** Rating (0-10 scale from Foursquare) */
  rating?: number;

  /** Price tier (1-4, where 1 is cheap and 4 is expensive) */
  price?: number;

  /** Hours of operation display string */
  hours?: string;

  /** Full hours data from Foursquare */
  hoursData?: {
    display?: string;
    is_local_holiday?: boolean;
    open_now?: boolean;
    regular?: {
      close: string;
      day: number;
      open: string;
    }[];
  };

  /** Whether the place is currently open */
  openNow?: boolean;

  /** Phone number */
  phone?: string;

  /** Website URL */
  website?: string;

  /** Community tips/reviews */
  tips?: {
    text: string;
    created_at: string;
  }[];

  /** Tips/reviews count */
  tipsCount?: number;

  /** Foursquare popularity score */
  popularity?: number;

  /** Distance from search point in meters */
  distance?: number;

  /** AI-generated description of the POI */
  aiDescription?: string;

  /** Whether AI description is currently being generated */
  aiDescriptionLoading?: boolean;

  /** Timestamp when POI data was fetched */
  fetchedAt?: string;
}

/**
 * Mapbox Places API response feature
 */
export interface MapboxPlaceFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address?: string;
  context?: POIContext[];
}

/**
 * Mapbox Places API response
 */
export interface MapboxPlacesResponse {
  type: 'FeatureCollection';
  query: number[];
  features: MapboxPlaceFeature[];
  attribution: string;
}

/**
 * Foursquare Places API Types
 */

export interface FoursquareCategory {
  id: number;
  name: string;
  short_name: string;
  plural_name: string;
  icon: {
    prefix: string;
    suffix: string;
  };
}

// Note: Current API returns latitude/longitude as direct fields, not in geocodes object
export interface FoursquareGeocode {
  main: {
    latitude: number;
    longitude: number;
  };
}

export interface FoursquareLocation {
  address?: string;
  address_extended?: string;
  census_block?: string;
  country?: string;
  cross_street?: string;
  dma?: string;
  formatted_address?: string;
  locality?: string;
  postcode?: string;
  region?: string;
}

export interface FoursquarePhoto {
  id: string;
  created_at: string;
  prefix: string;
  suffix: string;
  width: number;
  height: number;
  classifications?: string[];
}

export interface FoursquarePlace {
  fsq_place_id: string; // Updated field name
  name: string;
  categories: FoursquareCategory[];
  latitude: number; // Direct field (not in geocodes)
  longitude: number; // Direct field (not in geocodes)
  geocodes?: FoursquareGeocode; // Legacy field (may not exist)
  location: FoursquareLocation;
  distance?: number;
  timezone?: string;
  rating?: number;
  price?: number;
  hours?: {
    display?: string;
    is_local_holiday?: boolean;
    open_now?: boolean;
    regular?: {
      close: string;
      day: number;
      open: string;
    }[];
  };
  photos?: FoursquarePhoto[];
  tips?: {
    id: string;
    created_at: string;
    text: string;
  }[];
  popularity?: number;
  stats?: {
    total_photos?: number;
    total_ratings?: number;
    total_tips?: number;
  };
  tel?: string;
  website?: string;
}

export interface FoursquarePlaceSearchResponse {
  results: FoursquarePlace[];
  context?: {
    geo_bounds?: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        };
        radius: number;
      };
    };
  };
}
