CREATE TABLE IF NOT EXISTS "google_oauth_credentials" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"clientId" text NOT NULL,
	"clientSecret" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "google_oauth_credentials_userId_unique" ON "google_oauth_credentials" USING btree ("userId");
--> statement-breakpoint
ALTER TABLE "google_oauth_credentials" ADD CONSTRAINT "google_oauth_credentials_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
