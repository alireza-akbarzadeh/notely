import { and, asc, eq } from "drizzle-orm";
import { randomUUID } from "crypto";

import { attachments, db } from "@/lib/db";
import { requireNoteAccess } from "@/lib/notes/access";
import type { CreateLinkAttachmentValues } from "@/lib/validations/notes";

/** Soft limit for DB-backed uploads (base64 in Postgres). */
export const MAX_DB_ATTACHMENT_BYTES = 2 * 1024 * 1024;

function serializeAttachment(row: typeof attachments.$inferSelect) {
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
  };
}

export async function listAttachmentsForNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access) return null;

  const rows = await db
    .select()
    .from(attachments)
    .where(eq(attachments.noteId, noteId))
    .orderBy(asc(attachments.createdAt));

  return rows.map((row) => serializeAttachment(row));
}

export async function createLinkAttachment(
  userId: string,
  input: CreateLinkAttachmentValues,
) {
  const access = await requireNoteAccess(userId, input.noteId, "edit");
  if (!access) throw new Error("Note not found");

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
  const access = await requireNoteAccess(userId, input.noteId, "edit");
  if (!access) throw new Error("Note not found");

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
    .where(eq(attachments.id, attachmentId))
    .limit(1);
  if (!row) return null;

  const access = await requireNoteAccess(userId, row.noteId, "read");
  if (!access) return null;
  return row;
}

export async function deleteAttachment(userId: string, attachmentId: string) {
  const [existing] = await db
    .select()
    .from(attachments)
    .where(eq(attachments.id, attachmentId))
    .limit(1);
  if (!existing) return false;

  const access = await requireNoteAccess(userId, existing.noteId, "edit");
  if (!access) return false;

  await db.delete(attachments).where(eq(attachments.id, attachmentId));
  return true;
}
