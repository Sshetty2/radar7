import type { InferSelectModel } from 'drizzle-orm';
import {
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
  pgSchema,
  pgTable,
  real,
  integer
} from 'drizzle-orm/pg-core';

export const clientSchema = pgSchema('client');

export const user = clientSchema.table('User', {
  id: uuid('id').primaryKey()
    .notNull()
    .defaultRandom(),
  email   : varchar('email', { length: 64 }).notNull(),
  password: varchar('password', { length: 64 })
});

export type User = InferSelectModel<typeof user>;

export const chat = clientSchema.table('Chat', {
  id: uuid('id').primaryKey()
    .notNull()
    .defaultRandom(),
  createdAt: timestamp('createdAt').notNull(),
  title    : text('title').notNull(),
  userId   : uuid('userId')
    .notNull()
    .references(() => user.id),
  visibility: varchar('visibility', { enum: ['public', 'private'] })
    .notNull()
    .default('private')
});

export type Chat = InferSelectModel<typeof chat>;

export const message = clientSchema.table('Message', {
  id: uuid('id').primaryKey()
    .notNull()
    .defaultRandom(),
  chatId: uuid('chatId')
    .notNull()
    .references(() => chat.id),
  role     : varchar('role').notNull(),
  content  : json('content').notNull(),
  createdAt: timestamp('createdAt').notNull()
});

export type Message = InferSelectModel<typeof message>;

export const vote = clientSchema.table(
  'Vote',
  {
    chatId: uuid('chatId')
      .notNull()
      .references(() => chat.id),
    messageId: uuid('messageId')
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean('isUpvoted').notNull()
  },
  table => ({ pk: primaryKey({ columns: [table.chatId, table.messageId] }) })
);

export type Vote = InferSelectModel<typeof vote>;

export const document = clientSchema.table(
  'Document',
  {
    id: uuid('id').notNull()
      .defaultRandom(),
    createdAt: timestamp('createdAt').notNull(),
    title    : text('title').notNull(),
    content  : text('content'),
    kind     : varchar('text', { enum: ['text', 'code'] })
      .notNull()
      .default('text'),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id)
  },
  table => ({ pk: primaryKey({ columns: [table.id, table.createdAt] }) })
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = clientSchema.table(
  'Suggestion',
  {
    id: uuid('id').notNull()
      .defaultRandom(),
    documentId       : uuid('documentId').notNull(),
    documentCreatedAt: timestamp('documentCreatedAt').notNull(),
    originalText     : text('originalText').notNull(),
    suggestedText    : text('suggestedText').notNull(),
    description      : text('description'),
    isResolved       : boolean('isResolved').notNull()
      .default(false),
    userId: uuid('userId')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('createdAt').notNull()
  },
  table => ({
    pk         : primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns       : [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt]
    })
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

// POI (Point of Interest) caching table
// Using pgTable for public schema (same as other tables in the original migration)
export const poi = pgTable('POI', {
  id      : varchar('id', { length: 255 }).primaryKey()
    .notNull(), // Foursquare fsq_id or generated coordinate-based ID
  name    : text('name').notNull(),
  address : text('address').notNull(),
  category: varchar('category', { length: 100 }).notNull(),

  // Coordinates
  latitude : real('latitude').notNull(),
  longitude: real('longitude').notNull(),

  // Foursquare data (JSON for flexibility)
  properties: json('properties'), // Additional Foursquare properties
  photos    : json('photos'), // Array of POIPhoto objects
  categories: json('categories'), // Full categories array with icons and IDs
  location  : json('location'), // Full location object with all address components

  // Main image URL
  imageUrl: text('imageUrl'),

  // POI metadata
  rating    : real('rating'),
  price     : integer('price'), // 1-4 scale
  hours     : text('hours'), // Display string (e.g., "Mon–Sun: 24 Hours")
  hoursData : json('hoursData'), // Full hours object with regular schedule
  openNow   : boolean('openNow'), // Whether place is currently open
  phone     : varchar('phone', { length: 50 }),
  website   : text('website'),
  tips      : json('tips'), // Array of tip objects with text and created_at
  tipsCount : integer('tipsCount'),
  popularity: real('popularity'),
  distance  : real('distance'), // Distance from search point in meters

  // AI-generated description
  aiDescription: text('aiDescription'),

  // Cache management
  createdAt: timestamp('createdAt').notNull()
    .defaultNow(),
  updatedAt: timestamp('updatedAt').notNull()
    .defaultNow(),
  expiresAt: timestamp('expiresAt').notNull(), // Cache expiration (7 days default)

  // Source tracking
  source: varchar('source', { length: 50 }).notNull()
    .default('foursquare')
});

export type POI = InferSelectModel<typeof poi>;
