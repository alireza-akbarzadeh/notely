import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { createTask, listTasksForNote } from "@/lib/notes/tasks";
import { createTaskSchema } from "@/lib/validations/notes";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const noteId = new URL(request.url).searchParams.get("noteId");
  if (!noteId) return jsonError("noteId is required");

  const rows = await listTasksForNote(session.user.id, noteId);
  if (!rows) return jsonError("Note not found", 404);

  return NextResponse.json({ tasks: rows });
}

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid task payload");
  }

  try {
    const task = await createTask(session.user.id, parsed.data);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create task";
    return jsonError(message, message === "Note not found" ? 404 : 400);
  }
}
