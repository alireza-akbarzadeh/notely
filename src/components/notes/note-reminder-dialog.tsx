"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, LoaderCircle, Volume2, VolumeX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

function defaultRemindAt() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 30);
  d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);
  return d;
}

function withTime(base: Date, hours: number, minutes = 0) {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function formatFromNow(target: Date) {
  const diffMinutes = Math.round((target.getTime() - Date.now()) / 60_000);
  const format = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (Math.abs(diffMinutes) < 60) return format.format(diffMinutes, "minute");
  if (Math.abs(diffMinutes) < 60 * 24) {
    return format.format(Math.round(diffMinutes / 60), "hour");
  }
  return format.format(Math.round(diffMinutes / (60 * 24)), "day");
}

const QUICK_PRESETS: {
  label: string;
  build: () => Date;
}[] = [
  {
    label: "In 15 min",
    build: () => {
      const d = new Date();
      d.setMinutes(d.getMinutes() + 15, 0, 0);
      return d;
    },
  },
  {
    label: "In 1 hour",
    build: () => {
      const d = new Date();
      d.setHours(d.getHours() + 1, d.getMinutes(), 0, 0);
      return d;
    },
  },
  {
    label: "Tonight 8pm",
    build: () => {
      const d = withTime(new Date(), 20);
      if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
      return d;
    },
  },
  {
    label: "Tomorrow 9am",
    build: () => {
      const d = withTime(new Date(), 9);
      d.setDate(d.getDate() + 1);
      return d;
    },
  },
];

export function NoteReminderDialog({
  noteId,
  noteTitle,
  open,
  onOpenChange,
  canEdit,
}: NoteReminderDialogProps) {
  const queryClient = useQueryClient();
  const [remindAt, setRemindAt] = useState<Date>(() => defaultRemindAt());
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
      if (Number.isNaN(remindAt.getTime())) throw new Error("Invalid date/time");
      if (remindAt.getTime() < Date.now() - 30_000) {
        throw new Error("Pick a time in the future");
      }
      await ensureNotificationPermission();
      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noteTitle.trim() || "Untitled note",
          body: "Time to revisit this note",
          remindAt: remindAt.toISOString(),
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
      setRemindAt(defaultRemindAt());
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setRemindAt(defaultRemindAt());
          setError(null);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
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
          <div className="grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div className="space-y-1.5">
              <Label>Date & time</Label>
              <DateTimePicker
                value={remindAt}
                onChange={setRemindAt}
                minDate={new Date()}
                className="w-full sm:w-fit"
              />
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5">
                <p className="text-xs text-muted-foreground">Alerting</p>
                <p className="mt-0.5 font-medium">
                  {remindAt.toLocaleString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFromNow(remindAt)}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Quick pick</Label>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="justify-start font-normal"
                      onClick={() => setRemindAt(preset.build())}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Alert sound</Label>
                <div className="grid grid-cols-2 gap-2">
                  {REMINDER_SOUNDS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={sound === value}
                      onClick={() => {
                        setSound(value);
                        if (value !== "none") void playReminderSound(value);
                      }}
                      className={cn(
                        "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        sound === value
                          ? "border-primary/60 bg-primary/10"
                          : "border-border/80 hover:bg-accent/50",
                      )}
                    >
                      {value === "none" ? (
                        <VolumeX className="size-3.5 shrink-0 text-muted-foreground" />
                      ) : (
                        <Volume2
                          className={cn(
                            "size-3.5 shrink-0",
                            sound === value
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                      )}
                      <span className="truncate">
                        {REMINDER_SOUND_LABELS[value]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : null}
            </div>
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
