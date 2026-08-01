"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { NoteDeleteDialog } from "@/components/notes/note-delete-dialog";
import { NoteReminderDialog } from "@/components/notes/note-reminder-dialog";
import { NoteSharePanel } from "@/components/notes/note-share-panel";

import { EditorAiSheet } from "./editor-ai-sheet";
import { EditorCanvas } from "./editor-canvas";
import { EditorLinkDialog } from "./editor-link-dialog";
import { EditorPanelsDialog } from "./editor-panels-dialog";
import { EditorStatusBar } from "./editor-status-bar";
import { EditorToolbar } from "./editor-toolbar";
import { useEditorFont } from "./hooks/use-editor-font";
import { useNoteDraft } from "./hooks/use-note-draft";
import { useRichTextEditor } from "./hooks/use-rich-text-editor";
import type { NoteEditorProps } from "./types";
import { statusLabel, wordStats } from "./utils";

export type { NoteEditorProps } from "./types";

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const isTrashed = Boolean(note.deletedAt);
  const canEdit = !isTrashed && note.accessRole !== "viewer";
  const canShare = !isTrashed && note.accessRole === "owner";
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
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

  const stats = useMemo(() => wordStats(draft.content), [draft.content]);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <EditorToolbar
        canEdit={canEdit}
        canShare={canShare}
        editorFont={editorFont}
        onSelectFont={selectFont}
        activeFormats={editor.activeFormats}
        shareOpen={editor.shareOpen}
        onShareOpenChange={editor.setShareOpen}
        isFavorite={note.isFavorite}
        isTrashed={isTrashed}
        onBack={() => router.push(isTrashed ? "/notes?view=trash" : "/notes")}
        onToggleBlock={editor.toggleBlock}
        onInlineCommand={editor.toggleInlineCommand}
        onRunCommand={editor.runCommand}
        onInsertChecklist={editor.insertChecklistItem}
        onOpenLink={editor.openLinkDialog}
        onToggleCode={editor.toggleCode}
        onToggleFavorite={() => draft.saveNow({ isFavorite: !note.isFavorite })}
        onDelete={() => setDeleteOpen(true)}
        onRestore={() => draft.restoreMutation.mutate()}
        onOpenChecklist={() => setChecklistOpen(true)}
        onOpenResources={() => setResourcesOpen(true)}
        onOpenAi={() => setAiOpen(true)}
        onOpenReminder={() => setReminderOpen(true)}
        onPrepareTextColor={editor.prepareTextColor}
        onApplyTextColor={editor.applyTextColor}
        onPrepareInlineImage={editor.prepareInlineImage}
        onInsertInlineImage={editor.insertInlineImage}
        inlineImageUploading={editor.inlineImageUploading}
      />

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

      <NoteSharePanel
        noteId={note.id}
        canShare={canShare}
        open={editor.shareOpen}
        onOpenChange={editor.setShareOpen}
      />

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
        onChecklistOpenChange={setChecklistOpen}
        onResourcesOpenChange={setResourcesOpen}
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
        canShare={canShare}
        editorFont={editorFont}
        editorRef={editor.editorRef}
        onTitleChange={draft.setTitle}
        onToggleTag={draft.toggleTag}
        onOpenChecklist={() => setChecklistOpen(true)}
        onOpenResources={() => setResourcesOpen(true)}
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
        statusLabel={statusLabel(draft.status, canEdit)}
      />
    </div>
  );
}
