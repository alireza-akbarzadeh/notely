import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { listInbox } from "@/lib/notes/shares";

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const invites = await listInbox(session.user.id);
  return NextResponse.json({ invites });
}
