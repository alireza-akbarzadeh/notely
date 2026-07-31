# Notely roadmap

Step-by-step plan to replace the Nexora trading boilerplate with **Notely** — a notes app with spaces, tags, and a mobile-native shell. Auth (Better Auth) stays the same; only copy and branding change.

**Home route:** `/notes`  
**MVP:** Phases 1–4  
**Later:** Phase 5+

---

## Keep vs drop

| Keep | Drop |
|------|------|
| `src/lib/auth/**`, `src/app/(auth)/**`, `/api/auth`, `src/proxy.ts`, `auth-guard` | `src/lib/exchange/**`, `/api/exchange/**`, `/api/market` |
| Auth tables: `user`, `session`, `account`, `verification`, `twoFactor` | Tables `exchange_connections`, `watchlists` |
| Layout shell, forms, `src/components/ui/**`, account/2FA settings | `src/components/trading/**`, trading pages, crypto landing |
| TanStack Query, Zustand, Zod, RHF, Neon/Drizzle | `ccxt`, `lightweight-charts`, `protobufjs`, `ENCRYPTION_KEY` |

---

## Schema (Phase 3)

```
user ──< spaces ──< notes >──< note_tags >── tags
```

| Table | Columns |
|-------|---------|
| `spaces` | `id`, `userId`, `name`, `icon`, `sortOrder`, `isFavorite`, timestamps |
| `notes` | `id`, `spaceId`, `userId`, `title`, `content`, `summary`, `isPinned`, `isFavorite`, timestamps |
| `tags` | `id`, `userId`, `name`, `color` |
| `note_tags` | `noteId`, `tagId` (composite PK) |

Do **not** rewrite `0000` / `0001`. Add `0002_…` that drops trading tables and creates notes tables.

**Deferred (Phase 5+):** `tasks`, `attachments`, `events` / `meetings`.

---

## Architecture

```
Desktop:  nav sidebar | notes list | editor | (utility later)
Mobile:   single column — list ↔ editor stack; sidebar as sheet; bottom nav
```

API pattern (same as old exchange routes):

1. `requireSession()`
2. Zod `safeParse`
3. Logic in `src/lib/notes/**`
4. `NextResponse.json` / `jsonError`

---

## Phase 1 — Strip trading

- [x] Delete `src/lib/exchange/**`, `src/types/exchange.ts`, `src/lib/validations/exchange.ts`
- [x] Delete `/api/exchange/**`, `/api/market`
- [x] Delete `src/components/trading/**`, trading hooks/store/websocket
- [x] Delete `/trade`, `/markets`, `/portfolio` pages and trading dashboard overview
- [x] Remove `ccxt`, `lightweight-charts`, `protobufjs` from `package.json`
- [x] Remove `ENCRYPTION_KEY` from `src/lib/env.ts` and `.env.example`
- [x] Strip exchange UI from settings
- [x] Update Cursor architecture rule to Notely

**Done when:** App builds with no exchange imports; auth + settings still work.

---

## Phase 2 — Auth rebrand (logic unchanged)

- [x] `appName` / 2FA issuer → `Notely`
- [x] Auth shell, login, register, emails → Notely copy (no trading tape / exchanges)
- [x] Root metadata title → Notely
- [x] Redirects: post-login → `/notes` (update `proxy.ts` + auth pages)
- [x] Placeholders like `you@notely.app`

**Done when:** Login/register/2FA/reset still work; UI says Notely everywhere.

---

## Phase 3 — Schema + notes API

- [x] Add spaces / notes / tags / note_tags to `schema.ts`; remove exchange tables
- [x] Generate + run migration `0002_…`
- [x] `src/lib/notes/**` services
- [x] Zod validators in `src/lib/validations/notes.ts`
- [x] API routes: `/api/spaces`, `/api/notes`, `/api/notes/[id]`, `/api/tags`

**Done when:** Authenticated CRUD via API for spaces, notes, tags.

---

## Phase 4 — App shell + mobile + landing

- [x] Rewrite sidebar: New note, Search stub, Today, Favorites, Spaces, Settings
- [x] Notes list panel + editor (title, tags, textarea content)
- [x] Routes under `(dashboard)`: `/notes`, `/notes/[id]`, `/settings`
- [x] Mobile: list/editor stack, sheet sidebar, safe-area, large tap targets
- [x] Replace marketing landing with Notely hero

**Done when:** Create/open/edit notes on desktop and mobile; landing is notes-branded.

---

## Phase 5+ — Later (not MVP)

### Tasks / checklists

- [x] `tasks` table: `id`, `noteId`, `text`, `isCompleted`, `sortOrder`
- [x] Checklist block in editor; `/api/tasks`

### Files / attachments

- [ ] `attachments` table: `id`, `noteId`, `fileName`, `fileSize`, `url`
- [ ] Upload storage (R2/S3) + Resources section UI

### Calendar / meetings sidebar

- [ ] `events` table: `id`, `userId`, `title`, `startTime`, `endTime`, `link`
- [ ] Right utility column: mini-calendar + Upcoming + meeting card
- [ ] Can ship UI stubs before backend

### Inbox / global search

- [ ] Cmd+K search across notes
- [ ] Inbox for mentions / shared notes (when collaboration exists)

---

## Suggested implement order

1. Phase 1 strip → green build  
2. Phase 2 rebrand → auth smoke test  
3. Phase 3 schema + migrate → API smoke test  
4. Phase 4 shell → manual desktop + phone  
5. Phase 5+ one feature at a time  

After code changes: `pnpm graphify:update` (or `graphify update .`).
