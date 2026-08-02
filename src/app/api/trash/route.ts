import { NextResponse } from "next/server";

import { requireSession } from "@/lib/api/auth-guard";
import { emptyTrash } from "@/lib/notes/service";

/** Permanently delete all trashed notes and spaces for the current user. */
export async function DELETE() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const result = await emptyTrash(session.user.id);
  return NextResponse.json({ ok: true, ...result });
}
