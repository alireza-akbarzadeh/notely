"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Check,
  ExternalLink,
  FileText,
  Link2,
  ListTodo,
  Paperclip,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NoteAttachment, NoteTask } from "@/types/notes";

type PendingReminder = {
  id: string;
  remindAt: string;
  sound: string;
};

type EditorNoteExtrasProps = {
  noteId: string;
  editorContent: string;
  canEdit: boolean;
  editorFocused: boolean;
  onOpenChecklist: () => void;
  onOpenResources: () => void;
  onOpenReminder: () => void;
};

function formatReminderAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isImageAttachment(item: NoteAttachment) {
  if (item.mimeType.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(item.fileName);
}

export function EditorNoteExtras({
  noteId,
  editorContent,
  canEdit,
  editorFocused,
  onOpenChecklist,
  onOpenResources,
  onOpenReminder,
}: EditorNoteExtrasProps) {
  const tasksQuery = useQuery({
    queryKey: ["tasks", noteId],
    queryFn: async (): Promise<{ tasks: NoteTask[] }> => {
      const response = await fetch(
        `/api/tasks?noteId=${encodeURIComponent(noteId)}`,
      );
      if (!response.ok) throw new Error("Failed to load tasks");
      return response.json();
    },
  });

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

  const remindersQuery = useQuery({
    queryKey: ["reminders", "note", noteId],
    queryFn: async (): Promise<PendingReminder[]> => {
      const response = await fetch(
        `/api/reminders?noteId=${encodeURIComponent(noteId)}&status=pending`,
      );
      if (!response.ok) throw new Error("Failed to load reminders");
      const data = await response.json();
      return data.reminders as PendingReminder[];
    },
  });

  const tasks = tasksQuery.data?.tasks ?? [];
  const attachments = attachmentsQuery.data?.attachments ?? [];
  const reminders = remindersQuery.data ?? [];
  const nextReminder = reminders[0] ?? null;
  const doneCount = tasks.filter((task) => task.isCompleted).length;
  const visibleAttachments = attachments.filter(
    (item) => !editorContent.includes(`data-attachment-id="${item.id}"`),
  );
  const imageAttachments = visibleAttachments.filter(
    (item) => isImageAttachment(item) && item.url,
  );
  const otherAttachments = visibleAttachments.filter(
    (item) => !isImageAttachment(item) || !item.url,
  );

  return (
    <div
      className={cn(
        "mt-8 space-y-3 font-sans transition-[opacity,box-shadow] duration-200",
        editorFocused ? "opacity-100" : "opacity-85",
      )}
    >
      <section
        className={cn(
          "rounded-xl border border-border/70 bg-card/30 p-3 transition-shadow",
          editorFocused && "ring-1 ring-primary/25",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListTodo className="size-4 text-primary" />
            Checklist
            {tasks.length > 0 ? (
              <span className="text-xs font-normal text-muted-foreground">
                {doneCount}/{tasks.length}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onOpenChecklist}
          >
            {canEdit ? "Manage" : "View"}
          </Button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No tasks yet
            {canEdit ? " — open Manage to add some." : "."}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {tasks.slice(0, 6).map((task) => (
              <li
                key={task.id}
                className="flex items-start gap-2 text-sm leading-snug"
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border",
                    task.isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-transparent",
                  )}
                >
                  <Check className="size-3" />
                </span>
                <span
                  className={cn(
                    task.isCompleted && "text-muted-foreground line-through",
                  )}
                >
                  {task.text}
                </span>
              </li>
            ))}
            {tasks.length > 6 ? (
              <li className="text-xs text-muted-foreground">
                +{tasks.length - 6} more
              </li>
            ) : null}
          </ul>
        )}
      </section>

      <section
        className={cn(
          "rounded-xl border border-border/70 bg-card/30 p-3 transition-shadow",
          editorFocused && "ring-1 ring-primary/25",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Paperclip className="size-4 text-primary" />
            Resources
            {visibleAttachments.length > 0 ? (
              <span className="text-xs font-normal text-muted-foreground">
                {visibleAttachments.length}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onOpenResources}
          >
            {canEdit ? "Manage" : "View"}
          </Button>
        </div>

        {visibleAttachments.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {attachments.length > 0
              ? "Inline images are displayed in the note."
              : `No files or links yet${canEdit ? " — open Manage to upload." : "."}`}
          </p>
        ) : (
          <div className="space-y-3">
            {imageAttachments.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {imageAttachments.map((item) => (
                  <li key={item.id} className="min-w-0">
                    <a
                      href={item.url!}
                      target="_blank"
                      rel="noreferrer"
                      className="group block overflow-hidden rounded-lg border border-border/60 bg-muted/20"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url!}
                        alt={item.fileName}
                        className="max-h-64 w-full object-contain bg-black/20"
                        loading="lazy"
                      />
                      <span className="flex items-center gap-1.5 truncate px-2.5 py-1.5 text-xs text-muted-foreground group-hover:text-foreground">
                        <span className="min-w-0 flex-1 truncate">
                          {item.fileName}
                        </span>
                        <ExternalLink className="size-3 shrink-0 opacity-60" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {otherAttachments.length > 0 ? (
              <ul className="space-y-1.5">
                {otherAttachments.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {item.storage === "link" ? (
                        <Link2 className="size-3.5" />
                      ) : (
                        <FileText className="size-3.5" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                      {item.fileName}
                    </span>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1 text-muted-foreground hover:text-foreground"
                        aria-label={`Open ${item.fileName}`}
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : null}
                  </li>
                ))}
                {otherAttachments.length > 5 ? (
                  <li className="text-xs text-muted-foreground">
                    +{otherAttachments.length - 5} more
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        )}
      </section>

      <section
        className={cn(
          "rounded-xl border border-border/70 bg-card/30 p-3 transition-shadow",
          editorFocused && "ring-1 ring-primary/25",
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Bell className="size-4 text-primary" />
            Notify
            {reminders.length > 0 ? (
              <span className="text-xs font-normal text-muted-foreground">
                {reminders.length}
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={onOpenReminder}
          >
            {canEdit ? (nextReminder ? "Manage" : "Set time") : "View"}
          </Button>
        </div>

        {nextReminder ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {formatReminderAt(nextReminder.remindAt)}
            </p>
            <p className="text-xs text-muted-foreground">
              {reminders.length > 1
                ? `+${reminders.length - 1} more scheduled`
                : "Sound alert when this time arrives."}
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No reminder yet
            {canEdit
              ? " — set a date and time to get notified."
              : "."}
          </p>
        )}
      </section>
    </div>
  );
}
