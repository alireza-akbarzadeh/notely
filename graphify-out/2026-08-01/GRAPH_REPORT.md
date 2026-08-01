# Graph Report - notely  (2026-08-01)

## Corpus Check
- 286 files · ~102,182 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2339 nodes · 4978 edges · 150 communities (103 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `47f3f0e0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- security-settings.tsx
- validations/notes.ts
- app-bar.tsx
- google-integration.ts
- dependencies
- user-menu.tsx
- scripts
- sidebar.tsx
- cn
- compilerOptions
- components.json
- 1. Current product surface
- Find Skills
- push-client.ts
- Nexora
- shares.ts
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- dialog.tsx
- prompt-input.tsx
- dashboard-shell.tsx
- calendar-workspace.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- readJson
- jsonError
- events.ts
- commit.tsx
- inline-citation.tsx
- test-results.tsx
- voice-selector.tsx
- model-selector.tsx
- schema-display.tsx
- attachments.tsx
- stack-trace.tsx
- code-block.tsx
- environment-variables.tsx
- mic-selector.tsx
- reminders.ts
- audio-player.tsx
- open-in-chat.tsx
- note-editor.tsx
- context.tsx
- package-info.tsx
- message.tsx
- lib/utils.ts
- app-sidebar.tsx
- editor-ai-sheet.tsx
- snippet.tsx
- content.ts
- workspacePath
- agent.tsx
- editor-toolbar.tsx
- file-tree.tsx
- plan.tsx
- chain-of-thought.tsx
- confirmation.tsx
- terminal.tsx
- note-integrations.tsx
- speech-input.tsx
- google-connection-card.tsx
- artifact.tsx
- alert-dialog.tsx
- notes-list.tsx
- notification-settings.tsx
- node.tsx
- sandbox.tsx
- tool.tsx
- web-preview.tsx
- editor-canvas.tsx
- push.ts
- demo-section.tsx
- landing-page.tsx
- conversation.tsx
- jsx-preview.tsx
- collapsible.tsx
- notes-empty-state.tsx
- date-time-picker.tsx
- persona.tsx
- reasoning.tsx
- note-chat/route.ts
- task.tsx
- pricing-section.tsx
- sheet.tsx
- note-reminder-dialog.tsx
- task-board.tsx
- hero-section.tsx
- use-editor-font.ts
- select.tsx
- transcription.tsx
- react
- shimmer.tsx
- graphify-run.mjs
- edge.tsx
- highlightCode
- apple-icon.tsx
- canvas.tsx
- TokenSpan
- hover-card.tsx
- @ai-sdk/google
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
- streamdown
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 597 edges
2. `requireSession()` - 76 edges
3. `Button()` - 60 edges
4. `jsonError()` - 60 edges
5. `readJson()` - 40 edges
6. `workspacePath()` - 26 edges
7. `requireNoteAccess()` - 24 edges
8. `getEnv()` - 23 edges
9. `Input()` - 21 edges
10. `scripts` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Carousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useCarousel()` --references--> `react`  [EXTRACTED]
  src/components/ui/carousel.tsx → package.json
- `useSidebar()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `CalendarDayButton()` --references--> `react`  [EXTRACTED]
  src/components/ui/calendar.tsx → package.json
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Communities (150 total, 47 thin omitted)

### Community 0 - "security-settings.tsx"
Cohesion: 0.06
Nodes (54): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+46 more)

### Community 1 - "validations/notes.ts"
Cohesion: 0.09
Nodes (32): DELETE(), Params, PATCH(), GET(), POST(), tasks, createTask(), deleteTask() (+24 more)

### Community 2 - "app-bar.tsx"
Cohesion: 0.13
Nodes (18): Checkpoint(), CheckpointIcon(), CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, AppBar(), AppBarProps, Header() (+10 more)

### Community 3 - "google-integration.ts"
Cohesion: 0.05
Nodes (67): { GET, POST }, GET(), callbackRedirect(), GET(), GET(), safeReturnTo(), DELETE(), PUT() (+59 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): ai, drizzle-orm, next-themes, dependencies, ai, drizzle-orm, next-themes, @tanstack/react-query (+3 more)

### Community 5 - "user-menu.tsx"
Cohesion: 0.13
Nodes (17): UserAvatar(), UserMenu(), UserMenuProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+9 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (40): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+32 more)

### Community 7 - "sidebar.tsx"
Cohesion: 0.17
Nodes (15): Sidebar(), SidebarContext, SidebarContextProps, SidebarGroupAction(), SidebarInput(), SidebarMenuAction(), SidebarMenuBadge(), SidebarMenuButton() (+7 more)

### Community 8 - "cn"
Cohesion: 0.05
Nodes (60): Controls(), ControlsProps, Image(), ImageProps, Panel(), PanelProps, Queue(), QueueItem() (+52 more)

### Community 9 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 10 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 11 - "1. Current product surface"
Cohesion: 0.04
Nodes (44): 1. Current product surface, 2. Make the current state better (polish first), 3. New features backlog, 4. Suggested build order (next 4–6 weeks), 5. Explicit non-goals (for now), 6. How to use this doc, 7. Quick inventory (code map), AI assistant — `shipped` / `gap` (+36 more)

### Community 12 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 13 - "push-client.ts"
Cohesion: 0.18
Nodes (15): geistMono, geistSans, metadata, viewport, Providers(), PwaRegister(), NotificationSettings(), ensureNotificationPermission() (+7 more)

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "shares.ts"
Cohesion: 0.08
Nodes (33): DELETE(), Params, PATCH(), GET(), POST(), db, sql, account (+25 more)

### Community 24 - "dialog.tsx"
Cohesion: 0.15
Nodes (20): CalendarEventDialog(), CalendarEventDialogProps, GoogleCredentialsDialog(), GoogleCredentialsDialogProps, EditorLinkDialog(), EditorLinkDialogProps, EditorPanelsDialog(), EditorPanelsDialogProps (+12 more)

### Community 25 - "prompt-input.tsx"
Cohesion: 0.03
Nodes (62): AttachmentsContext, LocalAttachmentsContext, LocalReferencedSourcesContext, PromptInputActionAddAttachmentsProps, PromptInputActionAddScreenshotProps, PromptInputActionMenuContentProps, PromptInputActionMenuItem(), PromptInputActionMenuItemProps (+54 more)

### Community 26 - "dashboard-shell.tsx"
Cohesion: 0.18
Nodes (10): AppSidebar(), fetchSpaces(), DashboardChrome(), DashboardShell(), NoteSearchDialog(), SidebarInset(), isNotesChromePath(), isWorkspacePath() (+2 more)

### Community 27 - "calendar-workspace.tsx"
Cohesion: 0.08
Nodes (38): metadata, Suggestion(), SuggestionProps, Suggestions(), SuggestionsProps, CalendarListPanel(), CalendarListPanelProps, CalendarMiniMonth() (+30 more)

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

### Community 30 - "requireSession"
Cohesion: 0.14
Nodes (20): GET(), GET(), POST(), GET(), DELETE(), Params, PATCH(), GET() (+12 more)

### Community 31 - "service.ts"
Cohesion: 0.14
Nodes (29): DELETE(), Params, PATCH(), GET(), POST(), activeSpaceIds(), assertSpaceOwned(), createNote() (+21 more)

### Community 32 - "readJson"
Cohesion: 0.17
Nodes (15): Params, InboxPanel(), Invite, NoteSharePanel(), NoteSharePanelProps, NoteShareTrigger(), ShareRow, NotesEmptyState() (+7 more)

### Community 33 - "jsonError"
Cohesion: 0.17
Nodes (22): GET(), Params, DELETE(), Params, GET(), POST(), DELETE(), GET() (+14 more)

### Community 34 - "events.ts"
Cohesion: 0.27
Nodes (10): DELETE(), Params, GET(), POST(), createEvent(), deleteEvent(), listEvents(), serializeEvent() (+2 more)

### Community 35 - "commit.tsx"
Cohesion: 0.04
Nodes (47): Commit(), CommitActions(), CommitActionsProps, CommitAuthor(), CommitAuthorAvatar(), CommitAuthorAvatarProps, CommitAuthorProps, CommitContent() (+39 more)

### Community 36 - "inline-citation.tsx"
Cohesion: 0.06
Nodes (41): CarouselApiContext, InlineCitation(), InlineCitationCardBody(), InlineCitationCardBodyProps, InlineCitationCardProps, InlineCitationCardTrigger(), InlineCitationCardTriggerProps, InlineCitationCarousel() (+33 more)

### Community 37 - "test-results.tsx"
Cohesion: 0.05
Nodes (44): formatDuration(), statusIcons, statusStyles, Test(), TestContext, TestContextType, TestDuration(), TestDurationProps (+36 more)

### Community 38 - "voice-selector.tsx"
Cohesion: 0.05
Nodes (32): VoiceSelectorAccent(), VoiceSelectorAccentProps, VoiceSelectorAge(), VoiceSelectorAgeProps, VoiceSelectorAttributes(), VoiceSelectorAttributesProps, VoiceSelectorBullet(), VoiceSelectorBulletProps (+24 more)

### Community 39 - "model-selector.tsx"
Cohesion: 0.06
Nodes (29): ModelSelectorContent(), ModelSelectorContentProps, ModelSelectorDialogProps, ModelSelectorEmptyProps, ModelSelectorGroupProps, ModelSelectorInput(), ModelSelectorInputProps, ModelSelectorItemProps (+21 more)

### Community 40 - "schema-display.tsx"
Cohesion: 0.06
Nodes (32): HttpMethod, methodStyles, SchemaDisplay(), SchemaDisplayBody(), SchemaDisplayBodyProps, SchemaDisplayContent(), SchemaDisplayContentProps, SchemaDisplayContext (+24 more)

### Community 41 - "attachments.tsx"
Cohesion: 0.08
Nodes (29): Attachment(), AttachmentContext, AttachmentContextValue, AttachmentData, AttachmentEmpty(), AttachmentEmptyProps, AttachmentHoverCardContent(), AttachmentHoverCardContentProps (+21 more)

### Community 42 - "stack-trace.tsx"
Cohesion: 0.06
Nodes (28): FilePathButton, FilePathButtonProps, ParsedStackTrace, parseStackFrame(), parseStackTrace(), StackFrame, StackTrace, StackTraceActions (+20 more)

### Community 43 - "code-block.tsx"
Cohesion: 0.06
Nodes (24): CodeBlockActions(), CodeBlockBody, CodeBlockContainer(), CodeBlockContext, CodeBlockContextType, CodeBlockCopyButton(), CodeBlockCopyButtonProps, CodeBlockFilename() (+16 more)

### Community 44 - "environment-variables.tsx"
Cohesion: 0.07
Nodes (27): EnvironmentVariable(), EnvironmentVariableContext, EnvironmentVariableContextType, EnvironmentVariableCopyButton(), EnvironmentVariableCopyButtonProps, EnvironmentVariableGroup(), EnvironmentVariableGroupProps, EnvironmentVariableName() (+19 more)

### Community 45 - "mic-selector.tsx"
Cohesion: 0.08
Nodes (21): MicSelector(), MicSelectorContent(), MicSelectorContentProps, MicSelectorContext, MicSelectorContextType, MicSelectorEmptyProps, MicSelectorInputProps, MicSelectorItemProps (+13 more)

### Community 46 - "reminders.ts"
Cohesion: 0.15
Nodes (23): hasCronAuth(), POST(), DELETE(), PATCH(), RouteContext, GET(), POST(), createReminder() (+15 more)

### Community 47 - "audio-player.tsx"
Cohesion: 0.08
Nodes (21): AudioPlayerControlBarProps, AudioPlayerDurationDisplay(), AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButton(), AudioPlayerMuteButtonProps, AudioPlayerPlayButton(), AudioPlayerPlayButtonProps (+13 more)

### Community 48 - "open-in-chat.tsx"
Cohesion: 0.09
Nodes (22): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContent(), OpenInContentProps, OpenInContext, OpenInCursor() (+14 more)

### Community 49 - "note-editor.tsx"
Cohesion: 0.17
Nodes (22): NoteDeleteDialog(), applyAppendNoteContent(), applyReplaceNoteContent(), htmlFromAiContent(), EditorAiSheet(), EditorStatusBar(), EditorStatusBarProps, useRichTextEditor() (+14 more)

### Community 50 - "context.tsx"
Cohesion: 0.10
Nodes (24): ContextCacheUsage(), ContextCacheUsageProps, ContextContent(), ContextContentBody(), ContextContentBodyProps, ContextContentFooter(), ContextContentFooterProps, ContextContentHeader() (+16 more)

### Community 51 - "package-info.tsx"
Cohesion: 0.08
Nodes (25): ChangeType, changeTypeIcons, changeTypeStyles, PackageInfo(), PackageInfoChangeType(), PackageInfoChangeTypeProps, PackageInfoContent(), PackageInfoContentProps (+17 more)

### Community 52 - "message.tsx"
Cohesion: 0.09
Nodes (24): MessageActionProps, MessageActions(), MessageActionsProps, MessageBranch(), MessageBranchContent(), MessageBranchContentProps, MessageBranchContext, MessageBranchContextType (+16 more)

### Community 53 - "lib/utils.ts"
Cohesion: 0.16
Nodes (18): CtaSection(), LandingNav(), NoteChecklist(), NoteChecklistProps, EditorNoteExtras(), EditorNoteExtrasProps, formatReminderAt(), isImageAttachment() (+10 more)

### Community 54 - "app-sidebar.tsx"
Cohesion: 0.10
Nodes (21): ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator() (+13 more)

### Community 55 - "editor-ai-sheet.tsx"
Cohesion: 0.10
Nodes (24): Message(), MessageContent(), MessageResponse, captureScreenshot(), convertBlobUrlToDataUrl(), PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot() (+16 more)

### Community 56 - "snippet.tsx"
Cohesion: 0.11
Nodes (19): Snippet(), SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInput(), SnippetInputProps, SnippetProps (+11 more)

### Community 57 - "content.ts"
Cohesion: 0.13
Nodes (18): COMPARISON_ROWS, ComparisonRow, FAQS, FeatureKey, FEATURES, NAV_LINKS, PRICING_PLANS, PricingPlan (+10 more)

### Community 58 - "workspacePath"
Cohesion: 0.16
Nodes (14): IntegrationsPage(), IntegrationsPageProps, NotesPage(), NotesPageProps, IntegrationsPanel(), MobileBottomNav(), AppWorkspace(), isNotesListView() (+6 more)

### Community 59 - "agent.tsx"
Cohesion: 0.13
Nodes (19): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+11 more)

### Community 60 - "editor-toolbar.tsx"
Cohesion: 0.14
Nodes (17): EDITOR_FONT_STORAGE_KEY, EMPTY_FORMATS, TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE, EditorToolbar(), EditorToolbarProps, FormatButton() (+9 more)

### Community 61 - "file-tree.tsx"
Cohesion: 0.10
Nodes (18): FileTree(), FileTreeActions(), FileTreeActionsProps, FileTreeContext, FileTreeContextType, FileTreeFile(), FileTreeFileContext, FileTreeFileContextType (+10 more)

### Community 62 - "plan.tsx"
Cohesion: 0.11
Nodes (16): Plan(), PlanActionProps, PlanContentProps, PlanContext, PlanContextValue, PlanDescription(), PlanDescriptionProps, PlanFooterProps (+8 more)

### Community 63 - "chain-of-thought.tsx"
Cohesion: 0.11
Nodes (17): ChainOfThought, ChainOfThoughtContent, ChainOfThoughtContentProps, ChainOfThoughtContext, ChainOfThoughtContextValue, ChainOfThoughtHeader, ChainOfThoughtHeaderProps, ChainOfThoughtImage (+9 more)

### Community 64 - "confirmation.tsx"
Cohesion: 0.13
Nodes (17): Confirmation(), ConfirmationAccepted(), ConfirmationAcceptedProps, ConfirmationActionProps, ConfirmationActions(), ConfirmationActionsProps, ConfirmationContext, ConfirmationContextValue (+9 more)

### Community 65 - "terminal.tsx"
Cohesion: 0.11
Nodes (18): Terminal(), TerminalActions(), TerminalActionsProps, TerminalClearButton(), TerminalClearButtonProps, TerminalContent(), TerminalContentProps, TerminalContext (+10 more)

### Community 66 - "note-integrations.tsx"
Cohesion: 0.18
Nodes (16): GoogleConnectionCard(), googleConnectionKey, GoogleConnectionStatus, GoogleCredentialSource, GoogleIntegrationItem, googleItemsKey, useCallbackError(), useGoogleConnection() (+8 more)

### Community 67 - "speech-input.tsx"
Cohesion: 0.14
Nodes (12): detectSpeechInputMode(), SpeechInput(), SpeechInputMode, SpeechInputProps, SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionErrorEvent, SpeechRecognitionEvent (+4 more)

### Community 68 - "google-connection-card.tsx"
Cohesion: 0.26
Nodes (11): SCOPES, AccountSettings(), AppearanceSettings(), emptySubscribe(), THEME_OPTIONS, Card(), CardAction(), CardContent() (+3 more)

### Community 69 - "artifact.tsx"
Cohesion: 0.12
Nodes (16): Artifact(), ArtifactAction(), ArtifactActionProps, ArtifactActions(), ArtifactActionsProps, ArtifactClose(), ArtifactCloseProps, ArtifactContent() (+8 more)

### Community 70 - "alert-dialog.tsx"
Cohesion: 0.24
Nodes (12): NoteDeleteDialogProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader() (+4 more)

### Community 71 - "notes-list.tsx"
Cohesion: 0.21
Nodes (15): formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent(), useReminderClock(), groupNotes() (+7 more)

### Community 72 - "notification-settings.tsx"
Cohesion: 0.23
Nodes (12): ackReminder(), firedLocally, presentReminder(), Reminder, ReminderRuntime(), reminderUrl(), getAudioContext(), playReminderSound() (+4 more)

### Community 73 - "node.tsx"
Cohesion: 0.12
Nodes (12): Node(), NodeActionProps, NodeContent(), NodeContentProps, NodeDescriptionProps, NodeFooter(), NodeFooterProps, NodeHeader() (+4 more)

### Community 74 - "sandbox.tsx"
Cohesion: 0.12
Nodes (15): Sandbox(), SandboxContent(), SandboxContentProps, SandboxHeaderProps, SandboxRootProps, SandboxTabContent(), SandboxTabContentProps, SandboxTabs() (+7 more)

### Community 75 - "tool.tsx"
Cohesion: 0.13
Nodes (15): SandboxHeader(), getStatusBadge(), statusIcons, statusLabels, Tool(), ToolContent(), ToolContentProps, ToolHeader() (+7 more)

### Community 76 - "web-preview.tsx"
Cohesion: 0.15
Nodes (14): useWebPreview(), WebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue (+6 more)

### Community 77 - "editor-canvas.tsx"
Cohesion: 0.18
Nodes (12): EditorCanvas(), EditorCanvasProps, EditorTags(), EditorTagsProps, useNoteDraft(), UseNoteDraftOptions, BlockTag, DraftSnapshot (+4 more)

### Community 78 - "push.ts"
Cohesion: 0.23
Nodes (13): DELETE(), GET(), POST(), pushSubscriptions, configureWebPush(), isPushConfigured(), listUserPushSubscriptions(), PushSubscriptionInput (+5 more)

### Community 79 - "demo-section.tsx"
Cohesion: 0.18
Nodes (8): DemoSection(), TABS, WriteScreen(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 80 - "landing-page.tsx"
Cohesion: 0.21
Nodes (8): metadata, FOOTER_LINKS, LandingPage(), FaqSection(), LandingFooter(), PricingSection(), NotelyLogo(), NotelyLogoProps

### Community 81 - "conversation.tsx"
Cohesion: 0.16
Nodes (13): Conversation(), ConversationContent(), ConversationContentProps, ConversationDownload(), ConversationDownloadProps, ConversationEmptyState(), ConversationEmptyStateProps, ConversationProps (+5 more)

### Community 82 - "jsx-preview.tsx"
Cohesion: 0.16
Nodes (11): completeJsxTag(), JSXPreview, JSXPreviewContent, JSXPreviewContentProps, JSXPreviewContext, JSXPreviewContextValue, JSXPreviewError, JSXPreviewErrorProps (+3 more)

### Community 83 - "collapsible.tsx"
Cohesion: 0.19
Nodes (10): SourceProps, Sources(), SourcesContent(), SourcesContentProps, SourcesProps, SourcesTrigger(), SourcesTriggerProps, Collapsible() (+2 more)

### Community 84 - "notes-empty-state.tsx"
Cohesion: 0.15
Nodes (5): copy, IllustrationProps, IllustrationShell(), NotesEmptyStateProps, NotesEmptyStateVariant

### Community 85 - "date-time-picker.tsx"
Cohesion: 0.26
Nodes (12): DateTimePicker(), DateTimePickerProps, getHour12(), getPeriod(), HOURS, pad(), Period, PERIODS (+4 more)

### Community 86 - "persona.tsx"
Cohesion: 0.18
Nodes (10): getCurrentTheme(), Persona, PersonaProps, PersonaState, PersonaWithModel, PersonaWithModelProps, PersonaWithoutModel, PersonaWithoutModelProps (+2 more)

### Community 87 - "reasoning.tsx"
Cohesion: 0.17
Nodes (9): Reasoning, ReasoningContent, ReasoningContentProps, ReasoningContext, ReasoningContextValue, ReasoningProps, ReasoningTrigger, ReasoningTriggerProps (+1 more)

### Community 88 - "note-chat/route.ts"
Cohesion: 0.36
Nodes (8): maxDuration, POST(), buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 89 - "task.tsx"
Cohesion: 0.18
Nodes (10): Task(), TaskContent(), TaskContentProps, TaskItem(), TaskItemFile(), TaskItemFileProps, TaskItemProps, TaskProps (+2 more)

### Community 90 - "pricing-section.tsx"
Cohesion: 0.29
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 91 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 92 - "note-reminder-dialog.tsx"
Cohesion: 0.31
Nodes (9): defaultRemindAt(), formatFromNow(), NoteReminderDialog(), NoteReminderDialogProps, QUICK_PRESETS, Reminder, snoozeInOneHour(), snoozeTomorrowMorning() (+1 more)

### Community 93 - "task-board.tsx"
Cohesion: 0.28
Nodes (6): columns, notify(), Task, TaskBoard(), TaskStatus, ConfirmDialog()

### Community 94 - "hero-section.tsx"
Cohesion: 0.25
Nodes (7): HERO_STATS, HeroSection(), PROOF_POINTS, NOTES, SPACES, TASKS, WorkspacePreview()

### Community 95 - "use-editor-font.ts"
Cohesion: 0.44
Nodes (7): readStoredFont(), useEditorFont(), EDITOR_FONTS, EditorFontOption, ensureEditorFontLoaded(), getEditorFont(), loadedGoogleFonts

### Community 96 - "select.tsx"
Cohesion: 0.22
Nodes (8): SelectContent(), SelectGroup(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 97 - "transcription.tsx"
Cohesion: 0.29
Nodes (7): Transcription(), TranscriptionContext, TranscriptionContextValue, TranscriptionProps, TranscriptionSegment, TranscriptionSegmentProps, useTranscription()

### Community 98 - "react"
Cohesion: 0.33
Nodes (6): react, react, CalendarDayButton(), SidebarMenuSkeleton(), SidebarProvider(), useIsMobile()

### Community 99 - "shimmer.tsx"
Cohesion: 0.33
Nodes (6): getMotionComponent(), motionComponentCache, MotionHTMLProps, Shimmer, ShimmerComponent(), TextShimmerProps

### Community 100 - "graphify-run.mjs"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 101 - "edge.tsx"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 102 - "highlightCode"
Cohesion: 0.40
Nodes (5): CodeBlockContent(), createRawTokens(), getHighlighter(), getTokensCacheKey(), highlightCode()

### Community 105 - "TokenSpan"
Cohesion: 0.50
Nodes (4): isBold(), isItalic(), isUnderline(), TokenSpan()

### Community 106 - "hover-card.tsx"
Cohesion: 0.50
Nodes (3): HoverCard(), HoverCardContent(), HoverCardTrigger()

## Knowledge Gaps
- **858 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+853 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `security-settings.tsx`, `app-bar.tsx`, `user-menu.tsx`, `sidebar.tsx`, `push-client.ts`, `dialog.tsx`, `prompt-input.tsx`, `dashboard-shell.tsx`, `calendar-workspace.tsx`, `readJson`, `commit.tsx`, `inline-citation.tsx`, `test-results.tsx`, `voice-selector.tsx`, `model-selector.tsx`, `schema-display.tsx`, `attachments.tsx`, `stack-trace.tsx`, `code-block.tsx`, `environment-variables.tsx`, `mic-selector.tsx`, `audio-player.tsx`, `open-in-chat.tsx`, `context.tsx`, `package-info.tsx`, `message.tsx`, `lib/utils.ts`, `app-sidebar.tsx`, `editor-ai-sheet.tsx`, `snippet.tsx`, `content.ts`, `workspacePath`, `agent.tsx`, `editor-toolbar.tsx`, `file-tree.tsx`, `plan.tsx`, `chain-of-thought.tsx`, `confirmation.tsx`, `terminal.tsx`, `note-integrations.tsx`, `speech-input.tsx`, `google-connection-card.tsx`, `artifact.tsx`, `alert-dialog.tsx`, `notes-list.tsx`, `notification-settings.tsx`, `node.tsx`, `sandbox.tsx`, `tool.tsx`, `web-preview.tsx`, `editor-canvas.tsx`, `demo-section.tsx`, `landing-page.tsx`, `conversation.tsx`, `jsx-preview.tsx`, `collapsible.tsx`, `notes-empty-state.tsx`, `date-time-picker.tsx`, `persona.tsx`, `reasoning.tsx`, `task.tsx`, `pricing-section.tsx`, `sheet.tsx`, `note-reminder-dialog.tsx`, `task-board.tsx`, `hero-section.tsx`, `select.tsx`, `transcription.tsx`, `react`, `shimmer.tsx`, `hover-card.tsx`?**
  _High betweenness centrality (0.502) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `react-dom`, `react-hook-form`, `react-jsx-parser`, `react-qr-code`, `@rive-app/react-webgl2`, `shadcn`, `scripts`, `shiki`, `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `@streamdown/mermaid`, `tailwind-merge`, `tokenlens`, `tw-animate-css`, `use-stick-to-bottom`, `@xyflow/react`, `zod`, `zustand`, `react`, `@ai-sdk/google`, `@ai-sdk/react`, `ansi-to-react`, `@base-ui/react`, `better-auth`, `@better-auth/infra`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `jose`, `lucide-react`, `media-chrome`, `motion`, `nanoid`, `@neondatabase/serverless`, `next`, `@radix-ui/react-use-controllable-state`, `react-day-picker`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`, `inline-citation.tsx`, `sidebar.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _858 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `security-settings.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06390977443609022 - nodes in this community are weakly interconnected._
- **Should `validations/notes.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08888888888888889 - nodes in this community are weakly interconnected._
- **Should `app-bar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12535612535612536 - nodes in this community are weakly interconnected._