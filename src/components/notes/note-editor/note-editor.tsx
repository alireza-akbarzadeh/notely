"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { NoteDeleteDialog } from "@/components/notes/note-delete-dialog";
import { NoteReminderDialog } from "@/components/notes/note-reminder-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { workspacePath } from "@/lib/workspace/paths";

import { applyAppendNoteContent } from "./ai-apply";
import { EditorAiSheet } from "./editor-ai-sheet";
import { EditorCanvas } from "./editor-canvas";
import { EditorLinkDialog } from "./editor-link-dialog";
import { EditorPanelsDialog } from "./editor-panels-dialog";
import { EditorStatusBar } from "./editor-status-bar";
import { EditorToolbar } from "./editor-toolbar";
import { useEditorFont } from "./hooks/use-editor-font";
import { useNoteDraft } from "./hooks/use-note-draft";
import { useRichTextEditor } from "./hooks/use-rich-text-editor";
import { useVoiceDictation } from "./hooks/use-voice-dictation";
import type { NoteEditorProps } from "./types";
import { statusLabel, wordStats } from "./utils";

export type { NoteEditorProps } from "./types";

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTrashed = Boolean(note.deletedAt);
  const isArchived = Boolean(note.isArchived) && !isTrashed;
  const canEdit = !isTrashed && note.accessRole !== "viewer";
  const canShare = !isTrashed && note.accessRole === "owner";
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  // Reopens the panel when Google sends the user back here after consent.
  const [integrationsOpen, setIntegrationsOpen] = useState(() =>
    searchParams.has("integration"),
  );
  const [aiOpen, setAiOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  const { editorFont, selectFont } = useEditorFont();
  const draft = useNoteDraft({ note, allTags, canEdit });
  const editor = useRichTextEditor({
    noteId: note.id,
    initialContent: note.content,
    canEdit,
    setContent: draft.setContent,
  });
  const voice = useVoiceDictation({
    enabled: canEdit,
    onTranscript: editor.insertDictationText,
  });

  useEffect(() => {
    voice.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stop when switching notes
  }, [note.id]);

  const stats = useMemo(() => wordStats(draft.content), [draft.content]);

  function toggleArchive() {
    const next = !note.isArchived;
    draft.saveNow({ isArchived: next });
    if (next) {
      router.push(workspacePath({ view: "archive" }));
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <EditorToolbar
        noteId={note.id}
        canEdit={canEdit}
        canShare={canShare}
        editorFont={editorFont}
        onSelectFont={selectFont}
        activeFormats={editor.activeFormats}
        isFavorite={note.isFavorite}
        isArchived={isArchived}
        isTrashed={isTrashed}
        onBack={() =>
          router.push(
            isTrashed
              ? workspacePath({ view: "trash" })
              : isArchived
                ? workspacePath({ view: "archive" })
                : workspacePath(),
          )
        }
        onToggleBlock={editor.toggleBlock}
        onInlineCommand={editor.toggleInlineCommand}
        onRunCommand={editor.runCommand}
        onInsertChecklist={editor.insertChecklistItem}
        onOpenLink={editor.openLinkDialog}
        onToggleCode={editor.toggleCode}
        onToggleFavorite={() => draft.saveNow({ isFavorite: !note.isFavorite })}
        onToggleArchive={toggleArchive}
        onDelete={() => setDeleteOpen(true)}
        onRestore={() => draft.restoreMutation.mutate()}
        onOpenChecklist={() => setChecklistOpen(true)}
        onOpenResources={() => setResourcesOpen(true)}
        onOpenIntegrations={() => setIntegrationsOpen(true)}
        onOpenAi={() => setAiOpen(true)}
        onOpenReminder={() => setReminderOpen(true)}
        onPrepareTextColor={editor.prepareTextColor}
        onApplyTextColor={editor.applyTextColor}
        onPrepareInlineImage={editor.prepareInlineImage}
        onInsertInlineImage={editor.insertInlineImage}
        inlineImageUploading={editor.inlineImageUploading}
        voiceSupported={voice.isSupported}
        voiceListening={voice.isListening}
        onPrepareVoice={editor.prepareVoiceDictation}
        onToggleVoice={voice.toggle}
      />

      {voice.isListening ? (
        <div className="flex items-center gap-2 border-b border-border bg-destructive/10 px-4 py-2 text-sm text-destructive">
          <span
            className="size-2 shrink-0 animate-pulse rounded-full bg-destructive"
            aria-hidden
          />
          <p>Listening… speak to add text to this note. Tap the mic to stop.</p>
        </div>
      ) : null}

      {isTrashed ? (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2 text-sm">
          <p className="text-muted-foreground">
            This note is in Trash. Restore it to edit again.
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
              disabled={draft.restoreMutation.isPending}
              onClick={() => draft.restoreMutation.mutate()}
            >
              {draft.restoreMutation.isPending ? "Restoring…" : "Restore"}
            </button>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
              onClick={() => setDeleteOpen(true)}
            >
              Delete forever
            </button>
          </div>
        </div>
      ) : null}

      {isArchived ? (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2 text-sm">
          <p className="text-muted-foreground">
            This note is archived. Unarchive it to return it to your main list.
          </p>
          <button
            type="button"
            className="rounded-md px-2 py-1 text-xs font-medium text-foreground hover:bg-accent"
            onClick={() => draft.saveNow({ isArchived: false })}
          >
            Unarchive
          </button>
        </div>
      ) : null}

      <NoteDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        noteTitle={draft.title || note.title}
        permanent={isTrashed}
        pending={draft.deleteMutation.isPending}
        onConfirm={() => {
          draft.deleteMutation.mutate(
            { permanent: isTrashed },
            {
              onSettled: () => setDeleteOpen(false),
            },
          );
        }}
      />

      <ConfirmDialog
        open={Boolean(voice.error)}
        onOpenChange={(open) => {
          if (!open) voice.clearError();
        }}
        title="Voice dictation"
        description={voice.error ?? "Something went wrong with voice input."}
        confirmLabel="OK"
        cancelLabel="Close"
        onConfirm={() => voice.clearError()}
      />

      <EditorLinkDialog
        open={editor.linkOpen}
        onOpenChange={editor.setLinkOpen}
        linkUrl={editor.linkUrl}
        linkText={editor.linkText}
        onLinkUrlChange={editor.setLinkUrl}
        onLinkTextChange={editor.setLinkText}
        onApply={editor.applyLinkFromDialog}
      />

      <EditorPanelsDialog
        noteId={note.id}
        canEdit={canEdit}
        checklistOpen={checklistOpen}
        resourcesOpen={resourcesOpen}
        integrationsOpen={integrationsOpen}
        onChecklistOpenChange={setChecklistOpen}
        onResourcesOpenChange={setResourcesOpen}
        onIntegrationsOpenChange={setIntegrationsOpen}
        onImportIntegration={(content) => {
          applyAppendNoteContent(
            editor.editorRef.current,
            draft.content,
            draft.setContent,
            content,
          );
        }}
      />

      <NoteReminderDialog
        noteId={note.id}
        noteTitle={draft.title || note.title}
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        canEdit={canEdit}
      />

      <EditorAiSheet
        open={aiOpen}
        onOpenChange={setAiOpen}
        noteId={note.id}
        title={draft.title}
        contentHtml={draft.content}
        canEdit={canEdit}
        editorRef={editor.editorRef}
        setContent={draft.setContent}
        setTitle={draft.setTitle}
        onBeforeSend={editor.syncContentFromEditor}
      />

      <EditorCanvas
        note={note}
        allTags={allTags}
        selectedTags={draft.selectedTags}
        tagIds={draft.tagIds}
        title={draft.title}
        content={draft.content}
        canEdit={canEdit}
        canManageTags={canShare}
        editorFont={editorFont}
        editorRef={editor.editorRef}
        onTitleChange={draft.setTitle}
        onToggleTag={draft.toggleTag}
        onOpenChecklist={() => setChecklistOpen(true)}
        onOpenResources={() => setResourcesOpen(true)}
        onOpenReminder={() => setReminderOpen(true)}
        onInput={() => {
          editor.syncContentFromEditor();
          editor.refreshActiveFormats();
        }}
        onBlur={editor.syncContentFromEditor}
        onClick={(event) => {
          editor.handleEditorClick(event);
          editor.refreshActiveFormats();
        }}
        onKeyUp={editor.refreshActiveFormats}
        onMouseUp={editor.refreshActiveFormats}
      />

      <EditorStatusBar
        words={stats.words}
        minutes={stats.minutes}
        statusLabel={
          voice.isListening
            ? "Listening…"
            : statusLabel(draft.status, canEdit)
        }
      />
    </div>
  );
}
