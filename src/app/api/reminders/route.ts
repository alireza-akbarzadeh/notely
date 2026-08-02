import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  createReminder,
  listReminders,
  type ReminderStatus,
} from "@/lib/notes/reminders";
import { createReminderSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ReminderStatus | null;
  const noteId = searchParams.get("noteId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const reminders = await listReminders(session.user.id, {
    status: status ?? undefined,
    noteId: noteId ?? undefined,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  return NextResponse.json({ reminders });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createReminderSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      parsed.error.issues[0]?.message ?? "Invalid reminder payload",
    );
  }

  if (!parsed.data.noteId && !parsed.data.eventId) {
    return jsonError("noteId or eventId is required");
  }

  try {
    const reminder = await createReminder(session.user.id, {
      title: parsed.data.title,
      body: parsed.data.body,
      remindAt: new Date(parsed.data.remindAt),
      sound: parsed.data.sound,
      noteId: parsed.data.noteId,
      eventId: parsed.data.eventId,
    });
    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create reminder";
    return jsonError(message, 400);
  }
}
