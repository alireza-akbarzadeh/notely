# Notely — Features & backlog

Living product map: what ships today, what to polish, and what to build next.
Use this with `docs/NOTELY_ROADMAP.md` (migration history). Prefer this file for new work.

**App home:** `/workspace`  
**Note editor:** `/notes/[id]`  
**Last reviewed:** 2026-08-01  
**Implementation progress:** Working through §4 build order top-to-bottom. Tracker below.

### Progress tracker

| Item | Status |
|------|--------|
| P0.1 SW / cache (dev bypass + prod network-first `/_next/static/`) | ✅ done (`notely-v3`) |
| P0.2 `readJson` on notes / reminders / shares / calendar / shell clients | ✅ done |
| P0.3 Tasks cache races (idempotent create + key dedupe) | ✅ verified |
| P0.4 Reminder dialog QA (permission copy, errors) | ✅ done |
| A1 Snooze / reschedule reminders (+1h, tomorrow, edit) | ✅ done |
| P1.5 Archive vs Shared clarity | ✅ done (`view=shared`, labels “Shared with me”) |
| P1.6 Today view definition | ✅ done (edited today ∪ reminder due today) |
| P1.7 Trash UX | ✅ done (empty trash API + retention hint + status banner) |
| P1.8 Integrations empty / error | ✅ done (numbered Google OAuth setup steps) |
| A2 Task due dates + Due today | ✅ done (`dueAt` + board filter + Today notes) |
| A5 AI summarize / extract tasks | ⬜ next |
| A6 Note templates | ⬜ queued |

---

## Status legend

| Tag | Meaning |
|-----|---------|
| `shipped` | In production code and usable |
| `polish` | Exists, but UX/reliability needs work |
| `gap` | Marketed or half-wired; finish or cut from copy |
| `next` | Not built; high value for the next cycles |
| `later` | Valuable, but after the next batch |

---

## 1. Current product surface

### Workspace & navigation — `shipped`

| Feature | Notes |
|---------|--------|
| Unified workspace | `/workspace?view=…` for notes, today, favorites, archive, inbox, trash, integrations |
| Legacy redirects | `/notes` list + `/integrations` → workspace views |
| Spaces | Create, rename, favorite, soft-delete / restore / permanent delete |
| Sidebar + mobile bottom nav | Notes chrome without top AppBar; sheet sidebar on small screens |
| Focus mode | Distraction-reduced writing (Zustand) |

### Notes & editor — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Create / edit / autosave | `shipped` | Title + rich content |
| Pin / favorite | `shipped` | |
| Soft trash + restore + permanent delete | `shipped` | Notes and spaces |
| Archive / shared views | `shipped` | Canonical `view=shared`; `archive` redirects via normalize |
| Rich toolbar | `shipped` | Headings, lists, quotes, code, text color, links, images |
| Text color picker | `polish` | Fixed Base UI group crash; keep regression-tested |
| Checklists in notes | `shipped` | Tied to tasks API |
| Note search (Cmd/Ctrl+K) | `shipped` | Titles + bodies |
| Empty / loading states | `polish` | Uneven across views |

### Organization — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Color tags | `shipped` | Create, attach, filter |
| Tag management UI | `polish` | Rename/merge/delete flows thin |
| Space-scoped browsing | `shipped` | `?spaceId=` |
| Today / Favorites views | `shipped` | Today = edited today or reminder due today; Favorites labeled correctly |

### Tasks board — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Kanban (todo / in progress / done) | `shipped` | Drag + status column |
| Standalone `/tasks` page | `shipped` | |
| Note-linked + free tasks | `polish` | Linking UX and duplicate-cache races need hardening |
| Due dates on tasks | `shipped` | `dueAt` column; board date + Due today filter |

### Calendar & events — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Calendar workspace | `shipped` | Events CRUD, note links |
| Mini / upcoming UI | `polish` | Density and empty states |
| Recurring events | `later` | |
| Time zones | `later` | Assume local for now; document |

### Reminders & notifications — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Note reminders (date/time + sound) | `shipped` | Dialog + shadcn calendar/time picker |
| Reminder countdown on note | `shipped` | |
| Web Push + service worker | `shipped` | Subscribe from settings |
| In-app reminder runtime | `shipped` | Sound + open note |
| Event reminders | `polish` | Wire parity with note reminders |
| SW caching in production | `shipped` | Dev: no fetch caching. Prod: network-first for `/_next/static/`, cache-first for icons |
| Reminder snooze / reschedule | `shipped` | +1h, tomorrow 9am, full reschedule in dialog |
| Email reminders | `later` | |

### Sharing & inbox — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Invite by email (viewer / editor) | `shipped` | Registered users |
| Inbox accept / decline | `shipped` | |
| Shared-with-me list | `shipped` | |
| Live co-editing | `later` | No CRDT/presence yet |
| Public share links | `later` | |
| Mentions / @notify | `later` | |

### Attachments — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Links + small DB files (≤2MB) | `shipped` | Resources panel |
| Image embed in editor | `shipped` | |
| Blob / CDN storage for large files | `next` | Netlify Blobs or similar |
| Drag-drop upload polish | `polish` | Progress, type limits, errors |

### Integrations — `shipped` / `gap`

| Feature | Status | Notes |
|---------|--------|--------|
| Google OAuth connect | `shipped` | Credentials + connection card |
| Import Gmail / Calendar into notes | `polish` | Items API + note panel; deepen import UX |
| Disconnect / reconnect clarity | `polish` | |
| More providers (Notion, Todoist, …) | `later` | |

### AI assistant — `shipped` / `gap`

| Feature | Status | Notes |
|---------|--------|--------|
| Note chat API + UI kit | `shipped` | `api/ai/note-chat`, `ai-elements` |
| Summarize / rewrite / continue | `polish` | Prompt quality + streaming UX |
| Ask across all notes (RAG) | `next` | Embeddings + retrieval |
| AI on landing/pricing copy | `gap` | Align “Pro” messaging with actual gates (or add billing) |

### Auth & settings — `shipped`

| Feature | Status | Notes |
|---------|--------|--------|
| Email/password + social | `shipped` | Better Auth |
| 2FA | `shipped` | |
| Account / security / appearance | `shipped` | |
| Notification settings (push) | `shipped` | |
| Theme light/dark | `shipped` | |

### PWA & mobile — `shipped` / `polish`

| Feature | Status | Notes |
|---------|--------|--------|
| Manifest + SW + icons | `shipped` | `start_url` → `/workspace` |
| Mobile bottom nav | `shipped` | |
| Install prompt / offline shell | `polish` | Offline write queue not built |
| Safe areas | `polish` | Spot-check editor + dialogs |

---

## 2. Make the current state better (polish first)

Do these before large new surfaces. Ordered by user-visible impact.

### P0 — Reliability & trust

1. ~~**Service worker / Turbopack stale chunks**~~ — Done (`notely-v3`).
2. ~~**API JSON errors**~~ — Done: shell + notes + reminders + shares + calendar + integrations use `readJson`.
3. ~~**Tasks cache races**~~ — Verified idempotent create + dedupe in `task-board`.
4. ~~**Reminder dialog QA**~~ — Permission hints; create still works when notifications blocked.

### P1 — Clarity & navigation

5. ~~**Archive vs Shared**~~ — Done: `view=shared`, sidebar/AppBar/empty “Shared with me”.
6. ~~**Today view**~~ — Done: edited today ∪ pending reminder due today; sidebar “Today”.
7. ~~**Trash UX**~~ — Done: Empty trash + confirm, retention copy, restore/empty status banner.
8. ~~**Integrations empty / error**~~ — Done: numbered Cloud Console setup + redirect URI + CTA.

### P2 — Editor & notes quality

9. **Autosave indicator** — Explicit Saving / Saved / Offline / Error.
10. **Undo stack for destructive** — Confirm dialogs already; add toast “Restored” after undo paths.
11. **Tag rename / delete** — From settings or sidebar without leaving the note.
12. **Search ranking** — Boost title matches, recent, favorites; show space name in results.
13. **Keyboard shortcuts sheet** — `?` overlay: new note, search, bold, remind, etc.

### P3 — Performance & craft

14. **Notes list virtualization** — Large spaces.
15. **Image compression** before DB attach.
16. **Replace stale README** — Still describes Nexora trading; rewrite for Notely (link this doc).
17. **graphify in CI / local** — Fix Python env so `pnpm graphify:update` is reliable.

---

## 3. New features backlog

### Wave A — Next (highest leverage)

| ID | Feature | Why | Rough scope |
|----|---------|-----|-------------|
| A1 | ~~**Snooze / reschedule reminders**~~ | Shipped | +1h / tomorrow / Reschedule + Save changes |
| A2 | ~~**Task due dates + “Due today”**~~ | Shipped | `dueAt`; board filter; Today includes linked notes |
| A3 | **Offline-friendly draft queue** | Mobile / flaky net | IndexedDB queue + flush on reconnect |
| A4 | **Larger attachments via Blobs** | 2MB DB cap is a ceiling | Netlify Blobs + signed URLs |
| A5 | **AI: summarize note + extract tasks** | Uses existing chat path | One-shot actions in editor panel |
| A6 | **Note templates** | Faster capture | Meeting, daily journal, project brief |
| A7 | **Export note** | Portability | Markdown / PDF download |

### Wave B — Differentiation

| ID | Feature | Why | Rough scope |
|----|---------|-----|-------------|
| B1 | **RAG over all notes** | “Ask your notes” for real | Chunk + embed + cite sources |
| B2 | **Google Calendar two-way sync** | Beyond one-shot import | Map events ↔ Notely events |
| B3 | **Recurring reminders** | Habits | RRULE or simple daily/weekly |
| B4 | **Version history** | Trust for long notes | Snapshot on idle save; restore |
| B5 | **Public read-only link** | Share without account | Tokenized `/s/[token]` |
| B6 | **Space-level sharing** | Team plan story | Members + roles on spaces |
| B7 | **Daily digest email** | Soft re-engagement | Cron: due tasks + reminders |

### Wave C — Later / platform

| ID | Feature | Notes |
|----|---------|--------|
| C1 | Real-time co-editing | Yjs / PartyKit |
| C2 | Billing (Personal / Pro / Team) | Align landing gates with Stripe |
| C3 | Mobile native shells | Capacitor / PWA install polish |
| C4 | Webhooks / API tokens | Power users + Zapier |
| C5 | Full-text Postgres (`tsvector`) | Scale search past `ilike` |
| C6 | Audit log for shares | Team compliance |

---

## 4. Suggested build order (next 4–6 weeks)

```text
Week 1  P0 reliability (SW, readJson everywhere, reminder QA)
        A1 snooze reminders
Week 2  P1 nav clarity (Archive/Shared, Today definition, trash)
        A2 task due dates → Today view
Week 3  A5 AI summarize / extract tasks
        A6 templates (start with 3)
Week 4  A4 Blobs attachments OR A7 export Markdown
        P2 autosave indicator + shortcuts sheet
Week 5+ B1 RAG spike  ·  B2 Calendar sync spike  ·  README rewrite
```

Adjust if monetization matters first: then **C2 billing** before marketing “Pro-only” features as gated.

---

## 5. Explicit non-goals (for now)

- Rebuilding the landing as a generic AI SaaS page
- Notion-parity databases / multi-property tables
- Desktop Electron app
- End-to-end encrypted notes (would block search/AI until redesigned)

---

## 6. How to use this doc

1. Pick items from **§2 polish** or **§3 Wave A** only unless product priority changes.
2. When shipping, flip status tags here (`polish` → `shipped`, remove from Wave A).
3. After substantive code changes, run `pnpm graphify:update`.
4. Keep marketing copy (`src/components/landing/content.ts`) honest vs this file — especially AI, billing, and team spaces.

---

## 7. Quick inventory (code map)

| Area | Primary paths |
|------|----------------|
| Workspace routing | `src/lib/workspace/paths.ts`, `src/components/workspace/app-workspace.tsx` |
| Notes UI | `src/components/notes/**` |
| Editor | `src/components/notes/note-editor/**` |
| Tasks | `src/components/tasks/**`, `src/lib/notes/tasks.ts` |
| Calendar | `src/components/calendar/**`, `src/lib/notes/events.ts` |
| Reminders / push | `src/lib/notes/reminders.ts`, `src/lib/notifications/**`, `public/sw.js` |
| Shares / search | `src/lib/notes/shares.ts` |
| Google | `src/lib/google-integration.ts`, `src/app/api/integrations/google/**` |
| AI | `src/app/api/ai/note-chat`, `src/lib/ai/**` |
| Schema | `src/lib/db/schema.ts` |
