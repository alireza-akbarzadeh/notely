# Graph Report - notely  (2026-07-31)

## Corpus Check
- 135 files · ~33,533 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 739 nodes · 1621 edges · 39 communities (35 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2acbc59`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- security-settings.tsx
- tasks.ts
- app-bar.tsx
- auth/index.ts
- dependencies
- utils.ts
- scripts
- sidebar.tsx
- cn
- compilerOptions
- components.json
- Notely roadmap
- Find Skills
- jsonError
- sheet.tsx
- hub.ts
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- dialog.tsx
- react
- dashboard-shell.tsx
- tags/[id]/route.ts
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- note-editor.tsx
- validations/notes.ts
- events/route.ts
- app/layout.tsx
- tabs.tsx
- spaces/[id]/route.ts
- tags/route.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 155 edges
2. `requireSession()` - 49 edges
3. `jsonError()` - 41 edges
4. `Button()` - 20 edges
5. `requireNoteAccess()` - 20 edges
6. `scripts` - 16 edges
7. `compilerOptions` - 16 edges
8. `getRequestClientId()` - 15 edges
9. `publishNoteEvent()` - 14 edges
10. `Input()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `useIsMobile()` --references--> `react`  [EXTRACTED]
  src/hooks/use-mobile.ts → package.json
- `TwoFactorPage()` --calls--> `cn()`  [EXTRACTED]
  src/app/(auth)/two-factor/page.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (39 total, 4 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.05
Nodes (63): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+55 more)

### Community 1 - "tasks.ts"
Cohesion: 0.24
Nodes (11): GET(), POST(), tasks, createTask(), listIncompleteTasks(), listTasksForNote(), RealtimeMeta, serializeTask() (+3 more)

### Community 2 - "app-bar.tsx"
Cohesion: 0.22
Nodes (11): AppBar(), AppBarProps, Header(), OPTIONS, ThemeModeButton(), ThemeToggle(), ThemeToggleProps, Separator() (+3 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.11
Nodes (22): { GET, POST }, GET(), appleEnabled, auth, env, googleEnabled, Session, generateAppleClientSecret() (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (43): @base-ui/react, better-auth, @better-auth/infra, class-variance-authority, clsx, drizzle-orm, @hookform/resolvers, jose (+35 more)

### Community 5 - "utils.ts"
Cohesion: 0.06
Nodes (40): Params, UserAvatar(), UserMenu(), UserMenuProps, NoteFormatToolbar(), NoteFormatToolbarProps, ToolbarIcon(), NotesList() (+32 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (38): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.13
Nodes (24): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+16 more)

### Community 8 - "cn"
Cohesion: 0.12
Nodes (26): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SelectContent() (+18 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "Notely roadmap"
Cohesion: 0.06
Nodes (29): Architecture, Calendar / meetings sidebar, Files / attachments, Inbox / global search, Keep vs drop, Notely roadmap, Phase 1 — Strip trading, Phase 2 — Auth rebrand (logic unchanged) (+21 more)

### Community 12 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 13 - "jsonError"
Cohesion: 0.19
Nodes (17): DELETE(), Params, DELETE(), GET(), Params, PATCH(), DELETE(), Params (+9 more)

### Community 14 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 15 - "hub.ts"
Cohesion: 0.09
Nodes (24): GET(), db, sql, account, attachments, notes, noteShares, noteTags (+16 more)

### Community 24 - "dialog.tsx"
Cohesion: 0.21
Nodes (8): SearchHit, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 25 - "react"
Cohesion: 0.40
Nodes (5): react, react, SidebarMenuSkeleton(), SidebarProvider(), useIsMobile()

### Community 26 - "dashboard-shell.tsx"
Cohesion: 0.18
Nodes (10): AppSidebar(), fetchSpaces(), DashboardShell(), CalendarEvent, daysInMonth(), startOfMonth(), UtilitySidebar(), NoteSearchDialog() (+2 more)

### Community 27 - "tags/[id]/route.ts"
Cohesion: 0.67
Nodes (3): DELETE(), Params, deleteTag()

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

### Community 30 - "requireSession"
Cohesion: 0.14
Nodes (23): GET(), Params, GET(), GET(), DELETE(), Params, PATCH(), GET() (+15 more)

### Community 31 - "service.ts"
Cohesion: 0.17
Nodes (23): GET(), POST(), GET(), POST(), assertSpaceOwned(), createNote(), createSpace(), ensureDefaultSpace() (+15 more)

### Community 32 - "note-editor.tsx"
Cohesion: 0.08
Nodes (33): metadata, LandingPage(), NotelyLogo(), NotelyLogoProps, MobileBottomNav(), InboxPanel(), Invite, NoteChecklist() (+25 more)

### Community 33 - "validations/notes.ts"
Cohesion: 0.19
Nodes (15): GET(), POST(), createDbFileAttachment(), createLinkAttachment(), listAttachmentsForNote(), RealtimeMeta, serializeAttachment(), CreateEventValues (+7 more)

### Community 34 - "events/route.ts"
Cohesion: 0.26
Nodes (10): DELETE(), Params, GET(), POST(), events, createEvent(), deleteEvent(), listEvents() (+2 more)

### Community 35 - "app/layout.tsx"
Cohesion: 0.24
Nodes (6): geistMono, geistSans, metadata, Providers(), ThemeProvider(), TooltipProvider()

### Community 36 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 37 - "spaces/[id]/route.ts"
Cohesion: 0.38
Nodes (6): DELETE(), Params, PATCH(), deleteSpace(), updateSpace(), updateSpaceSchema

### Community 39 - "tags/route.ts"
Cohesion: 0.47
Nodes (5): GET(), POST(), createTag(), listTags(), createTagSchema

## Knowledge Gaps
- **207 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `note-editor.tsx`, `app-bar.tsx`, `tabs.tsx`, `utils.ts`, `sidebar.tsx`, `sheet.tsx`, `dialog.tsx`, `react`, `dashboard-shell.tsx`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `react`, `scripts`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`, `sidebar.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054945054945054944 - nodes in this community are weakly interconnected._
- **Should `auth/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11264367816091954 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._