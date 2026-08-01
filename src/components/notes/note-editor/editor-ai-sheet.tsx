"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
  type FileUIPart,
} from "ai";
import { MessageSquare, Sparkles } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  applyAppendNoteContent,
  applyReplaceNoteContent,
} from "./ai-apply";
import { stripHtml } from "./utils";

type EditorAiSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  title: string;
  contentHtml: string;
  canEdit: boolean;
  editorRef: RefObject<HTMLDivElement | null>;
  setContent: (html: string) => void;
  setTitle: (title: string) => void;
  onBeforeSend: () => void;
};

function PromptAttachmentsHeader() {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline" className="w-full">
      {attachments.files.map((file) => (
        <Attachment
          key={file.id}
          data={file}
          onRemove={() => attachments.remove(file.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
}

function NoteAiSubmit({
  busy,
  inputEmpty,
  status,
  onStop,
}: {
  busy: boolean;
  inputEmpty: boolean;
  status: "ready" | "submitted" | "streaming" | "error";
  onStop: () => void;
}) {
  const attachments = usePromptInputAttachments();
  const canSend = !inputEmpty || attachments.files.length > 0;

  return (
    <PromptInputSubmit
      status={
        status === "streaming"
          ? "streaming"
          : status === "submitted"
            ? "submitted"
            : "ready"
      }
      disabled={!busy && !canSend}
      onClick={(event) => {
        if (busy) {
          event.preventDefault();
          onStop();
        }
      }}
    />
  );
}

export function EditorAiSheet({
  open,
  onOpenChange,
  noteId,
  title,
  contentHtml,
  canEdit,
  editorRef,
  setContent,
  setTitle,
  onBeforeSend,
}: EditorAiSheetProps) {
  const [input, setInput] = useState("");
  const contentRef = useRef(contentHtml);
  const titleRef = useRef(title);
  const canEditRef = useRef(canEdit);

  useEffect(() => {
    contentRef.current = contentHtml;
  }, [contentHtml]);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    canEditRef.current = canEdit;
  }, [canEdit]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ai/note-chat",
        body: () => ({
          noteId,
          title: titleRef.current,
          content: stripHtml(contentRef.current),
        }),
      }),
    [noteId],
  );

  const { messages, sendMessage, status, error, addToolOutput, stop, clearError } =
    useChat({
      id: `note-ai-${noteId}`,
      transport,
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      onToolCall: ({ toolCall }) => {
        if (!("toolName" in toolCall) || !toolCall.toolName) return;

        const name = toolCall.toolName;
        const toolCallId = toolCall.toolCallId;
        const inputData = ("input" in toolCall ? toolCall.input : {}) as {
          content?: string;
          title?: string;
        };

        if (!canEditRef.current) {
          void addToolOutput({
            tool: name,
            toolCallId,
            state: "output-error",
            errorText: "You have view-only access to this note.",
          });
          return;
        }

        try {
          if (name === "replaceNoteContent") {
            const result = applyReplaceNoteContent(
              editorRef.current,
              setContent,
              inputData.content ?? "",
            );
            contentRef.current = editorRef.current?.innerHTML ?? contentRef.current;
            void addToolOutput({
              tool: name,
              toolCallId,
              output: result,
            });
            return;
          }

          if (name === "appendNoteContent") {
            const result = applyAppendNoteContent(
              editorRef.current,
              contentRef.current,
              setContent,
              inputData.content ?? "",
            );
            contentRef.current = editorRef.current?.innerHTML ?? contentRef.current;
            void addToolOutput({
              tool: name,
              toolCallId,
              output: result,
            });
            return;
          }

          if (name === "updateNoteTitle") {
            const next = (inputData.title ?? "").trim() || "Untitled";
            setTitle(next);
            titleRef.current = next;
            void addToolOutput({
              tool: name,
              toolCallId,
              output: { success: true, title: next },
            });
            return;
          }

          void addToolOutput({
            tool: name,
            toolCallId,
            state: "output-error",
            errorText: `Unknown tool: ${name}`,
          });
        } catch (err) {
          void addToolOutput({
            tool: name,
            toolCallId,
            state: "output-error",
            errorText: err instanceof Error ? err.message : "Tool failed",
          });
        }
      },
    });

  const busy = status === "submitted" || status === "streaming";

  const handleSubmit = useCallback(
    async (message: PromptInputMessage) => {
      const text = message.text.trim();
      const files = message.files ?? [];
      if (!text && files.length === 0) return;

      onBeforeSend();
      contentRef.current = editorRef.current?.innerHTML ?? contentRef.current;
      clearError();
      setInput("");

      await sendMessage({
        text: text || "Please look at the attached file(s) in context of my note.",
        files: files as FileUIPart[],
      });
    },
    [clearError, editorRef, onBeforeSend, sendMessage],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 data-[side=right]:sm:max-w-md"
      >
        <SheetHeader className="border-b border-border/60">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Ask Gemini
          </SheetTitle>
          <SheetDescription>
            Chat about this note. Ask for a review, rewrite, or to continue
            writing
            {canEdit ? " — edits apply to the editor." : " (view only)."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-4">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<MessageSquare className="size-10" />}
                  title="Talk about this note"
                  description="Ask Gemini to review clarity, improve wording, continue writing, or suggest a better title."
                />
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <Message from={message.role} key={`${message.id}-t-${index}`}>
                            <MessageContent>
                              <MessageResponse>{part.text}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                      }

                      if (isToolUIPart(part)) {
                        return (
                          <Tool key={`${message.id}-tool-${index}`} defaultOpen>
                            {part.type === "dynamic-tool" ? (
                              <ToolHeader
                                type="dynamic-tool"
                                state={part.state}
                                toolName={part.toolName}
                              />
                            ) : (
                              <ToolHeader type={part.type} state={part.state} />
                            )}
                            <ToolContent>
                              <ToolInput input={part.input} />
                              <ToolOutput
                                output={part.output}
                                errorText={part.errorText}
                              />
                            </ToolContent>
                          </Tool>
                        );
                      }

                      return null;
                    })}
                  </div>
                ))
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {error ? (
            <p className="border-t border-border/60 px-4 py-2 text-sm text-destructive">
              {error.message}
            </p>
          ) : null}

          <div className="border-t border-border/60 p-3">
            <PromptInput
              accept="image/*"
              multiple
              maxFiles={4}
              onSubmit={handleSubmit}
              className="rounded-xl border border-border/70 bg-background"
            >
              <PromptInputHeader className="px-2 pt-2">
                <PromptAttachmentsHeader />
              </PromptInputHeader>
              <PromptInputBody>
                <PromptInputTextarea
                  value={input}
                  onChange={(event) => setInput(event.currentTarget.value)}
                  placeholder="Ask about this note…"
                  className="min-h-16"
                  disabled={busy}
                />
              </PromptInputBody>
              <PromptInputFooter className="px-2 pb-2">
                <PromptInputTools>
                  <PromptInputActionMenu>
                    <PromptInputActionMenuTrigger />
                    <PromptInputActionMenuContent>
                      <PromptInputActionAddAttachments label="Add photos" />
                    </PromptInputActionMenuContent>
                  </PromptInputActionMenu>
                </PromptInputTools>
                <NoteAiSubmit
                  busy={busy}
                  inputEmpty={!input.trim()}
                  status={status}
                  onStop={stop}
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
