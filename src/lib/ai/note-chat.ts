import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { tool } from "ai";
import { z } from "zod";

import { getEnv } from "@/lib/env";

const MAX_NOTE_CHARS = 50_000;

export function getGeminiApiKey() {
  const env = getEnv();
  return env.GOOGLE_GENERATIVE_AI_API_KEY ?? env.GEMINI_API_KEY;
}

export function createGeminiModel() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("AI not configured. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY.");
  }

  const google = createGoogleGenerativeAI({ apiKey });
  return google("gemini-2.5-flash");
}

export function buildNoteSystemPrompt(
  title: string,
  content: string,
  canEdit: boolean,
) {
  const clipped =
    content.length > MAX_NOTE_CHARS
      ? `${content.slice(0, MAX_NOTE_CHARS)}\n\n[…truncated]`
      : content;

  return `You are Notely's note assistant, powered by Google Gemini.
Help the user review, discuss, and improve their note.

Guidelines:
- Be concise and practical.
- When reviewing, cover clarity, structure, gaps, and next steps.
- Prefer simple HTML for note body edits: p, br, strong, em, u, s, ul, ol, li, h1, h2, blockquote, code. Plain text with newlines is also fine.
- Do not invent facts about the user's private content beyond what is in the note.
- ${
    canEdit
      ? "When the user asks you to rewrite, improve, continue, fix grammar, or change the title, use the editing tools. Confirm briefly after applying."
      : "The user has view-only access — answer questions but do not attempt to edit the note."
  }

Current note title: ${title.trim() || "Untitled"}

Current note body:
---
${clipped.trim() || "(empty)"}
---`;
}

export function createNoteEditTools(canEdit: boolean) {
  if (!canEdit) return undefined;

  return {
    replaceNoteContent: tool({
      description:
        "Replace the entire note body with improved content (HTML or plain text).",
      inputSchema: z.object({
        content: z
          .string()
          .describe(
            "Full new note body. Prefer simple HTML or plain text with newlines.",
          ),
      }),
    }),
    appendNoteContent: tool({
      description: "Append content to the end of the note body.",
      inputSchema: z.object({
        content: z
          .string()
          .describe("Content to append (HTML or plain text)."),
      }),
    }),
    updateNoteTitle: tool({
      description: "Update the note title.",
      inputSchema: z.object({
        title: z.string().max(200).describe("The new note title."),
      }),
    }),
  };
}
