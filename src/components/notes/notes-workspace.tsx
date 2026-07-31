"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { NotesList } from "@/components/notes/notes-list";
import { NoteEditor } from "@/components/notes/note-editor";
import { Skeleton } from "@/components/ui/skeleton";
import type { NoteSummary, NoteTag, SpaceSummary } from "@/types/notes";

type NotesWorkspaceProps = {
  noteId?: string;
};

export function NotesWorkspace({ noteId }: NotesWorkspaceProps) {
  const searchParams = useSearchParams();
  const spaceId = searchParams.get("spaceId") ?? undefined;
  const view = searchParams.get("view");

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
    queryFn: async (): Promise<{ notes: NoteSummary[] }> => {
      const params = new URLSearchParams();
      if (spaceId) params.set("spaceId", spaceId);
      if (view === "favorites") params.set("favorites", "1");
      const response = await fetch(`/api/notes?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to load notes");
      return response.json();
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
    if (view === "inbox") return [] as NoteSummary[];
    return rows;
  }, [notesQuery.data?.notes, view]);

  const spaceName =
    spacesQuery.data?.spaces.find((space: SpaceSummary) => space.id === spaceId)
      ?.name ??
    spacesQuery.data?.spaces[0]?.name ??
    "Notes";

  const showEditor = Boolean(noteId);
  const note = noteQuery.data?.note;

  return (
    <div className="flex min-h-0 flex-1">
      <div className={showEditor ? "hidden md:flex md:min-h-0" : "flex min-h-0 w-full"}>
        <NotesList
          notes={notes}
          activeNoteId={noteId}
          isLoading={notesQuery.isLoading}
          spaceName={spaceName}
        />
      </div>

      <div className={showEditor ? "flex min-h-0 flex-1" : "hidden min-h-0 flex-1 md:flex"}>
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
          <div className="hidden flex-1 items-center justify-center p-8 text-center md:flex">
            <div>
              <p className="text-lg font-semibold">Select a note</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Or create a new one from the sidebar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
