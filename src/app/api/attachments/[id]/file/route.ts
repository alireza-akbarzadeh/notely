import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { getAttachmentForUser } from "@/lib/notes/attachments";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const row = await getAttachmentForUser(session.user.id, id);
  if (!row) return jsonError("Attachment not found", 404);

  if (row.storage === "link" && row.url) {
    return NextResponse.redirect(row.url);
  }

  if (row.storage === "db" && row.data) {
    const bytes = Buffer.from(row.data, "base64");
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": row.mimeType || "application/octet-stream",
        "Content-Length": String(bytes.byteLength),
        "Content-Disposition": `inline; filename="${row.fileName.replace(/"/g, "")}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  }

  return jsonError("Attachment file is unavailable", 404);
}
