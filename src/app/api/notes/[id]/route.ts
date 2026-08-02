import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteNote, getNote, updateNote } from "@/lib/notes/service";
import { getRequestClientId } from "@/lib/realtime/request";
import { updateNoteSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const note = await getNote(session.user.id, id);
  if (!note) return jsonError("Note not found", 404);

  return NextResponse.json({ note });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid note payload");
  }

  try {
    const clientId = await getRequestClientId();
    const note = await updateNote(session.user.id, id, parsed.data, { clientId });
    if (!note) return jsonError("Note not found", 404);
    return NextResponse.json({ note });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update note";
    return jsonError(message, 400);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const clientId = await getRequestClientId();
  const deleted = await deleteNote(session.user.id, id, { clientId });
  if (!deleted) return jsonError("Note not found", 404);

  return NextResponse.json({ success: true });
}
