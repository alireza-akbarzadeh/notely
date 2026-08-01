"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

export type PendingReminder = {
  id: string;
  noteId: string | null;
  title: string;
  remindAt: string;
  createdAt: string;
};

async function fetchPendingReminders(): Promise<PendingReminder[]> {
  const response = await fetch("/api/reminders?status=pending");
  if (!response.ok) throw new Error("Failed to load reminders");
  const data = await response.json();
  return data.reminders as PendingReminder[];
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
