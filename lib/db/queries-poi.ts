/**
 * Database queries for POI caching
 * Server-side only - DO NOT import on client
 */

import { db } from './index';
import { poi } from './schema';
import { eq, and, sql, gt } from 'drizzle-orm';
import type { POI as POIType } from '@/lib/types/poi';

/**
 * Generate a cache key from coordinates (rounded to 4 decimal places ~11m precision)
 */
export function generatePOICacheKey (lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

/**
 * Get POI from cache by ID
 * Returns null if not found or expired
 */
export async function getCachedPOI (id: string): Promise<POIType | null> {
  try {
    const result = await db
      .select()
      .from(poi)
      .where(
        and(
          eq(poi.id, id),
          gt(poi.expiresAt, new Date()) // Not expired
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const cached = result[0];

    // Extract tips array
    const tips = cached.tips as any;

    // Transform database record to POI type
    return {
      id         : cached.id,
      name       : cached.name,
      address    : cached.address,
      category   : cached.category,
      coordinates: {
        lat: cached.latitude,
        lng: cached.longitude
      },
      properties: cached.properties as any,
      photos    : cached.photos as any,
      categories: cached.categories as any || undefined,
      location  : cached.location as any || undefined,
      imageUrl  : cached.imageUrl || undefined,
      rating    : cached.rating || undefined,
      price     : cached.price || undefined,
      hours     : cached.hours || undefined,
      hoursData : cached.hoursData as any || undefined,
      openNow   : cached.openNow !== null ? cached.openNow : undefined,
      phone     : cached.phone || undefined,
      website   : cached.website || undefined,
      tips,

      // NOTE: Compute tipsCount from array length instead of using cached value
      // The Foursquare API has historical issues with tip count discrepancies
      tipsCount           : Array.isArray(tips) ? tips.length : 0,
      popularity          : cached.popularity || undefined,
      distance            : cached.distance || undefined,
      aiDescription       : cached.aiDescription || undefined,
      aiDescriptionLoading: false,
      fetchedAt           : cached.createdAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching cached POI:', error);

    return null;
  }
}

/**
 * Find POI by approximate coordinates
 * Searches within ~11m radius (4 decimal places precision)
 */
export async function getCachedPOIByLocation (
  lat: number,
  lng: number
): Promise<POIType | null> {
  try {
    const cacheKey = generatePOICacheKey(lat, lng);

    // Search for POIs with matching rounded coordinates
    const latRounded = parseFloat(lat.toFixed(4));
    const lngRounded = parseFloat(lng.toFixed(4));

    const result = await db
      .select()
      .from(poi)
      .where(
        and(

          // Match coordinates (rounded)
          sql`ROUND(CAST(${poi.latitude} AS numeric), 4) = ${latRounded}`,
          sql`ROUND(CAST(${poi.longitude} AS numeric), 4) = ${lngRounded}`,

          // Not expired
          gt(poi.expiresAt, new Date())
        )
      )
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const cached = result[0];

    // Extract tips array
    const tips = cached.tips as any;

    return {
      id         : cached.id,
      name       : cached.name,
      address    : cached.address,
      category   : cached.category,
      coordinates: {
        lat: cached.latitude,
        lng: cached.longitude
      },
      properties: cached.properties as any,
      photos    : cached.photos as any,
      categories: cached.categories as any || undefined,
      location  : cached.location as any || undefined,
      imageUrl  : cached.imageUrl || undefined,
      rating    : cached.rating || undefined,
      price     : cached.price || undefined,
      hours     : cached.hours || undefined,
      hoursData : cached.hoursData as any || undefined,
      openNow   : cached.openNow !== null ? cached.openNow : undefined,
      phone     : cached.phone || undefined,
      website   : cached.website || undefined,
      tips,

      // NOTE: Compute tipsCount from array length instead of using cached value
      // The Foursquare API has historical issues with tip count discrepancies
      tipsCount           : Array.isArray(tips) ? tips.length : 0,
      popularity          : cached.popularity || undefined,
      distance            : cached.distance || undefined,
      aiDescription       : cached.aiDescription || undefined,
      aiDescriptionLoading: false,
      fetchedAt           : cached.createdAt.toISOString()
    };
  } catch (error) {
    console.error('Error fetching cached POI by location:', error);

    return null;
  }
}

/**
 * Save POI to cache
 * Upserts (insert or update) POI data with 7-day expiration
 */
export async function cachePOI (poiData: POIType): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    const now = new Date();

    await db
      .insert(poi)
      .values({
        id           : poiData.id,
        name         : poiData.name,
        address      : poiData.address,
        category     : poiData.category,
        latitude     : poiData.coordinates.lat,
        longitude    : poiData.coordinates.lng,
        properties   : poiData.properties as any,
        photos       : poiData.photos as any,
        categories   : poiData.categories as any || null,
        location     : poiData.location as any || null,
        imageUrl     : poiData.imageUrl || null,
        rating       : poiData.rating || null,
        price        : poiData.price || null,
        hours        : poiData.hours || null,
        hoursData    : poiData.hoursData as any || null,
        openNow      : poiData.openNow !== undefined ? poiData.openNow : null,
        phone        : poiData.phone || null,
        website      : poiData.website || null,
        tips         : poiData.tips as any || null,
        tipsCount    : poiData.tipsCount || null,
        popularity   : poiData.popularity || null,
        distance     : poiData.distance || null,
        aiDescription: poiData.aiDescription || null,
        createdAt    : now,
        updatedAt    : now,
        expiresAt,
        source       : 'foursquare'
      })
      .onConflictDoUpdate({
        target: poi.id,
        set   : {
          name         : poiData.name,
          address      : poiData.address,
          category     : poiData.category,
          latitude     : poiData.coordinates.lat,
          longitude    : poiData.coordinates.lng,
          properties   : poiData.properties as any,
          photos       : poiData.photos as any,
          categories   : poiData.categories as any || null,
          location     : poiData.location as any || null,
          imageUrl     : poiData.imageUrl || null,
          rating       : poiData.rating || null,
          price        : poiData.price || null,
          hours        : poiData.hours || null,
          hoursData    : poiData.hoursData as any || null,
          openNow      : poiData.openNow !== undefined ? poiData.openNow : null,
          phone        : poiData.phone || null,
          website      : poiData.website || null,
          tips         : poiData.tips as any || null,
          tipsCount    : poiData.tipsCount || null,
          popularity   : poiData.popularity || null,
          distance     : poiData.distance || null,
          aiDescription: poiData.aiDescription || null,
          updatedAt    : now,
          expiresAt // Refresh expiration
        }
      });

    console.log(`✅ Cached POI: ${poiData.name} (${poiData.id})`);
  } catch (error) {
    console.error('Error caching POI:', error);
    throw error;
  }
}

/**
 * Delete expired POIs from cache (cleanup function)
 */
export async function cleanupExpiredPOIs (): Promise<number> {
  try {
    const result = await db
      .delete(poi)
      .where(sql`${poi.expiresAt} < NOW()`)
      .returning({ id: poi.id });

    console.log(`🗑️  Cleaned up ${result.length} expired POIs`);

    return result.length;
  } catch (error) {
    console.error('Error cleaning up expired POIs:', error);

    return 0;
  }
}
