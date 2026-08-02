import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

import { jsonError, requireSession } from "@/lib/api/auth-guard";
import {
  buildNoteSystemPrompt,
  createGeminiModel,
  createNoteEditTools,
  getGeminiApiKey,
} from "@/lib/ai/note-chat";
import { requireNoteAccess } from "@/lib/notes/access";
import { noteChatRequestSchema } from "@/lib/validations/ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { session, response } = await requireSession();
  if (!session) return response!;

  if (!getGeminiApiKey()) {
    return jsonError(
      "AI not configured. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY.",
      503,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const parsed = noteChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid AI payload");
  }

  const { messages, noteId, title, content } = parsed.data;

  const access = await requireNoteAccess(session.user.id, noteId, "read");
  if (!access) {
    return jsonError("Note not found", 404);
  }

  try {
    const model = createGeminiModel();
    const tools = createNoteEditTools(access.canEdit);
    const result = streamText({
      model,
      system: buildNoteSystemPrompt(title, content, access.canEdit),
      messages: await convertToModelMessages(messages as UIMessage[]),
      ...(tools ? { tools } : {}),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI request failed";
    const status = message.includes("not configured") ? 503 : 400;
    return jsonError(message, status);
  }
}
