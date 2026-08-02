"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, FileText, Link2, Paperclip, Trash2, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
<<<<<<< HEAD
import { realtimeHeaders } from "@/lib/realtime/client-id";
=======
import { readJson } from "@/lib/api/read-json";
>>>>>>> refs/remotes/origin/main
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

function isImageAttachment(item: NoteAttachment) {
  if (item.mimeType.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(item.fileName);
}

export function NoteResources({ noteId, canEdit = true }: NoteResourcesProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canEdit) return;
    function openPicker() {
      fileInputRef.current?.click();
    }
    window.addEventListener("notely:attach-file", openPicker);
    return () => window.removeEventListener("notely:attach-file", openPicker);
  }, [canEdit]);

  const attachmentsQuery = useQuery({
    queryKey: ["attachments", noteId],
    queryFn: async (): Promise<{ attachments: NoteAttachment[] }> =>
      readJson<{ attachments: NoteAttachment[] }>(
        await fetch(`/api/attachments?noteId=${encodeURIComponent(noteId)}`),
        "Failed to load attachments",
      ),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.set("noteId", noteId);
      form.set("file", file);
      const response = await fetch("/api/attachments", {
        method: "POST",
        headers: realtimeHeaders(),
        body: form,
      });
      const data = await readJson<{ attachment: NoteAttachment }>(
        response,
        "Upload failed",
      );
      return data.attachment;
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
        headers: realtimeHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          noteId,
          fileName: linkName.trim() || "Link",
          url: linkUrl.trim(),
        }),
      });
      const data = await readJson<{ attachment: NoteAttachment }>(
        response,
        "Failed to add link",
      );
      return data.attachment;
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
<<<<<<< HEAD
      const response = await fetch(`/api/attachments/${id}`, {
        method: "DELETE",
        headers: realtimeHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete");
=======
      const response = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
      await readJson(response, "Failed to delete");
>>>>>>> refs/remotes/origin/main
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", noteId] });
    },
  });

  const items: NoteAttachment[] = attachmentsQuery.data?.attachments ?? [];

  return (
<<<<<<< HEAD
    <section
      id="note-resources"
      className="mb-8 rounded-2xl border border-border/80 bg-card/40 p-4"
    >
=======
    <section className="rounded-2xl border border-border/80 bg-card/40 p-4">
>>>>>>> refs/remotes/origin/main
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
        {items.map((item) => {
          const showImage = isImageAttachment(item) && item.url;
          return (
            <li
              key={item.id}
              className="overflow-hidden rounded-xl border border-border/70 bg-background/40"
            >
              {showImage ? (
                <a
                  href={item.url!}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-black/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url!}
                    alt={item.fileName}
                    className="max-h-48 w-full object-contain"
                    loading="lazy"
                  />
                </a>
              ) : null}
              <div className="flex items-center gap-3 px-3 py-2.5">
                {!showImage ? (
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground">
                    {item.storage === "link" ? (
                      <Link2 className="size-4" />
                    ) : (
                      <FileText className="size-4" />
                    )}
                  </div>
                ) : null}
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
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "size-8",
                    )}
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
              </div>
            </li>
          );
        })}
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
