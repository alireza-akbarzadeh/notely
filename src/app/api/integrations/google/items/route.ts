import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { listGoogleIntegrationItems } from "@/lib/google-integration";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const query = searchParams.get("q")?.slice(0, 100);
  if (source !== "gmail" && source !== "calendar") {
    return jsonError("Source must be gmail or calendar");
  }

  try {
    const items = await listGoogleIntegrationItems(
      session.user.id,
      source,
      query,
    );
    return NextResponse.json({ items });
  } catch (error) {
    const message =
      error instanceof Error && error.message.startsWith("Connect Google")
        ? error.message
        : "Could not load Google Workspace items";
    return jsonError(message, message.startsWith("Connect") ? 409 : 502);
  }
}
