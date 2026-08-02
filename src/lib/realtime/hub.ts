import { and, eq } from "drizzle-orm";

import { db, noteShares, notes } from "@/lib/db";
import type { RealtimeEvent, RealtimePublishInput } from "@/lib/realtime/types";

type Listener = (event: RealtimeEvent) => void;

const listenersByUser = new Map<string, Set<Listener>>();

export function subscribe(userId: string, listener: Listener) {
  let set = listenersByUser.get(userId);
  if (!set) {
    set = new Set();
    listenersByUser.set(userId, set);
  }
  set.add(listener);
  return () => {
    set!.delete(listener);
    if (set!.size === 0) listenersByUser.delete(userId);
  };
}

export function publishToUsers(userIds: string[], event: RealtimeEvent) {
  const unique = [...new Set(userIds.filter(Boolean))];
  for (const userId of unique) {
    const set = listenersByUser.get(userId);
    if (!set) continue;
    for (const listener of set) {
      try {
        listener(event);
      } catch {
        // Ignore broken listeners; unsubscribe happens on stream close.
      }
    }
  }
}

export async function recipientUserIdsForNote(noteId: string) {
  const [note] = await db
    .select({ userId: notes.userId })
    .from(notes)
    .where(eq(notes.id, noteId))
    .limit(1);
  if (!note) return [] as string[];

  const shares = await db
    .select({ userId: noteShares.userId })
    .from(noteShares)
    .where(
      and(eq(noteShares.noteId, noteId), eq(noteShares.status, "accepted")),
    );

  return [
    note.userId,
    ...shares.map((row) => row.userId).filter((id): id is string => Boolean(id)),
  ];
}

export async function publishNoteEvent(input: RealtimePublishInput) {
  const event: RealtimeEvent = {
    type: input.type,
    noteId: input.noteId,
    actorUserId: input.actorUserId,
    clientId: input.clientId ?? null,
    at: new Date().toISOString(),
  };

  // For deletes the note row may already be gone — still notify the actor at least.
  let recipients = await recipientUserIdsForNote(input.noteId);
  if (recipients.length === 0) {
    recipients = [input.actorUserId];
  }

  publishToUsers(recipients, event);
  return event;
}

/** Use when recipients were resolved before a delete. */
export function publishNoteEventToUsers(
  userIds: string[],
  input: RealtimePublishInput,
) {
  const event: RealtimeEvent = {
    type: input.type,
    noteId: input.noteId,
    actorUserId: input.actorUserId,
    clientId: input.clientId ?? null,
    at: new Date().toISOString(),
  };
  const recipients =
    userIds.length > 0 ? userIds : [input.actorUserId];
  publishToUsers(recipients, event);
  return event;
}
