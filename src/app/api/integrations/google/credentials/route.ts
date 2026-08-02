import { NextResponse } from "next/server";
import { z } from "zod";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  clearGoogleOAuthCredentials,
  getGoogleConnectionStatus,
  saveGoogleOAuthCredentials,
} from "@/lib/google-integration";

const saveCredentialsSchema = z.object({
  clientId: z.string().trim().min(8).max(200),
  clientSecret: z.string().trim().min(8).max(200),
});

export async function PUT(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = saveCredentialsSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid Google credentials",
    );
  }

  try {
    await saveGoogleOAuthCredentials(
      session.user.id,
      parsed.data.clientId,
      parsed.data.clientSecret,
    );
    return NextResponse.json(
      await getGoogleConnectionStatus(session.user.id),
    );
  } catch {
    return jsonError("Could not save Google credentials", 500);
  }
}

export async function DELETE() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  try {
    await clearGoogleOAuthCredentials(session.user.id);
    return NextResponse.json(
      await getGoogleConnectionStatus(session.user.id),
    );
  } catch {
    return jsonError("Could not clear Google credentials", 500);
  }
}
