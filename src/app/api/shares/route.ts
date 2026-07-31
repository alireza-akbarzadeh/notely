import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  inviteCollaborator,
  listSharesForNote,
} from "@/lib/notes/shares";
import { inviteShareSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const noteId = new URL(request.url).searchParams.get("noteId");
  if (!noteId) return jsonError("noteId is required");

  const shares = await listSharesForNote(session.user.id, noteId);
  if (!shares) return jsonError("Note not found", 404);

  return NextResponse.json({ shares });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = inviteShareSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid share payload");
  }

  try {
    const share = await inviteCollaborator(session.user.id, parsed.data);
    return NextResponse.json({ share }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to share";
    return jsonError(message, message === "Note not found" ? 404 : 400);
  }
}
