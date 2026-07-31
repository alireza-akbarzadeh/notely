import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { removeShare, respondToShare } from "@/lib/notes/shares";
import { respondShareSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();
  const parsed = respondShareSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid payload");
  }

  const result = await respondToShare(session.user.id, id, parsed.data.action);
  if (!result) return jsonError("Invite not found", 404);

  return NextResponse.json({ share: result });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const deleted = await removeShare(session.user.id, id);
  if (!deleted) return jsonError("Share not found", 404);

  return NextResponse.json({ success: true });
}
