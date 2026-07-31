import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { createTag, listTags } from "@/lib/notes/service";
import { createTagSchema } from "@/lib/validations/notes";

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const rows = await listTags(session.user.id);
  return NextResponse.json({
    tags: rows.map((tag) => ({
      ...tag,
      createdAt: tag.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createTagSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid tag payload");
  }

  const tag = await createTag(session.user.id, parsed.data);
  return NextResponse.json(
    {
      tag: {
        ...tag,
        createdAt: tag.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
