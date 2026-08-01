import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  removeShare,
  respondToShare,
  updateShareRole,
} from "@/lib/notes/shares";
import {
  respondShareSchema,
  updateShareRoleSchema,
} from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();

  const roleParsed = updateShareRoleSchema.safeParse(body);
  if (roleParsed.success) {
    const result = await updateShareRole(
      session.user.id,
      id,
      roleParsed.data.role,
    );
    if (!result) return jsonError("Share not found", 404);
    return NextResponse.json({ share: result });
  }

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
