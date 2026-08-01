import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  isPushConfigured,
  removePushSubscription,
  savePushSubscription,
} from "@/lib/notifications/push";
import { pushSubscribeSchema } from "@/lib/validations/notes";

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const envPublic =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    process.env.VAPID_PUBLIC_KEY ||
    null;

  return NextResponse.json({
    configured: isPushConfigured() && Boolean(envPublic),
    publicKey: envPublic,
  });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  if (!isPushConfigured()) {
    return jsonError("Web Push is not configured on this server", 503);
  }

  const body = await request.json();
  const parsed = pushSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid subscription",
    );
  }

  const id = await savePushSubscription(
    session.user.id,
    parsed.data,
    request.headers.get("user-agent"),
  );

  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json().catch(() => null);
  const endpoint =
    typeof body?.endpoint === "string" ? body.endpoint : null;
  if (!endpoint) return jsonError("endpoint is required");

  const removed = await removePushSubscription(session.user.id, endpoint);
  return NextResponse.json({ ok: removed });
}
