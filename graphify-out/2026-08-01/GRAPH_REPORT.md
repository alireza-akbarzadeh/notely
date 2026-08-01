# Graph Report - notely  (2026-08-01)

## Corpus Check
- 291 files · ~106,735 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2373 nodes · 5108 edges · 146 communities (98 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `56665359`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- login-page.tsx
- tasks.ts
- checkpoint.tsx
- auth/index.ts
- dependencies
- open-in-chat.tsx
- scripts
- cn
- jsonError
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
- lib/utils.ts
- note-editor.tsx
- readJson
- prompt-input.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- note-share-panel.tsx
- commit.tsx
- app-sidebar.tsx
- google-integration.ts
- inline-citation.tsx
- queue.tsx
- test-results.tsx
- voice-selector.tsx
- model-selector.tsx
- notification-settings.tsx
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
- node.tsx
- snippet.tsx
- agent.tsx
- reminders.ts
- editor-ai-sheet.tsx
- calendar-week-view.tsx
- user-menu.tsx
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
- demo-section.tsx
- sandbox.tsx
- use-voice-dictation.ts
- web-preview.tsx
- date-time-picker.tsx
- content.ts
- note-reminder-countdown.tsx
- hero-section.tsx
- security-settings.tsx
- landing-page.tsx
- conversation.tsx
- jsx-preview.tsx
- file-tree.tsx
- app/layout.tsx
- button-group.tsx
- persona.tsx
- note-chat/route.ts
- select.tsx
- tags/[id]/route.ts
- pricing-section.tsx
- highlightCode
- transcription.tsx
- TokenSpan
- login/page.tsx
- graphify-run.mjs
- edge.tsx
- @tanstack/react-query
- apple-icon.tsx
- canvas.tsx
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
- types/notes.ts
- use-editor-font.ts

## God Nodes (most connected - your core abstractions)
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
- `SidebarMenuSkeleton()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json
- `SidebarProvider()` --references--> `react`  [EXTRACTED]
  src/components/ui/sidebar.tsx → package.json

## Import Cycles
- None detected.

## Communities (146 total, 48 thin omitted)

### Community 0 - "login-page.tsx"
Cohesion: 0.13
Nodes (23): DevAuthEmail, extractUrl(), ForgotPasswordPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel(), AuthPanelProps (+15 more)

### Community 1 - "tasks.ts"
Cohesion: 0.17
Nodes (17): DELETE(), Params, PATCH(), GET(), POST(), tasks, createTask(), deleteTask() (+9 more)

### Community 2 - "checkpoint.tsx"
Cohesion: 0.19
Nodes (11): Checkpoint(), CheckpointIcon(), CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, OPTIONS, ThemeToggle(), ThemeToggleProps (+3 more)

### Community 3 - "auth/index.ts"
Cohesion: 0.15
Nodes (16): { GET, POST }, auth, env, googleEnabled, resolveAppleEnabled(), Session, generateAppleClientSecret(), isAppleAuthConfigured() (+8 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): ai, @ai-sdk/google, drizzle-orm, next-themes, dependencies, ai, @ai-sdk/google, drizzle-orm (+3 more)

### Community 5 - "open-in-chat.tsx"
Cohesion: 0.09
Nodes (22): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContent(), OpenInContentProps, OpenInContext, OpenInCursor() (+14 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (40): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+32 more)

### Community 7 - "cn"
Cohesion: 0.05
Nodes (60): react, react, Controls(), ControlsProps, Image(), ImageProps, Panel(), PanelProps (+52 more)

### Community 8 - "jsonError"
Cohesion: 0.16
Nodes (23): GET(), Params, GET(), POST(), DELETE(), GET(), Params, PATCH() (+15 more)

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
Cohesion: 0.08
Nodes (35): DELETE(), Params, PATCH(), GET(), POST(), db, sql, account (+27 more)

### Community 24 - "lib/utils.ts"
Cohesion: 0.12
Nodes (33): CalendarEventDialogProps, CalendarNavSidebarProps, GoogleCredentialsDialogProps, NoteChecklist(), NoteChecklistProps, EditorLinkDialogProps, EditorPanelsDialogProps, defaultRemindAt() (+25 more)

### Community 25 - "note-editor.tsx"
Cohesion: 0.15
Nodes (25): applyAppendNoteContent(), applyReplaceNoteContent(), htmlFromAiContent(), EditorAiSheet(), EditorCanvas(), EditorLinkDialog(), EditorPanelsDialog(), EditorStatusBar() (+17 more)

### Community 26 - "readJson"
Cohesion: 0.09
Nodes (36): IntegrationsPage(), IntegrationsPageProps, Params, NotesPage(), NotesPageProps, AppBar(), AppBarProps, Header() (+28 more)

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
Cohesion: 0.12
Nodes (25): DELETE(), Params, DELETE(), Params, GET(), POST(), GET(), GET() (+17 more)

### Community 31 - "service.ts"
Cohesion: 0.08
Nodes (46): GET(), POST(), DELETE(), Params, PATCH(), GET(), POST(), GET() (+38 more)

### Community 32 - "note-share-panel.tsx"
Cohesion: 0.15
Nodes (15): initials(), NoteShareMenu(), NoteShareMenuProps, NoteShareTrigger, roleLabel(), ShareRow, statusLabel(), Avatar() (+7 more)

### Community 33 - "commit.tsx"
Cohesion: 0.04
Nodes (47): Commit(), CommitActions(), CommitActionsProps, CommitAuthor(), CommitAuthorAvatar(), CommitAuthorAvatarProps, CommitAuthorProps, CommitContent() (+39 more)

### Community 34 - "app-sidebar.tsx"
Cohesion: 0.17
Nodes (17): NoteListContextMenuProps, SpaceDeleteDialog(), TagManageDialog(), ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem() (+9 more)

### Community 35 - "google-integration.ts"
Cohesion: 0.07
Nodes (51): GET(), callbackRedirect(), GET(), GET(), safeReturnTo(), DELETE(), PUT(), saveCredentialsSchema (+43 more)

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

### Community 41 - "notification-settings.tsx"
Cohesion: 0.07
Nodes (35): copy, IllustrationProps, IllustrationShell(), NotesEmptyStateProps, NotesEmptyStateVariant, ackReminder(), firedLocally, presentReminder() (+27 more)

### Community 42 - "calendar-workspace.tsx"
Cohesion: 0.12
Nodes (17): metadata, Suggestion(), SuggestionProps, Suggestions(), SuggestionsProps, CalendarEventDialog(), CalendarListPanel(), CalendarListPanelProps (+9 more)

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
Cohesion: 0.09
Nodes (27): ContextCacheUsage(), ContextCacheUsageProps, ContextContent(), ContextContentBody(), ContextContentBodyProps, ContextContentFooter(), ContextContentFooterProps, ContextContentHeader() (+19 more)

### Community 52 - "package-info.tsx"
Cohesion: 0.08
Nodes (25): ChangeType, changeTypeIcons, changeTypeStyles, PackageInfo(), PackageInfoChangeType(), PackageInfoChangeTypeProps, PackageInfoContent(), PackageInfoContentProps (+17 more)

### Community 53 - "audio-player.tsx"
Cohesion: 0.09
Nodes (17): AudioPlayerControlBarProps, AudioPlayerDurationDisplay(), AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButton(), AudioPlayerMuteButtonProps, AudioPlayerPlayButton(), AudioPlayerPlayButtonProps (+9 more)

### Community 54 - "node.tsx"
Cohesion: 0.11
Nodes (22): Node(), NodeActionProps, NodeContent(), NodeContentProps, NodeDescriptionProps, NodeFooter(), NodeFooterProps, NodeHeader() (+14 more)

### Community 55 - "snippet.tsx"
Cohesion: 0.11
Nodes (19): Snippet(), SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInput(), SnippetInputProps, SnippetProps (+11 more)

### Community 56 - "agent.tsx"
Cohesion: 0.12
Nodes (20): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+12 more)

### Community 57 - "reminders.ts"
Cohesion: 0.11
Nodes (32): DELETE(), GET(), POST(), hasCronAuth(), POST(), DELETE(), PATCH(), RouteContext (+24 more)

### Community 58 - "editor-ai-sheet.tsx"
Cohesion: 0.11
Nodes (21): captureScreenshot(), convertBlobUrlToDataUrl(), PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot(), PromptInputActionMenu(), PromptInputActionMenuContent(), PromptInputActionMenuTrigger() (+13 more)

### Community 59 - "calendar-week-view.tsx"
Cohesion: 0.20
Nodes (19): CalendarMiniMonth(), CalendarMiniMonthProps, CalendarWeekView(), CalendarWeekViewProps, addDays(), DAY_END_HOUR, DAY_START_HOUR, daysInMonth() (+11 more)

### Community 60 - "user-menu.tsx"
Cohesion: 0.14
Nodes (15): UserAvatar(), UserMenu(), UserMenuProps, DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuGroup(), DropdownMenuItem() (+7 more)

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
Cohesion: 0.13
Nodes (20): GoogleConnectionCard(), SCOPES, GoogleCredentialsDialog(), IntegrationsPanel(), googleConnectionKey, GoogleConnectionStatus, GoogleCredentialSource, GoogleIntegrationItem (+12 more)

### Community 67 - "speech-input.tsx"
Cohesion: 0.14
Nodes (12): detectSpeechInputMode(), SpeechInput(), SpeechInputMode, SpeechInputProps, SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionErrorEvent, SpeechRecognitionEvent (+4 more)

### Community 68 - "field.tsx"
Cohesion: 0.20
Nodes (12): FormPasswordFieldProps, FormFieldProps, Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel(), FieldLegend() (+4 more)

### Community 69 - "notes-list.tsx"
Cohesion: 0.24
Nodes (11): NoteListContextMenu(), useReminderClock(), groupNotes(), NoteGroup, NotesList(), NotesListProps, noteTimestamp(), spaceTimestamp() (+3 more)

### Community 70 - "artifact.tsx"
Cohesion: 0.12
Nodes (16): Artifact(), ArtifactAction(), ArtifactActionProps, ArtifactActions(), ArtifactActionsProps, ArtifactClose(), ArtifactCloseProps, ArtifactContent() (+8 more)

### Community 71 - "demo-section.tsx"
Cohesion: 0.18
Nodes (8): DemoSection(), TABS, WriteScreen(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 72 - "sandbox.tsx"
Cohesion: 0.07
Nodes (30): Sandbox(), SandboxContent(), SandboxContentProps, SandboxHeader(), SandboxHeaderProps, SandboxRootProps, SandboxTabContent(), SandboxTabContentProps (+22 more)

### Community 73 - "use-voice-dictation.ts"
Cohesion: 0.19
Nodes (11): getSpeechRecognitionCtor(), isSpeechDictationSupported(), SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionConstructor, SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionResult (+3 more)

### Community 74 - "web-preview.tsx"
Cohesion: 0.15
Nodes (14): useWebPreview(), WebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue (+6 more)

### Community 75 - "date-time-picker.tsx"
Cohesion: 0.26
Nodes (12): DateTimePicker(), DateTimePickerProps, getHour12(), getPeriod(), HOURS, pad(), Period, PERIODS (+4 more)

### Community 76 - "content.ts"
Cohesion: 0.16
Nodes (15): COMPARISON_ROWS, ComparisonRow, FeatureKey, FEATURES, PRICING_PLANS, PricingPlan, TESTIMONIALS, WORKFLOW (+7 more)

### Community 77 - "note-reminder-countdown.tsx"
Cohesion: 0.43
Nodes (6): formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent()

### Community 78 - "hero-section.tsx"
Cohesion: 0.25
Nodes (7): HERO_STATS, HeroSection(), PROOF_POINTS, NOTES, SPACES, TASKS, WorkspacePreview()

### Community 79 - "security-settings.tsx"
Cohesion: 0.15
Nodes (17): formatDate(), SecuritySettings(), SessionRow, truncateUa(), ChangePasswordFormValues, changePasswordSchema, LoginFormValues, loginSchema (+9 more)

### Community 80 - "landing-page.tsx"
Cohesion: 0.14
Nodes (15): metadata, FOOTER_LINKS, NAV_LINKS, LandingPage(), CtaSection(), FaqSection(), FeaturesSection(), LandingFooter() (+7 more)

### Community 81 - "conversation.tsx"
Cohesion: 0.16
Nodes (13): Conversation(), ConversationContent(), ConversationContentProps, ConversationDownload(), ConversationDownloadProps, ConversationEmptyState(), ConversationEmptyStateProps, ConversationProps (+5 more)

### Community 82 - "jsx-preview.tsx"
Cohesion: 0.16
Nodes (11): completeJsxTag(), JSXPreview, JSXPreviewContent, JSXPreviewContentProps, JSXPreviewContext, JSXPreviewContextValue, JSXPreviewError, JSXPreviewErrorProps (+3 more)

### Community 83 - "file-tree.tsx"
Cohesion: 0.05
Nodes (38): FileTree(), FileTreeActions(), FileTreeActionsProps, FileTreeContext, FileTreeContextType, FileTreeFile(), FileTreeFileContext, FileTreeFileContextType (+30 more)

### Community 84 - "app/layout.tsx"
Cohesion: 0.22
Nodes (7): geistMono, geistSans, metadata, viewport, Providers(), ThemeProvider(), TooltipProvider()

### Community 85 - "button-group.tsx"
Cohesion: 0.38
Nodes (5): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Separator()

### Community 86 - "persona.tsx"
Cohesion: 0.18
Nodes (10): getCurrentTheme(), Persona, PersonaProps, PersonaState, PersonaWithModel, PersonaWithModelProps, PersonaWithoutModel, PersonaWithoutModelProps (+2 more)

### Community 87 - "note-chat/route.ts"
Cohesion: 0.36
Nodes (8): maxDuration, POST(), buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 88 - "select.tsx"
Cohesion: 0.22
Nodes (8): SelectContent(), SelectGroup(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 89 - "tags/[id]/route.ts"
Cohesion: 0.38
Nodes (6): DELETE(), Params, PATCH(), deleteTag(), updateTag(), updateTagSchema

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

### Community 95 - "graphify-run.mjs"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 96 - "edge.tsx"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 146 - "editor-toolbar.tsx"
Cohesion: 0.14
Nodes (17): EDITOR_FONT_STORAGE_KEY, EMPTY_FORMATS, TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE, EditorToolbar(), EditorToolbarProps, FormatButton() (+9 more)

### Community 147 - "types/notes.ts"
Cohesion: 0.15
Nodes (18): EditorCanvasProps, EditorNoteExtras(), EditorNoteExtrasProps, formatReminderAt(), isImageAttachment(), PendingReminder, EditorTags(), EditorTagsProps (+10 more)

### Community 149 - "use-editor-font.ts"
Cohesion: 0.44
Nodes (7): readStoredFont(), useEditorFont(), EDITOR_FONTS, EditorFontOption, ensureEditorFontLoaded(), getEditorFont(), loadedGoogleFonts

## Knowledge Gaps
- **869 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+864 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `login-page.tsx`, `checkpoint.tsx`, `open-in-chat.tsx`, `carousel.tsx`, `editor-toolbar.tsx`, `types/notes.ts`, `lib/utils.ts`, `note-editor.tsx`, `readJson`, `prompt-input.tsx`, `note-share-panel.tsx`, `commit.tsx`, `app-sidebar.tsx`, `inline-citation.tsx`, `queue.tsx`, `test-results.tsx`, `voice-selector.tsx`, `model-selector.tsx`, `notification-settings.tsx`, `calendar-workspace.tsx`, `schema-display.tsx`, `attachments.tsx`, `stack-trace.tsx`, `code-block.tsx`, `alert-dialog.tsx`, `environment-variables.tsx`, `message.tsx`, `mic-selector.tsx`, `context.tsx`, `package-info.tsx`, `audio-player.tsx`, `node.tsx`, `snippet.tsx`, `agent.tsx`, `editor-ai-sheet.tsx`, `calendar-week-view.tsx`, `user-menu.tsx`, `plan.tsx`, `chain-of-thought.tsx`, `confirmation.tsx`, `reasoning.tsx`, `terminal.tsx`, `note-integrations.tsx`, `speech-input.tsx`, `field.tsx`, `notes-list.tsx`, `artifact.tsx`, `demo-section.tsx`, `sandbox.tsx`, `web-preview.tsx`, `date-time-picker.tsx`, `content.ts`, `note-reminder-countdown.tsx`, `hero-section.tsx`, `landing-page.tsx`, `conversation.tsx`, `jsx-preview.tsx`, `file-tree.tsx`, `button-group.tsx`, `persona.tsx`, `select.tsx`, `pricing-section.tsx`, `transcription.tsx`?**
  _High betweenness centrality (0.507) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `shadcn`, `shiki`, `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `scripts`, `cn`, `@streamdown/mermaid`, `tailwind-merge`, `tokenlens`, `tw-animate-css`, `use-stick-to-bottom`, `@xyflow/react`, `zod`, `zustand`, `@tanstack/react-query`, `@ai-sdk/react`, `ansi-to-react`, `@base-ui/react`, `better-auth`, `@better-auth/infra`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `jose`, `lucide-react`, `media-chrome`, `motion`, `nanoid`, `@neondatabase/serverless`, `next`, `@radix-ui/react-use-controllable-state`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-jsx-parser`, `react-qr-code`, `@rive-app/react-webgl2`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `react` connect `cn` to `dependencies`, `carousel.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _869 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `login-page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13086770981507823 - nodes in this community are weakly interconnected._
- **Should `open-in-chat.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Should `scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._