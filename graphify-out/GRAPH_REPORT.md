# Graph Report - notely  (2026-07-31)

## Corpus Check
- 108 files · ~26,053 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 623 nodes · 1248 edges · 30 communities (26 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6271bb1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- security-settings.tsx
- service.ts
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
- tabs.tsx
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- dialog.tsx
- dashboard-shell.tsx
- sheet.tsx
- react
- Notely Drizzle + Neon
- Notely Better Auth

## God Nodes (most connected - your core abstractions)
1. `cn()` - 145 edges
2. `requireSession()` - 32 edges
3. `jsonError()` - 29 edges
4. `scripts` - 16 edges
5. `compilerOptions` - 16 edges
6. `Button()` - 14 edges
7. `authClient` - 10 edges
8. `Notely roadmap` - 10 edges
9. `FieldGroup()` - 9 edges
10. `Input()` - 9 edges

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

## Communities (30 total, 4 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.05
Nodes (65): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+57 more)

### Community 1 - "service.ts"
Cohesion: 0.05
Nodes (88): GET(), Params, DELETE(), Params, GET(), POST(), DELETE(), GET() (+80 more)

### Community 2 - "utils.ts"
Cohesion: 0.09
Nodes (27): Params, metadata, LandingPage(), NotelyLogo(), NotelyLogoProps, NoteChecklist(), NoteChecklistProps, DraftSnapshot (+19 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.11
Nodes (22): { GET, POST }, GET(), appleEnabled, auth, env, googleEnabled, Session, generateAppleClientSecret() (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (41): @base-ui/react, better-auth, @better-auth/infra, class-variance-authority, clsx, drizzle-orm, @hookform/resolvers, jose (+33 more)

### Community 5 - "user-menu.tsx"
Cohesion: 0.09
Nodes (25): UserAvatar(), UserMenu(), UserMenuProps, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+17 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (38): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.11
Nodes (28): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+20 more)

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
Cohesion: 0.13
Nodes (14): Architecture, Calendar / meetings sidebar, Files / attachments, Inbox / global search, Keep vs drop, Notely roadmap, Phase 1 — Strip trading, Phase 2 — Auth rebrand (logic unchanged) (+6 more)

### Community 12 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 13 - "app/layout.tsx"
Cohesion: 0.33
Nodes (4): geistMono, geistSans, metadata, Providers()

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 24 - "dialog.tsx"
Cohesion: 0.18
Nodes (6): DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 25 - "dashboard-shell.tsx"
Cohesion: 0.24
Nodes (6): AppSidebar(), fetchSpaces(), DashboardShell(), MobileBottomNav(), SidebarInset(), SpaceSummary

### Community 26 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 27 - "react"
Cohesion: 0.40
Nodes (5): react, react, SidebarMenuSkeleton(), SidebarProvider(), useIsMobile()

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

## Knowledge Gaps
- **182 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+177 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `utils.ts`, `user-menu.tsx`, `sidebar.tsx`, `tabs.tsx`, `dialog.tsx`, `dashboard-shell.tsx`, `sheet.tsx`, `react`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `react`, `scripts`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`, `sidebar.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _182 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05147563486616335 - nodes in this community are weakly interconnected._
- **Should `service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050673854447439354 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09082125603864734 - nodes in this community are weakly interconnected._