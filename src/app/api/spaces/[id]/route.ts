import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteSpace, updateSpace } from "@/lib/notes/service";
import { updateSpaceSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateSpaceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid space payload");
  }

  const space = await updateSpace(session.user.id, id, parsed.data);
  if (!space) return jsonError("Space not found", 404);

  return NextResponse.json({
    space: {
      ...space,
      createdAt: space.createdAt.toISOString(),
      updatedAt: space.updatedAt.toISOString(),
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const deleted = await deleteSpace(session.user.id, id);
  if (!deleted) return jsonError("Space not found", 404);

  return NextResponse.json({ success: true });
}
