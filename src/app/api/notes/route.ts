import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { createNote, ensureDefaultSpace, listNotes } from "@/lib/notes/service";
import { createNoteSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get("spaceId") ?? undefined;
  const favoritesOnly = searchParams.get("favorites") === "1";

  await ensureDefaultSpace(session.user.id);
  const rows = await listNotes(session.user.id, { spaceId, favoritesOnly });

  return NextResponse.json({ notes: rows });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createNoteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid note payload");
  }

  try {
    const note = await createNote(session.user.id, parsed.data);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create note";
    return jsonError(message, 400);
  }
}
