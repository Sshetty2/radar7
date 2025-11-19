import { NextResponse } from 'next/server';
import { sampleEvents } from '@/lib/data/sample-events';

export function GET (request: Request) {
  try {
    // TODO: In the future, fetch from database:
    // import { db } from '@/lib/db';
    // import { events } from '@/lib/db/crawler-schema';
    // const allEvents = await db.select().from(events);

    // For now, return sample events
    return NextResponse.json(sampleEvents);
  } catch (error) {
    console.error('Error fetching events:', error);

    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
