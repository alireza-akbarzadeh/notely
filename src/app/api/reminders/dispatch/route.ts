import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { getEnv } from "@/lib/env";
import {
  dispatchDueReminders,
  dispatchUserDueReminders,
} from "@/lib/notifications/dispatch";

function hasCronAuth(request: Request) {
  const env = getEnv();
  if (!env.CRON_SECRET) return false;
  const header = request.headers.get("authorization");
  const bearer = header?.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : null;
  const cronHeader = request.headers.get("x-cron-secret");
  return bearer === env.CRON_SECRET || cronHeader === env.CRON_SECRET;
}

export async function POST(request: Request) {
  if (hasCronAuth(request)) {
    const result = await dispatchDueReminders();
    return NextResponse.json(result);
  }

  const { session, response } = await requireSession();
  if (!session) return response!;

  // Logged-in clients only flush their own due reminders (sound / local notify).
  const result = await dispatchUserDueReminders(session.user.id);
  return NextResponse.json(result);
}
