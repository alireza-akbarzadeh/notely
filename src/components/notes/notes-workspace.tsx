"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { InboxPanel } from "@/components/notes/inbox-panel";
import { NotesEmptyState } from "@/components/notes/notes-empty-state";
import { NotesList } from "@/components/notes/notes-list";
import { NoteEditor } from "@/components/notes/note-editor";
import {
  isSameLocalDay,
  useNoteIdsWithReminderDueToday,
} from "@/components/notes/use-note-reminders";
import { Skeleton } from "@/components/ui/skeleton";
import { readJson } from "@/lib/api/read-json";
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
  const tagId = searchParams.get("tagId") ?? undefined;
  const focusMode = useFocusMode((state) => state.enabled);
  const reminderDueTodayIds = useNoteIdsWithReminderDueToday(view === "today");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const tasksForTodayQuery = useQuery({
    queryKey: ["tasks"],
    enabled: view === "today",
    queryFn: async (): Promise<{
      tasks: Array<{
        noteId: string | null;
        dueAt: string | null;
        isCompleted: boolean;
      }>;
    }> =>
      readJson(await fetch("/api/tasks"), "Failed to load tasks"),
  });

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const spacesQuery = useQuery({
    queryKey: ["spaces"],
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> =>
      readJson<{ spaces: SpaceSummary[] }>(
        await fetch("/api/spaces"),
        "Failed to load spaces",
      ),
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
        if (view === "shared") params.set("shared", "1");
        if (view === "archive") params.set("archive", "1");
      }
      return readJson<{ notes: NoteSummary[] }>(
        await fetch(`/api/notes?${params.toString()}`),
        "Failed to load notes",
      );
    },
  });

  const trashedSpacesQuery = useQuery({
    queryKey: ["spaces", "trash"],
    enabled: view === "trash",
    queryFn: async (): Promise<{ spaces: SpaceSummary[] }> =>
      readJson<{ spaces: SpaceSummary[] }>(
        await fetch("/api/spaces?trash=1"),
        "Failed to load trashed spaces",
      ),
  });

  const restoreSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/spaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      const data = await readJson<{ space: SpaceSummary }>(
        response,
        "Failed to restore space",
      );
      return data.space;
    },
    onSuccess: (space) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setStatusMessage(`Restored “${space.name}”.`);
      router.push(workspacePath({ spaceId: space.id }));
    },
  });

  const permanentlyDeleteSpaceMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/spaces/${id}?permanent=1`, {
        method: "DELETE",
      });
      await readJson(response, "Failed to permanently delete space");
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setStatusMessage("Space deleted forever.");
    },
  });

  const emptyTrashMutation = useMutation({
    mutationFn: async () => {
      const data = await readJson<{
        notesDeleted: number;
        spacesDeleted: number;
      }>(await fetch("/api/trash", { method: "DELETE" }), "Failed to empty trash");
      return data;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      const parts = [
        result.notesDeleted > 0
          ? `${result.notesDeleted} note${result.notesDeleted === 1 ? "" : "s"}`
          : null,
        result.spacesDeleted > 0
          ? `${result.spacesDeleted} space${result.spacesDeleted === 1 ? "" : "s"}`
          : null,
      ].filter(Boolean);
      setStatusMessage(
        parts.length > 0
          ? `Emptied trash (${parts.join(", ")}).`
          : "Trash was already empty.",
      );
    },
  });

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<{ tags: NoteTag[] }> =>
      readJson<{ tags: NoteTag[] }>(await fetch("/api/tags"), "Failed to load tags"),
  });

  const noteQuery = useQuery({
    queryKey: ["note", noteId],
    enabled: Boolean(noteId),
    queryFn: async (): Promise<{ note: NoteSummary }> =>
      readJson<{ note: NoteSummary }>(
        await fetch(`/api/notes/${noteId}`),
        "Failed to load note",
      ),
  });

  const createNoteMutation = useMutation({
    mutationFn: async (targetSpaceId: string) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spaceId: targetSpaceId, title: "Untitled" }),
      });
      const data = await readJson<{ note: { id: string } }>(
        response,
        "Failed to create note",
      );
      return data.note;
    },
    onSuccess: (note) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push(notePath(note.id));
    },
  });

  // Today = edited today, reminder due today, or incomplete task due today.
  const notes = useMemo(() => {
    let rows: NoteSummary[] = notesQuery.data?.notes ?? [];
    if (view === "today") {
      const today = new Date();
      const taskDueTodayIds = new Set<string>();
      for (const task of tasksForTodayQuery.data?.tasks ?? []) {
        if (!task.noteId || task.isCompleted || !task.dueAt) continue;
        if (isSameLocalDay(new Date(task.dueAt), today)) {
          taskDueTodayIds.add(task.noteId);
        }
      }
      rows = rows.filter(
        (note: NoteSummary) =>
          isSameLocalDay(new Date(note.updatedAt), today) ||
          reminderDueTodayIds.has(note.id) ||
          taskDueTodayIds.has(note.id),
      );
    }
    if (tagId) {
      rows = rows.filter((note) => note.tags.some((tag) => tag.id === tagId));
    }
    return rows;
  }, [
    notesQuery.data?.notes,
    reminderDueTodayIds,
    tagId,
    tasksForTodayQuery.data?.tasks,
    view,
  ]);

  const activeTag = tagsQuery.data?.tags.find((tag) => tag.id === tagId);

  const spaceName =
    activeTag
      ? `#${activeTag.name}`
      : view === "shared"
      ? "Shared with me"
      : view === "archive"
        ? "Archive"
        : view === "favorites"
          ? "Favorites"
          : view === "today"
            ? "Today"
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
          onEmptyTrash={
            view === "trash" ? () => emptyTrashMutation.mutate() : undefined
          }
          spaceActionPending={spaceActionPending}
          emptyTrashPending={emptyTrashMutation.isPending}
          statusMessage={statusMessage}
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
                  : view === "shared"
                    ? "shared"
                    : view === "archive"
                      ? "archive"
                      : view === "today"
                        ? "today"
                        : view === "favorites"
                          ? "favorites"
                          : "empty"
                : "select"
            }
            createPending={createNoteMutation.isPending}
            onCreateNote={
              isEmptyList &&
              view !== "trash" &&
              view !== "shared" &&
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
