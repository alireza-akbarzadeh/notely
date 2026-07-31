import { and, asc, eq, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db, events } from "@/lib/db";

function serializeEvent(row: typeof events.$inferSelect) {
  return {
    id: row.id,
    userId: row.userId,
    title: row.title,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime?.toISOString() ?? null,
    link: row.link,
    noteId: row.noteId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listEvents(
  userId: string,
  options?: { from?: Date; to?: Date },
) {
  const conditions = [eq(events.userId, userId)];
  if (options?.from) conditions.push(gte(events.startTime, options.from));
  if (options?.to) conditions.push(lte(events.startTime, options.to));

  const rows = await db
    .select()
    .from(events)
    .where(and(...conditions))
    .orderBy(asc(events.startTime));

  return rows.map(serializeEvent);
}

export async function createEvent(
  userId: string,
  input: {
    title: string;
    startTime: Date;
    endTime?: Date | null;
    link?: string | null;
    noteId?: string | null;
  },
) {
  const id = randomUUID();
  const now = new Date();
  await db.insert(events).values({
    id,
    userId,
    title: input.title,
    startTime: input.startTime,
    endTime: input.endTime ?? null,
    link: input.link ?? null,
    noteId: input.noteId ?? null,
    createdAt: now,
    updatedAt: now,
  });
  const [row] = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return serializeEvent(row!);
}

export async function deleteEvent(userId: string, eventId: string) {
  const [existing] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.userId, userId)))
    .limit(1);
  if (!existing) return false;
  await db.delete(events).where(eq(events.id, eventId));
  return true;
}
