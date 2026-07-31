import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { searchNotes } from "@/lib/notes/shares";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const q = new URL(request.url).searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ notes: [] });

  const notes = await searchNotes(session.user.id, q);
  return NextResponse.json({ notes });
}
