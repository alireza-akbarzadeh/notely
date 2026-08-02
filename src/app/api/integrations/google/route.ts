import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  disconnectGoogleAccount,
  getGoogleConnectionStatus,
} from "@/lib/google-integration";

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  return NextResponse.json(
    await getGoogleConnectionStatus(session.user.id),
  );
}

export async function DELETE() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  try {
    await disconnectGoogleAccount(session.user.id);
    return NextResponse.json({ success: true });
  } catch {
    return jsonError("Could not disconnect Google Workspace", 502);
  }
}
