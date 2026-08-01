import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteTag, updateTag } from "@/lib/notes/service";
import { updateTagSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateTagSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid tag payload");
  }

  const tag = await updateTag(session.user.id, id, parsed.data);
  if (!tag) return jsonError("Tag not found", 404);

  return NextResponse.json({
    tag: {
      ...tag,
      createdAt: tag.createdAt.toISOString(),
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const deleted = await deleteTag(session.user.id, id);
  if (!deleted) return jsonError("Tag not found", 404);

  return NextResponse.json({ success: true });
}
