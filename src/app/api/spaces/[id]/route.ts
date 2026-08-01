import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  deleteSpace,
  permanentlyDeleteSpace,
  restoreSpace,
  serializeSpace,
  updateSpace,
} from "@/lib/notes/service";
import { updateSpaceSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();

  if (body?.restore === true) {
    const space = await restoreSpace(session.user.id, id);
    if (!space) return jsonError("Space not found", 404);
    return NextResponse.json({ space: serializeSpace(space) });
  }

  const parsed = updateSpaceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid space payload");
  }

  const space = await updateSpace(session.user.id, id, parsed.data);
  if (!space) return jsonError("Space not found", 404);

  return NextResponse.json({ space: serializeSpace(space) });
}

export async function DELETE(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const permanent =
    new URL(request.url).searchParams.get("permanent") === "1";

  if (permanent) {
    const hardDeleted = await permanentlyDeleteSpace(session.user.id, id);
    if (hardDeleted) {
      return NextResponse.json({ success: true, permanent: true });
    }
    // Not in trash yet — fall through to soft delete.
  }

  const softDeleted = await deleteSpace(session.user.id, id);
  if (!softDeleted) return jsonError("Space not found", 404);

  return NextResponse.json({ success: true, permanent: false });
}
