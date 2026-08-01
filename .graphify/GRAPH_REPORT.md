# Graph Report - .  (2026-08-01)

## Corpus Check
- 288 files · ~302,788 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2114 nodes · 3969 edges · 101 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output
- Edge kinds: contains: 1842 · imports: 1203 · imports_from: 699 · calls: 189 · references: 24 · inherits: 6 · re_exports: 6


## Input Scope
- Requested: auto
- Resolved: committed (source: default-auto)
- Included files: 288 · Candidates: 461
- Excluded: 0 untracked · 335274 ignored · 3 sensitive · 0 missing committed
- Recommendation: Use --scope all or graphify.yaml inputs.corpus for a knowledge-base folder.

## Graph Freshness
- Built from Git commit: `63a5c8c`
- Compare this hash to `git rev-parse HEAD` before trusting freshness-sensitive graph output.
## God Nodes (most connected - your core abstractions)
1. `cn()` - 121 edges
2. `Button()` - 60 edges
3. `readJson()` - 24 edges
4. `requireSession()` - 22 edges
5. `Input()` - 19 edges
6. `jsonError()` - 19 edges
7. `authClient` - 16 edges
8. `Collapsible()` - 15 edges
9. `CollapsibleTrigger()` - 15 edges
10. `CollapsibleContent()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `connectGoogleAccount()` --calls--> `googleCredentials()`  [EXTRACTED]
  src/lib/google-integration.ts → src/lib/google-integration.ts  _Bridges community 33 → community 72_
- `Button()` --calls--> `buttonVariants`  [EXTRACTED]
  src/components/ui/button.tsx → src/components/ui/button.tsx  _Bridges community 5 → community 21_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.03
Nodes (44): AttachmentsContext, LocalAttachmentsContext, LocalReferencedSourcesContext, PromptInputActionAddAttachmentsProps, PromptInputActionAddScreenshotProps, PromptInputActionMenuContentProps, PromptInputActionMenuItemProps, PromptInputActionMenuProps (+36 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (54): Params, RouteContext, deleteAttachment(), deleteEvent(), deleteReminder(), activeSpaceIds(), assertSpaceOwned(), createNote() (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (25): CommitActionsProps, CommitAuthorAvatarProps, CommitAuthorProps, CommitContentProps, CommitCopyButtonProps, CommitFileAdditionsProps, CommitFileChangesProps, CommitFileDeletionsProps (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (36): useEditorFont(), UseRichTextEditorOptions, EDITOR_FONTS, EditorFontOption, ensureEditorFontLoaded(), getEditorFont(), loadedGoogleFonts, applyAppendNoteContent() (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (25): UserMenuProps, formatMemberSince(), getUserInitials(), AccessMode, initials(), NoteShareMenuProps, NoteSharePanel(), NoteSharePanelProps (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (27): CalendarEventDialog(), CalendarEventDialogProps, EditorLinkDialog(), EditorLinkDialogProps, formatFromNow(), NoteReminderDialog(), NoteReminderDialogProps, QUICK_PRESETS (+19 more)

### Community 6 - "Community 6"
Cohesion: 0.05
Nodes (29): formatDuration(), statusIcons, statusStyles, TestContext, TestContextType, TestDurationProps, TestErrorMessageProps, TestErrorProps (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (26): readJson(), UseNoteDraftOptions, Params, IntegrationsPageProps, AppBar(), AppBarProps, Header(), InboxPanel() (+18 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (21): VoiceSelectorAccentProps, VoiceSelectorAgeProps, VoiceSelectorAttributesProps, VoiceSelectorBulletProps, VoiceSelectorContentProps, VoiceSelectorContext, VoiceSelectorContextValue, VoiceSelectorDescriptionProps (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (27): CalendarListPanel(), CalendarListPanelProps, CalendarNavSidebar(), CalendarNavSidebarProps, CalendarWorkspace(), formatRelativeDate(), EditorCanvas(), EditorCanvasProps (+19 more)

### Community 10 - "Community 10"
Cohesion: 0.06
Nodes (24): CodeBlockBody, CodeBlockContext, CodeBlockContextType, CodeBlockCopyButtonProps, CodeBlockLanguageSelectorContentProps, CodeBlockLanguageSelectorItemProps, CodeBlockLanguageSelectorProps, CodeBlockLanguageSelectorTriggerProps (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (25): useIsMobile(), FocusModeState, useFocusMode, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle() (+17 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (20): NodeActionProps, NodeContentProps, NodeDescriptionProps, NodeFooterProps, NodeHeaderProps, NodeProps, NodeTitleProps, GoogleConnectionCard() (+12 more)

### Community 13 - "Community 13"
Cohesion: 0.06
Nodes (18): QueueItemActionProps, QueueItemActionsProps, QueueItemAttachmentProps, QueueItemContentProps, QueueItemDescriptionProps, QueueItemFileProps, QueueItemImageProps, QueueItemIndicatorProps (+10 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (17): AuthError(), AuthFooterLink(), AuthPanel(), AuthPanelProps, AuthSubmit(), AuthSubmitProps, AuthShell(), AuthShellProps (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.06
Nodes (19): HttpMethod, methodStyles, SchemaDisplayBodyProps, SchemaDisplayContentProps, SchemaDisplayContext, SchemaDisplayContextType, SchemaDisplayDescriptionProps, SchemaDisplayExampleProps (+11 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (15): SandboxContentProps, SandboxHeaderProps, SandboxRootProps, SandboxTabContentProps, SandboxTabsBarProps, SandboxTabsListProps, SandboxTabsProps, SandboxTabsTriggerProps (+7 more)

### Community 17 - "Community 17"
Cohesion: 0.06
Nodes (26): FilePathButton, FilePathButtonProps, ParsedStackTrace, StackFrame, StackTrace, StackTraceActions, StackTraceActionsProps, StackTraceContent (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (3): jsonError(), requireSession(), Params

### Community 19 - "Community 19"
Cohesion: 0.08
Nodes (27): Attachments(), MessageContent(), MessageResponse, PromptInputActionMenu(), PromptInputActionMenuContent(), PromptInputActionMenuTrigger(), PromptInputBody(), PromptInputFooter() (+19 more)

### Community 20 - "Community 20"
Cohesion: 0.08
Nodes (25): Attachment(), AttachmentContext, AttachmentContextValue, AttachmentData, AttachmentEmptyProps, AttachmentHoverCardContentProps, AttachmentHoverCardProps, AttachmentHoverCardTriggerProps (+17 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (13): ControlsProps, ImageProps, PanelProps, ToolbarProps, authClient, SocialAuthButtonsProps, cn(), PROOF_POINTS (+5 more)

### Community 22 - "Community 22"
Cohesion: 0.07
Nodes (19): CarouselApiContext, InlineCitationCardBodyProps, InlineCitationCardProps, InlineCitationCardTriggerProps, InlineCitationCarouselContentProps, InlineCitationCarouselHeaderProps, InlineCitationCarouselIndex(), InlineCitationCarouselIndexProps (+11 more)

### Community 23 - "Community 23"
Cohesion: 0.07
Nodes (16): EnvironmentVariableContext, EnvironmentVariableContextType, EnvironmentVariableCopyButtonProps, EnvironmentVariableGroupProps, EnvironmentVariableNameProps, EnvironmentVariableProps, EnvironmentVariableRequiredProps, EnvironmentVariablesContentProps (+8 more)

### Community 24 - "Community 24"
Cohesion: 0.07
Nodes (15): ModelSelectorContentProps, ModelSelectorDialogProps, ModelSelectorEmptyProps, ModelSelectorGroupProps, ModelSelectorInputProps, ModelSelectorItemProps, ModelSelectorListProps, ModelSelectorLogoGroupProps (+7 more)

### Community 25 - "Community 25"
Cohesion: 0.11
Nodes (21): db, sql, NoteAccess, NoteAccessRole, createDbFileAttachment(), createLinkAttachment(), getAttachmentForUser(), listAttachmentsForNote() (+13 more)

### Community 26 - "Community 26"
Cohesion: 0.08
Nodes (14): AudioPlayerControlBarProps, AudioPlayerDurationDisplayProps, AudioPlayerElementProps, AudioPlayerMuteButtonProps, AudioPlayerPlayButtonProps, AudioPlayerProps, AudioPlayerSeekBackwardButtonProps, AudioPlayerSeekForwardButtonProps (+6 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (21): OpenInChatGPT(), OpenInChatGPTProps, OpenInClaude(), OpenInClaudeProps, OpenInContentProps, OpenInContext, OpenInCursor(), OpenInCursorProps (+13 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (23): Agent, AgentContent, AgentContentProps, AgentHeader, AgentHeaderProps, AgentInstructions, AgentInstructionsProps, AgentOutput (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.10
Nodes (22): ContextCacheUsage(), ContextCacheUsageProps, ContextContentBodyProps, ContextContentFooter(), ContextContentFooterProps, ContextContentHeader(), ContextContentHeaderProps, ContextContentProps (+14 more)

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (22): Message(), MessageActionProps, MessageActionsProps, MessageBranchContent(), MessageBranchContentProps, MessageBranchContext, MessageBranchContextType, MessageBranchNext() (+14 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (18): env, googleEnabled, Session, generateAppleClientSecret(), isAppleAuthConfigured(), isGoogleAuthConfigured(), looksLikePkcs8PrivateKey(), normalizeApplePrivateKey() (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (19): ConfirmationAccepted(), ConfirmationAcceptedProps, ConfirmationActionProps, ConfirmationActions(), ConfirmationActionsProps, ConfirmationContext, ConfirmationContextValue, ConfirmationProps (+11 more)

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (23): CalendarEvent, connectGoogleAccount(), decodeGmailBody(), decryptToken(), disconnectGoogleAccount(), encryptToken(), findGmailBody(), getConnection() (+15 more)

### Community 34 - "Community 34"
Cohesion: 0.08
Nodes (14): ChangeType, changeTypeIcons, changeTypeStyles, PackageInfoChangeTypeProps, PackageInfoContentProps, PackageInfoContext, PackageInfoContextType, PackageInfoDependenciesProps (+6 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (16): SnippetAddonProps, SnippetContext, SnippetContextType, SnippetCopyButtonProps, SnippetInputProps, SnippetProps, SnippetTextProps, InputGroup() (+8 more)

### Community 36 - "Community 36"
Cohesion: 0.11
Nodes (12): SourceProps, SourcesContentProps, SourcesProps, SourcesTriggerProps, TaskContentProps, TaskItemFileProps, TaskItemProps, TaskProps (+4 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (17): hasCronAuth(), POST(), listDueReminders(), markReminderFired(), ReminderSummary, dispatchDueReminders(), dispatchUserDueReminders(), fireReminder() (+9 more)

### Community 38 - "Community 38"
Cohesion: 0.11
Nodes (15): googleConnectionKey, GoogleConnectionStatus, GoogleCredentialSource, GoogleIntegrationItem, googleItemsKey, useCallbackError(), useGoogleConnection(), EditorPanelsDialog() (+7 more)

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (15): Calendar(), DateTimePicker(), DateTimePickerProps, getHour12(), getPeriod(), HOURS, Period, PERIODS (+7 more)

### Community 40 - "Community 40"
Cohesion: 0.10
Nodes (13): MicSelector(), MicSelectorContentProps, MicSelectorContext, MicSelectorContextType, MicSelectorEmptyProps, MicSelectorInputProps, MicSelectorItemProps, MicSelectorLabelProps (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.14
Nodes (17): ComparisonRow, FeatureKey, FEATURES, FOOTER_LINKS, HERO_STATS, PRICING_PLANS, PricingPlan, TESTIMONIALS (+9 more)

### Community 42 - "Community 42"
Cohesion: 0.10
Nodes (12): FileTreeActionsProps, FileTreeContext, FileTreeContextType, FileTreeFileContext, FileTreeFileContextType, FileTreeFileProps, FileTreeFolderContext, FileTreeFolderContextType (+4 more)

### Community 43 - "Community 43"
Cohesion: 0.11
Nodes (13): PlanActionProps, PlanContentProps, PlanContext, PlanContextValue, PlanDescription(), PlanDescriptionProps, PlanFooterProps, PlanHeaderProps (+5 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (16): SessionRow, ChangePasswordFormValues, changePasswordSchema, ForgotPasswordFormValues, forgotPasswordSchema, LoginFormValues, loginSchema, passwordSchema (+8 more)

### Community 45 - "Community 45"
Cohesion: 0.11
Nodes (17): ChainOfThought, ChainOfThoughtContent, ChainOfThoughtContentProps, ChainOfThoughtContext, ChainOfThoughtContextValue, ChainOfThoughtHeader, ChainOfThoughtHeaderProps, ChainOfThoughtImage (+9 more)

### Community 46 - "Community 46"
Cohesion: 0.12
Nodes (15): Reasoning, ReasoningContent, ReasoningContentProps, ReasoningContext, ReasoningContextValue, ReasoningProps, ReasoningTrigger, ReasoningTriggerProps (+7 more)

### Community 47 - "Community 47"
Cohesion: 0.11
Nodes (10): TerminalActionsProps, TerminalClearButtonProps, TerminalContentProps, TerminalContext, TerminalContextType, TerminalCopyButtonProps, TerminalHeaderProps, TerminalProps (+2 more)

### Community 48 - "Community 48"
Cohesion: 0.19
Nodes (16): CalendarMiniMonth(), CalendarMiniMonthProps, CalendarWeekView(), CalendarWeekViewProps, addDays(), daysInMonth(), eventHeightPx(), eventTopPx() (+8 more)

### Community 49 - "Community 49"
Cohesion: 0.16
Nodes (11): CheckpointIconProps, CheckpointProps, CheckpointTriggerProps, OPTIONS, ThemeModeButton(), ThemeToggle(), ThemeToggleProps, Separator() (+3 more)

### Community 50 - "Community 50"
Cohesion: 0.11
Nodes (17): account, attachments, events, googleConnections, googleOAuthCredentials, notes, noteShares, noteTags (+9 more)

### Community 51 - "Community 51"
Cohesion: 0.22
Nodes (11): NoteDeleteDialog(), NoteDeleteDialogProps, AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+3 more)

### Community 52 - "Community 52"
Cohesion: 0.18
Nodes (11): NoteListContextMenuProps, ContextMenu(), ContextMenuContent(), ContextMenuGroup(), ContextMenuItem(), ContextMenuLabel(), ContextMenuSeparator(), ContextMenuSub() (+3 more)

### Community 53 - "Community 53"
Cohesion: 0.20
Nodes (14): ensureNotificationPermission(), getPushSubscriptionState(), pushSupported(), registerNotelyServiceWorker(), serviceWorkerSupported(), subscribeToPush(), unsubscribeFromPush(), urlBase64ToUint8Array() (+6 more)

### Community 54 - "Community 54"
Cohesion: 0.12
Nodes (8): ArtifactActionProps, ArtifactActionsProps, ArtifactCloseProps, ArtifactContentProps, ArtifactDescriptionProps, ArtifactHeaderProps, ArtifactProps, ArtifactTitleProps

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (11): AppSidebar(), DashboardShell(), MobileBottomNav(), ackReminder(), firedLocally, presentReminder(), Reminder, ReminderRuntime() (+3 more)

### Community 56 - "Community 56"
Cohesion: 0.19
Nodes (10): NAV_LINKS, LandingPage(), UserMenu(), metadata, CtaSection(), HeroSection(), LandingFooter(), LandingNav() (+2 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (12): Event, EventTarget, SpeechInputMode, SpeechInputProps, SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionErrorEvent, SpeechRecognitionEvent (+4 more)

### Community 58 - "Community 58"
Cohesion: 0.15
Nodes (12): useWebPreview(), WebPreviewBody(), WebPreviewBodyProps, WebPreviewConsole(), WebPreviewConsoleProps, WebPreviewContext, WebPreviewContextValue, WebPreviewNavigationButtonProps (+4 more)

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (9): createTask(), deleteTask(), listTasks(), listTasksForNote(), serializeTask(), updateTask(), createTaskSchema, CreateTaskValues (+1 more)

### Community 60 - "Community 60"
Cohesion: 0.18
Nodes (9): getAudioContext(), playReminderSound(), tone(), columns, formatDueLabel(), isSameLocalDay(), Task, TaskBoard() (+1 more)

### Community 61 - "Community 61"
Cohesion: 0.15
Nodes (11): Conversation(), ConversationContent(), ConversationContentProps, ConversationDownloadProps, ConversationEmptyState(), ConversationEmptyStateProps, ConversationProps, ConversationScrollButton() (+3 more)

### Community 62 - "Community 62"
Cohesion: 0.16
Nodes (11): completeJsxTag(), JSXPreview, JSXPreviewContent, JSXPreviewContentProps, JSXPreviewContext, JSXPreviewContextValue, JSXPreviewError, JSXPreviewErrorProps (+3 more)

### Community 63 - "Community 63"
Cohesion: 0.18
Nodes (10): useNoteDraft(), useRichTextEditor(), EditorAiSheet(), EditorStatusBar(), EditorStatusBarProps, EditorToolbar(), NoteEditor(), DraftSnapshot (+2 more)

### Community 64 - "Community 64"
Cohesion: 0.16
Nodes (13): BrowserSpeechRecognition, BrowserSpeechRecognitionAlternative, BrowserSpeechRecognitionConstructor, BrowserSpeechRecognitionErrorEvent, BrowserSpeechRecognitionEvent, BrowserSpeechRecognitionResult, BrowserSpeechRecognitionResultList, Event (+5 more)

### Community 65 - "Community 65"
Cohesion: 0.19
Nodes (12): getNoteAccess(), requireNoteAccess(), inviteCollaborator(), inviter, listInbox(), listSharedWithMe(), listSharesForNote(), removeShare() (+4 more)

### Community 66 - "Community 66"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 67 - "Community 67"
Cohesion: 0.19
Nodes (8): geistMono, geistSans, metadata, viewport, Providers(), PwaRegister(), ThemeProvider(), TooltipProvider()

### Community 68 - "Community 68"
Cohesion: 0.21
Nodes (5): FormFieldProps, Field(), FieldError(), FieldLabel(), fieldVariants

### Community 69 - "Community 69"
Cohesion: 0.23
Nodes (8): COMPARISON_ROWS, PricingSection(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 70 - "Community 70"
Cohesion: 0.15
Nodes (4): copy, IllustrationProps, NotesEmptyStateProps, NotesEmptyStateVariant

### Community 71 - "Community 71"
Cohesion: 0.17
Nodes (8): Persona, PersonaProps, PersonaState, PersonaWithModel, PersonaWithModelProps, PersonaWithoutModel, PersonaWithoutModelProps, sources

### Community 72 - "Community 72"
Cohesion: 0.27
Nodes (10): GET(), safeReturnTo(), createGoogleAuthorizationUrl(), envGoogleCredentials(), getGoogleConnectionStatus(), getUserOAuthCredentials(), googleCredentials(), googleRedirectUri() (+2 more)

### Community 73 - "Community 73"
Cohesion: 0.33
Nodes (6): buildNoteSystemPrompt(), createGeminiModel(), createNoteEditTools(), getGeminiApiKey(), NoteChatRequest, noteChatRequestSchema

### Community 74 - "Community 74"
Cohesion: 0.20
Nodes (9): Command(), CommandDialog(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+1 more)

### Community 75 - "Community 75"
Cohesion: 0.39
Nodes (8): note_tags, notes, public.notes, public.spaces, public.tags, public.user, spaces, tags

### Community 76 - "Community 76"
Cohesion: 0.25
Nodes (6): createSpace(), ensureDefaultSpace(), listSpaces(), listTrashedSpaces(), serializeSpace(), createSpaceSchema

### Community 77 - "Community 77"
Cohesion: 0.32
Nodes (4): SuggestionProps, SuggestionsProps, ScrollArea(), ScrollBar()

### Community 78 - "Community 78"
Cohesion: 0.29
Nodes (6): TranscriptionContext, TranscriptionContextValue, TranscriptionProps, TranscriptionSegment, TranscriptionSegmentProps, useTranscription()

### Community 79 - "Community 79"
Cohesion: 0.29
Nodes (6): { GET, POST }, auth, config, exactPublicRoutes, isPublicPath(), proxy()

### Community 80 - "Community 80"
Cohesion: 0.39
Nodes (7): account, exchange_connections, public.user, session, user, verification, watchlists

### Community 81 - "Community 81"
Cohesion: 0.36
Nodes (7): formatCountdown(), formatTarget(), NoteReminderCountdown(), NoteReminderCountdownProps, REMINDER_ACCENTS, reminderAccent(), useReminderClock()

### Community 83 - "Community 83"
Cohesion: 0.29
Nodes (7): PromptInput(), PromptInputActionAddAttachments(), PromptInputActionAddScreenshot(), PromptInputTextarea(), useOptionalPromptInputController(), useOptionalProviderAttachments(), usePromptInputAttachments()

### Community 84 - "Community 84"
Cohesion: 0.33
Nodes (5): CalendarUtilityPanel(), CalendarUtilityPanelProps, SHORTCUTS, CalendarEvent, CalendarView

### Community 85 - "Community 85"
Cohesion: 0.47
Nodes (4): Animated(), Edge, getEdgeParams(), getHandleCoordsByPosition()

### Community 86 - "Community 86"
Cohesion: 0.60
Nodes (5): public.events, public.notes, public.user, push_subscriptions, reminders

### Community 87 - "Community 87"
Cohesion: 0.33
Nodes (5): args, bin, env, home, result

### Community 88 - "Community 88"
Cohesion: 0.33
Nodes (1): Progress()

### Community 89 - "Community 89"
Cohesion: 0.40
Nodes (2): saveCredentialsSchema, clearGoogleOAuthCredentials()

### Community 90 - "Community 90"
Cohesion: 0.80
Nodes (4): events, note_shares, public.notes, public.user

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (2): CanvasProps, deleteKeyCode

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (3): public.user, twoFactor, user

### Community 93 - "Community 93"
Cohesion: 0.83
Nodes (3): public.notes, public.user, tasks

### Community 94 - "Community 94"
Cohesion: 0.83
Nodes (3): attachments, public.notes, public.user

### Community 95 - "Community 95"
Cohesion: 0.50
Nodes (3): HoverCard(), HoverCardContent(), HoverCardTrigger()

### Community 96 - "Community 96"
Cohesion: 0.67
Nodes (1): size

### Community 97 - "Community 97"
Cohesion: 1.00
Nodes (2): google_connections, public.user

### Community 104 - "Community 104"
Cohesion: 1.00
Nodes (1): eslintConfig

### Community 106 - "Community 106"
Cohesion: 1.00
Nodes (1): nextConfig

### Community 107 - "Community 107"
Cohesion: 1.00
Nodes (1): config

### Community 108 - "Community 108"
Cohesion: 1.00
Nodes (1): PRECACHE

## Knowledge Gaps
- **697 isolated node(s):** `user`, `verification`, `twoFactor`, `eslintConfig`, `nextConfig` (+692 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 88`** (1 nodes): `Progress()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (2 nodes): `saveCredentialsSchema`, `clearGoogleOAuthCredentials()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (2 nodes): `CanvasProps`, `deleteKeyCode`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (1 nodes): `size`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (2 nodes): `google_connections`, `public.user`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 104`** (1 nodes): `eslintConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 106`** (1 nodes): `nextConfig`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 107`** (1 nodes): `config`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 108`** (1 nodes): `PRECACHE`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 21` to `Community 28`, `Community 54`, `Community 20`, `Community 26`, `Community 45`, `Community 49`, `Community 10`, `Community 2`, `Community 32`, `Community 29`, `Community 61`, `Community 23`, `Community 42`, `Community 22`, `Community 62`, `Community 30`, `Community 40`, `Community 24`, `Community 12`, `Community 27`, `Community 34`, `Community 71`, `Community 43`, `Community 0`, `Community 13`, `Community 46`, `Community 16`, `Community 15`, `Community 35`, `Community 36`, `Community 57`, `Community 17`, `Community 77`, `Community 47`, `Community 6`, `Community 19`, `Community 78`, `Community 8`, `Community 58`, `Community 14`, `Community 48`, `Community 9`, `Community 84`, `Community 7`, `Community 11`, `Community 55`, `Community 4`, `Community 3`, `Community 38`, `Community 52`, `Community 81`, `Community 5`, `Community 70`, `Community 56`, `Community 69`, `Community 53`, `Community 41`, `Community 60`, `Community 51`, `Community 82`, `Community 66`, `Community 74`, `Community 39`, `Community 68`, `Community 95`, `Community 88`?**
  _High betweenness centrality (0.277) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 5` to `Community 54`, `Community 20`, `Community 26`, `Community 49`, `Community 10`, `Community 2`, `Community 32`, `Community 29`, `Community 61`, `Community 23`, `Community 30`, `Community 40`, `Community 27`, `Community 43`, `Community 13`, `Community 57`, `Community 17`, `Community 77`, `Community 47`, `Community 8`, `Community 58`, `Community 9`, `Community 48`, `Community 12`, `Community 7`, `Community 11`, `Community 4`, `Community 3`, `Community 38`, `Community 52`, `Community 70`, `Community 56`, `Community 53`, `Community 44`, `Community 60`, `Community 51`, `Community 21`, `Community 66`, `Community 35`, `Community 55`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `ReminderSound` connect `Community 25` to `Community 5`, `Community 55`, `Community 60`, `Community 53`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `user`, `verification`, `twoFactor` to the rest of the system?**
  _697 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0273972602739726 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05478750640040963 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0392156862745098 - nodes in this community are weakly interconnected._