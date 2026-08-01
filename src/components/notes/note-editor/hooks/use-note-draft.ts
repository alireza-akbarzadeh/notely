"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { readJson } from "@/lib/api/read-json";
import type { NoteSummary, NoteTag } from "@/types/notes";
import { notePath, workspacePath } from "@/lib/workspace/paths";

import type { DraftSnapshot, SaveStatus } from "../types";
import { sameTagIds } from "../utils";

type UseNoteDraftOptions = {
  note: NoteSummary;
  allTags: NoteTag[];
  canEdit: boolean;
};

export function useNoteDraft({ note, allTags, canEdit }: UseNoteDraftOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tagIds, setTagIds] = useState(note.tags.map((tag) => tag.id));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const savedRef = useRef<DraftSnapshot>({
    title: note.title,
    content: note.content,
    tagIds: note.tags.map((tag) => tag.id),
  });
  const draftRef = useRef<DraftSnapshot>(savedRef.current);

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
      isArchived?: boolean;
    }) => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJson<{ note: NoteSummary }>(
        response,
        "Failed to save",
      );
      return { note: data.note, payload };
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
    mutationFn: async (options?: { permanent?: boolean }) => {
      const permanent = options?.permanent === true;
      const url = permanent
        ? `/api/notes/${note.id}?permanent=1`
        : `/api/notes/${note.id}`;
      const response = await fetch(url, { method: "DELETE" });
      return readJson<{ success: boolean; permanent?: boolean }>(
        response,
        "Failed to delete",
      );
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["note", note.id] });
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Soft-deleted notes appear here; after permanent delete Trash refreshes.
      router.push(workspacePath({ view: "trash" }));
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restore: true }),
      });
      const data = await readJson<{ note: NoteSummary }>(
        response,
        "Failed to restore",
      );
      return data.note;
    },
    onSuccess: (restored) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.setQueryData(["note", note.id], { note: restored });
      router.push(notePath(note.id));
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

  function saveNow(overrides?: { isFavorite?: boolean; isArchived?: boolean }) {
    saveMutation.mutate({
      title: title.trim() || "Untitled",
      content,
      tagIds,
      ...overrides,
    });
  }

  const selectedTags = allTags.filter((tag) => tagIds.includes(tag.id));

  return {
    title,
    setTitle,
    content,
    setContent,
    tagIds,
    status,
    selectedTags,
    toggleTag,
    saveNow,
    saveMutation,
    deleteMutation,
    restoreMutation,
  };
}
