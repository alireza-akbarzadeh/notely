import { z } from "zod";

export const noteChatRequestSchema = z.object({
  messages: z.array(z.unknown()).min(1, "At least one message is required"),
  noteId: z.string().min(1, "noteId is required"),
  title: z.string().max(500).optional().default(""),
  content: z.string().max(200_000).optional().default(""),
});

export type NoteChatRequest = z.infer<typeof noteChatRequestSchema>;
