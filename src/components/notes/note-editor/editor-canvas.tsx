"use client";

import type { MouseEvent, RefObject } from "react";

import { Input } from "@/components/ui/input";
import { NoteChecklist } from "@/components/notes/note-checklist";
import { NoteResources } from "@/components/notes/note-resources";
import type { EditorFontOption } from "@/lib/editor-fonts";
import { cn } from "@/lib/utils";
import type { NoteSummary, NoteTag } from "@/types/notes";

import { EditorTags } from "./editor-tags";
import { formatEditedAt, stripHtml } from "./utils";

type EditorCanvasProps = {
  note: NoteSummary;
  allTags: NoteTag[];
  selectedTags: NoteTag[];
  tagIds: string[];
  title: string;
  canEdit: boolean;
  canShare: boolean;
  editorFont: EditorFontOption;
  editorRef: RefObject<HTMLDivElement | null>;
  onTitleChange: (value: string) => void;
  onToggleTag: (tagId: string) => void;
  onInput: () => void;
  onBlur: () => void;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  onKeyUp: () => void;
  onMouseUp: () => void;
};

export function EditorCanvas({
  note,
  allTags,
  selectedTags,
  tagIds,
  title,
  canEdit,
  canShare,
  editorFont,
  editorRef,
  onTitleChange,
  onToggleTag,
  onInput,
  onBlur,
  onClick,
  onKeyUp,
  onMouseUp,
}: EditorCanvasProps) {
  return (
    <div
      className="prose-note min-h-0 flex-1 overflow-y-auto px-5 py-8 pb-[calc(6rem+env(safe-area-inset-bottom))] scrollbar-thin md:px-12 md:pb-8 lg:px-16"
      style={{ fontFamily: editorFont.family }}
    >
      <div className="mx-auto max-w-2xl">
        <EditorTags
          allTags={allTags}
          selectedTags={selectedTags}
          tagIds={tagIds}
          canShare={canShare}
          onToggleTag={onToggleTag}
        />

        <Input
          value={title}
          readOnly={!canEdit}
          onChange={(event) => onTitleChange(event.target.value)}
          className="mb-2 h-auto border-0 bg-transparent px-0 text-3xl font-semibold leading-tight tracking-tight text-foreground shadow-none focus-visible:ring-0 md:text-[2.35rem]"
          style={{ fontFamily: editorFont.family }}
          placeholder="Untitled"
        />

        <p className="mb-8 text-xs text-muted-foreground">
          {formatEditedAt(note.updatedAt)}
          {note.isShared ? ` · Shared · ${note.accessRole ?? "editor"}` : ""}
        </p>

        <div
          ref={editorRef}
          role="textbox"
          aria-multiline="true"
          aria-label="Note content"
          contentEditable={canEdit}
          suppressContentEditableWarning
          onInput={onInput}
          onBlur={onBlur}
          onClick={onClick}
          onKeyUp={onKeyUp}
          onMouseUp={onMouseUp}
          data-placeholder="Start writing…"
          className={cn(
            "note-rich-editor mb-10 min-h-[42vh] w-full text-[16px] leading-7 text-foreground/90 outline-none",
            !canEdit && "opacity-90",
          )}
          style={{ fontFamily: editorFont.family }}
          data-empty={stripHtml(note.content) ? "false" : "true"}
        />

        <div className="font-sans">
          <NoteChecklist noteId={note.id} canEdit={canEdit} />
          <NoteResources noteId={note.id} canEdit={canEdit} />
        </div>
      </div>
    </div>
  );
}
