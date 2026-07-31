CREATE TABLE "attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"noteId" text NOT NULL,
	"userId" text NOT NULL,
	"fileName" text NOT NULL,
	"fileSize" integer DEFAULT 0 NOT NULL,
	"mimeType" text DEFAULT 'application/octet-stream' NOT NULL,
	"storage" text DEFAULT 'link' NOT NULL,
	"url" text,
	"data" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_noteId_notes_id_fk" FOREIGN KEY ("noteId") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
