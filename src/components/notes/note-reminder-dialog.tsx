"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  REMINDER_SOUND_LABELS,
  REMINDER_SOUNDS,
  type ReminderSound,
} from "@/lib/notifications/sounds";
import { playReminderSound } from "@/lib/notifications/sound-player";
import { ensureNotificationPermission } from "@/lib/notifications/push-client";
import { cn } from "@/lib/utils";

type Reminder = {
  id: string;
  title: string;
  body: string | null;
  remindAt: string;
  sound: ReminderSound;
  status: string;
};

type NoteReminderDialogProps = {
  noteId: string;
  noteTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
};

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function defaultRemindAt() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  d.setSeconds(0, 0);
  return d;
}

export function NoteReminderDialog({
  noteId,
  noteTitle,
  open,
  onOpenChange,
  canEdit,
}: NoteReminderDialogProps) {
  const queryClient = useQueryClient();
  const [remindAt, setRemindAt] = useState(() =>
    toLocalInputValue(defaultRemindAt()),
  );
  const [sound, setSound] = useState<ReminderSound>("chime");
  const [error, setError] = useState<string | null>(null);

  const remindersQuery = useQuery({
    queryKey: ["reminders", "note", noteId],
    enabled: open,
    queryFn: async (): Promise<Reminder[]> => {
      const response = await fetch(
        `/api/reminders?noteId=${encodeURIComponent(noteId)}&status=pending`,
      );
      if (!response.ok) throw new Error("Failed to load reminders");
      const data = await response.json();
      return data.reminders as Reminder[];
    },
  });

  const pending = useMemo(
    () => remindersQuery.data ?? [],
    [remindersQuery.data],
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      const at = new Date(remindAt);
      if (Number.isNaN(at.getTime())) throw new Error("Invalid date/time");
      if (at.getTime() < Date.now() - 30_000) {
        throw new Error("Pick a time in the future");
      }
      await ensureNotificationPermission();
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle.trim() || "Untitled note",
          body: "Time to revisit this note",
          remindAt: at.toISOString(),
          sound,
          noteId,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to set reminder");
      return data.reminder as Reminder;
    },
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      onOpenChange(false);
    },
    onError: (err: Error) => setError(err.message),
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/reminders/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to cancel");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="size-4" />
            Remind me
          </DialogTitle>
          <DialogDescription>
            Get a sound alert and notification when this time arrives — even if
            you leave the note.
          </DialogDescription>
        </DialogHeader>

        {pending.length > 0 ? (
          <ul className="space-y-2 rounded-lg border border-border/70 bg-muted/30 p-3">
            {pending.map((reminder) => (
              <li
                key={reminder.id}
                className="flex items-start justify-between gap-2 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {new Date(reminder.remindAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Sound: {REMINDER_SOUND_LABELS[reminder.sound]}
                  </p>
                </div>
                {canEdit ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 gap-1 text-muted-foreground"
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate(reminder.id)}
                  >
                    <BellOff className="size-3.5" />
                    Cancel
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {canEdit ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="remind-at">Date & time</Label>
              <Input
                id="remind-at"
                type="datetime-local"
                value={remindAt}
                onChange={(e) => setRemindAt(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Alert sound</Label>
              <div className="grid grid-cols-2 gap-2">
                {REMINDER_SOUNDS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setSound(value);
                      if (value !== "none") void playReminderSound(value);
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                      sound === value
                        ? "border-primary/60 bg-primary/10"
                        : "border-border/80 hover:bg-accent/50",
                    )}
                  >
                    {REMINDER_SOUND_LABELS[value]}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <p className="text-xs text-destructive">{error}</p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You can view reminders, but only editors can change them.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {canEdit ? (
            <Button
              type="button"
              disabled={createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              {createMutation.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                "Set reminder"
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
