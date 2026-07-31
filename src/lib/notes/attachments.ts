import { and, asc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { attachments, db, notes } from "@/lib/db";
import type { CreateLinkAttachmentValues } from "@/lib/validations/notes";

/** Soft limit for DB-backed uploads (base64 in Postgres). */
export const MAX_DB_ATTACHMENT_BYTES = 2 * 1024 * 1024;

function serializeAttachment(
  row: typeof attachments.$inferSelect,
  options?: { includeData?: boolean },
) {
  return {
    id: row.id,
    noteId: row.noteId,
    userId: row.userId,
    fileName: row.fileName,
    fileSize: row.fileSize,
    mimeType: row.mimeType,
    storage: row.storage,
    url:
      row.storage === "db"
        ? `/api/attachments/${row.id}/file`
        : (row.url ?? null),
    createdAt: row.createdAt.toISOString(),
    ...(options?.includeData ? { data: row.data } : {}),
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

export async function listAttachmentsForNote(userId: string, noteId: string) {
  const owned = await assertNoteOwned(userId, noteId);
  if (!owned) return null;

  const rows = await db
    .select()
    .from(attachments)
    .where(and(eq(attachments.noteId, noteId), eq(attachments.userId, userId)))
    .orderBy(asc(attachments.createdAt));

  return rows.map((row) => serializeAttachment(row));
}

export async function createLinkAttachment(
  userId: string,
  input: CreateLinkAttachmentValues,
) {
  const owned = await assertNoteOwned(userId, input.noteId);
  if (!owned) throw new Error("Note not found");

  const id = randomUUID();
  await db.insert(attachments).values({
    id,
    noteId: input.noteId,
    userId,
    fileName: input.fileName,
    fileSize: input.fileSize ?? 0,
    mimeType: input.mimeType ?? "application/octet-stream",
    storage: "link",
    url: input.url,
    data: null,
  });

  const [row] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id))
    .limit(1);
  return serializeAttachment(row!);
}

export async function createDbFileAttachment(
  userId: string,
  input: {
    noteId: string;
    fileName: string;
    mimeType: string;
    bytes: Buffer;
  },
) {
  const owned = await assertNoteOwned(userId, input.noteId);
  if (!owned) throw new Error("Note not found");

  if (input.bytes.byteLength === 0) {
    throw new Error("File is empty");
  }
  if (input.bytes.byteLength > MAX_DB_ATTACHMENT_BYTES) {
    throw new Error(
      `File too large (max ${Math.floor(MAX_DB_ATTACHMENT_BYTES / (1024 * 1024))}MB). Add a link instead, or compress the file.`,
    );
  }

  const id = randomUUID();
  await db.insert(attachments).values({
    id,
    noteId: input.noteId,
    userId,
    fileName: input.fileName,
    fileSize: input.bytes.byteLength,
    mimeType: input.mimeType || "application/octet-stream",
    storage: "db",
    url: null,
    data: input.bytes.toString("base64"),
  });

  const [row] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, id))
    .limit(1);
  return serializeAttachment(row!);
}

export async function getAttachmentForUser(userId: string, attachmentId: string) {
  const [row] = await db
    .select()
    .from(attachments)
    .where(and(eq(attachments.id, attachmentId), eq(attachments.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function deleteAttachment(userId: string, attachmentId: string) {
  const existing = await getAttachmentForUser(userId, attachmentId);
  if (!existing) return false;
  await db.delete(attachments).where(eq(attachments.id, attachmentId));
  return true;
}
