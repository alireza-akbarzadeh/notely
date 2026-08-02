import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteAttachment } from "@/lib/notes/attachments";
import { getRequestClientId } from "@/lib/realtime/request";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const clientId = await getRequestClientId();
  const deleted = await deleteAttachment(session.user.id, id, { clientId });
  if (!deleted) return jsonError("Attachment not found", 404);

  return NextResponse.json({ success: true });
}
