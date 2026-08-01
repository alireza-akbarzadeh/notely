import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  createSpace,
  ensureDefaultSpace,
  listSpaces,
  listTrashedSpaces,
  serializeSpace,
} from "@/lib/notes/service";
import { createSpaceSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const trashOnly = new URL(request.url).searchParams.get("trash") === "1";

  if (trashOnly) {
    const rows = await listTrashedSpaces(session.user.id);
    return NextResponse.json({ spaces: rows });
  }

  await ensureDefaultSpace(session.user.id);
  const rows = await listSpaces(session.user.id);

  return NextResponse.json({
    spaces: rows.map((space) => serializeSpace(space)),
  });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createSpaceSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid space payload");
  }

  const space = await createSpace(session.user.id, parsed.data);
  return NextResponse.json({ space: serializeSpace(space) }, { status: 201 });
}
