import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  createDbFileAttachment,
  createLinkAttachment,
  listAttachmentsForNote,
  MAX_DB_ATTACHMENT_BYTES,
} from "@/lib/notes/attachments";
import { getRequestClientId } from "@/lib/realtime/request";
import { createLinkAttachmentSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const noteId = new URL(request.url).searchParams.get("noteId");
  if (!noteId) return jsonError("noteId is required");

  const rows = await listAttachmentsForNote(session.user.id, noteId);
  if (!rows) return jsonError("Note not found", 404);

  return NextResponse.json({ attachments: rows });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const contentType = request.headers.get("content-type") ?? "";

  try {
    const clientId = await getRequestClientId();
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const noteId = String(form.get("noteId") ?? "");
      const file = form.get("file");

      if (!noteId) return jsonError("noteId is required");
      if (!(file instanceof File)) return jsonError("file is required");
      if (file.size > MAX_DB_ATTACHMENT_BYTES) {
        return jsonError(
          `File too large (max ${Math.floor(MAX_DB_ATTACHMENT_BYTES / (1024 * 1024))}MB)`,
        );
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const attachment = await createDbFileAttachment(
        session.user.id,
        {
          noteId,
          fileName: file.name || "upload",
          mimeType: file.type || "application/octet-stream",
          bytes,
        },
        { clientId },
      );
      return NextResponse.json({ attachment }, { status: 201 });
    }

    const body = await request.json();
    const parsed = createLinkAttachmentSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        parsed.error.issues[0]?.message ?? "Invalid attachment payload",
      );
    }

    const attachment = await createLinkAttachment(session.user.id, parsed.data, {
      clientId,
    });
    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create attachment";
    return jsonError(message, message === "Note not found" ? 404 : 400);
  }
}
