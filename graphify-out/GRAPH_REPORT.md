# Graph Report - notely  (2026-08-01)

## Corpus Check
<<<<<<< HEAD
- 135 files · ~33,533 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 739 nodes · 1621 edges · 39 communities (35 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a2acbc59`
=======
- 292 files · ~107,176 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2379 nodes · 5131 edges · 152 communities (104 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63a5c8cf`
>>>>>>> refs/remotes/origin/main
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
<<<<<<< HEAD
- security-settings.tsx
- tasks.ts
- app-bar.tsx
- auth/index.ts
- dependencies
- utils.ts
=======
- login-page.tsx
- requireSession
- app-bar.tsx
- google-connection-card.tsx
- dependencies
- open-in-chat.tsx
>>>>>>> refs/remotes/origin/main
- scripts
- cn
- jsonError
- compilerOptions
- components.json
- 1. Current product surface
- Find Skills
<<<<<<< HEAD
- jsonError
- sheet.tsx
- hub.ts
=======
- security-settings.tsx
- Nexora
- shares.ts
>>>>>>> refs/remotes/origin/main
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
<<<<<<< HEAD
- dialog.tsx
- react
- dashboard-shell.tsx
- tags/[id]/route.ts
=======
- button.tsx
- note-editor.tsx
- workspacePath
- prompt-input.tsx
>>>>>>> refs/remotes/origin/main
- Notely Drizzle + Neon
- Notely Better Auth
- auth-guard.ts
- service.ts
<<<<<<< HEAD
- note-editor.tsx
- validations/notes.ts
- events/route.ts
- app/layout.tsx
- tabs.tsx
- spaces/[id]/route.ts
=======
- note-share-panel.tsx
- commit.tsx
- editor-ai-sheet.tsx
- google-integration.ts
- inline-citation.tsx
- queue.tsx
- test-results.tsx
- voice-selector.tsx
- model-selector.tsx
- notification-settings.tsx
- lib/utils.ts
- schema-display.tsx
- attachments.tsx
- stack-trace.tsx
- code-block.tsx
- alert-dialog.tsx
- environment-variables.tsx
- message.tsx
- mic-selector.tsx
- context.tsx
- package-info.tsx
- audio-player.tsx
- auth/index.ts
- snippet.tsx
- agent.tsx
- reminders.ts
- usePromptInputAttachments
- calendar-week-view.tsx
- dropdown-menu.tsx
- plan.tsx
- chain-of-thought.tsx
- confirmation.tsx
- reasoning.tsx
- terminal.tsx
- note-integrations.tsx
- speech-input.tsx
- file-tree.tsx
- notes-workspace.tsx
- artifact.tsx
- demo-section.tsx
- tool.tsx
- use-voice-dictation.ts
- web-preview.tsx
- date-time-picker.tsx
- content.ts
- notes-list.tsx
- hero-section.tsx
- sandbox.tsx
- landing-page.tsx
- conversation.tsx
- jsx-preview.tsx
- collapsible.tsx
- app/layout.tsx
- push.ts
- persona.tsx
- note-chat/route.ts
- select.tsx
>>>>>>> refs/remotes/origin/main
- tags/route.ts
- pricing-section.tsx
- highlightCode
- transcription.tsx
- TokenSpan
- field.tsx
- graphify-run.mjs
- edge.tsx
- @tanstack/react-query
- apple-icon.tsx
- canvas.tsx
- task-board.tsx
- task.tsx
- note-reminder-dialog.tsx
- @ai-sdk/react
- ansi-to-react
- @base-ui/react
- better-auth
- @better-auth/infra
- class-variance-authority
- clsx
- cmdk
- date-fns
- embla-carousel-react
- @hookform/resolvers
- jose
- lucide-react
- media-chrome
- motion
- nanoid
- @neondatabase/serverless
- next
- @radix-ui/react-use-controllable-state
- react-day-picker
- react-dom
- react-hook-form
- react-jsx-parser
- react-qr-code
- @rive-app/react-webgl2
- shadcn
- shiki
- providers.tsx
- @streamdown/cjk
- @streamdown/code
- @streamdown/math
- @streamdown/mermaid
- tailwind-merge
- tokenlens
- tw-animate-css
- use-stick-to-bottom
- @xyflow/react
- zod
- zustand
- sw.js
- editor-toolbar.tsx
- readJson
- user-menu.tsx
- use-editor-font.ts
- hover-card.tsx
- @ai-sdk/google

## God Nodes (most connected - your core abstractions)
<<<<<<< HEAD
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
=======
1. `cn()` - 600 edges
2. `requireSession()` - 76 edges
3. `Button()` - 62 edges
4. `jsonError()` - 60 edges
5. `readJson()` - 44 edges
6. `workspacePath()` - 26 edges
7. `requireNoteAccess()` - 25 edges
8. `Input()` - 23 edges
9. `getEnv()` - 23 edges
10. `scripts` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Carousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `CalendarDayButton()` --references--> `react`  [EXTRACTED]
  src/components/ui/calendar.tsx → package.json
>>>>>>> refs/remotes/origin/main
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
<<<<<<< HEAD
- `useIsMobile()` --references--> `react`  [EXTRACTED]
  src/hooks/use-mobile.ts → package.json
- `TwoFactorPage()` --calls--> `cn()`  [EXTRACTED]
  src/app/(auth)/two-factor/page.tsx → src/lib/utils.ts
=======
>>>>>>> refs/remotes/origin/main

## Import Cycles
- None detected.

<<<<<<< HEAD
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
=======
## Communities (152 total, 48 thin omitted)

### Community 0 - "login-page.tsx"
Cohesion: 0.14
Nodes (25): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), RegisterPage(), ResetPasswordForm(), TwoFactorPage(), AuthError() (+17 more)

### Community 1 - "requireSession"
Cohesion: 0.19
Nodes (18): DELETE(), Params, PATCH(), GET(), POST(), requireSession(), requireNoteAccess(), createTask() (+10 more)

### Community 2 - "app-bar.tsx"
Cohesion: 0.14
Nodes (17): Checkpoint(), CheckpointIcon(), CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, AppBar(), AppBarProps, Header() (+9 more)
>>>>>>> refs/remotes/origin/main

### Community 3 - "google-connection-card.tsx"
Cohesion: 0.11
Nodes (24): Node(), NodeActionProps, NodeContent(), NodeContentProps, NodeDescriptionProps, NodeFooter(), NodeFooterProps, NodeHeader() (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): ai, drizzle-orm, next-themes, dependencies, ai, drizzle-orm, next-themes, streamdown (+3 more)

<<<<<<< HEAD
### Community 5 - "utils.ts"
Cohesion: 0.06
Nodes (40): Params, UserAvatar(), UserMenu(), UserMenuProps, NoteFormatToolbar(), NoteFormatToolbarProps, ToolbarIcon(), NotesList() (+32 more)
=======
### Community 5 - "open-in-chat.tsx"
Cohesion: 0.09
Nodes (22): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContent(), OpenInContentProps, OpenInContext, OpenInCursor() (+14 more)
>>>>>>> refs/remotes/origin/main

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (40): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+32 more)

<<<<<<< HEAD
### Community 7 - "sidebar.tsx"
Cohesion: 0.13
Nodes (24): Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent() (+16 more)

### Community 8 - "cn"
Cohesion: 0.12
Nodes (26): Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), SelectContent() (+18 more)
=======
### Community 7 - "cn"
Cohesion: 0.06
Nodes (55): react, react, Controls(), ControlsProps, Image(), ImageProps, Panel(), PanelProps (+47 more)

### Community 8 - "jsonError"
Cohesion: 0.13
Nodes (23): GET(), Params, DELETE(), Params, GET(), POST(), DELETE(), Params (+15 more)
>>>>>>> refs/remotes/origin/main

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

<<<<<<< HEAD
### Community 11 - "Notely roadmap"
Cohesion: 0.06
Nodes (29): Architecture, Calendar / meetings sidebar, Files / attachments, Inbox / global search, Keep vs drop, Notely roadmap, Phase 1 — Strip trading, Phase 2 — Auth rebrand (logic unchanged) (+21 more)
=======
### Community 11 - "1. Current product surface"
Cohesion: 0.04
Nodes (44): 1. Current product surface, 2. Make the current state better (polish first), 3. New features backlog, 4. Suggested build order (next 4–6 weeks), 5. Explicit non-goals (for now), 6. How to use this doc, 7. Quick inventory (code map), AI assistant — `shipped` / `gap` (+36 more)
>>>>>>> refs/remotes/origin/main

### Community 12 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

<<<<<<< HEAD
### Community 13 - "jsonError"
Cohesion: 0.19
Nodes (17): DELETE(), Params, DELETE(), GET(), Params, PATCH(), DELETE(), Params (+9 more)
=======
### Community 13 - "security-settings.tsx"
Cohesion: 0.12
Nodes (21): formatDate(), SecuritySettings(), SessionRow, truncateUa(), ChangePasswordFormValues, changePasswordSchema, ForgotPasswordFormValues, forgotPasswordSchema (+13 more)
>>>>>>> refs/remotes/origin/main

### Community 14 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

<<<<<<< HEAD
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
=======
### Community 15 - "shares.ts"
Cohesion: 0.07
Nodes (38): GET(), GET(), DELETE(), Params, PATCH(), GET(), POST(), db (+30 more)

### Community 24 - "button.tsx"
Cohesion: 0.11
Nodes (34): CalendarEventDialog(), CalendarEventDialogProps, GoogleCredentialsDialogProps, EditorLinkDialog(), EditorLinkDialogProps, EditorPanelsDialog(), EditorPanelsDialogProps, NoteListContextMenuProps (+26 more)

### Community 25 - "note-editor.tsx"
Cohesion: 0.12
Nodes (29): applyAppendNoteContent(), applyReplaceNoteContent(), htmlFromAiContent(), EditorAiSheet(), EditorCanvas(), EditorCanvasProps, EditorStatusBar(), EditorStatusBarProps (+21 more)

### Community 26 - "workspacePath"
Cohesion: 0.12
Nodes (18): IntegrationsPage(), IntegrationsPageProps, NotesPage(), NotesPageProps, IntegrationsPanel(), AppSidebar(), fetchSpaces(), DashboardChrome() (+10 more)

### Community 27 - "prompt-input.tsx"
Cohesion: 0.03
Nodes (62): AttachmentsContext, LocalAttachmentsContext, LocalReferencedSourcesContext, PromptInputActionAddAttachmentsProps, PromptInputActionAddScreenshotProps, PromptInputActionMenuContentProps, PromptInputActionMenuItem(), PromptInputActionMenuItemProps (+54 more)
>>>>>>> refs/remotes/origin/main

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

<<<<<<< HEAD
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
=======
### Community 30 - "auth-guard.ts"
Cohesion: 0.18
Nodes (13): DELETE(), Params, GET(), POST(), DELETE(), events, createEvent(), deleteEvent() (+5 more)

### Community 31 - "service.ts"
Cohesion: 0.08
Nodes (51): DELETE(), GET(), Params, PATCH(), GET(), POST(), DELETE(), Params (+43 more)

### Community 32 - "note-share-panel.tsx"
Cohesion: 0.18
Nodes (12): AccessMode, initials(), NoteShareMenuProps, NoteSharePanel(), NoteSharePanelProps, ROLE_LABEL, ShareRole, ShareRow (+4 more)

### Community 33 - "commit.tsx"
Cohesion: 0.04
Nodes (47): Commit(), CommitActions(), CommitActionsProps, CommitAuthor(), CommitAuthorAvatar(), CommitAuthorAvatarProps, CommitAuthorProps, CommitContent() (+39 more)

### Community 34 - "editor-ai-sheet.tsx"
Cohesion: 0.11
Nodes (17): PromptInputActionMenu(), PromptInputActionMenuContent(), PromptInputActionMenuTrigger(), PromptInputBody(), PromptInputFooter(), PromptInputHeader(), PromptInputMessage, PromptInputSubmit() (+9 more)

### Community 35 - "google-integration.ts"
Cohesion: 0.07
Nodes (52): GET(), callbackRedirect(), GET(), GET(), safeReturnTo(), DELETE(), PUT(), saveCredentialsSchema (+44 more)

### Community 36 - "inline-citation.tsx"
Cohesion: 0.06
Nodes (41): CarouselApiContext, InlineCitation(), InlineCitationCardBody(), InlineCitationCardBodyProps, InlineCitationCardProps, InlineCitationCardTrigger(), InlineCitationCardTriggerProps, InlineCitationCarousel() (+33 more)

### Community 37 - "queue.tsx"
Cohesion: 0.06
Nodes (33): Queue(), QueueItem(), QueueItemAction(), QueueItemActionProps, QueueItemActions(), QueueItemActionsProps, QueueItemAttachment(), QueueItemAttachmentProps (+25 more)

### Community 38 - "test-results.tsx"
Cohesion: 0.05
Nodes (44): formatDuration(), statusIcons, statusStyles, Test(), TestContext, TestContextType, TestDuration(), TestDurationProps (+36 more)

### Community 39 - "voice-selector.tsx"
Cohesion: 0.05
Nodes (32): VoiceSelectorAccent(), VoiceSelectorAccentProps, VoiceSelectorAge(), VoiceSelectorAgeProps, VoiceSelectorAttributes(), VoiceSelectorAttributesProps, VoiceSelectorBullet(), VoiceSelectorBulletProps (+24 more)

### Community 40 - "model-selector.tsx"
Cohesion: 0.06
Nodes (29): ModelSelectorContent(), ModelSelectorContentProps, ModelSelectorDialogProps, ModelSelectorEmptyProps, ModelSelectorGroupProps, ModelSelectorInput(), ModelSelectorInputProps, ModelSelectorItemProps (+21 more)

### Community 41 - "notification-settings.tsx"
Cohesion: 0.17
Nodes (21): ackReminder(), firedLocally, presentReminder(), Reminder, ReminderRuntime(), reminderUrl(), NotificationSettings(), ensureNotificationPermission() (+13 more)

### Community 42 - "lib/utils.ts"
Cohesion: 0.12
Nodes (22): Suggestion(), SuggestionProps, Suggestions(), SuggestionsProps, CalendarListPanel(), CalendarListPanelProps, CalendarNavSidebar(), CalendarNavSidebarProps (+14 more)

### Community 43 - "schema-display.tsx"
Cohesion: 0.06
Nodes (32): HttpMethod, methodStyles, SchemaDisplay(), SchemaDisplayBody(), SchemaDisplayBodyProps, SchemaDisplayContent(), SchemaDisplayContentProps, SchemaDisplayContext (+24 more)

### Community 44 - "attachments.tsx"
Cohesion: 0.08
Nodes (29): Attachment(), AttachmentContext, AttachmentContextValue, AttachmentData, AttachmentEmpty(), AttachmentEmptyProps, AttachmentHoverCardContent(), AttachmentHoverCardContentProps (+21 more)

### Community 45 - "stack-trace.tsx"
Cohesion: 0.06
Nodes (28): FilePathButton, FilePathButtonProps, ParsedStackTrace, parseStackFrame(), parseStackTrace(), StackFrame, StackTrace, StackTraceActions (+20 more)

### Community 46 - "code-block.tsx"
Cohesion: 0.06
Nodes (24): CodeBlockActions(), CodeBlockBody, CodeBlockContainer(), CodeBlockContext, CodeBlockContextType, CodeBlockCopyButton(), CodeBlockCopyButtonProps, CodeBlockFilename() (+16 more)

### Community 47 - "alert-dialog.tsx"
Cohesion: 0.22
Nodes (13): NoteDeleteDialog(), NoteDeleteDialogProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+5 more)

### Community 48 - "environment-variables.tsx"
Cohesion: 0.07
Nodes (27): EnvironmentVariable(), EnvironmentVariableContext, EnvironmentVariableContextType, EnvironmentVariableCopyButton(), EnvironmentVariableCopyButtonProps, EnvironmentVariableGroup(), EnvironmentVariableGroupProps, EnvironmentVariableName() (+19 more)

### Community 49 - "message.tsx"
Cohesion: 0.08
Nodes (27): Message(), MessageActionProps, MessageActions(), MessageActionsProps, MessageBranch(), MessageBranchContent(), MessageBranchContentProps, MessageBranchContext (+19 more)

### Community 50 - "mic-selector.tsx"
Cohesion: 0.08
Nodes (21): MicSelector(), MicSelectorContent(), MicSelectorContentProps, MicSelectorContext, MicSelectorContextType, MicSelectorEmptyProps, MicSelectorInputProps, MicSelectorItemProps (+13 more)

### Community 51 - "context.tsx"
Cohesion: 0.10
Nodes (24): ContextCacheUsage(), ContextCacheUsageProps, ContextContent(), ContextContentBody(), ContextContentBodyProps, ContextContentFooter(), ContextContentFooterProps, ContextContentHeader() (+16 more)

### Community 52 - "package-info.tsx"
Cohesion: 0.08
Nodes (25): ChangeType, changeTypeIcons, changeTypeStyles, PackageInfo(), PackageInfoChangeType(), PackageInfoChangeTypeProps, PackageInfoContent(), PackageInfoContentProps (+17 more)

### Community 53 - "audio-player.tsx"
Cohesion: 0.08
Nodes (21): AudioPlayerControlBarProps, AudioPlayerDurationDisplay(), AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButton(), AudioPlayerMuteButtonProps, AudioPlayerPlayButton(), AudioPlayerPlayButtonProps (+13 more)

### Community 54 - "auth/index.ts"
Cohesion: 0.16
Nodes (15): { GET, POST }, auth, env, googleEnabled, resolveAppleEnabled(), Session, generateAppleClientSecret(), isAppleAuthConfigured() (+7 more)

### Community 55 - "snippet.tsx"
Cohesion: 0.11
Nodes (19): Snippet(), SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInput(), SnippetInputProps, SnippetProps (+11 more)

### Community 56 - "agent.tsx"
Cohesion: 0.13
Nodes (19): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+11 more)

### Community 57 - "reminders.ts"
Cohesion: 0.15
Nodes (23): hasCronAuth(), POST(), DELETE(), PATCH(), RouteContext, GET(), POST(), createReminder() (+15 more)

### Community 58 - "usePromptInputAttachments"
Cohesion: 0.18
Nodes (11): captureScreenshot(), convertBlobUrlToDataUrl(), PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot(), PromptInputTextarea(), useOptionalPromptInputController(), useOptionalProviderAttachments() (+3 more)

### Community 59 - "calendar-week-view.tsx"
Cohesion: 0.16
Nodes (21): metadata, CalendarMiniMonth(), CalendarMiniMonthProps, CalendarWeekView(), CalendarWeekViewProps, CalendarWorkspace(), addDays(), DAY_END_HOUR (+13 more)

### Community 60 - "dropdown-menu.tsx"
Cohesion: 0.15
Nodes (9): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuGroup(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger() (+1 more)

### Community 61 - "plan.tsx"
Cohesion: 0.11
Nodes (16): Plan(), PlanActionProps, PlanContentProps, PlanContext, PlanContextValue, PlanDescription(), PlanDescriptionProps, PlanFooterProps (+8 more)

### Community 62 - "chain-of-thought.tsx"
Cohesion: 0.11
Nodes (17): ChainOfThought, ChainOfThoughtContent, ChainOfThoughtContentProps, ChainOfThoughtContext, ChainOfThoughtContextValue, ChainOfThoughtHeader, ChainOfThoughtHeaderProps, ChainOfThoughtImage (+9 more)

### Community 63 - "confirmation.tsx"
Cohesion: 0.13
Nodes (17): Confirmation(), ConfirmationAccepted(), ConfirmationAcceptedProps, ConfirmationActionProps, ConfirmationActions(), ConfirmationActionsProps, ConfirmationContext, ConfirmationContextValue (+9 more)

### Community 64 - "reasoning.tsx"
Cohesion: 0.12
Nodes (15): Reasoning, ReasoningContent, ReasoningContentProps, ReasoningContext, ReasoningContextValue, ReasoningProps, ReasoningTrigger, ReasoningTriggerProps (+7 more)

### Community 65 - "terminal.tsx"
Cohesion: 0.11
Nodes (18): Terminal(), TerminalActions(), TerminalActionsProps, TerminalClearButton(), TerminalClearButtonProps, TerminalContent(), TerminalContentProps, TerminalContext (+10 more)

### Community 66 - "note-integrations.tsx"
Cohesion: 0.18
Nodes (16): GoogleConnectionCard(), googleConnectionKey, GoogleConnectionStatus, GoogleCredentialSource, GoogleIntegrationItem, googleItemsKey, useCallbackError(), useGoogleConnection() (+8 more)

### Community 67 - "speech-input.tsx"
Cohesion: 0.14
Nodes (12): detectSpeechInputMode(), SpeechInput(), SpeechInputMode, SpeechInputProps, SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionErrorEvent, SpeechRecognitionEvent (+4 more)

### Community 68 - "file-tree.tsx"
Cohesion: 0.10
Nodes (18): FileTree(), FileTreeActions(), FileTreeActionsProps, FileTreeContext, FileTreeContextType, FileTreeFile(), FileTreeFileContext, FileTreeFileContextType (+10 more)

### Community 69 - "notes-workspace.tsx"
Cohesion: 0.09
Nodes (18): Params, InboxPanel(), Invite, copy, IllustrationProps, IllustrationShell(), NotesEmptyState(), NotesEmptyStateProps (+10 more)

### Community 70 - "artifact.tsx"
Cohesion: 0.12
Nodes (16): Artifact(), ArtifactAction(), ArtifactActionProps, ArtifactActions(), ArtifactActionsProps, ArtifactClose(), ArtifactCloseProps, ArtifactContent() (+8 more)

### Community 71 - "demo-section.tsx"
Cohesion: 0.18
Nodes (8): DemoSection(), TABS, WriteScreen(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 72 - "tool.tsx"
Cohesion: 0.13
Nodes (15): SandboxHeader(), getStatusBadge(), statusIcons, statusLabels, Tool(), ToolContent(), ToolContentProps, ToolHeader() (+7 more)

### Community 73 - "use-voice-dictation.ts"
Cohesion: 0.20
Nodes (11): BrowserSpeechRecognition, BrowserSpeechRecognitionAlternative, BrowserSpeechRecognitionConstructor, BrowserSpeechRecognitionErrorEvent, BrowserSpeechRecognitionEvent, BrowserSpeechRecognitionResult, BrowserSpeechRecognitionResultList, getSpeechRecognitionCtor() (+3 more)

### Community 74 - "web-preview.tsx"
Cohesion: 0.15
Nodes (14): useWebPreview(), WebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue (+6 more)

### Community 75 - "date-time-picker.tsx"
Cohesion: 0.23
Nodes (13): Calendar(), DateTimePicker(), DateTimePickerProps, getHour12(), getPeriod(), HOURS, pad(), Period (+5 more)

### Community 76 - "content.ts"
Cohesion: 0.16
Nodes (15): COMPARISON_ROWS, ComparisonRow, FAQS, FeatureKey, FEATURES, PRICING_PLANS, PricingPlan, TESTIMONIALS (+7 more)

### Community 77 - "notes-list.tsx"
Cohesion: 0.20
Nodes (15): NoteListContextMenu(), formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent(), useReminderClock() (+7 more)

### Community 78 - "hero-section.tsx"
Cohesion: 0.29
Nodes (6): HERO_STATS, PROOF_POINTS, NOTES, SPACES, TASKS, WorkspacePreview()

### Community 79 - "sandbox.tsx"
Cohesion: 0.12
Nodes (15): Sandbox(), SandboxContent(), SandboxContentProps, SandboxHeaderProps, SandboxRootProps, SandboxTabContent(), SandboxTabContentProps, SandboxTabs() (+7 more)

### Community 80 - "landing-page.tsx"
Cohesion: 0.15
Nodes (15): metadata, FOOTER_LINKS, NAV_LINKS, LandingPage(), CtaSection(), FaqSection(), HeroSection(), LandingFooter() (+7 more)

### Community 81 - "conversation.tsx"
Cohesion: 0.16
Nodes (13): Conversation(), ConversationContent(), ConversationContentProps, ConversationDownload(), ConversationDownloadProps, ConversationEmptyState(), ConversationEmptyStateProps, ConversationProps (+5 more)

### Community 82 - "jsx-preview.tsx"
Cohesion: 0.16
Nodes (11): completeJsxTag(), JSXPreview, JSXPreviewContent, JSXPreviewContentProps, JSXPreviewContext, JSXPreviewContextValue, JSXPreviewError, JSXPreviewErrorProps (+3 more)

### Community 83 - "collapsible.tsx"
Cohesion: 0.19
Nodes (10): SourceProps, Sources(), SourcesContent(), SourcesContentProps, SourcesProps, SourcesTrigger(), SourcesTriggerProps, Collapsible() (+2 more)

### Community 84 - "app/layout.tsx"
Cohesion: 0.25
Nodes (6): geistMono, geistSans, metadata, viewport, Providers(), PwaRegister()
>>>>>>> refs/remotes/origin/main

### Community 85 - "push.ts"
Cohesion: 0.23
Nodes (13): DELETE(), GET(), POST(), pushSubscriptions, configureWebPush(), isPushConfigured(), listUserPushSubscriptions(), PushSubscriptionInput (+5 more)

<<<<<<< HEAD
### Community 35 - "app/layout.tsx"
Cohesion: 0.24
Nodes (6): geistMono, geistSans, metadata, Providers(), ThemeProvider(), TooltipProvider()

### Community 36 - "tabs.tsx"
Cohesion: 0.40
Nodes (5): Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 37 - "spaces/[id]/route.ts"
Cohesion: 0.38
Nodes (6): DELETE(), Params, PATCH(), deleteSpace(), updateSpace(), updateSpaceSchema
=======
### Community 86 - "persona.tsx"
Cohesion: 0.18
Nodes (10): getCurrentTheme(), Persona, PersonaProps, PersonaState, PersonaWithModel, PersonaWithModelProps, PersonaWithoutModel, PersonaWithoutModelProps (+2 more)
>>>>>>> refs/remotes/origin/main

### Community 87 - "note-chat/route.ts"
Cohesion: 0.36
Nodes (8): maxDuration, POST(), buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 88 - "select.tsx"
Cohesion: 0.22
Nodes (8): SelectContent(), SelectGroup(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 89 - "tags/route.ts"
Cohesion: 0.47
Nodes (5): GET(), POST(), createTag(), listTags(), createTagSchema

### Community 90 - "pricing-section.tsx"
Cohesion: 0.29
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 91 - "highlightCode"
Cohesion: 0.40
Nodes (5): CodeBlockContent(), createRawTokens(), getHighlighter(), getTokensCacheKey(), highlightCode()

### Community 92 - "transcription.tsx"
Cohesion: 0.29
Nodes (7): Transcription(), TranscriptionContext, TranscriptionContextValue, TranscriptionProps, TranscriptionSegment, TranscriptionSegmentProps, useTranscription()

### Community 93 - "TokenSpan"
Cohesion: 0.50
Nodes (4): isBold(), isItalic(), isUnderline(), TokenSpan()

### Community 94 - "field.tsx"
Cohesion: 0.20
Nodes (12): FormPasswordFieldProps, FormFieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend() (+4 more)

### Community 95 - "graphify-run.mjs"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 96 - "edge.tsx"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 100 - "task-board.tsx"
Cohesion: 0.26
Nodes (9): columns, endOfTodayLocal(), formatDueLabel(), isSameLocalDay(), notify(), Task, TaskBoard(), TaskStatus (+1 more)

### Community 101 - "task.tsx"
Cohesion: 0.18
Nodes (10): Task(), TaskContent(), TaskContentProps, TaskItem(), TaskItemFile(), TaskItemFileProps, TaskItemProps, TaskProps (+2 more)

### Community 102 - "note-reminder-dialog.tsx"
Cohesion: 0.31
Nodes (9): defaultRemindAt(), formatFromNow(), NoteReminderDialog(), NoteReminderDialogProps, QUICK_PRESETS, Reminder, snoozeInOneHour(), snoozeTomorrowMorning() (+1 more)

### Community 146 - "editor-toolbar.tsx"
Cohesion: 0.14
Nodes (17): EDITOR_FONT_STORAGE_KEY, EMPTY_FORMATS, TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE, EditorToolbar(), EditorToolbarProps, FormatButton() (+9 more)

### Community 147 - "readJson"
Cohesion: 0.17
Nodes (17): MobileBottomNav(), EditorNoteExtras(), EditorNoteExtrasProps, formatReminderAt(), isImageAttachment(), PendingReminder, useNoteDraft(), UseNoteDraftOptions (+9 more)

### Community 148 - "user-menu.tsx"
Cohesion: 0.19
Nodes (12): UserAvatar(), UserMenu(), UserMenuProps, Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount() (+4 more)

### Community 149 - "use-editor-font.ts"
Cohesion: 0.44
Nodes (7): readStoredFont(), useEditorFont(), EDITOR_FONTS, EditorFontOption, ensureEditorFontLoaded(), getEditorFont(), loadedGoogleFonts

### Community 150 - "hover-card.tsx"
Cohesion: 0.50
Nodes (3): HoverCard(), HoverCardContent(), HoverCardTrigger()

## Knowledge Gaps
<<<<<<< HEAD
- **207 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+202 more)
=======
- **873 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+868 more)
>>>>>>> refs/remotes/origin/main
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

<<<<<<< HEAD
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
=======
- **Why does `cn()` connect `cn` to `login-page.tsx`, `app-bar.tsx`, `google-connection-card.tsx`, `open-in-chat.tsx`, `editor-toolbar.tsx`, `readJson`, `user-menu.tsx`, `hover-card.tsx`, `button.tsx`, `note-editor.tsx`, `workspacePath`, `prompt-input.tsx`, `note-share-panel.tsx`, `commit.tsx`, `editor-ai-sheet.tsx`, `inline-citation.tsx`, `queue.tsx`, `test-results.tsx`, `voice-selector.tsx`, `model-selector.tsx`, `notification-settings.tsx`, `lib/utils.ts`, `schema-display.tsx`, `attachments.tsx`, `stack-trace.tsx`, `code-block.tsx`, `alert-dialog.tsx`, `environment-variables.tsx`, `message.tsx`, `mic-selector.tsx`, `context.tsx`, `package-info.tsx`, `audio-player.tsx`, `snippet.tsx`, `agent.tsx`, `usePromptInputAttachments`, `calendar-week-view.tsx`, `dropdown-menu.tsx`, `plan.tsx`, `chain-of-thought.tsx`, `confirmation.tsx`, `reasoning.tsx`, `terminal.tsx`, `note-integrations.tsx`, `speech-input.tsx`, `file-tree.tsx`, `notes-workspace.tsx`, `artifact.tsx`, `demo-section.tsx`, `tool.tsx`, `web-preview.tsx`, `date-time-picker.tsx`, `content.ts`, `notes-list.tsx`, `hero-section.tsx`, `sandbox.tsx`, `landing-page.tsx`, `conversation.tsx`, `jsx-preview.tsx`, `collapsible.tsx`, `persona.tsx`, `select.tsx`, `pricing-section.tsx`, `transcription.tsx`, `field.tsx`, `task-board.tsx`, `task.tsx`, `note-reminder-dialog.tsx`?**
  _High betweenness centrality (0.528) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `shadcn`, `shiki`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `scripts`, `cn`, `@streamdown/mermaid`, `tailwind-merge`, `tokenlens`, `tw-animate-css`, `use-stick-to-bottom`, `@xyflow/react`, `zod`, `zustand`, `@ai-sdk/google`, `@tanstack/react-query`, `@ai-sdk/react`, `ansi-to-react`, `@base-ui/react`, `better-auth`, `@better-auth/infra`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `jose`, `lucide-react`, `media-chrome`, `motion`, `nanoid`, `@neondatabase/serverless`, `next`, `@radix-ui/react-use-controllable-state`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-jsx-parser`, `react-qr-code`, `@rive-app/react-webgl2`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `react` connect `cn` to `dependencies`, `inline-citation.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _873 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `login-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14268292682926828 - nodes in this community are weakly interconnected._
- **Should `app-bar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14492753623188406 - nodes in this community are weakly interconnected._
- **Should `google-connection-card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10695187165775401 - nodes in this community are weakly interconnected._
>>>>>>> refs/remotes/origin/main
