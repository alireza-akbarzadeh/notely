# Graph Report - .  (2026-07-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 542 nodes · 1117 edges · 24 communities (20 shown, 4 thin omitted)
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
- sheet.tsx
- dashboard-shell.tsx
- app/layout.tsx
- react
- tabs.tsx
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 143 edges
2. `requireSession()` - 25 edges
3. `jsonError()` - 22 edges
4. `scripts` - 16 edges
5. `compilerOptions` - 16 edges
6. `Button()` - 13 edges
7. `authClient` - 10 edges
8. `FieldGroup()` - 9 edges
9. `Input()` - 8 edges
10. `getEnv()` - 8 edges

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

## Communities (24 total, 4 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.06
Nodes (60): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+52 more)

### Community 1 - "service.ts"
Cohesion: 0.08
Nodes (60): DELETE(), GET(), Params, PATCH(), GET(), POST(), DELETE(), Params (+52 more)

### Community 2 - "utils.ts"
Cohesion: 0.07
Nodes (29): Params, metadata, FormFieldProps, LandingPage(), NotelyLogo(), NotelyLogoProps, NoteChecklist(), NoteChecklistProps (+21 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.07
Nodes (34): { GET, POST }, GET(), appleEnabled, auth, env, googleEnabled, Session, generateAppleClientSecret() (+26 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (41): @base-ui/react, better-auth, @better-auth/infra, class-variance-authority, clsx, drizzle-orm, @hookform/resolvers, jose (+33 more)

### Community 5 - "user-menu.tsx"
Cohesion: 0.07
Nodes (29): Header(), HeaderProps, UserAvatar(), UserMenu(), UserMenuProps, AccountSettings(), Avatar(), AvatarBadge() (+21 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (38): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+30 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.11
Nodes (27): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+19 more)

### Community 8 - "cn"
Cohesion: 0.12
Nodes (26): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SelectContent() (+18 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 12 - "dashboard-shell.tsx"
Cohesion: 0.28
Nodes (5): AppSidebar(), fetchSpaces(), DashboardShell(), MobileBottomNav(), SidebarInset()

### Community 13 - "app/layout.tsx"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, Providers(), TooltipProvider()

### Community 14 - "react"
Cohesion: 0.40
Nodes (5): react, react, SidebarMenuSkeleton(), SidebarProvider(), useIsMobile()

### Community 15 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

## Knowledge Gaps
- **137 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `utils.ts`, `user-menu.tsx`, `sidebar.tsx`, `sheet.tsx`, `dashboard-shell.tsx`, `react`, `tabs.tsx`?**
  _High betweenness centrality (0.281) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `scripts`, `react`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`, `sidebar.tsx`?**
  _High betweenness centrality (0.154) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05854341736694678 - nodes in this community are weakly interconnected._
- **Should `service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07746478873239436 - nodes in this community are weakly interconnected._
- **Should `utils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06862745098039216 - nodes in this community are weakly interconnected._