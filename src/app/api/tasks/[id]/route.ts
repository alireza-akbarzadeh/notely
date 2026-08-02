import { NextResponse } from "next/server";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import { deleteTask, updateTask } from "@/lib/notes/tasks";
import { getRequestClientId } from "@/lib/realtime/request";
import { updateTaskSchema } from "@/lib/validations/notes";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid task payload");
  }

  const clientId = await getRequestClientId();
  const task = await updateTask(session.user.id, id, parsed.data, { clientId });
  if (!task) return jsonError("Task not found", 404);

  return NextResponse.json({ task });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  const { id } = await params;
  const clientId = await getRequestClientId();
  const deleted = await deleteTask(session.user.id, id, { clientId });
  if (!deleted) return jsonError("Task not found", 404);

  return NextResponse.json({ success: true });
}
