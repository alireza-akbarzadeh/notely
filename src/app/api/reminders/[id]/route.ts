import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteReminder, updateReminder } from "@/lib/notes/reminders";
import { updateReminderSchema } from "@/lib/validations/notes";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await context.params;
  const body = await request.json();
  const parsed = updateReminderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid reminder payload",
    );
  }

  const reminder = await updateReminder(session.user.id, id, {
    title: parsed.data.title,
    body: parsed.data.body,
    remindAt: parsed.data.remindAt
      ? new Date(parsed.data.remindAt)
      : undefined,
    sound: parsed.data.sound,
    status: parsed.data.status,
  });

  if (!reminder) return jsonError("Reminder not found", 404);
  return NextResponse.json({ reminder });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await context.params;
  const deleted = await deleteReminder(session.user.id, id);
  if (!deleted) return jsonError("Reminder not found", 404);
  return NextResponse.json({ ok: true });
}
