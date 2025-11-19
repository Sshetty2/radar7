import type { InferSelectModel } from 'drizzle-orm';
import {
  varchar,
  timestamp,
  json,
  uuid,
  text,
  numeric,
  integer,
  pgSchema
} from 'drizzle-orm/pg-core';

export const crawlerSchema = pgSchema('crawler');

export const events = crawlerSchema.table('Events', {
  id: uuid('id').primaryKey()
    .notNull()
    .defaultRandom(),
  title       : text('title').notNull(),
  description : text('description'),
  venueName   : text('venueName'),
  venueAddress: text('venueAddress'),
  latitude    : numeric('latitude', {
    precision: 10,
    scale    : 7
  }),
  longitude: numeric('longitude', {
    precision: 10,
    scale    : 7
  }),
  locale          : varchar('locale', { length: 10 }),
  city            : varchar('city', { length: 100 }),
  state           : varchar('state', { length: 50 }),
  country         : varchar('country', { length: 2 }),
  startsAt        : timestamp('startsAt', { withTimezone: true }),
  endsAt          : timestamp('endsAt', { withTimezone: true }),
  organizer       : varchar('organizer', { length: 255 }),
  organizerContact: text('organizerContact'),
  category        : varchar('category', { length: 100 }),
  tags            : json('tags').$type<string[] | null>(),
  price           : varchar('price', { length: 50 }),
  ticketUrl       : text('ticketUrl'),
  eventUrl        : text('eventUrl'),
  imageUrl        : text('imageUrl'),
  eventType       : varchar('eventType', {
    length: 20,
    enum  : ['PHYSICAL', 'VIRTUAL', 'HYBRID']
  }),
  status: varchar('status', {
    length: 20,
    enum  : ['ACTIVE', 'CANCELLED', 'POSTPONED']
  }),
  rsvpTotal    : integer('rsvpTotal'),
  rsvpCount    : integer('rsvpCount'),
  waitListCount: integer('waitListCount'),
  source       : varchar('source', {
    length: 50,
    enum  : ['meetup', 'eventbrite', 'linkedin', 'luma']
  }),
  sourceId       : varchar('sourceId', { length: 255 }),
  sourceCreatedAt: timestamp('sourceCreatedAt', { withTimezone: true }),
  sourceUpdatedAt: timestamp('sourceUpdatedAt', { withTimezone: true }),
  rawData        : json('rawData'),
  createdAt      : timestamp('createdAt', { withTimezone: true }).notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull()
    .defaultNow()
});

export type Event = InferSelectModel<typeof events>;
