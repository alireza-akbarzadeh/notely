"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { NoteSharePanel } from "@/components/notes/note-share-panel";

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
  const canEdit = note.accessRole !== "viewer";
  const canShare = note.accessRole === "owner";
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

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
        onOpenChecklist={() => setChecklistOpen(true)}
        onOpenResources={() => setResourcesOpen(true)}
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

      <EditorPanelsDialog
        noteId={note.id}
        canEdit={canEdit}
        checklistOpen={checklistOpen}
        resourcesOpen={resourcesOpen}
        onChecklistOpenChange={setChecklistOpen}
        onResourcesOpenChange={setResourcesOpen}
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
