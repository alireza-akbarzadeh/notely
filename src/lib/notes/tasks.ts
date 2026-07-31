import { and, asc, desc, eq, max } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db, notes, tasks } from "@/lib/db";
import type {
  CreateTaskValues,
  UpdateTaskValues,
} from "@/lib/validations/notes";

function serializeTask(row: typeof tasks.$inferSelect) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function assertNoteOwned(userId: string, noteId: string) {
  const [note] = await db
    .select({ id: notes.id })
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
    .limit(1);
  return Boolean(note);
}

export async function listTasksForNote(userId: string, noteId: string) {
  const owned = await assertNoteOwned(userId, noteId);
  if (!owned) return null;

  const rows = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.noteId, noteId), eq(tasks.userId, userId)))
    .orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

  return rows.map(serializeTask);
}

export async function createTask(userId: string, input: CreateTaskValues) {
  const owned = await assertNoteOwned(userId, input.noteId);
  if (!owned) throw new Error("Note not found");

  const [agg] = await db
    .select({ maxOrder: max(tasks.sortOrder) })
    .from(tasks)
    .where(and(eq(tasks.noteId, input.noteId), eq(tasks.userId, userId)));

  const id = randomUUID();
  const now = new Date();
  await db.insert(tasks).values({
    id,
    noteId: input.noteId,
    userId,
    text: input.text ?? "",
    isCompleted: false,
    sortOrder: (agg?.maxOrder ?? -1) + 1,
    createdAt: now,
    updatedAt: now,
  });

  const [row] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return serializeTask(row!);
}

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskValues,
) {
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .limit(1);
  if (!existing) return null;

  await db
    .update(tasks)
    .set({
      ...(input.text !== undefined ? { text: input.text } : {}),
      ...(input.isCompleted !== undefined
        ? { isCompleted: input.isCompleted }
        : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));

  const [row] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  return serializeTask(row!);
}

export async function deleteTask(userId: string, taskId: string) {
  const [existing] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
    .limit(1);
  if (!existing) return false;

  await db.delete(tasks).where(eq(tasks.id, taskId));
  return true;
}

export async function listIncompleteTasks(userId: string, limit = 20) {
  const rows = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.isCompleted, false)))
    .orderBy(desc(tasks.updatedAt))
    .limit(limit);

  return rows.map(serializeTask);
}
