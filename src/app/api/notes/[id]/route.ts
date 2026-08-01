import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  deleteNote,
  getNote,
  permanentlyDeleteNote,
  restoreNote,
  updateNote,
} from "@/lib/notes/service";
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

  if (body?.restore === true) {
    const note = await restoreNote(session.user.id, id);
    if (!note) return jsonError("Note not found", 404);
    return NextResponse.json({ note });
  }

  const parsed = updateNoteSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid note payload");
  }

  try {
    const note = await updateNote(session.user.id, id, parsed.data);
    if (!note) return jsonError("Note not found", 404);
    return NextResponse.json({ note });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update note";
    return jsonError(message, 400);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const permanent =
    new URL(request.url).searchParams.get("permanent") === "1";

  // Permanent delete only removes notes that are already in Trash.
  // Active notes always soft-delete, even if ?permanent=1 is sent by mistake.
  if (permanent) {
    const hardDeleted = await permanentlyDeleteNote(session.user.id, id);
    if (hardDeleted) {
      return NextResponse.json({ success: true, permanent: true });
    }
    // Not in trash yet — fall through to soft delete.
  }

  const softDeleted = await deleteNote(session.user.id, id);
  if (!softDeleted) return jsonError("Note not found", 404);

  return NextResponse.json({ success: true, permanent: false });
}
