import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteAttachment } from "@/lib/notes/attachments";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const deleted = await deleteAttachment(session.user.id, id);
  if (!deleted) return jsonError("Attachment not found", 404);

  return NextResponse.json({ success: true });
}
