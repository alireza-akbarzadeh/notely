import { and, asc, eq, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db, reminders } from "@/lib/db";
import type { ReminderSound } from "@/lib/notifications/sounds";

export type ReminderStatus = "pending" | "fired" | "dismissed" | "cancelled";

function serializeReminder(row: typeof reminders.$inferSelect) {
  return {
    id: row.id,
    userId: row.userId,
    noteId: row.noteId,
    eventId: row.eventId,
    title: row.title,
    body: row.body,
    remindAt: row.remindAt.toISOString(),
    sound: row.sound as ReminderSound,
    status: row.status as ReminderStatus,
    firedAt: row.firedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export type ReminderSummary = ReturnType<typeof serializeReminder>;

export async function listReminders(
  userId: string,
  options?: {
    status?: ReminderStatus;
    from?: Date;
    to?: Date;
    noteId?: string;
  },
) {
  const conditions = [eq(reminders.userId, userId)];
  if (options?.status) conditions.push(eq(reminders.status, options.status));
  if (options?.noteId) conditions.push(eq(reminders.noteId, options.noteId));
  if (options?.from) conditions.push(gte(reminders.remindAt, options.from));
  if (options?.to) conditions.push(lte(reminders.remindAt, options.to));

  const rows = await db
    .select()
    .from(reminders)
    .where(and(...conditions))
    .orderBy(asc(reminders.remindAt));

  return rows.map(serializeReminder);
}

export async function createReminder(
  userId: string,
  input: {
    title: string;
    body?: string | null;
    remindAt: Date;
    sound?: ReminderSound;
    noteId?: string | null;
    eventId?: string | null;
  },
) {
  if (!input.noteId && !input.eventId) {
    throw new Error("Reminder must link to a note or event");
  }

  const id = randomUUID();
  const now = new Date();
  await db.insert(reminders).values({
    id,
    userId,
    noteId: input.noteId ?? null,
    eventId: input.eventId ?? null,
    title: input.title,
    body: input.body ?? null,
    remindAt: input.remindAt,
    sound: input.sound ?? "chime",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  const [row] = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, id))
    .limit(1);
  return serializeReminder(row!);
}

export async function updateReminder(
  userId: string,
  reminderId: string,
  input: {
    title?: string;
    body?: string | null;
    remindAt?: Date;
    sound?: ReminderSound;
    status?: ReminderStatus;
  },
) {
  const [existing] = await db
    .select()
    .from(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)))
    .limit(1);
  if (!existing) return null;

  const now = new Date();
  const nextStatus = input.status ?? existing.status;
  const nextFiredAt =
    nextStatus === "fired"
      ? existing.firedAt ?? now
      : nextStatus === "pending"
        ? null
        : existing.firedAt;
  await db
    .update(reminders)
    .set({
      title: input.title ?? existing.title,
      body: input.body !== undefined ? input.body : existing.body,
      remindAt: input.remindAt ?? existing.remindAt,
      sound: input.sound ?? existing.sound,
      status: nextStatus,
      firedAt: nextFiredAt,
      updatedAt: now,
    })
    .where(eq(reminders.id, reminderId));

  const [row] = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, reminderId))
    .limit(1);
  return serializeReminder(row!);
}

export async function deleteReminder(userId: string, reminderId: string) {
  const [existing] = await db
    .select()
    .from(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)))
    .limit(1);
  if (!existing) return false;
  await db.delete(reminders).where(eq(reminders.id, reminderId));
  return true;
}

/** Due reminders across all users (for push dispatch cron). */
export async function listDueReminders(now = new Date(), limit = 100) {
  const rows = await db
    .select()
    .from(reminders)
    .where(
      and(eq(reminders.status, "pending"), lte(reminders.remindAt, now)),
    )
    .orderBy(asc(reminders.remindAt))
    .limit(limit);

  return rows.map(serializeReminder);
}

export async function markReminderFired(reminderId: string) {
  const now = new Date();
  await db
    .update(reminders)
    .set({ status: "fired", firedAt: now, updatedAt: now })
    .where(
      and(eq(reminders.id, reminderId), eq(reminders.status, "pending")),
    );
}

export async function listUpcomingPending(
  userId: string,
  withinMs = 24 * 60 * 60 * 1000,
) {
  const now = new Date();
  const to = new Date(now.getTime() + withinMs);
  return listReminders(userId, {
    status: "pending",
    from: new Date(now.getTime() - 60_000),
    to,
  });
}

export async function cancelRemindersForEvent(userId: string, eventId: string) {
  const now = new Date();
  await db
    .update(reminders)
    .set({ status: "cancelled", updatedAt: now })
    .where(
      and(
        eq(reminders.userId, userId),
        eq(reminders.eventId, eventId),
        eq(reminders.status, "pending"),
      ),
    );
}

export async function getRemindersForNote(userId: string, noteId: string) {
  return listReminders(userId, { noteId, status: "pending" });
}
