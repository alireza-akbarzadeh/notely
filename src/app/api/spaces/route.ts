import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  createSpace,
  ensureDefaultSpace,
  listSpaces,
} from "@/lib/notes/service";
import { createSpaceSchema } from "@/lib/validations/notes";

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  await ensureDefaultSpace(session.user.id);
  const rows = await listSpaces(session.user.id);

  return NextResponse.json({
    spaces: rows.map((space) => ({
      ...space,
      createdAt: space.createdAt.toISOString(),
      updatedAt: space.updatedAt.toISOString(),
    })),
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
  return NextResponse.json(
    {
      space: {
        ...space,
        createdAt: space.createdAt.toISOString(),
        updatedAt: space.updatedAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
