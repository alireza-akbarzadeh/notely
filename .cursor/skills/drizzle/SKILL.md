---
name: drizzle
description: >-
  Notely Drizzle ORM + Neon Postgres patterns. Use when editing pgTable schemas,
  db.select/insert/update, migrations, drizzle-kit scripts, or src/lib/db/**.
---

# Notely Drizzle + Neon

## Layout

- Schema: `src/lib/db/schema.ts`
- Client: `src/lib/db/index.ts` (`drizzle-orm/neon-http` + `@neondatabase/serverless`)
- Config: `drizzle.config.ts` → `out: ./drizzle`
- Scripts: `pnpm db:generate | db:migrate | db:push | db:studio`

## Conventions

- Text primary keys (Better Auth style), not serials
- Better Auth tables keep camelCase column names (`emailVerified`, `userId`) to match the adapter
- App tables (`spaces`, `notes`, `tags`, `note_tags`) follow the same column naming as nearby schema
- Export tables from `schema.ts`; re-export via `@/lib/db`
- Always pass `{ schema }` to `drizzle(...)` so relational queries work
- Domain logic for notes lives in `src/lib/notes/service.ts`

## Queries

Prefer the existing style:

```typescript
import { and, eq } from "drizzle-orm";
import { db, notes } from "@/lib/db";

const [row] = await db
  .select()
  .from(notes)
  .where(
    and(
      eq(notes.userId, userId),
      eq(notes.id, noteId),
    ),
  )
  .limit(1);
```

## Migrations

- After schema edits: `pnpm db:generate` then `pnpm db:migrate`
- Do not rewrite historical SQL under `drizzle/` — add a new migration
- Current notes migration: `drizzle/0002_notely_notes.sql`
