"use client";

import { useState } from "react";

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

type CalendarEventDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startAt: Date | null;
  pending?: boolean;
  onSubmit: (values: {
    title: string;
    remindMinutesBefore: number | null;
  }) => void;
};

export function CalendarEventDialog({
  open,
  onOpenChange,
  startAt,
  pending = false,
  onSubmit,
}: CalendarEventDialogProps) {
  const [title, setTitle] = useState("New event");
  const [remindMinutes, setRemindMinutes] = useState("0");

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;

    const raw = remindMinutes.trim();
    const remindMinutesBefore =
      raw === "" ? null : Number.parseInt(raw, 10);

    onSubmit({
      title: trimmed,
      remindMinutesBefore: Number.isFinite(remindMinutesBefore)
        ? remindMinutesBefore
        : null,
    });
  }

  const whenLabel = startAt
    ? startAt.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
          <DialogDescription>
            {whenLabel
              ? `Scheduled for ${whenLabel}.`
              : "Add a title and optional reminder."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-1">
          <div className="grid gap-1.5">
            <Label htmlFor="calendar-event-title">Title</Label>
            <Input
              id="calendar-event-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="New event"
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="calendar-event-remind">
              Remind me (minutes before)
            </Label>
            <Input
              id="calendar-event-remind"
              type="number"
              min={0}
              value={remindMinutes}
              onChange={(event) => setRemindMinutes(event.target.value)}
              placeholder="0 = at start, blank = no reminder"
            />
            <p className="text-[11px] text-muted-foreground">
              Use 0 for an alert at the start, or leave blank for no reminder.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!title.trim() || pending}
            onClick={handleSubmit}
          >
            {pending ? "Creating…" : "Create event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
