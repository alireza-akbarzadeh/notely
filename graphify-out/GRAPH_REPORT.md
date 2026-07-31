# Graph Report - notely  (2026-07-31)

## Corpus Check
- 126 files · ~31,285 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 697 nodes · 1482 edges · 35 communities (31 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `02a42145`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- security-settings.tsx
- validations/notes.ts
- utils.ts
- auth/index.ts
- dependencies
- user-menu.tsx
- scripts
- sidebar.tsx
- cn
- compilerOptions
- components.json
- Notely roadmap
- Find Skills
- app/layout.tsx
- Nexora
- shares.ts
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- app-sidebar.tsx
- dashboard-shell.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- note-editor.tsx
- requireNoteAccess
- events/route.ts
- spaces/[id]/route.ts
- tags/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 152 edges
2. `requireSession()` - 47 edges
3. `jsonError()` - 41 edges
4. `requireNoteAccess()` - 20 edges
5. `Button()` - 19 edges
6. `scripts` - 16 edges
7. `compilerOptions` - 16 edges
8. `Input()` - 13 edges
9. `authClient` - 10 edges
10. `Notely roadmap` - 10 edges

## Surprising Connections (you probably didn't know these)
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `useIsMobile()` --references--> `react`  [EXTRACTED]
  src/hooks/use-mobile.ts → package.json
- `TwoFactorPage()` --calls--> `cn()`  [EXTRACTED]
  src/app/(auth)/two-factor/page.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (35 total, 4 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.06
Nodes (63): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+55 more)

### Community 1 - "validations/notes.ts"
Cohesion: 0.10
Nodes (27): DELETE(), Params, PATCH(), GET(), POST(), tasks, createTask(), deleteTask() (+19 more)

### Community 2 - "utils.ts"
Cohesion: 0.23
Nodes (11): AppBar(), AppBarProps, Header(), OPTIONS, ThemeModeButton(), ThemeToggleProps, Button(), Separator() (+3 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.11
Nodes (22): { GET, POST }, GET(), appleEnabled, auth, env, googleEnabled, Session, generateAppleClientSecret() (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (43): @base-ui/react, better-auth, @better-auth/infra, class-variance-authority, clsx, drizzle-orm, @hookform/resolvers, jose (+35 more)

### Community 5 - "user-menu.tsx"
Cohesion: 0.09
Nodes (25): UserAvatar(), UserMenu(), UserMenuProps, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+17 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (38): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.08
Nodes (28): react, react, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+20 more)

### Community 8 - "cn"
Cohesion: 0.10
Nodes (32): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Label() (+24 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "Notely roadmap"
Cohesion: 0.12
Nodes (15): Architecture, Calendar / meetings sidebar, Files / attachments, Inbox / global search, Keep vs drop, Notely roadmap, Phase 1 — Strip trading, Phase 2 — Auth rebrand (logic unchanged) (+7 more)

### Community 12 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 13 - "app/layout.tsx"
Cohesion: 0.24
Nodes (6): geistMono, geistSans, metadata, Providers(), ThemeProvider(), TooltipProvider()

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "shares.ts"
Cohesion: 0.10
Nodes (23): DELETE(), Params, PATCH(), db, sql, account, attachments, notes (+15 more)

### Community 24 - "app-sidebar.tsx"
Cohesion: 0.11
Nodes (20): AppSidebar(), fetchSpaces(), SearchHit, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+12 more)

### Community 26 - "dashboard-shell.tsx"
Cohesion: 0.20
Nodes (9): DashboardShell(), MobileBottomNav(), CalendarEvent, daysInMonth(), startOfMonth(), UtilitySidebar(), NoteSearchDialog(), SidebarInset() (+1 more)

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

### Community 30 - "requireSession"
Cohesion: 0.16
Nodes (22): GET(), DELETE(), GET(), Params, PATCH(), GET(), POST(), GET() (+14 more)

### Community 31 - "service.ts"
Cohesion: 0.24
Nodes (16): GET(), POST(), assertSpaceOwned(), createNote(), createSpace(), ensureDefaultSpace(), getNote(), listNotes() (+8 more)

### Community 32 - "note-editor.tsx"
Cohesion: 0.07
Nodes (29): Params, metadata, LandingPage(), NotelyLogo(), NotelyLogoProps, InboxPanel(), Invite, NoteChecklist() (+21 more)

### Community 33 - "requireNoteAccess"
Cohesion: 0.25
Nodes (13): GET(), Params, DELETE(), Params, GET(), POST(), requireNoteAccess(), createDbFileAttachment() (+5 more)

### Community 34 - "events/route.ts"
Cohesion: 0.26
Nodes (10): DELETE(), Params, GET(), POST(), events, createEvent(), deleteEvent(), listEvents() (+2 more)

### Community 37 - "spaces/[id]/route.ts"
Cohesion: 0.38
Nodes (6): DELETE(), Params, PATCH(), deleteSpace(), updateSpace(), updateSpaceSchema

### Community 39 - "tags/route.ts"
Cohesion: 0.47
Nodes (5): GET(), POST(), createTag(), listTags(), createTagSchema

## Knowledge Gaps
- **197 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+192 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `note-editor.tsx`, `utils.ts`, `user-menu.tsx`, `sidebar.tsx`, `app-sidebar.tsx`, `dashboard-shell.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`, `sidebar.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Why does `react` connect `sidebar.tsx` to `dependencies`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _197 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05568039950062422 - nodes in this community are weakly interconnected._
- **Should `validations/notes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1032258064516129 - nodes in this community are weakly interconnected._
- **Should `auth/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._