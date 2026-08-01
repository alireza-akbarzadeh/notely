# Graph Report - notely  (2026-08-01)

## Corpus Check
- 290 files · ~105,005 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2352 nodes · 5051 edges · 143 communities (96 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cf9cdfa7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- login-page.tsx
- tasks.ts
- lib/utils.ts
- getEnv
- dependencies
- open-in-chat.tsx
- scripts
- cn
- requireNoteAccess
- compilerOptions
- components.json
- 1. Current product surface
- Find Skills
- carousel.tsx
- Nexora
- shares.ts
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- button.tsx
- use-rich-text-editor.ts
- workspacePath
- prompt-input.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- readJson
- commit.tsx
- notes-empty-state.tsx
- google-integration.ts
- inline-citation.tsx
- queue.tsx
- test-results.tsx
- voice-selector.tsx
- model-selector.tsx
- note-reminder-dialog.tsx
- calendar-workspace.tsx
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
- google-connection-card.tsx
- snippet.tsx
- agent.tsx
- reminders.ts
- editor-ai-sheet.tsx
- calendar-week-view.tsx
- file-tree.tsx
- plan.tsx
- chain-of-thought.tsx
- confirmation.tsx
- reasoning.tsx
- terminal.tsx
- note-integrations.tsx
- speech-input.tsx
- field.tsx
- notes-list.tsx
- artifact.tsx
- task-board.tsx
- sandbox.tsx
- tool.tsx
- web-preview.tsx
- note-editor.tsx
- content.ts
- note-reminder-countdown.tsx
- landing-page.tsx
- security-settings.tsx
- landing-nav.tsx
- conversation.tsx
- jsx-preview.tsx
- collapsible.tsx
- useMessageBranch
- button-group.tsx
- persona.tsx
- note-chat/route.ts
- usePromptInputAttachments
- proxy.ts
- pricing-section.tsx
- transcription.tsx
- graphify-run.mjs
- edge.tsx
- apple-icon.tsx
- canvas.tsx
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
- editor-toolbar.tsx
- editor-canvas.tsx
- use-editor-font.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 601 edges
2. `requireSession()` - 76 edges
3. `Button()` - 62 edges
4. `jsonError()` - 60 edges
5. `readJson()` - 44 edges
6. `workspacePath()` - 26 edges
7. `requireNoteAccess()` - 24 edges
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
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Communities (143 total, 47 thin omitted)

### Community 0 - "login-page.tsx"
Cohesion: 0.10
Nodes (28): DevAuthEmail, extractUrl(), ForgotPasswordPage(), LoginPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel() (+20 more)

### Community 1 - "tasks.ts"
Cohesion: 0.17
Nodes (17): DELETE(), Params, PATCH(), GET(), POST(), tasks, createTask(), deleteTask() (+9 more)

### Community 2 - "lib/utils.ts"
Cohesion: 0.16
Nodes (15): Checkpoint(), CheckpointIcon(), CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, AppBarProps, Header(), OPTIONS (+7 more)

### Community 3 - "getEnv"
Cohesion: 0.17
Nodes (18): GET(), env, googleEnabled, resolveAppleEnabled(), Session, generateAppleClientSecret(), isAppleAuthConfigured(), isGoogleAuthConfigured() (+10 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): ai, drizzle-orm, next-themes, dependencies, ai, drizzle-orm, next-themes, @tanstack/react-query (+3 more)

### Community 5 - "open-in-chat.tsx"
Cohesion: 0.06
Nodes (39): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContent(), OpenInContentProps, OpenInContext, OpenInCursor() (+31 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (40): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+32 more)

### Community 7 - "cn"
Cohesion: 0.06
Nodes (56): react, react, Controls(), ControlsProps, Image(), ImageProps, Panel(), PanelProps (+48 more)

### Community 8 - "requireNoteAccess"
Cohesion: 0.20
Nodes (16): GET(), Params, DELETE(), Params, GET(), POST(), requireNoteAccess(), createDbFileAttachment() (+8 more)

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

### Community 13 - "carousel.tsx"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "shares.ts"
Cohesion: 0.10
Nodes (23): DELETE(), db, sql, account, attachments, events, googleConnections, googleOAuthCredentials (+15 more)

### Community 24 - "button.tsx"
Cohesion: 0.14
Nodes (30): CalendarEventDialogProps, GoogleCredentialsDialogProps, EditorLinkDialogProps, EditorPanelsDialogProps, NoteListContextMenuProps, SearchHit, SpaceDeleteDialog(), SpaceDeleteDialogProps (+22 more)

### Community 25 - "use-rich-text-editor.ts"
Cohesion: 0.21
Nodes (18): applyAppendNoteContent(), applyReplaceNoteContent(), htmlFromAiContent(), EditorAiSheet(), EditorCanvas(), useRichTextEditor(), UseRichTextEditorOptions, decorateEditorLinks() (+10 more)

### Community 26 - "workspacePath"
Cohesion: 0.11
Nodes (25): IntegrationsPage(), IntegrationsPageProps, NotesPage(), NotesPageProps, IntegrationsPanel(), AppBar(), AppSidebar(), fetchSpaces() (+17 more)

### Community 27 - "prompt-input.tsx"
Cohesion: 0.03
Nodes (62): AttachmentsContext, LocalAttachmentsContext, LocalReferencedSourcesContext, PromptInputActionAddAttachmentsProps, PromptInputActionAddScreenshotProps, PromptInputActionMenuContentProps, PromptInputActionMenuItem(), PromptInputActionMenuItemProps (+54 more)

### Community 28 - "Notely Drizzle + Neon"
Cohesion: 0.33
Nodes (5): Conventions, Layout, Migrations, Notely Drizzle + Neon, Queries

### Community 29 - "Notely Better Auth"
Cohesion: 0.40
Nodes (4): Layout, Notely Better Auth, Pattern (API route), Rules

### Community 30 - "requireSession"
Cohesion: 0.08
Nodes (45): { GET, POST }, DELETE(), Params, GET(), POST(), GET(), DELETE(), PATCH() (+37 more)

### Community 31 - "service.ts"
Cohesion: 0.07
Nodes (56): DELETE(), GET(), Params, PATCH(), GET(), POST(), DELETE(), Params (+48 more)

### Community 32 - "readJson"
Cohesion: 0.13
Nodes (20): Params, InboxPanel(), Invite, NoteChecklist(), NoteChecklistProps, NoteSharePanel(), NoteSharePanelProps, ShareRow (+12 more)

### Community 33 - "commit.tsx"
Cohesion: 0.04
Nodes (53): Commit(), CommitActions(), CommitActionsProps, CommitAuthor(), CommitAuthorAvatar(), CommitAuthorAvatarProps, CommitAuthorProps, CommitContent() (+45 more)

### Community 34 - "notes-empty-state.tsx"
Cohesion: 0.15
Nodes (5): copy, IllustrationProps, IllustrationShell(), NotesEmptyStateProps, NotesEmptyStateVariant

### Community 35 - "google-integration.ts"
Cohesion: 0.09
Nodes (43): callbackRedirect(), GET(), GET(), safeReturnTo(), DELETE(), PUT(), saveCredentialsSchema, GET() (+35 more)

### Community 36 - "inline-citation.tsx"
Cohesion: 0.07
Nodes (28): CarouselApiContext, InlineCitation(), InlineCitationCardBody(), InlineCitationCardBodyProps, InlineCitationCardProps, InlineCitationCardTrigger(), InlineCitationCardTriggerProps, InlineCitationCarousel() (+20 more)

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

### Community 41 - "note-reminder-dialog.tsx"
Cohesion: 0.07
Nodes (49): geistMono, geistSans, metadata, viewport, defaultRemindAt(), formatFromNow(), NoteReminderDialog(), NoteReminderDialogProps (+41 more)

### Community 42 - "calendar-workspace.tsx"
Cohesion: 0.11
Nodes (20): metadata, Suggestion(), SuggestionProps, Suggestions(), SuggestionsProps, CalendarEventDialog(), CalendarListPanel(), CalendarListPanelProps (+12 more)

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
Cohesion: 0.05
Nodes (42): CodeBlockActions(), CodeBlockBody, CodeBlockContainer(), CodeBlockContent(), CodeBlockContext, CodeBlockContextType, CodeBlockCopyButton(), CodeBlockCopyButtonProps (+34 more)

### Community 47 - "alert-dialog.tsx"
Cohesion: 0.22
Nodes (13): NoteDeleteDialog(), NoteDeleteDialogProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+5 more)

### Community 48 - "environment-variables.tsx"
Cohesion: 0.07
Nodes (27): EnvironmentVariable(), EnvironmentVariableContext, EnvironmentVariableContextType, EnvironmentVariableCopyButton(), EnvironmentVariableCopyButtonProps, EnvironmentVariableGroup(), EnvironmentVariableGroupProps, EnvironmentVariableName() (+19 more)

### Community 49 - "message.tsx"
Cohesion: 0.09
Nodes (21): Message(), MessageActionProps, MessageActions(), MessageActionsProps, MessageBranch(), MessageBranchContentProps, MessageBranchContext, MessageBranchContextType (+13 more)

### Community 50 - "mic-selector.tsx"
Cohesion: 0.08
Nodes (21): MicSelector(), MicSelectorContent(), MicSelectorContentProps, MicSelectorContext, MicSelectorContextType, MicSelectorEmptyProps, MicSelectorInputProps, MicSelectorItemProps (+13 more)

### Community 51 - "context.tsx"
Cohesion: 0.09
Nodes (27): ContextCacheUsage(), ContextCacheUsageProps, ContextContent(), ContextContentBody(), ContextContentBodyProps, ContextContentFooter(), ContextContentFooterProps, ContextContentHeader() (+19 more)

### Community 52 - "package-info.tsx"
Cohesion: 0.08
Nodes (23): ChangeType, changeTypeIcons, changeTypeStyles, PackageInfo(), PackageInfoChangeType(), PackageInfoChangeTypeProps, PackageInfoContent(), PackageInfoContentProps (+15 more)

### Community 53 - "audio-player.tsx"
Cohesion: 0.09
Nodes (17): AudioPlayerControlBarProps, AudioPlayerDurationDisplay(), AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButton(), AudioPlayerMuteButtonProps, AudioPlayerPlayButton(), AudioPlayerPlayButtonProps (+9 more)

### Community 54 - "google-connection-card.tsx"
Cohesion: 0.11
Nodes (24): Node(), NodeActionProps, NodeContent(), NodeContentProps, NodeDescriptionProps, NodeFooter(), NodeFooterProps, NodeHeader() (+16 more)

### Community 55 - "snippet.tsx"
Cohesion: 0.11
Nodes (19): Snippet(), SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInput(), SnippetInputProps, SnippetProps (+11 more)

### Community 56 - "agent.tsx"
Cohesion: 0.13
Nodes (19): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+11 more)

### Community 57 - "reminders.ts"
Cohesion: 0.13
Nodes (27): DELETE(), GET(), POST(), hasCronAuth(), POST(), pushSubscriptions, getRemindersForNote(), listDueReminders() (+19 more)

### Community 58 - "editor-ai-sheet.tsx"
Cohesion: 0.11
Nodes (17): PromptInputActionMenu(), PromptInputActionMenuContent(), PromptInputActionMenuTrigger(), PromptInputBody(), PromptInputFooter(), PromptInputHeader(), PromptInputMessage, PromptInputSubmit() (+9 more)

### Community 59 - "calendar-week-view.tsx"
Cohesion: 0.20
Nodes (19): CalendarMiniMonth(), CalendarMiniMonthProps, CalendarWeekView(), CalendarWeekViewProps, addDays(), DAY_END_HOUR, DAY_START_HOUR, daysInMonth() (+11 more)

### Community 60 - "file-tree.tsx"
Cohesion: 0.10
Nodes (18): FileTree(), FileTreeActions(), FileTreeActionsProps, FileTreeContext, FileTreeContextType, FileTreeFile(), FileTreeFileContext, FileTreeFileContextType (+10 more)

### Community 61 - "plan.tsx"
Cohesion: 0.11
Nodes (16): Plan(), PlanActionProps, PlanContentProps, PlanContext, PlanContextValue, PlanDescription(), PlanDescriptionProps, PlanFooterProps (+8 more)

### Community 62 - "chain-of-thought.tsx"
Cohesion: 0.10
Nodes (19): ChainOfThought, ChainOfThoughtContent, ChainOfThoughtContentProps, ChainOfThoughtContext, ChainOfThoughtContextValue, ChainOfThoughtHeader, ChainOfThoughtHeaderProps, ChainOfThoughtImage (+11 more)

### Community 63 - "confirmation.tsx"
Cohesion: 0.10
Nodes (22): Confirmation(), ConfirmationAccepted(), ConfirmationAcceptedProps, ConfirmationActionProps, ConfirmationActions(), ConfirmationActionsProps, ConfirmationContext, ConfirmationContextValue (+14 more)

### Community 64 - "reasoning.tsx"
Cohesion: 0.12
Nodes (15): Reasoning, ReasoningContent, ReasoningContentProps, ReasoningContext, ReasoningContextValue, ReasoningProps, ReasoningTrigger, ReasoningTriggerProps (+7 more)

### Community 65 - "terminal.tsx"
Cohesion: 0.11
Nodes (18): Terminal(), TerminalActions(), TerminalActionsProps, TerminalClearButton(), TerminalClearButtonProps, TerminalContent(), TerminalContentProps, TerminalContext (+10 more)

### Community 66 - "note-integrations.tsx"
Cohesion: 0.26
Nodes (11): GoogleConnectionCard(), googleConnectionKey, GoogleConnectionStatus, GoogleCredentialSource, GoogleIntegrationItem, googleItemsKey, useCallbackError(), useGoogleConnection() (+3 more)

### Community 67 - "speech-input.tsx"
Cohesion: 0.14
Nodes (12): detectSpeechInputMode(), SpeechInput(), SpeechInputMode, SpeechInputProps, SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionErrorEvent, SpeechRecognitionEvent (+4 more)

### Community 68 - "field.tsx"
Cohesion: 0.20
Nodes (12): FormPasswordFieldProps, FormFieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend() (+4 more)

### Community 69 - "notes-list.tsx"
Cohesion: 0.27
Nodes (10): NoteListContextMenu(), useReminderClock(), groupNotes(), NoteGroup, NotesList(), NotesListProps, noteTimestamp(), spaceTimestamp() (+2 more)

### Community 70 - "artifact.tsx"
Cohesion: 0.12
Nodes (16): Artifact(), ArtifactAction(), ArtifactActionProps, ArtifactActions(), ArtifactActionsProps, ArtifactClose(), ArtifactCloseProps, ArtifactContent() (+8 more)

### Community 71 - "task-board.tsx"
Cohesion: 0.26
Nodes (9): columns, endOfTodayLocal(), formatDueLabel(), isSameLocalDay(), notify(), Task, TaskBoard(), TaskStatus (+1 more)

### Community 72 - "sandbox.tsx"
Cohesion: 0.09
Nodes (22): Sandbox(), SandboxContent(), SandboxContentProps, SandboxHeaderProps, SandboxRootProps, SandboxTabContent(), SandboxTabContentProps, SandboxTabs() (+14 more)

### Community 73 - "tool.tsx"
Cohesion: 0.13
Nodes (15): SandboxHeader(), getStatusBadge(), statusIcons, statusLabels, Tool(), ToolContent(), ToolContentProps, ToolHeader() (+7 more)

### Community 74 - "web-preview.tsx"
Cohesion: 0.15
Nodes (14): useWebPreview(), WebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue (+6 more)

### Community 75 - "note-editor.tsx"
Cohesion: 0.25
Nodes (8): EditorLinkDialog(), EditorPanelsDialog(), EditorStatusBar(), EditorStatusBarProps, EditorToolbar(), NoteEditor(), NoteEditorProps, statusLabel()

### Community 76 - "content.ts"
Cohesion: 0.14
Nodes (17): COMPARISON_ROWS, ComparisonRow, FAQS, FeatureKey, FEATURES, PRICING_PLANS, PricingPlan, TESTIMONIALS (+9 more)

### Community 77 - "note-reminder-countdown.tsx"
Cohesion: 0.43
Nodes (6): formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent()

### Community 78 - "landing-page.tsx"
Cohesion: 0.16
Nodes (14): HERO_STATS, CtaSection(), DemoSection(), FaqSection(), HeroSection(), PROOF_POINTS, LandingNav(), PricingSection() (+6 more)

### Community 79 - "security-settings.tsx"
Cohesion: 0.19
Nodes (13): formatDate(), SecuritySettings(), SessionRow, truncateUa(), ChangePasswordFormValues, changePasswordSchema, LoginFormValues, loginSchema (+5 more)

### Community 80 - "landing-nav.tsx"
Cohesion: 0.21
Nodes (7): metadata, FOOTER_LINKS, NAV_LINKS, LandingPage(), LandingFooter(), NotelyLogo(), NotelyLogoProps

### Community 81 - "conversation.tsx"
Cohesion: 0.16
Nodes (13): Conversation(), ConversationContent(), ConversationContentProps, ConversationDownload(), ConversationDownloadProps, ConversationEmptyState(), ConversationEmptyStateProps, ConversationProps (+5 more)

### Community 82 - "jsx-preview.tsx"
Cohesion: 0.16
Nodes (11): completeJsxTag(), JSXPreview, JSXPreviewContent, JSXPreviewContentProps, JSXPreviewContext, JSXPreviewContextValue, JSXPreviewError, JSXPreviewErrorProps (+3 more)

### Community 83 - "collapsible.tsx"
Cohesion: 0.11
Nodes (20): SourceProps, Sources(), SourcesContent(), SourcesContentProps, SourcesProps, SourcesTrigger(), SourcesTriggerProps, Task() (+12 more)

### Community 84 - "useMessageBranch"
Cohesion: 0.33
Nodes (6): MessageBranchContent(), MessageBranchNext(), MessageBranchPage(), MessageBranchPrevious(), MessageBranchSelector(), useMessageBranch()

### Community 85 - "button-group.tsx"
Cohesion: 0.50
Nodes (4): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants

### Community 86 - "persona.tsx"
Cohesion: 0.18
Nodes (10): getCurrentTheme(), Persona, PersonaProps, PersonaState, PersonaWithModel, PersonaWithModelProps, PersonaWithoutModel, PersonaWithoutModelProps (+2 more)

### Community 87 - "note-chat/route.ts"
Cohesion: 0.36
Nodes (8): maxDuration, POST(), buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 88 - "usePromptInputAttachments"
Cohesion: 0.18
Nodes (11): captureScreenshot(), convertBlobUrlToDataUrl(), PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot(), PromptInputTextarea(), useOptionalPromptInputController(), useOptionalProviderAttachments() (+3 more)

### Community 89 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, exactPublicRoutes, isPublicPath(), proxy()

### Community 90 - "pricing-section.tsx"
Cohesion: 0.29
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 92 - "transcription.tsx"
Cohesion: 0.29
Nodes (7): Transcription(), TranscriptionContext, TranscriptionContextValue, TranscriptionProps, TranscriptionSegment, TranscriptionSegmentProps, useTranscription()

### Community 95 - "graphify-run.mjs"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 96 - "edge.tsx"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 146 - "editor-toolbar.tsx"
Cohesion: 0.12
Nodes (20): EDITOR_FONT_STORAGE_KEY, EMPTY_FORMATS, TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE, EditorToolbarProps, FormatButton(), ActiveFormats (+12 more)

### Community 147 - "editor-canvas.tsx"
Cohesion: 0.16
Nodes (14): EditorCanvasProps, EditorNoteExtras(), EditorNoteExtrasProps, formatReminderAt(), isImageAttachment(), PendingReminder, EditorTags(), EditorTagsProps (+6 more)

### Community 149 - "use-editor-font.ts"
Cohesion: 0.44
Nodes (7): readStoredFont(), useEditorFont(), EDITOR_FONTS, EditorFontOption, ensureEditorFontLoaded(), getEditorFont(), loadedGoogleFonts

## Knowledge Gaps
- **861 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+856 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `login-page.tsx`, `lib/utils.ts`, `open-in-chat.tsx`, `carousel.tsx`, `editor-toolbar.tsx`, `editor-canvas.tsx`, `button.tsx`, `use-rich-text-editor.ts`, `workspacePath`, `prompt-input.tsx`, `readJson`, `commit.tsx`, `notes-empty-state.tsx`, `inline-citation.tsx`, `queue.tsx`, `test-results.tsx`, `voice-selector.tsx`, `model-selector.tsx`, `note-reminder-dialog.tsx`, `calendar-workspace.tsx`, `schema-display.tsx`, `attachments.tsx`, `stack-trace.tsx`, `code-block.tsx`, `alert-dialog.tsx`, `environment-variables.tsx`, `message.tsx`, `mic-selector.tsx`, `context.tsx`, `package-info.tsx`, `audio-player.tsx`, `google-connection-card.tsx`, `snippet.tsx`, `agent.tsx`, `editor-ai-sheet.tsx`, `calendar-week-view.tsx`, `file-tree.tsx`, `plan.tsx`, `chain-of-thought.tsx`, `confirmation.tsx`, `reasoning.tsx`, `terminal.tsx`, `speech-input.tsx`, `field.tsx`, `notes-list.tsx`, `artifact.tsx`, `task-board.tsx`, `sandbox.tsx`, `tool.tsx`, `web-preview.tsx`, `note-editor.tsx`, `content.ts`, `note-reminder-countdown.tsx`, `landing-page.tsx`, `landing-nav.tsx`, `conversation.tsx`, `jsx-preview.tsx`, `collapsible.tsx`, `useMessageBranch`, `button-group.tsx`, `persona.tsx`, `usePromptInputAttachments`, `pricing-section.tsx`, `transcription.tsx`?**
  _High betweenness centrality (0.518) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `shadcn`, `shiki`, `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `scripts`, `cn`, `@streamdown/mermaid`, `tailwind-merge`, `tokenlens`, `tw-animate-css`, `use-stick-to-bottom`, `@xyflow/react`, `zod`, `zustand`, `@ai-sdk/google`, `@ai-sdk/react`, `ansi-to-react`, `@base-ui/react`, `better-auth`, `@better-auth/infra`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `jose`, `lucide-react`, `media-chrome`, `motion`, `nanoid`, `@neondatabase/serverless`, `next`, `@radix-ui/react-use-controllable-state`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-jsx-parser`, `react-qr-code`, `@rive-app/react-webgl2`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `react` connect `cn` to `dependencies`, `carousel.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _861 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `login-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10101010101010101 - nodes in this community are weakly interconnected._
- **Should `open-in-chat.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05725490196078432 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._