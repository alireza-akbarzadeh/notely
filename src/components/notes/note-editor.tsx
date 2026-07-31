"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteChecklist } from "@/components/notes/note-checklist";
import type { NoteSummary, NoteTag } from "@/types/notes";

type NoteEditorProps = {
  note: NoteSummary;
  allTags: NoteTag[];
};

export function NoteEditor({ note, allTags }: NoteEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagIds, setTagIds] = useState(note.tags.map((tag) => tag.id));
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTagIds(note.tags.map((tag) => tag.id));
    setStatus("idle");
  }, [note.id, note.title, note.content, note.tags]);

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
      return data.note as NoteSummary;
    },
    onMutate: () => setStatus("saving"),
    onSuccess: (updated) => {
      setStatus("saved");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.setQueryData(["note", note.id], { note: updated });
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
    const handle = window.setTimeout(() => {
      if (title === note.title && content === note.content) {
        const sameTags =
          tagIds.length === note.tags.length &&
          tagIds.every((id) => note.tags.some((tag) => tag.id === id));
        if (sameTags) return;
      }
      saveMutation.mutate({ title: title.trim() || "Untitled", content, tagIds });
    }, 600);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagIds]);

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
          {status === "saving"
            ? "Saving…"
            : status === "saved"
              ? "Saved"
              : status === "error"
                ? "Couldn’t save"
                : "Ready"}
        </p>
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
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] md:px-10 md:pb-10">
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mb-4 h-auto border-0 bg-transparent px-0 text-3xl font-semibold shadow-none focus-visible:ring-0 md:text-4xl"
          placeholder="Untitled"
        />

        {allTags.length > 0 ? (
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

        <NoteChecklist noteId={note.id} />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Start writing…"
          className="min-h-[40vh] w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
