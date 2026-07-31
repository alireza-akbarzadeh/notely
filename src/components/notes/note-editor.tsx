"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteChecklist } from "@/components/notes/note-checklist";
import { NoteResources } from "@/components/notes/note-resources";
import { NoteSharePanel } from "@/components/notes/note-share-panel";
import type { NoteSummary, NoteTag } from "@/types/notes";

type NoteEditorProps = {
  note: NoteSummary;
  allTags: NoteTag[];
};

type DraftSnapshot = {
  title: string;
  content: string;
  tagIds: string[];
};

function sameTagIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canEdit = note.accessRole !== "viewer";
  const canShare = note.accessRole === "owner";
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagIds, setTagIds] = useState(note.tags.map((tag) => tag.id));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const savedRef = useRef<DraftSnapshot>({
    title: note.title,
    content: note.content,
    tagIds: note.tags.map((tag) => tag.id),
  });
  const draftRef = useRef<DraftSnapshot>(savedRef.current);

  // Only reload local draft when switching notes — never while typing.
  useEffect(() => {
    const next: DraftSnapshot = {
      title: note.title,
      content: note.content,
      tagIds: note.tags.map((tag) => tag.id),
    };
    setTitle(next.title);
    setContent(next.content);
    setTagIds(next.tagIds);
    savedRef.current = next;
    draftRef.current = next;
    setStatus("idle");
  }, [note.id]);

  useEffect(() => {
    draftRef.current = { title, content, tagIds };
  }, [title, content, tagIds]);

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      content: string;
      tagIds: string[];
      isFavorite?: boolean;
    }) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to save");
      return { note: data.note as NoteSummary, payload };
    },
    onMutate: () => setStatus("saving"),
    onSuccess: ({ note: updated, payload }) => {
      savedRef.current = {
        title: payload.title,
        content: payload.content,
        tagIds: payload.tagIds,
      };

      const draft = draftRef.current;
      const draftMatchesSave =
        draft.title === payload.title &&
        draft.content === payload.content &&
        sameTagIds(draft.tagIds, payload.tagIds);

      queryClient.setQueryData(["note", note.id], {
        note: {
          ...updated,
          // Keep newer local draft in the cache if the user typed during save.
          title: draftMatchesSave ? updated.title : draft.title,
          content: draftMatchesSave ? updated.content : draft.content,
          tags: draftMatchesSave
            ? updated.tags
            : allTags.filter((tag) => draft.tagIds.includes(tag.id)),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setStatus(draftMatchesSave ? "saved" : "saving");
    },
    onError: () => setStatus("error"),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${note.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes");
    },
  });

  useEffect(() => {
    if (!canEdit) return;
    const handle = window.setTimeout(() => {
      const saved = savedRef.current;
      if (
        title === saved.title &&
        content === saved.content &&
        sameTagIds(tagIds, saved.tagIds)
      ) {
        return;
      }
      saveMutation.mutate({
        title: title.trim() || "Untitled",
        content,
        tagIds,
      });
    }, 700);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagIds, canEdit]);

  function toggleTag(tagId: string) {
    setTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId],
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => router.push("/notes")}
          aria-label="Back to notes"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <p className="flex-1 truncate text-xs text-muted-foreground">
          {note.isShared ? `Shared · ${note.accessRole ?? "editor"} · ` : ""}
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "Saved"
              : status === "error"
                ? "Couldn’t save"
                : canEdit
                  ? "Ready"
                  : "View only"}
        </p>
        {canShare ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              saveMutation.mutate({
                title: title.trim() || "Untitled",
                content,
                tagIds,
                isFavorite: !note.isFavorite,
              })
            }
            aria-label="Toggle favorite"
          >
            <Star
              className={`size-4 ${note.isFavorite ? "fill-primary text-primary" : ""}`}
            />
          </Button>
        ) : null}
        {canShare ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.confirm("Delete this note?")) deleteMutation.mutate();
            }}
            aria-label="Delete note"
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-10 md:pb-10">
        <Input
          value={title}
          readOnly={!canEdit}
          onChange={(event) => setTitle(event.target.value)}
          className="mb-4 h-auto border-0 bg-transparent px-0 text-3xl font-semibold shadow-none focus-visible:ring-0 md:text-4xl"
          placeholder="Untitled"
        />

        <NoteSharePanel noteId={note.id} canShare={canShare} />

        {allTags.length > 0 && canShare ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const selected = tagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-opacity"
                  style={{
                    backgroundColor: selected ? `${tag.color}33` : `${tag.color}14`,
                    color: tag.color,
                    opacity: selected ? 1 : 0.7,
                  }}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>
        ) : null}

        <textarea
          value={content}
          readOnly={!canEdit}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Start writing…"
          className="mb-8 min-h-[40vh] w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground read-only:opacity-90"
        />

        <NoteChecklist noteId={note.id} canEdit={canEdit} />
        <NoteResources noteId={note.id} canEdit={canEdit} />
      </div>
    </div>
  );
}
