# Graph Report - notely  (2026-07-31)

## Corpus Check
- 102 files · ~24,198 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 596 nodes · 1166 edges · 31 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04ab58d8`
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
- landing-page.tsx
- breadcrumb.tsx
- avatar.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- badge.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `requireSession()` - 25 edges
3. `jsonError()` - 22 edges
4. `scripts` - 16 edges
5. `compilerOptions` - 16 edges
6. `Button()` - 13 edges
7. `authClient` - 10 edges
8. `Notely roadmap` - 10 edges
9. `FieldGroup()` - 9 edges
10. `Nexora` - 9 edges

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

## Communities (31 total, 5 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.05
Nodes (65): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+57 more)

### Community 1 - "service.ts"
Cohesion: 0.06
Nodes (70): DELETE(), GET(), Params, PATCH(), GET(), POST(), DELETE(), Params (+62 more)

### Community 2 - "utils.ts"
Cohesion: 0.14
Nodes (15): Params, NoteChecklist(), NoteChecklistProps, NoteEditor(), NoteEditorProps, NotesList(), NotesListProps, NotesWorkspace() (+7 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.10
Nodes (24): { GET, POST }, GET(), appleEnabled, auth, env, googleEnabled, Session, generateAppleClientSecret() (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (41): @base-ui/react, better-auth, @better-auth/infra, class-variance-authority, clsx, drizzle-orm, @hookform/resolvers, jose (+33 more)

### Community 5 - "user-menu.tsx"
Cohesion: 0.13
Nodes (17): UserAvatar(), UserMenu(), UserMenuProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+9 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (38): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.06
Nodes (46): react, react, AppSidebar(), fetchSpaces(), DashboardShell(), HeaderProps, MobileBottomNav(), Separator() (+38 more)

### Community 8 - "cn"
Cohesion: 0.15
Nodes (20): Label(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator() (+12 more)

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
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, Providers(), TooltipProvider()

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 24 - "dialog.tsx"
Cohesion: 0.18
Nodes (6): DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle()

### Community 25 - "landing-page.tsx"
Cohesion: 0.31
Nodes (4): metadata, LandingPage(), NotelyLogo(), NotelyLogoProps

### Community 26 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 27 - "avatar.tsx"
Cohesion: 0.29
Nodes (6): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage()

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

## Knowledge Gaps
- **178 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `utils.ts`, `user-menu.tsx`, `sidebar.tsx`, `tabs.tsx`, `dialog.tsx`, `landing-page.tsx`, `breadcrumb.tsx`, `avatar.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`, `sidebar.tsx`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `react` connect `sidebar.tsx` to `dependencies`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05352968676951847 - nodes in this community are weakly interconnected._
- **Should `service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06288568909785483 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._