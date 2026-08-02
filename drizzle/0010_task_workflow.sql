ALTER TABLE "tasks" ALTER COLUMN "noteId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "status" text DEFAULT 'todo' NOT NULL;--> statement-breakpoint
UPDATE "tasks"
SET "status" = CASE WHEN "isCompleted" THEN 'done' ELSE 'todo' END;
