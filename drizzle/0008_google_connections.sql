CREATE TABLE IF NOT EXISTS "google_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"googleAccountId" text NOT NULL,
	"email" text NOT NULL,
	"accessToken" text NOT NULL,
	"refreshToken" text,
	"scope" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "google_connections_userId_unique" ON "google_connections" USING btree ("userId");
--> statement-breakpoint
ALTER TABLE "google_connections" ADD CONSTRAINT "google_connections_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
