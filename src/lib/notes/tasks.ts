import { and, asc, desc, eq, max } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db, tasks } from "@/lib/db";
import { requireNoteAccess } from "@/lib/notes/access";
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

export async function listTasksForNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access) return null;

  const rows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.noteId, noteId))
    .orderBy(asc(tasks.sortOrder), asc(tasks.createdAt));

  return rows.map(serializeTask);
}

export async function listTasks(userId: string) {
  const rows = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(asc(tasks.sortOrder), desc(tasks.updatedAt));

  return rows.map(serializeTask);
}

export async function createTask(userId: string, input: CreateTaskValues) {
  if (input.noteId) {
    const access = await requireNoteAccess(userId, input.noteId, "edit");
    if (!access) throw new Error("Note not found");
  }

  const [agg] = await db
    .select({ maxOrder: max(tasks.sortOrder) })
    .from(tasks)
    .where(eq(tasks.userId, userId));

  const id = randomUUID();
  const now = new Date();
  await db.insert(tasks).values({
    id,
    noteId: input.noteId ?? null,
    userId,
    text: input.text ?? "",
    status: input.status ?? "todo",
    isCompleted: (input.status ?? "todo") === "done",
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
    .where(eq(tasks.id, taskId))
    .limit(1);
  if (!existing) return null;

  if (existing.noteId) {
    const access = await requireNoteAccess(userId, existing.noteId, "edit");
    if (!access) return null;
  } else if (existing.userId !== userId) {
    return null;
  }

  const nextStatus =
    input.status ??
    (input.isCompleted === true
      ? "done"
      : input.isCompleted === false
        ? "todo"
        : undefined);

  await db
    .update(tasks)
    .set({
      ...(input.text !== undefined ? { text: input.text } : {}),
      ...(nextStatus !== undefined
        ? { status: nextStatus, isCompleted: nextStatus === "done" }
        : input.isCompleted !== undefined
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
    .where(eq(tasks.id, taskId))
    .limit(1);
  if (!existing) return false;

  if (existing.noteId) {
    const access = await requireNoteAccess(userId, existing.noteId, "edit");
    if (!access) return false;
  } else if (existing.userId !== userId) {
    return false;
  }

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
