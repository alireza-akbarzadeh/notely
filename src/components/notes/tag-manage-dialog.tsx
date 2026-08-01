"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { readJson } from "@/lib/api/read-json";
import { cn } from "@/lib/utils";
import type { NoteTag } from "@/types/notes";

const TAG_COLORS = [
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#64748b",
] as const;

type TagManageDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TagManageDialog({ open, onOpenChange }: TagManageDialogProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(TAG_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<NoteTag | null>(null);
  const [tagToDelete, setTagToDelete] = useState<NoteTag | null>(null);

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    enabled: open,
    queryFn: async (): Promise<{ tags: NoteTag[] }> =>
      readJson<{ tags: NoteTag[] }>(await fetch("/api/tags"), "Failed to load tags"),
  });

  useEffect(() => {
    if (!open) {
      setName("");
      setColor(TAG_COLORS[0]);
      setError(null);
      setEditing(null);
      setTagToDelete(null);
    }
  }, [open]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });
      return readJson<{ tag: NoteTag }>(response, "Failed to create tag");
    },
    onSuccess: () => {
      setName("");
      setColor(TAG_COLORS[0]);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editing) throw new Error("No tag selected");
      const response = await fetch(`/api/tags/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });
      return readJson<{ tag: NoteTag }>(response, "Failed to update tag");
    },
    onSuccess: () => {
      setEditing(null);
      setName("");
      setColor(TAG_COLORS[0]);
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
    onError: (err: Error) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tags/${id}`, { method: "DELETE" });
      return readJson(response, "Failed to delete tag");
    },
    onSuccess: () => {
      setTagToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  function startEdit(tag: NoteTag) {
    setEditing(tag);
    setName(tag.name);
    setColor(tag.color);
    setError(null);
  }

  function cancelEdit() {
    setEditing(null);
    setName("");
    setColor(TAG_COLORS[0]);
    setError(null);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a tag name");
      return;
    }
    if (editing) updateMutation.mutate();
    else createMutation.mutate();
  }

  const pending = createMutation.isPending || updateMutation.isPending;
  const tags = tagsQuery.data?.tags ?? [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage tags</DialogTitle>
            <DialogDescription>
              Create, rename, recolor, or delete tags used across your notes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-3">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={editing ? "Rename tag" : "New tag name"}
              maxLength={40}
              autoFocus
            />
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={cn(
                    "size-6 rounded-full border-2 transition-transform",
                    color === swatch
                      ? "scale-110 border-foreground"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: swatch }}
                  aria-label={`Color ${swatch}`}
                />
              ))}
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <DialogFooter className="gap-2 sm:gap-0">
              {editing ? (
                <Button type="button" variant="ghost" onClick={cancelEdit}>
                  Cancel edit
                </Button>
              ) : null}
              <Button type="submit" disabled={pending || !name.trim()}>
                {pending ? "Saving…" : editing ? "Save tag" : "Add tag"}
                {!editing && !pending ? <Plus className="size-3.5" /> : null}
              </Button>
            </DialogFooter>
          </form>

          <div className="max-h-56 space-y-1 overflow-y-auto border-t border-border pt-3">
            {tagsQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">Loading tags…</p>
            ) : tags.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tags yet.</p>
            ) : (
              tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/60"
                >
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm">
                    #{tag.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => startEdit(tag)}
                    aria-label={`Edit ${tag.name}`}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => setTagToDelete(tag)}
                    aria-label={`Delete ${tag.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(tagToDelete)}
        onOpenChange={(next) => {
          if (!next) setTagToDelete(null);
        }}
        title="Delete tag?"
        description={
          tagToDelete
            ? `#${tagToDelete.name} will be removed from all notes.`
            : "This tag will be removed from all notes."
        }
        confirmLabel="Delete"
        destructive
        pending={deleteMutation.isPending}
        onConfirm={() => {
          if (tagToDelete) deleteMutation.mutate(tagToDelete.id);
        }}
      />
    </>
  );
}
