"use client";

import { cn } from "@/lib/utils";
import type { NoteTag } from "@/types/notes";

type EditorTagsProps = {
  allTags: NoteTag[];
  selectedTags: NoteTag[];
  tagIds: string[];
  canShare: boolean;
  onToggleTag: (tagId: string) => void;
};

export function EditorTags({
  allTags,
  selectedTags,
  tagIds,
  canShare,
  onToggleTag,
}: EditorTagsProps) {
  if (selectedTags.length === 0 && !(allTags.length > 0 && canShare)) {
    return null;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {(canShare ? allTags : selectedTags).map((tag) => {
        const selected = tagIds.includes(tag.id);
        if (!canShare && !selected) return null;
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => canShare && onToggleTag(tag.id)}
            disabled={!canShare}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
              selected
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            #{tag.name}
          </button>
        );
      })}
    </div>
  );
}
