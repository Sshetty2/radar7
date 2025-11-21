/* eslint-disable key-spacing */
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setMapView } from '@/lib/store/slices/mapSlice';
import { setEvents, setLoading, setError } from '@/lib/store/slices/eventsSlice';
import { setSelectedEvent, selectMapStyle } from '@/lib/store/slices/uiSlice';
import { selectFilters } from '@/lib/store/slices/filtersSlice';
import { filterEvents } from '@/lib/utils/filter-events';

import { MapControls } from './map-controls';
import { SearchBox } from './search-box';
import { FilterButton } from './filter-button';
import { SidebarToggle } from './sidebar-toggle';
import { MapStyleToggle } from './map-style-toggle';
import { NewEventButton } from './new-event-button';
import { EventSidebar } from '@/components/events/event-sidebar';
import { EventDetailPopover } from '@/components/events/event-detail-popover';
import { FilterModal } from '@/components/filters/filter-modal';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Custom map style
const CUSTOM_STYLE = 'mapbox://styles/sshetty/cmi7w7y3d003501sb3yqy0be6';

// eslint-disable-next-line space-before-function-paren
export function MapContainer() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const dispatch = useAppDispatch();

  const mapState = useAppSelector(state => state.map);
  const allEvents = useAppSelector(state => state.events.allEvents);
  const filters = useAppSelector(selectFilters);
  const mapStyle = useAppSelector(selectMapStyle);

  const [mounted, setMounted] = useState(false);

  // Filter events based on active filters
  const filteredEvents = filterEvents(allEvents, filters);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    setMounted(true);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: CUSTOM_STYLE,
      center: mapState.center,
      zoom: mapState.zoom,
      pitch: 0,
      bearing: 0,
      attributionControl: false // We'll add it manually in a different position
    });

    // Wait for the style to load, then set the lightPreset based on current mapStyle
    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'lightPreset', mapStyle);
    });

    // Add attribution control at bottom-left (will be moved via CSS)
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');

    // Update Redux state on map move
    map.on('moveend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const bounds = map.getBounds();

      dispatch(
        setMapView({
          center: [center.lng, center.lat],
          zoom,
          bounds: [
            [bounds?.getWest() || 0, bounds?.getSouth() || 0],
            [bounds?.getEast() || 0, bounds?.getNorth() || 0]
          ]
        })
      );
    });

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update lightPreset when toggle changes
  useEffect(() => {
    if (!mapRef.current || !mounted) {
      return;
    }

    // Check if the map style is loaded before setting config
    if (mapRef.current.isStyleLoaded()) {
      mapRef.current.setConfigProperty('basemap', 'lightPreset', mapStyle);
    } else {
      // If style isn't loaded yet, wait for it
      mapRef.current.once('style.load', () => {
        mapRef.current?.setConfigProperty('basemap', 'lightPreset', mapStyle);
      });
    }
  }, [mapStyle, mounted]);

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      dispatch(setLoading(true));

      try {
        const response = await fetch('/api/events');

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        dispatch(setEvents(events));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to load events'));
      }
    };

    fetchEvents();
  }, [dispatch]);

  // Update markers when filtered events change
  useEffect(() => {
    if (!mapRef.current || !mounted) {
      return;
    }

    const map = mapRef.current;

    // Wait for map to be fully loaded before manipulating markers
    const updateMarkers = () => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Category-based colors
      const categoryColors: Record<string, string> = {
        'Social Activities': '#ef4444',
        Technology: '#3b82f6',
        'Food & Drink': '#f59e0b',
        'Sports & Fitness': '#10b981',
        'Arts & Culture': '#8b5cf6',
        'Professional Development': '#06b6d4',
        'Professional Networking': '#06b6d4',
        'Music & Arts': '#ec4899',
        'Health & Wellness': '#14b8a6'
      };

      // Add markers for filtered events
      filteredEvents.forEach(event => {
        if (!event.latitude || !event.longitude) {
          return;
        }

        const lat = parseFloat(event.latitude as string);
        const lng = parseFloat(event.longitude as string);

        if (isNaN(lat) || isNaN(lng)) {
          return;
        }

        const color = categoryColors[event.category || ''] || '#6b7280';

        // Create marker with Mapbox's built-in marker (smaller scale)
        const marker = new mapboxgl.Marker({
          color,
          scale: 0.7, // Make markers smaller
          anchor: 'bottom' // Anchor to bottom for stability
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              className: 'event-popup'
            }).setHTML(
              `<div style="font-family: sans-serif;">
                <strong style="display: block; margin-bottom: 4px;">${event.title}</strong>
                <span style="font-size: 12px; color: #666;">
                  ${event.startsAt ? new Date(event.startsAt).toLocaleDateString() : 'TBD'}
                </span>
              </div>`
            )
          )
          .addTo(map);

        // Click handler on the marker element
        const markerEl = marker.getElement();
        markerEl.style.cursor = 'pointer';

        markerEl.addEventListener('click', e => {
          e.stopPropagation();
          dispatch(setSelectedEvent(event.id as string));
        });

        markersRef.current.push(marker);
      });
    };

    // Only update markers if the map style is loaded
    if (map.isStyleLoaded()) {
      updateMarkers();
    } else {
      map.once('load', updateMarkers);
    }

    // Cleanup function
    return () => {
      // Don't remove markers on every render, only when component unmounts
    };
  }, [filteredEvents, mounted, dispatch]);

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="h-full w-full" />

      {/* Overlay UI components */}
      <MapControls />
      <SearchBox />
      <FilterButton />
      <SidebarToggle />
      <MapStyleToggle />
      <NewEventButton />

      {/* Modals and Sidebars */}
      <EventSidebar events={filteredEvents} />
      <EventDetailPopover />
      <FilterModal />
    </div>
  );
}
