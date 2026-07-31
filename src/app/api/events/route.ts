import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { createEvent, listEvents } from "@/lib/notes/events";
import { createEventSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const events = await listEvents(session.user.id, {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createEventSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid event payload");
  }

  const event = await createEvent(session.user.id, {
    title: parsed.data.title,
    startTime: new Date(parsed.data.startTime),
    endTime: parsed.data.endTime ? new Date(parsed.data.endTime) : null,
    link: parsed.data.link,
    noteId: parsed.data.noteId,
  });

  return NextResponse.json({ event }, { status: 201 });
}
