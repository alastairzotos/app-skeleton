CREATE TABLE "outbox" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"queue" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"payload" jsonb,
	"claimed" boolean DEFAULT false
);
