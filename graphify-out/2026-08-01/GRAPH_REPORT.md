# Graph Report - notely  (2026-08-01)

## Corpus Check
- 289 files · ~103,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2349 nodes · 5013 edges · 146 communities (99 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `04541b92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.ts
- jsonError
- app-bar.tsx
- getEnv
- dependencies
- open-in-chat.tsx
- scripts
- app-sidebar.tsx
- cn
- compilerOptions
- components.json
- 1. Current product surface
- Find Skills
- tooltip.tsx
- Nexora
- shares.ts
- graphify
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- dialog.tsx
- editor-toolbar.tsx
- workspacePath
- prompt-input.tsx
- Notely Drizzle + Neon
- Notely Better Auth
- requireSession
- service.ts
- readJson
- commit.tsx
- events.ts
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
- task-board.tsx
- environment-variables.tsx
- message.tsx
- mic-selector.tsx
- context.tsx
- package-info.tsx
- audio-player.tsx
- security-settings.tsx
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
- node.tsx
- sandbox.tsx
- tool.tsx
- web-preview.tsx
- push.ts
- content.ts
- demo-section.tsx
- lib/utils.ts
- login-page.tsx
- landing-page.tsx
- conversation.tsx
- jsx-preview.tsx
- collapsible.tsx
- notes-empty-state.tsx
- date-time-picker.tsx
- persona.tsx
- note-chat/route.ts
- usePromptInputAttachments
- task.tsx
- pricing-section.tsx
- select.tsx
- transcription.tsx
- button.tsx
- section-shell.tsx
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
1. `cn()` - 599 edges
2. `requireSession()` - 76 edges
3. `Button()` - 61 edges
4. `jsonError()` - 60 edges
5. `readJson()` - 42 edges
6. `workspacePath()` - 26 edges
7. `requireNoteAccess()` - 24 edges
8. `getEnv()` - 23 edges
9. `Input()` - 22 edges
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

## Communities (146 total, 47 thin omitted)

### Community 0 - "auth.ts"
Cohesion: 0.11
Nodes (27): DevAuthEmail, extractUrl(), ForgotPasswordPage(), TwoFactorPage(), AuthError(), AuthFooterLink(), AuthPanel(), AuthPanelProps (+19 more)

### Community 1 - "jsonError"
Cohesion: 0.13
Nodes (28): GET(), Params, GET(), POST(), DELETE(), Params, PATCH(), GET() (+20 more)

### Community 2 - "app-bar.tsx"
Cohesion: 0.15
Nodes (14): Checkpoint(), CheckpointIcon(), CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, AppBarProps, Header(), OPTIONS (+6 more)

### Community 3 - "getEnv"
Cohesion: 0.13
Nodes (22): GET(), env, googleEnabled, resolveAppleEnabled(), Session, generateAppleClientSecret(), isAppleAuthConfigured(), isGoogleAuthConfigured() (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.18
Nodes (11): ai, drizzle-orm, next-themes, dependencies, ai, drizzle-orm, next-themes, @tanstack/react-query (+3 more)

### Community 5 - "open-in-chat.tsx"
Cohesion: 0.06
Nodes (39): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContent(), OpenInContentProps, OpenInContext, OpenInCursor() (+31 more)

### Community 6 - "scripts"
Cohesion: 0.05
Nodes (40): drizzle-kit, eslint, eslint-config-next, devDependencies, drizzle-kit, eslint, eslint-config-next, tailwindcss (+32 more)

### Community 7 - "app-sidebar.tsx"
Cohesion: 0.07
Nodes (42): react, react, CalendarDayButton(), ContextMenu(), ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem() (+34 more)

### Community 8 - "cn"
Cohesion: 0.10
Nodes (27): Controls(), ControlsProps, Image(), ImageProps, Panel(), PanelProps, Toolbar(), ToolbarProps (+19 more)

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

### Community 13 - "tooltip.tsx"
Cohesion: 0.21
Nodes (7): geistMono, geistSans, metadata, viewport, Providers(), ThemeProvider(), TooltipProvider()

### Community 14 - "Nexora"
Cohesion: 0.14
Nodes (13): 1. Install dependencies, 2. Configure environment, 3. Set up the database, 4. Run the development server, Deploy on Vercel, Features (Phase 1), Getting Started, Nexora (+5 more)

### Community 15 - "shares.ts"
Cohesion: 0.07
Nodes (35): GET(), DELETE(), Params, PATCH(), GET(), POST(), db, sql (+27 more)

### Community 24 - "dialog.tsx"
Cohesion: 0.13
Nodes (23): CalendarEventDialog(), CalendarEventDialogProps, GoogleCredentialsDialog(), GoogleCredentialsDialogProps, EditorLinkDialog(), EditorLinkDialogProps, EditorPanelsDialog(), EditorPanelsDialogProps (+15 more)

### Community 25 - "editor-toolbar.tsx"
Cohesion: 0.06
Nodes (57): applyAppendNoteContent(), applyReplaceNoteContent(), htmlFromAiContent(), EDITOR_FONT_STORAGE_KEY, EMPTY_FORMATS, TEXT_COLORS, TOOLBAR_BTN, TOOLBAR_BTN_ACTIVE (+49 more)

### Community 26 - "workspacePath"
Cohesion: 0.12
Nodes (23): IntegrationsPage(), IntegrationsPageProps, NotesPage(), NotesPageProps, IntegrationsPanel(), AppBar(), AppSidebar(), DashboardChrome() (+15 more)

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
Cohesion: 0.10
Nodes (25): DELETE(), Params, { GET, POST }, DELETE(), PATCH(), RouteContext, GET(), DELETE() (+17 more)

### Community 31 - "service.ts"
Cohesion: 0.07
Nodes (54): DELETE(), GET(), Params, PATCH(), GET(), POST(), DELETE(), Params (+46 more)

### Community 32 - "readJson"
Cohesion: 0.13
Nodes (17): Params, fetchSpaces(), InboxPanel(), Invite, NoteSharePanel(), NoteSharePanelProps, NoteShareTrigger(), ShareRow (+9 more)

### Community 33 - "commit.tsx"
Cohesion: 0.04
Nodes (47): Commit(), CommitActions(), CommitActionsProps, CommitAuthor(), CommitAuthorAvatar(), CommitAuthorAvatarProps, CommitAuthorProps, CommitContent() (+39 more)

### Community 34 - "events.ts"
Cohesion: 0.24
Nodes (11): DELETE(), Params, GET(), POST(), events, createEvent(), deleteEvent(), listEvents() (+3 more)

### Community 35 - "google-integration.ts"
Cohesion: 0.09
Nodes (43): callbackRedirect(), GET(), GET(), safeReturnTo(), DELETE(), PUT(), saveCredentialsSchema, GET() (+35 more)

### Community 36 - "inline-citation.tsx"
Cohesion: 0.06
Nodes (41): CarouselApiContext, InlineCitation(), InlineCitationCardBody(), InlineCitationCardBodyProps, InlineCitationCardProps, InlineCitationCardTrigger(), InlineCitationCardTriggerProps, InlineCitationCarousel() (+33 more)

### Community 37 - "queue.tsx"
Cohesion: 0.05
Nodes (41): Queue(), QueueItem(), QueueItemAction(), QueueItemActionProps, QueueItemActions(), QueueItemActionsProps, QueueItemAttachment(), QueueItemAttachmentProps (+33 more)

### Community 38 - "test-results.tsx"
Cohesion: 0.05
Nodes (44): formatDuration(), statusIcons, statusStyles, Test(), TestContext, TestContextType, TestDuration(), TestDurationProps (+36 more)

### Community 39 - "voice-selector.tsx"
Cohesion: 0.05
Nodes (32): VoiceSelectorAccent(), VoiceSelectorAccentProps, VoiceSelectorAge(), VoiceSelectorAgeProps, VoiceSelectorAttributes(), VoiceSelectorAttributesProps, VoiceSelectorBullet(), VoiceSelectorBulletProps (+24 more)

### Community 40 - "model-selector.tsx"
Cohesion: 0.06
Nodes (28): ModelSelectorContent(), ModelSelectorContentProps, ModelSelectorDialogProps, ModelSelectorEmptyProps, ModelSelectorGroupProps, ModelSelectorInput(), ModelSelectorInputProps, ModelSelectorItemProps (+20 more)

### Community 41 - "note-reminder-dialog.tsx"
Cohesion: 0.12
Nodes (31): defaultRemindAt(), formatFromNow(), NoteReminderDialog(), NoteReminderDialogProps, QUICK_PRESETS, Reminder, snoozeInOneHour(), snoozeTomorrowMorning() (+23 more)

### Community 42 - "calendar-workspace.tsx"
Cohesion: 0.09
Nodes (26): metadata, CalendarNavSidebar(), CalendarNavSidebarProps, CalendarUtilityPanel(), CalendarUtilityPanelProps, SHORTCUTS, CalendarWorkspace(), CalendarEvent (+18 more)

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

### Community 47 - "task-board.tsx"
Cohesion: 0.12
Nodes (22): NoteDeleteDialog(), NoteDeleteDialogProps, columns, endOfTodayLocal(), formatDueLabel(), isSameLocalDay(), notify(), Task (+14 more)

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
Nodes (20): AudioPlayerControlBarProps, AudioPlayerDurationDisplay(), AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButton(), AudioPlayerMuteButtonProps, AudioPlayerPlayButton(), AudioPlayerPlayButtonProps (+12 more)

### Community 54 - "security-settings.tsx"
Cohesion: 0.19
Nodes (17): SCOPES, AccountSettings(), AppearanceSettings(), emptySubscribe(), THEME_OPTIONS, formatDate(), SecuritySettings(), SessionRow (+9 more)

### Community 55 - "snippet.tsx"
Cohesion: 0.11
Nodes (19): Snippet(), SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInput(), SnippetInputProps, SnippetProps (+11 more)

### Community 56 - "agent.tsx"
Cohesion: 0.12
Nodes (20): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+12 more)

### Community 57 - "reminders.ts"
Cohesion: 0.20
Nodes (18): hasCronAuth(), POST(), GET(), POST(), createReminder(), getRemindersForNote(), listDueReminders(), listReminders() (+10 more)

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

### Community 68 - "field.tsx"
Cohesion: 0.16
Nodes (14): FormPasswordField(), FormPasswordFieldProps, FormTextField(), Field(), FieldContent(), FieldDescription(), FieldError(), FieldLabel() (+6 more)

### Community 69 - "notes-list.tsx"
Cohesion: 0.19
Nodes (15): formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent(), useReminderClock(), groupNotes() (+7 more)

### Community 70 - "artifact.tsx"
Cohesion: 0.12
Nodes (16): Artifact(), ArtifactAction(), ArtifactActionProps, ArtifactActions(), ArtifactActionsProps, ArtifactClose(), ArtifactCloseProps, ArtifactContent() (+8 more)

### Community 71 - "node.tsx"
Cohesion: 0.12
Nodes (12): Node(), NodeActionProps, NodeContent(), NodeContentProps, NodeDescriptionProps, NodeFooter(), NodeFooterProps, NodeHeader() (+4 more)

### Community 72 - "sandbox.tsx"
Cohesion: 0.12
Nodes (15): Sandbox(), SandboxContent(), SandboxContentProps, SandboxHeaderProps, SandboxRootProps, SandboxTabContent(), SandboxTabContentProps, SandboxTabs() (+7 more)

### Community 73 - "tool.tsx"
Cohesion: 0.13
Nodes (15): SandboxHeader(), getStatusBadge(), statusIcons, statusLabels, Tool(), ToolContent(), ToolContentProps, ToolHeader() (+7 more)

### Community 74 - "web-preview.tsx"
Cohesion: 0.15
Nodes (14): useWebPreview(), WebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue (+6 more)

### Community 75 - "push.ts"
Cohesion: 0.23
Nodes (13): DELETE(), GET(), POST(), pushSubscriptions, configureWebPush(), isPushConfigured(), listUserPushSubscriptions(), PushSubscriptionInput (+5 more)

### Community 76 - "content.ts"
Cohesion: 0.15
Nodes (13): COMPARISON_ROWS, ComparisonRow, FeatureKey, FEATURES, FOOTER_LINKS, HERO_STATS, NAV_LINKS, PRICING_PLANS (+5 more)

### Community 77 - "demo-section.tsx"
Cohesion: 0.18
Nodes (8): DemoSection(), TABS, WriteScreen(), Tabs(), TabsContent(), TabsList(), tabsListVariants, TabsTrigger()

### Community 78 - "lib/utils.ts"
Cohesion: 0.17
Nodes (9): PROOF_POINTS, NotelyLogo(), NotelyLogoProps, NOTES, SPACES, TASKS, WorkspacePreview(), ButtonGroupSeparator() (+1 more)

### Community 79 - "login-page.tsx"
Cohesion: 0.21
Nodes (6): LoginPage(), SocialAuthButtons(), SocialAuthButtonsProps, authClient, LoginFormValues, loginSchema

### Community 80 - "landing-page.tsx"
Cohesion: 0.18
Nodes (9): metadata, LandingPage(), CtaSection(), FaqSection(), HeroSection(), LandingFooter(), PricingSection(), TestimonialsSection() (+1 more)

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

### Community 87 - "note-chat/route.ts"
Cohesion: 0.36
Nodes (8): maxDuration, POST(), buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 88 - "usePromptInputAttachments"
Cohesion: 0.18
Nodes (11): captureScreenshot(), convertBlobUrlToDataUrl(), PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot(), PromptInputTextarea(), useOptionalPromptInputController(), useOptionalProviderAttachments() (+3 more)

### Community 89 - "task.tsx"
Cohesion: 0.18
Nodes (10): Task(), TaskContent(), TaskContentProps, TaskItem(), TaskItemFile(), TaskItemFileProps, TaskItemProps, TaskProps (+2 more)

### Community 90 - "pricing-section.tsx"
Cohesion: 0.29
Nodes (8): Table(), TableBody(), TableCaption(), TableCell(), TableFooter(), TableHead(), TableHeader(), TableRow()

### Community 91 - "select.tsx"
Cohesion: 0.22
Nodes (8): SelectContent(), SelectGroup(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger(), SelectValue()

### Community 92 - "transcription.tsx"
Cohesion: 0.29
Nodes (7): Transcription(), TranscriptionContext, TranscriptionContextValue, TranscriptionProps, TranscriptionSegment, TranscriptionSegmentProps, useTranscription()

### Community 93 - "button.tsx"
Cohesion: 0.62
Nodes (4): LandingNav(), Button(), buttonVariants, Calendar()

### Community 94 - "section-shell.tsx"
Cohesion: 0.48
Nodes (4): Section(), SectionHeading(), SectionHeadingProps, SectionProps

### Community 95 - "graphify-run.mjs"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 96 - "edge.tsx"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 97 - "highlightCode"
Cohesion: 0.40
Nodes (5): CodeBlockContent(), createRawTokens(), getHighlighter(), getTokensCacheKey(), highlightCode()

### Community 100 - "TokenSpan"
Cohesion: 0.50
Nodes (4): isBold(), isItalic(), isUnderline(), TokenSpan()

### Community 101 - "hover-card.tsx"
Cohesion: 0.50
Nodes (3): HoverCard(), HoverCardContent(), HoverCardTrigger()

## Knowledge Gaps
- **860 isolated node(s):** `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style`, `rsc`, `tsx` (+855 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `auth.ts`, `app-bar.tsx`, `open-in-chat.tsx`, `app-sidebar.tsx`, `tooltip.tsx`, `dialog.tsx`, `editor-toolbar.tsx`, `workspacePath`, `prompt-input.tsx`, `readJson`, `commit.tsx`, `inline-citation.tsx`, `queue.tsx`, `test-results.tsx`, `voice-selector.tsx`, `model-selector.tsx`, `note-reminder-dialog.tsx`, `calendar-workspace.tsx`, `schema-display.tsx`, `attachments.tsx`, `stack-trace.tsx`, `code-block.tsx`, `task-board.tsx`, `environment-variables.tsx`, `message.tsx`, `mic-selector.tsx`, `context.tsx`, `package-info.tsx`, `audio-player.tsx`, `security-settings.tsx`, `snippet.tsx`, `agent.tsx`, `editor-ai-sheet.tsx`, `calendar-week-view.tsx`, `file-tree.tsx`, `plan.tsx`, `chain-of-thought.tsx`, `confirmation.tsx`, `reasoning.tsx`, `terminal.tsx`, `note-integrations.tsx`, `speech-input.tsx`, `field.tsx`, `notes-list.tsx`, `artifact.tsx`, `node.tsx`, `sandbox.tsx`, `tool.tsx`, `web-preview.tsx`, `demo-section.tsx`, `lib/utils.ts`, `login-page.tsx`, `landing-page.tsx`, `conversation.tsx`, `jsx-preview.tsx`, `collapsible.tsx`, `notes-empty-state.tsx`, `date-time-picker.tsx`, `persona.tsx`, `usePromptInputAttachments`, `task.tsx`, `pricing-section.tsx`, `select.tsx`, `transcription.tsx`, `button.tsx`, `section-shell.tsx`, `hover-card.tsx`?**
  _High betweenness centrality (0.534) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `shadcn`, `shiki`, `streamdown`, `@streamdown/cjk`, `@streamdown/code`, `@streamdown/math`, `scripts`, `app-sidebar.tsx`, `@streamdown/mermaid`, `tailwind-merge`, `tokenlens`, `tw-animate-css`, `use-stick-to-bottom`, `@xyflow/react`, `zod`, `zustand`, `@ai-sdk/google`, `@ai-sdk/react`, `ansi-to-react`, `@base-ui/react`, `better-auth`, `@better-auth/infra`, `class-variance-authority`, `clsx`, `cmdk`, `date-fns`, `embla-carousel-react`, `@hookform/resolvers`, `jose`, `lucide-react`, `media-chrome`, `motion`, `nanoid`, `@neondatabase/serverless`, `next`, `@radix-ui/react-use-controllable-state`, `react-day-picker`, `react-dom`, `react-hook-form`, `react-jsx-parser`, `react-qr-code`, `@rive-app/react-webgl2`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `react` connect `app-sidebar.tsx` to `dependencies`, `inline-citation.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `${userHome}/.local/bin/graphify-mcp`, `$schema`, `style` to the rest of the system?**
  _860 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10668563300142248 - nodes in this community are weakly interconnected._
- **Should `jsonError` be split into smaller, more focused modules?**
  _Cohesion score 0.13277310924369748 - nodes in this community are weakly interconnected._
- **Should `app-bar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._