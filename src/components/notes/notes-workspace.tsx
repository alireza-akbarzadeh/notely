"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { InboxPanel } from "@/components/notes/inbox-panel";
import { NotesEmptyState } from "@/components/notes/notes-empty-state";
import { NotesList } from "@/components/notes/notes-list";
import { NoteEditor } from "@/components/notes/note-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusMode } from "@/stores/focus-mode";
import { normalizeWorkspaceView, notePath, workspacePath } from "@/lib/workspace/paths";
import type { NoteSummary, NoteTag, SpaceSummary } from "@/types/notes";

type NotesWorkspaceProps = {
  noteId?: string;
};

export function NotesWorkspace({ noteId }: NotesWorkspaceProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const spaceId = searchParams.get("spaceId") ?? undefined;
  const view = normalizeWorkspaceView(searchParams.get("view"));
  const focusMode = useFocusMode((state) => state.enabled);

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> => {
      const response = await fetch("/api/spaces");
      if (!response.ok) throw new Error("Failed to load spaces");
      return response.json();
    },
  });

  const notesQuery = useQuery({
    queryKey: ["notes", spaceId, view],
    enabled: view !== "inbox",
    queryFn: async (): Promise<{ notes: NoteSummary[] }> => {
      const params = new URLSearchParams();
      if (view === "trash") {
        params.set("trash", "1");
      } else {
        if (spaceId) params.set("spaceId", spaceId);
        if (view === "favorites") params.set("favorites", "1");
        if (view === "archive") params.set("shared", "1");
      }
      const response = await fetch(`/api/notes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to load notes");
      return response.json();
    },
  });

  const trashedSpacesQuery = useQuery({
    queryKey: ["spaces", "trash"],
    enabled: view === "trash",
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> => {
      const response = await fetch("/api/spaces?trash=1");
      if (!response.ok) throw new Error("Failed to load trashed spaces");
      return response.json();
    },
  });

  const restoreSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/spaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to restore space");
      return data.space as SpaceSummary;
    },
    onSuccess: (space) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(workspacePath({ spaceId: space.id }));
    },
  });

  const permanentlyDeleteSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/spaces/${id}?permanent=1`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to permanently delete space");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<{ tags: NoteTag[] }> => {
      const response = await fetch("/api/tags");
      if (!response.ok) throw new Error("Failed to load tags");
      return response.json();
    },
  });

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    enabled: Boolean(noteId),
    queryFn: async (): Promise<{ note: NoteSummary }> => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) throw new Error("Failed to load note");
      return response.json();
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (targetSpaceId: string) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId: targetSpaceId, title: "Untitled" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to create note");
      return data.note as { id: string };
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(notePath(note.id));
    },
  });

  const notes = useMemo(() => {
    const rows: NoteSummary[] = notesQuery.data?.notes ?? [];
    if (view === "today") {
      const today = new Date();
      return rows.filter((note: NoteSummary) => {
        const updated = new Date(note.updatedAt);
        return (
          updated.getFullYear() === today.getFullYear() &&
          updated.getMonth() === today.getMonth() &&
          updated.getDate() === today.getDate()
        );
      });
    }
    return rows;
  }, [notesQuery.data?.notes, view]);

  const spaceName =
    view === "archive"
      ? "Archive"
      : view === "favorites"
        ? "Tasks"
        : view === "today"
          ? "Journal"
          : view === "trash"
            ? "Trash"
            : spacesQuery.data?.spaces.find((space: SpaceSummary) => space.id === spaceId)
                ?.name ??
              spacesQuery.data?.spaces[0]?.name ??
              "All Notes";

  if (view === "inbox") {
    return <InboxPanel />;
  }

  const showEditor = Boolean(noteId);
  const note = noteQuery.data?.note;
  const defaultSpaceId = spaceId ?? spacesQuery.data?.spaces[0]?.id;
  const trashedSpaces = trashedSpacesQuery.data?.spaces ?? [];
  const isEmptyList =
    !notesQuery.isLoading &&
    notes.length === 0 &&
    (view !== "trash" ||
      (!trashedSpacesQuery.isLoading && trashedSpaces.length === 0));
  const hideList = focusMode && showEditor;
  const spaceActionPending =
    restoreSpaceMutation.isPending || permanentlyDeleteSpaceMutation.isPending;

  return (
    <div className="flex min-h-0 flex-1 bg-background">
      <div
        className={
          hideList
            ? "hidden"
            : showEditor
              ? "hidden md:flex md:min-h-0"
              : isEmptyList
                ? "flex min-h-0 w-full md:hidden"
                : "flex min-h-0 w-full md:w-auto"
        }
      >
        <NotesList
          notes={notes}
          activeNoteId={noteId}
          isLoading={notesQuery.isLoading}
          spaceName={spaceName}
          trashedSpaces={view === "trash" ? trashedSpaces : undefined}
          trashedSpacesLoading={
            view === "trash" ? trashedSpacesQuery.isLoading : false
          }
          onRestoreSpace={(id) => restoreSpaceMutation.mutate(id)}
          onPermanentlyDeleteSpace={(id) =>
            permanentlyDeleteSpaceMutation.mutate(id)
          }
          spaceActionPending={spaceActionPending}
        />
      </div>

      <div
        className={
          showEditor || hideList
            ? "flex min-h-0 min-w-0 flex-1"
            : "hidden min-h-0 min-w-0 flex-1 md:flex"
        }
      >
        {showEditor ? (
          noteQuery.isLoading ? (
            <div className="flex flex-1 flex-col gap-4 p-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : note ? (
            <NoteEditor note={note} allTags={tagsQuery.data?.tags ?? []} />
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
              Note not found
            </div>
          )
        ) : (
          <NotesEmptyState
            className="w-full"
            variant={
              isEmptyList
                ? view === "trash"
                  ? "trash"
                  : view === "archive"
                    ? "archive"
                    : view === "favorites"
                      ? "task"
                      : "empty"
                : "select"
            }
            createPending={createNoteMutation.isPending}
            onCreateNote={
              isEmptyList &&
              view !== "trash" &&
              view !== "archive" &&
              view !== "favorites" &&
              defaultSpaceId
                ? () => createNoteMutation.mutate(defaultSpaceId)
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
