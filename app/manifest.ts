import type { MetadataRoute } from 'next';

export default function manifest (): MetadataRoute.Manifest {
  return {
    name                       : 'Radar7 - Event Discovery Platform',
    short_name                 : 'Radar7',
    description                : 'Discover events from Meetup, Eventbrite, LinkedIn Events, and Luma with superior map-based discovery and intelligent filtering.',
    start_url                  : '/',
    display                    : 'standalone',
    background_color           : '#000000',
    theme_color                : '#10b981',
    orientation                : 'portrait-primary',
    scope                      : '/',
    categories                 : ['social', 'events', 'lifestyle'],
    lang                       : 'en-US',
    dir                        : 'ltr',
    prefer_related_applications: false,
    icons                      : [
      {
        src  : '/icon-192.png',
        sizes: '192x192',
        type : 'image/png'
      },
      {
        src  : '/icon-512.png',
        sizes: '512x512',
        type : 'image/png'
      }
    ],
    shortcuts: [
      {
        name       : 'Browse Events',
        short_name : 'Events',
        description: 'Browse all events',
        url        : '/',
        icons      : [
          {
            src  : '/icon-192.png',
            sizes: '192x192',
            type : 'image/png'
          }
        ]
      }
    ],
    screenshots: [
      {
        src        : '/screenshot-desktop.png',
        sizes      : '1280x720',
        type       : 'image/png',
        form_factor: 'wide'
      },
      {
        src        : '/screenshot-mobile.png',
        sizes      : '750x1334',
        type       : 'image/png',
        form_factor: 'narrow'
      }
    ]
  };
}
