import { NextRequest, NextResponse } from 'next/server';
import { fetchPOIAtLocation, generateSampleAIDescription } from '@/lib/api/foursquare-places';
import { getCachedPOIByLocation, cachePOI } from '@/lib/db/queries-poi';

/**
 * GET /api/poi
 * Fetch POI data at a specific location with database caching
 *
 * Flow:
 * 1. Check database cache first (saves API calls!)
 * 2. If cached and not expired, return cached data
 * 3. If not cached, fetch from Foursquare API using query (POI name) + location
 * 4. Cache the result in database for future requests
 * 5. Return POI data
 *
 * Query params:
 * - lng: Longitude (required)
 * - lat: Latitude (required)
 * - query: POI name to search for (optional but recommended)
 *
 * Returns:
 * - POI data with photos and AI-generated description
 * - 400 if lat/lng are missing or invalid
 * - 404 if no POI found at location
 * - 500 if API error occurs
 */
export async function GET (request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lngParam = searchParams.get('lng');
    const latParam = searchParams.get('lat');
    const query = searchParams.get('query'); // POI name from map

    // Validate parameters
    if (!lngParam || !latParam) {
      return NextResponse.json(
        { error: 'Missing required parameters: lng and lat' },
        { status: 400 }
      );
    }

    const lng = parseFloat(lngParam);
    const lat = parseFloat(latParam);

    if (isNaN(lng) || isNaN(lat)) {
      return NextResponse.json(
        { error: 'Invalid coordinates: lng and lat must be valid numbers' },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      return NextResponse.json(
        { error: 'Invalid coordinates: lng must be between -180 and 180, lat must be between -90 and 90' },
        { status: 400 }
      );
    }

    // STEP 1: Check database cache first
    const cacheKey = query ? `${query}:${lat},${lng}` : `${lat},${lng}`;
    console.log(`🔍 Checking cache for POI: ${query || 'unknown'} at ${lat}, ${lng}...`);
    const cachedPOI = await getCachedPOIByLocation(lat, lng);

    if (cachedPOI) {
      console.log(`✅ Cache HIT! Returning cached POI: ${cachedPOI.name}`);

      return NextResponse.json({
        ...cachedPOI,
        _cached: true // Flag to indicate this came from cache
      });
    }

    console.log('❌ Cache MISS. Fetching from Foursquare API...');

    // STEP 2: Get Foursquare API key from environment
    const foursquareApiKey = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;

    if (!foursquareApiKey) {
      console.error('NEXT_PUBLIC_FOURSQUARE_API_KEY is not set');

      return NextResponse.json(
        { error: 'Server configuration error: Foursquare API key not found' },
        { status: 500 }
      );
    }

    // STEP 3: Fetch POI data from Foursquare API with query (POI name)
    console.log(`🔎 Searching Foursquare for: "${query}" at ${lat}, ${lng}`);
    const poi = await fetchPOIAtLocation(lng, lat, foursquareApiKey, query || undefined);

    if (!poi) {
      return NextResponse.json(
        { error: 'No POI found at this location' },
        { status: 404 }
      );
    }

    // STEP 4: Generate sample AI description
    // TODO: Replace with actual AI description generation
    poi.aiDescription = generateSampleAIDescription(poi);

    // STEP 5: Cache the POI in database for future requests
    try {
      await cachePOI(poi);
      console.log(`💾 Saved POI to cache: ${poi.name}`);
    } catch (cacheError) {
      // Don't fail the request if caching fails, just log it
      console.error('Failed to cache POI (non-fatal):', cacheError);
    }

    // STEP 6: Return POI data
    return NextResponse.json({
      ...poi,
      _cached: false // Flag to indicate this is fresh from API
    });
  } catch (error) {
    console.error('Error in POI API route:', error);

    return NextResponse.json(
      {
        error  : 'Failed to fetch POI data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
