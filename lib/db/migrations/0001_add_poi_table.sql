-- Create POI table in public schema (same as other tables)
CREATE TABLE IF NOT EXISTS "POI" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"properties" json,
	"photos" json,
	"imageUrl" text,
	"rating" real,
	"price" integer,
	"hours" text,
	"phone" varchar(50),
	"website" text,
	"tipsCount" integer,
	"popularity" real,
	"aiDescription" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"source" varchar(50) DEFAULT 'foursquare' NOT NULL
);
