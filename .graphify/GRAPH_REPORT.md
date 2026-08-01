# Graph Report - .  (2026-08-01)

## Corpus Check
- 125 files · ~97,124 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 558 nodes · 1092 edges · 32 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 448 · imports: 353 · imports_from: 230 · calls: 39 · references: 19 · re_exports: 3


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 125 · Candidates: 166
- Excluded: 13 untracked · 185810 ignored · 1 sensitive · 1 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `163aa28`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `cn()` - 39 edges
2. `Button()` - 18 edges
3. `requireSession()` - 12 edges
4. `jsonError()` - 12 edges
5. `authClient` - 10 edges
6. `Input()` - 9 edges
7. `FieldGroup()` - 8 edges
8. `db` - 8 edges
9. `AuthError()` - 7 edges
10. `FormTextField()` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (50): AuthError(), AuthFooterLink(), AuthPanel(), AuthPanelProps, AuthSubmit(), AuthSubmitProps, AuthShell(), AuthShellProps (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (35): { GET, POST }, auth, env, googleEnabled, Session, generateAppleClientSecret(), isAppleAuthConfigured(), isGoogleAuthConfigured() (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (24): useIsMobile(), UserMenu(), Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle(), Sidebar() (+16 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (15): UserMenuProps, formatMemberSince(), getUserInitials(), Avatar(), AvatarFallback(), AvatarImage(), Badge(), badgeVariants (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (11): cn(), NoteChecklistProps, NoteResourcesProps, NoteSharePanelProps, ShareRow, NotesEmptyStateProps, NotelyLogo(), NotelyLogoProps (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (15): Params, formatRelativeDate(), InboxPanel(), Invite, NotesEmptyState(), NoteGroup, NotesList(), NotesListProps (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (19): assertSpaceOwned(), createNote(), createSpace(), deleteTag(), ensureDefaultSpace(), getNote(), listNotes(), listSpaces() (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (3): jsonError(), requireSession(), Params

### Community 8 - "Community 8"
Cohesion: 0.14
Nodes (15): db, sql, getNoteAccess(), NoteAccess, NoteAccessRole, requireNoteAccess(), inviteCollaborator(), inviter (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (15): Params, deleteNote(), deleteSpace(), updateSpace(), createEventSchema, CreateEventValues, createLinkAttachmentSchema, createNoteSchema (+7 more)

### Community 10 - "Community 10"
Cohesion: 0.13
Nodes (7): ContextMenu(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuSeparator(), ContextMenuTrigger()

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (10): OPTIONS, ThemeModeButton(), ThemeToggleProps, AppBar(), AppBarProps, Header(), Separator(), Tooltip() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (8): AppSidebar(), DashboardShell(), CalendarEvent, daysInMonth(), startOfMonth(), UtilitySidebar(), SidebarInset(), SidebarProvider()

### Community 13 - "Community 13"
Cohesion: 0.19
Nodes (8): NoteSearchDialog(), SearchHit, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle()

### Community 14 - "Community 14"
Cohesion: 0.21
Nodes (8): createTask(), deleteTask(), listTasksForNote(), serializeTask(), updateTask(), createTaskSchema, CreateTaskValues, UpdateTaskValues

### Community 16 - "Community 16"
Cohesion: 0.24
Nodes (6): geistMono, geistSans, metadata, Providers(), ThemeProvider(), TooltipProvider()

### Community 18 - "Community 18"
Cohesion: 0.39
Nodes (8): note_tags, notes, public.notes, public.spaces, public.tags, public.user, spaces, tags

### Community 20 - "Community 20"
Cohesion: 0.39
Nodes (7): account, exchange_connections, public.user, session, user, verification, watchlists

### Community 21 - "Community 21"
Cohesion: 0.32
Nodes (7): createDbFileAttachment(), createLinkAttachment(), deleteAttachment(), getAttachmentForUser(), listAttachmentsForNote(), serializeAttachment(), CreateLinkAttachmentValues

### Community 23 - "Community 23"
Cohesion: 0.40
Nodes (4): MobileBottomNav(), NoteAttachment, NoteTask, SpaceSummary

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (3): EDITOR_FONTS, EditorFontOption, loadedGoogleFonts

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (3): createTag(), listTags(), createTagSchema

### Community 26 - "Community 26"
Cohesion: 0.40
Nodes (2): TabsList(), tabsListVariants

### Community 27 - "Community 27"
Cohesion: 0.80
Nodes (4): events, note_shares, public.notes, public.user

### Community 28 - "Community 28"
Cohesion: 0.40
Nodes (2): LandingPage(), metadata

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (4): createEvent(), deleteEvent(), listEvents(), serializeEvent()

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (3): public.user, twoFactor, user

### Community 31 - "Community 31"
Cohesion: 0.83
Nodes (3): public.notes, public.user, tasks

### Community 32 - "Community 32"
Cohesion: 0.83
Nodes (3): attachments, public.notes, public.user

### Community 36 - "Community 36"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 38 - "Community 38"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 39 - "Community 39"
Cohesion: 1.00
Nodes (1): config

## Knowledge Gaps
- **71 isolated node(s):** `user`, `verification`, `twoFactor`, `eslintConfig`, `nextConfig` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 26`** (2 nodes): `TabsList()`, `tabsListVariants`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `LandingPage()`, `metadata`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 4` to `Community 0`, `Community 11`, `Community 2`, `Community 12`, `Community 23`, `Community 3`, `Community 5`, `Community 22`, `Community 15`, `Community 10`, `Community 13`, `Community 17`, `Community 19`, `Community 26`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 4` to `Community 11`, `Community 2`, `Community 12`, `Community 3`, `Community 5`, `Community 0`, `Community 13`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `db` connect `Community 8` to `Community 1`, `Community 21`, `Community 29`, `Community 6`, `Community 14`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `user`, `verification`, `twoFactor` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05337078651685393 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06376811594202898 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0743321718931475 - nodes in this community are weakly interconnected._