"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { readJson } from "@/lib/api/read-json";

export type PendingReminder = {
  id: string;
  noteId: string | null;
  title: string;
  remindAt: string;
  createdAt: string;
};

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

async function fetchPendingReminders(): Promise<PendingReminder[]> {
  const data = await readJson<{ reminders: PendingReminder[] }>(
    await fetch("/api/reminders?status=pending"),
    "Failed to load reminders",
  );
  return data.reminders;
}

/** Soonest pending reminder per note, keyed by note id. */
export function useNoteReminders(enabled = true) {
  const query = useQuery({
    queryKey: ["reminders", "pending", "by-note"],
    enabled,
    refetchInterval: 60_000,
    queryFn: fetchPendingReminders,
  });

  return useMemo(() => {
    const byNote = new Map<string, PendingReminder>();
    for (const reminder of query.data ?? []) {
      if (!reminder.noteId) continue;
      const current = byNote.get(reminder.noteId);
      if (
        !current ||
        Date.parse(reminder.remindAt) < Date.parse(current.remindAt)
      ) {
        byNote.set(reminder.noteId, reminder);
      }
    }
    return byNote;
  }, [query.data]);
}

/** Note ids with a pending reminder due sometime today (local timezone). */
export function useNoteIdsWithReminderDueToday(enabled = true) {
  const query = useQuery({
    queryKey: ["reminders", "pending", "by-note"],
    enabled,
    refetchInterval: 60_000,
    queryFn: fetchPendingReminders,
  });

  return useMemo(() => {
    const ids = new Set<string>();
    const today = new Date();
    for (const reminder of query.data ?? []) {
      if (!reminder.noteId) continue;
      if (isSameLocalDay(new Date(reminder.remindAt), today)) {
        ids.add(reminder.noteId);
      }
    }
    return ids;
  }, [query.data]);
}

export { isSameLocalDay };
