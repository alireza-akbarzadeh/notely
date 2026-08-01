"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { readJson } from "@/lib/api/read-json";
import { cn } from "@/lib/utils";
import type { NoteSummary, SpaceSummary } from "@/types/notes";

type SpaceDeleteDialogProps = {
  space: SpaceSummary | null;
  fallbackSpace: SpaceSummary | null;
  pending?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: {
    keepNoteIds: string[];
    moveTargetSpaceId?: string;
  }) => void;
};

export function SpaceDeleteDialog({
  space,
  fallbackSpace,
  pending = false,
  onOpenChange,
  onConfirm,
}: SpaceDeleteDialogProps) {
  const open = Boolean(space);
  const [selectedDeleteIds, setSelectedDeleteIds] = useState<Set<string>>(
    new Set(),
  );

  const notesQuery = useQuery({
    queryKey: ["notes", space?.id, "space-delete"],
    enabled: Boolean(space?.id),
    queryFn: async (): Promise<{ notes: NoteSummary[] }> => {
      const params = new URLSearchParams({ spaceId: space!.id });
      return readJson<{ notes: NoteSummary[] }>(
        await fetch(`/api/notes?${params.toString()}`),
        "Failed to load notes",
      );
    },
  });

  const notes = notesQuery.data?.notes ?? [];

  useEffect(() => {
    if (!open) {
      setSelectedDeleteIds(new Set());
      return;
    }
    if (!notesQuery.isSuccess || !notesQuery.data) return;
    setSelectedDeleteIds(new Set(notesQuery.data.notes.map((note) => note.id)));
  }, [open, notesQuery.isSuccess, notesQuery.dataUpdatedAt, notesQuery.data]);

  const allSelected =
    notes.length > 0 && selectedDeleteIds.size === notes.length;
  const noneSelected = selectedDeleteIds.size === 0;
  const keepCount = notes.length - selectedDeleteIds.size;

  const summary = useMemo(() => {
    if (notes.length === 0) {
      return "This empty space will move to Trash. You can restore it later.";
    }
    if (allSelected) {
      return `All ${notes.length} notes will move to Trash with “${space?.name}”.`;
    }
    if (noneSelected && fallbackSpace) {
      return `All notes stay in “${fallbackSpace.name}”. Only the space moves to Trash.`;
    }
    if (keepCount > 0 && fallbackSpace) {
      return `${selectedDeleteIds.size} note${selectedDeleteIds.size === 1 ? "" : "s"} will trash with the space. ${keepCount} stay in “${fallbackSpace.name}”.`;
    }
    return "Choose which notes to delete with this space.";
  }, [
    allSelected,
    fallbackSpace,
    keepCount,
    noneSelected,
    notes.length,
    selectedDeleteIds.size,
    space?.name,
  ]);

  function toggleNote(noteId: string) {
    setSelectedDeleteIds((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) next.delete(noteId);
      else next.add(noteId);
      return next;
    });
  }

  function toggleAll() {
    if (allSelected) setSelectedDeleteIds(new Set());
    else setSelectedDeleteIds(new Set(notes.map((note) => note.id)));
  }

  function handleConfirm() {
    if (!space) return;
    const keepNoteIds = notes
      .filter((note) => !selectedDeleteIds.has(note.id))
      .map((note) => note.id);

    if (keepNoteIds.length > 0 && !fallbackSpace) return;

    onConfirm({
      keepNoteIds,
      moveTargetSpaceId:
        keepNoteIds.length > 0 ? fallbackSpace?.id : undefined,
    });
  }

  const canConfirm =
    !pending &&
    !notesQuery.isLoading &&
    !notesQuery.isError &&
    (keepCount === 0 || Boolean(fallbackSpace));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move space to Trash?</DialogTitle>
          <DialogDescription>
            {space
              ? `Choose which notes in “${space.name}” to delete. Unchecked notes stay in another space.`
              : "Choose which notes to delete."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {notesQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : notesQuery.isError ? (
            <p className="text-sm text-destructive">
              Couldn’t load notes for this space.
            </p>
          ) : notes.length === 0 ? (
            <p className="rounded-lg border border-border bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
              No notes in this space.
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  className="text-xs font-medium text-primary hover:underline"
                  onClick={toggleAll}
                  disabled={pending}
                >
                  {allSelected ? "Uncheck all" : "Check all"}
                </button>
                <span className="text-xs text-muted-foreground">
                  {selectedDeleteIds.size} of {notes.length} selected
                </span>
              </div>

              <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-1.5 scrollbar-thin">
                {notes.map((note) => {
                  const checked = selectedDeleteIds.has(note.id);
                  return (
                    <li key={note.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-md px-2.5 py-2 transition-colors",
                          checked ? "bg-destructive/5" : "hover:bg-accent/60",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 shrink-0 accent-destructive"
                          checked={checked}
                          disabled={pending}
                          onChange={() => toggleNote(note.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-foreground">
                            {note.title || "Untitled"}
                          </span>
                          <span className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                            {note.summary || "Empty note"}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

          <p className="text-xs leading-relaxed text-muted-foreground">
            {summary}
          </p>

          {keepCount > 0 && !fallbackSpace ? (
            <p className="text-xs text-destructive">
              Create another space first to keep unchecked notes.
            </p>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            {pending ? "Moving…" : "Move to Trash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
