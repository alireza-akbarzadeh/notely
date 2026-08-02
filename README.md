# Notely

Notely is a notes workspace for capturing ideas, organizing spaces, collaborating with checklists, and staying in sync across devices.

**Home after login:** `/notes`

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui**
- **Better Auth** (email/password, optional Google/Apple, 2FA)
- **Neon PostgreSQL** + **Drizzle ORM**
- **TanStack Query** + **Zustand**
- **next-themes** (light / dark / system)
- **Realtime sync** via authenticated **SSE** (`/api/realtime`)

## Features

- Spaces, notes, tags, favorites, Today view
- Checklists (shared editors can add/update todos)
- Attachments (DB upload ≤2MB + external links)
- Note sharing by email (invite → Inbox accept/decline)
- Calendar / upcoming events utility sidebar
- Cmd+K note search
- Light and dark themes + app bar (search, share, notifications, theme, account)
- **Cross-device realtime sync** — after a note/task/attachment save, other open sessions receive a push and refresh

## Getting started

### 1. Install

```bash
pnpm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Random secret (32+ characters) |
| `BETTER_AUTH_URL` | App URL for auth callbacks (optional) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (default `http://localhost:3000`) |
| `EMAIL_PROVIDER` | `console` (default) or `resend` |
| `RESEND_API_KEY` / `EMAIL_FROM` | Required when `EMAIL_PROVIDER=resend` |
| `GOOGLE_*` / `APPLE_*` | Optional social OAuth credentials |

### 3. Database

```bash
pnpm db:migrate
# or during early setup: pnpm db:push
```

### 4. Dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── (auth)/           # Login, register, reset, 2FA
│   ├── (dashboard)/      # Notes + settings
│   ├── (marketing)/      # Landing
│   └── api/              # Auth, notes, tasks, shares, realtime, …
├── components/
│   ├── layout/           # Sidebar, app bar, shell
│   ├── notes/            # List, editor, checklist, share, inbox
│   └── ui/               # shadcn primitives
├── hooks/                # useRealtimeSync, …
└── lib/
    ├── auth/             # Better Auth
    ├── db/               # Drizzle schema + client
    ├── notes/            # Domain services + access control
    └── realtime/         # SSE hub + client id helpers
```

## Realtime sync

Mutations publish typed events (`note.updated`, `tasks.changed`, …) to an in-memory hub. Authenticated clients subscribe with `EventSource` on `GET /api/realtime`. Each browser tab sends `x-client-id` so it ignores its own echoes.

```
Device A ──PATCH──► API ──publish──► Hub ──SSE──► Device B
```

**Limits:** the hub is **in-process**. It works for `pnpm dev` and a single Node instance. On multi-instance Vercel, subscribers on another instance will not see events until you add Redis/Upstash pub-sub or a dedicated WebSocket room service (PartyKit / similar). The event schema is transport-agnostic for that upgrade.

## Deploy on Vercel

1. Push the repo to GitHub and import in [Vercel](https://vercel.com)
2. Set env vars from `.env.example` / `.env.local`
3. Run migrations against production Neon (`pnpm db:migrate`)
4. Deploy (`next build`)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Generate SQL migrations |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push schema (dev) |
| `pnpm db:studio` | Drizzle Studio |
| `pnpm graphify:update` | Refresh code knowledge graph |

## Roadmap

See [docs/NOTELY_ROADMAP.md](docs/NOTELY_ROADMAP.md).
