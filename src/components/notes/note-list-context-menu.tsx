"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, FolderOpen, Plus, Tags } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
import type { NoteSummary, NoteTag, SpaceSummary } from "@/types/notes";

const DEFAULT_TAG_COLOR = "#3b82f6";

type NoteListContextMenuProps = {
  note: NoteSummary;
  spaces: SpaceSummary[];
  tags: NoteTag[];
  disabled?: boolean;
  children: ReactNode;
};

export function NoteListContextMenu({
  note,
  spaces,
  tags,
  disabled = false,
  children,
}: NoteListContextMenuProps) {
  const queryClient = useQueryClient();
  const [createSpaceOpen, setCreateSpaceOpen] = useState(false);
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [tagName, setTagName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canOrganize =
    !disabled && note.accessRole === "owner" && !note.deletedAt;

  const moveMutation = useMutation({
    mutationFn: async (spaceId: string) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId }),
      });
      return readJson<{ note: NoteSummary }>(response, "Failed to move note");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
    },
  });

  const tagsMutation = useMutation({
    mutationFn: async (tagIds: string[]) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds }),
      });
      return readJson<{ note: NoteSummary }>(response, "Failed to update tags");
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["note", note.id], { note: data.note });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const createSpaceMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await readJson<{ space: SpaceSummary }>(
        response,
        "Failed to create space",
      );
      const moveResponse = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId: data.space.id }),
      });
      await readJson(moveResponse, "Failed to move note");
      return data.space;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });
      setCreateSpaceOpen(false);
      setSpaceName("");
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color: DEFAULT_TAG_COLOR }),
      });
      const data = await readJson<{ tag: NoteTag }>(
        response,
        "Failed to create tag",
      );
      const nextIds = Array.from(
        new Set([...note.tags.map((tag) => tag.id), data.tag.id]),
      );
      const assignResponse = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds: nextIds }),
      });
      await readJson(assignResponse, "Failed to assign tag");
      return data.tag;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });
      setCreateTagOpen(false);
      setTagName("");
      setError(null);
    },
    onError: (err: Error) => setError(err.message),
  });

  function toggleTag(tagId: string) {
    const current = note.tags.map((tag) => tag.id);
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    tagsMutation.mutate(next);
  }

  function submitSpace(event: FormEvent) {
    event.preventDefault();
    if (!spaceName.trim()) {
      setError("Enter a space name");
      return;
    }
    createSpaceMutation.mutate(spaceName.trim());
  }

  function submitTag(event: FormEvent) {
    event.preventDefault();
    if (!tagName.trim()) {
      setError("Enter a tag name");
      return;
    }
    createTagMutation.mutate(tagName.trim());
  }

  if (!canOrganize) {
    return <>{children}</>;
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="block w-full">
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-52">
          <ContextMenuGroup>
            <ContextMenuLabel className="truncate">
              {note.title || "Untitled"}
            </ContextMenuLabel>
          </ContextMenuGroup>
          <ContextMenuSeparator />

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <FolderOpen />
              Move to space
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="min-w-44">
              {spaces.map((space) => {
                const current = note.spaceId === space.id;
                return (
                  <ContextMenuItem
                    key={space.id}
                    disabled={current || moveMutation.isPending}
                    onClick={() => moveMutation.mutate(space.id)}
                  >
                    <span className="truncate">{space.name}</span>
                    <Check
                      className={cn(
                        "ml-auto size-3.5",
                        current ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </ContextMenuItem>
                );
              })}
              {spaces.length > 0 ? <ContextMenuSeparator /> : null}
              <ContextMenuItem
                onClick={() => {
                  setError(null);
                  setSpaceName("");
                  setCreateSpaceOpen(true);
                }}
              >
                <Plus />
                New space…
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSub>
            <ContextMenuSubTrigger>
              <Tags />
              Tags
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="min-w-44">
              {tags.length === 0 ? (
                <ContextMenuItem disabled>No tags yet</ContextMenuItem>
              ) : (
                tags.map((tag) => {
                  const assigned = note.tags.some((item) => item.id === tag.id);
                  return (
                    <ContextMenuItem
                      key={tag.id}
                      disabled={tagsMutation.isPending}
                      onClick={() => toggleTag(tag.id)}
                    >
                      <span
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: tag.color }}
                        aria-hidden
                      />
                      <span className="truncate">#{tag.name}</span>
                      <Check
                        className={cn(
                          "ml-auto size-3.5",
                          assigned ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </ContextMenuItem>
                  );
                })
              )}
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => {
                  setError(null);
                  setTagName("");
                  setCreateTagOpen(true);
                }}
              >
                <Plus />
                New tag…
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>

      <Dialog
        open={createSpaceOpen}
        onOpenChange={(open) => {
          setCreateSpaceOpen(open);
          if (!open) {
            setSpaceName("");
            setError(null);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={submitSpace}>
            <DialogHeader>
              <DialogTitle>New space</DialogTitle>
              <DialogDescription>
                Create a space and move “{note.title || "Untitled"}” into it.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                autoFocus
                value={spaceName}
                onChange={(event) => setSpaceName(event.target.value)}
                placeholder="e.g. Work, Personal"
                maxLength={80}
                aria-label="Space name"
              />
              {error ? (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateSpaceOpen(false)}
                disabled={createSpaceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!spaceName.trim() || createSpaceMutation.isPending}
              >
                {createSpaceMutation.isPending
                  ? "Creating…"
                  : "Create & move"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={createTagOpen}
        onOpenChange={(open) => {
          setCreateTagOpen(open);
          if (!open) {
            setTagName("");
            setError(null);
          }
        }}
      >
        <DialogContent>
          <form onSubmit={submitTag}>
            <DialogHeader>
              <DialogTitle>New tag</DialogTitle>
              <DialogDescription>
                Create a tag and assign it to “{note.title || "Untitled"}”.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Input
                autoFocus
                value={tagName}
                onChange={(event) => setTagName(event.target.value)}
                placeholder="e.g. ideas, urgent"
                maxLength={40}
                aria-label="Tag name"
              />
              {error ? (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateTagOpen(false)}
                disabled={createTagMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!tagName.trim() || createTagMutation.isPending}
              >
                {createTagMutation.isPending
                  ? "Creating…"
                  : "Create & assign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
