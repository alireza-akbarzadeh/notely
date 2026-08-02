"use client";

import { cn } from "@/lib/utils";
import type { NoteTag } from "@/types/notes";

type EditorTagsProps = {
  allTags: NoteTag[];
  selectedTags: NoteTag[];
  tagIds: string[];
  canManageTags: boolean;
  onToggleTag: (tagId: string) => void;
};

export function EditorTags({
  allTags,
  selectedTags,
  tagIds,
  canManageTags,
  onToggleTag,
}: EditorTagsProps) {
  const visibleTags = canManageTags ? allTags : selectedTags;

  if (visibleTags.length === 0) {
    if (!canManageTags) return null;
    return (
      <p className="mb-4 text-xs text-muted-foreground">
        No tags yet — create some from the Tags section in the sidebar, then
        assign them here.
      </p>
    );
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {visibleTags.map((tag) => {
        const selected = tagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => canManageTags && onToggleTag(tag.id)}
            disabled={!canManageTags}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              selected
                ? "border-transparent text-foreground"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground",
              !canManageTags && "cursor-default",
            )}
            style={
              selected
                ? {
                    backgroundColor: `${tag.color}22`,
                    borderColor: `${tag.color}55`,
                    color: tag.color,
                  }
                : undefined
            }
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: tag.color }}
              aria-hidden
            />
            #{tag.name}
          </button>
        );
      })}
    </div>
  );
}
