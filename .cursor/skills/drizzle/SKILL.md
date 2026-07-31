---
name: drizzle
description: >-
  Nexora Drizzle ORM + Neon Postgres patterns. Use when editing pgTable schemas,
  db.select/insert/update, migrations, drizzle-kit scripts, or src/lib/db/**.
---

# Nexora Drizzle + Neon

## Layout

- Schema: `src/lib/db/schema.ts`
- Client: `src/lib/db/index.ts` (`drizzle-orm/neon-http` + `@neondatabase/serverless`)
- Config: `drizzle.config.ts` → `out: ./drizzle`
- Scripts: `pnpm db:generate | db:migrate | db:push | db:studio`

## Conventions

- Text primary keys (Better Auth style), not serials
- Better Auth tables keep camelCase column names (`emailVerified`, `userId`) to match the adapter
- App tables (`exchange_connections`, `watchlists`) follow the same column naming as nearby schema
- Export tables from `schema.ts`; re-export via `@/lib/db`
- Always pass `{ schema }` to `drizzle(...)` so relational queries work

## Queries

Prefer the existing style:

```typescript
import { and, eq } from "drizzle-orm";
import { db, exchangeConnections } from "@/lib/db";

const [row] = await db
  .select()
  .from(exchangeConnections)
  .where(
    and(
      eq(exchangeConnections.userId, userId),
      eq(exchangeConnections.isActive, true),
    ),
  )
  .limit(1);
```

## Migrations

1. Edit `src/lib/db/schema.ts`
2. `pnpm db:generate`
3. Review SQL under `drizzle/`
4. `pnpm db:migrate` (or `db:push` only for local prototyping)

Never put secrets in schema files. `DATABASE_URL` comes from env via `getEnv()`.
