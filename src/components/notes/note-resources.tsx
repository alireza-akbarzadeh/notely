"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Link2, Paperclip, Trash2, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NoteAttachment } from "@/types/notes";

type NoteResourcesProps = {
  noteId: string;
  canEdit?: boolean;
};

function formatBytes(size: number) {
  if (!size) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function NoteResources({ noteId, canEdit = true }: NoteResourcesProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const attachmentsQuery = useQuery({
    queryKey: ["attachments", noteId],
    queryFn: async (): Promise<{ attachments: NoteAttachment[] }> => {
      const response = await fetch(
        `/api/attachments?noteId=${encodeURIComponent(noteId)}`,
      );
      if (!response.ok) throw new Error("Failed to load attachments");
      return response.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("noteId", noteId);
      form.set("file", file);
      const response = await fetch("/api/attachments", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");
      return data.attachment as NoteAttachment;
    },
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["attachments", noteId] });
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error ? mutationError.message : "Upload failed",
      );
    },
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/attachments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId,
          fileName: linkName.trim() || "Link",
          url: linkUrl.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to add link");
      return data.attachment as NoteAttachment;
    },
    onSuccess: () => {
      setLinkName("");
      setLinkUrl("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["attachments", noteId] });
    },
    onError: (mutationError) => {
      setError(
        mutationError instanceof Error ? mutationError.message : "Failed to add link",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", noteId] });
    },
  });

  const items: NoteAttachment[] = attachmentsQuery.data?.attachments ?? [];

  return (
    <section className="rounded-2xl border border-border/80 bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Resources</h2>
          <p className="text-xs text-muted-foreground">
            {attachmentsQuery.isLoading
              ? "Loading…"
              : items.length === 0
                ? "Files and links for this note"
                : `${items.length} attachment${items.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {canEdit ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) uploadMutation.mutate(file);
              }}
            />
          </>
        ) : null}
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-border/70 bg-background/40 px-3 py-2.5"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground">
              {item.storage === "link" ? (
                <Link2 className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.fileName}</p>
              <p className="text-[11px] text-muted-foreground">
                {formatBytes(item.fileSize)}
                {item.storage === "link" ? " · link" : ""}
              </p>
            </div>
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
                aria-label="Open attachment"
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null}
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => deleteMutation.mutate(item.id)}
                aria-label="Delete attachment"
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </li>
        ))}
      </ul>

      {canEdit ? (
        <>
          <form
            className="mt-3 grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              if (!linkUrl.trim()) return;
              linkMutation.mutate();
            }}
          >
            <Input
              value={linkName}
              onChange={(event) => setLinkName(event.target.value)}
              placeholder="Label"
              className="h-10"
            />
            <Input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              placeholder="https://…"
              type="url"
              className="h-10"
            />
            <Button
              type="submit"
              variant="secondary"
              className="h-10 gap-1.5"
              disabled={!linkUrl.trim() || linkMutation.isPending}
            >
              <Paperclip className="size-3.5" />
              Add link
            </Button>
          </form>

          {error ? <p className="mt-2 text-xs text-destructive">{error}</p> : null}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Uploads up to 2MB are stored with your note. Larger files: paste a link.
          </p>
        </>
      ) : null}
    </section>
  );
}
