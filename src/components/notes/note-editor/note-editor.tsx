"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { NoteSharePanel } from "@/components/notes/note-share-panel";

import { EditorCanvas } from "./editor-canvas";
import { EditorLinkDialog } from "./editor-link-dialog";
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
  const canEdit = note.accessRole !== "viewer";
  const canShare = note.accessRole === "owner";

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
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <EditorToolbar
        canEdit={canEdit}
        canShare={canShare}
        editorFont={editorFont}
        onSelectFont={selectFont}
        activeFormats={editor.activeFormats}
        shareOpen={editor.shareOpen}
        onShareOpenChange={editor.setShareOpen}
        isFavorite={note.isFavorite}
        onBack={() => router.push("/notes")}
        onToggleBlock={editor.toggleBlock}
        onInlineCommand={editor.toggleInlineCommand}
        onRunCommand={editor.runCommand}
        onInsertChecklist={editor.insertChecklistItem}
        onOpenLink={editor.openLinkDialog}
        onToggleCode={editor.toggleCode}
        onToggleFavorite={() => draft.saveNow({ isFavorite: !note.isFavorite })}
        onDelete={() => {
          if (window.confirm("Delete this note?")) draft.deleteMutation.mutate();
        }}
      />

      <NoteSharePanel
        noteId={note.id}
        canShare={canShare}
        open={editor.shareOpen}
        onOpenChange={editor.setShareOpen}
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

      <EditorCanvas
        note={note}
        allTags={allTags}
        selectedTags={draft.selectedTags}
        tagIds={draft.tagIds}
        title={draft.title}
        canEdit={canEdit}
        canShare={canShare}
        editorFont={editorFont}
        editorRef={editor.editorRef}
        onTitleChange={draft.setTitle}
        onToggleTag={draft.toggleTag}
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
