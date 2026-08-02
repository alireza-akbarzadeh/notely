"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { readJson } from "@/lib/api/read-json";
import { authClient } from "@/lib/auth/client";
import { playReminderSound } from "@/lib/notifications/sound-player";
import { registerNotelyServiceWorker } from "@/lib/notifications/push-client";
import type { ReminderSound } from "@/lib/notifications/sounds";

type Reminder = {
  id: string;
  title: string;
  body: string | null;
  remindAt: string;
  sound: ReminderSound;
  noteId: string | null;
  eventId: string | null;
  status: string;
};

const firedLocally = new Set<string>();

function reminderUrl(reminder: Reminder) {
  if (reminder.noteId) return `/notes/${reminder.noteId}`;
  if (reminder.eventId) return "/plans";
  return "/workspace";
}

async function ackReminder(id: string) {
  await fetch(`/api/reminders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "fired" }),
  });
}

async function presentReminder(reminder: Reminder) {
  if (firedLocally.has(reminder.id)) return;
  firedLocally.add(reminder.id);

  void playReminderSound(reminder.sound);

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      const registration = await navigator.serviceWorker?.ready;
      const options: NotificationOptions = {
        body: reminder.body ?? "Reminder from Notely",
        tag: `reminder-${reminder.id}`,
        data: { url: reminderUrl(reminder) },
      };
      if (registration) {
        await registration.showNotification(reminder.title, options);
      } else {
        new Notification(reminder.title, options);
      }
    } catch {
      // Notification may fail in some browsers without focus; sound still played.
    }
  }

  await ackReminder(reminder.id);
}

export function ReminderRuntime() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const timersRef = useRef<Map<string, number>>(new Map());
  const dueAtRef = useRef<Map<string, number>>(new Map());

  const remindersQuery = useQuery({
    queryKey: ["reminders", "pending", "runtime"],
    enabled: Boolean(session?.user),
    refetchInterval: 60_000,
    queryFn: async (): Promise<Reminder[]> => {
      const from = new Date(Date.now() - 60_000).toISOString();
      const to = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const data = await readJson<{ reminders: Reminder[] }>(
        await fetch(
          `/api/reminders?status=pending&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        ),
        "Failed to load reminders",
      );
      return data.reminders;
    },
  });

  useEffect(() => {
    if (!session?.user) return;
    void registerNotelyServiceWorker().catch(() => undefined);
  }, [session?.user]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const type = event.data?.type;
      if (type === "notely-reminder" && event.data?.payload) {
        const payload = event.data.payload as {
          sound?: string;
          reminderId?: string;
        };
        if (payload.sound) void playReminderSound(payload.sound);
        if (payload.reminderId) firedLocally.add(payload.reminderId);
      }
      if (type === "notely-open" && typeof event.data?.url === "string") {
        router.push(event.data.url);
      }
    }
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, [router]);

  useEffect(() => {
    const reminders = remindersQuery.data ?? [];
    const timers = timersRef.current;
    const dueAt = dueAtRef.current;

    for (const [id, handle] of timers) {
      const stillPending = reminders.find((r) => r.id === id);
      const nextDue = stillPending
        ? new Date(stillPending.remindAt).getTime()
        : null;
      if (!stillPending || dueAt.get(id) !== nextDue) {
        window.clearTimeout(handle);
        timers.delete(id);
        dueAt.delete(id);
      }
    }

    for (const reminder of reminders) {
      if (firedLocally.has(reminder.id)) continue;
      const due = new Date(reminder.remindAt).getTime();
      if (timers.has(reminder.id)) continue;

      const delay = due - Date.now();
      if (delay <= 0) {
        void presentReminder(reminder);
        continue;
      }
      if (delay > 24 * 60 * 60 * 1000) continue;
      const handle = window.setTimeout(() => {
        timers.delete(reminder.id);
        dueAt.delete(reminder.id);
        void presentReminder(reminder);
      }, delay);
      timers.set(reminder.id, handle);
      dueAt.set(reminder.id, due);
    }
  }, [remindersQuery.data]);

  useEffect(() => {
    const timers = timersRef.current;
    const dueAt = dueAtRef.current;
    return () => {
      for (const handle of timers.values()) window.clearTimeout(handle);
      timers.clear();
      dueAt.clear();
    };
  }, []);

  return null;
}
