import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  icon: z.string().trim().max(32).optional().nullable(),
  isFavorite: z.boolean().optional(),
});

export const updateSpaceSchema = createSpaceSchema.partial().extend({
  sortOrder: z.number().int().optional(),
});

/** Body for soft-deleting a space; unchecked notes can be moved to another space. */
export const deleteSpaceSchema = z
  .object({
    keepNoteIds: z.array(z.string().min(1)).optional().default([]),
    moveTargetSpaceId: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if ((value.keepNoteIds?.length ?? 0) > 0 && !value.moveTargetSpaceId) {
      ctx.addIssue({
        code: "custom",
        message: "Choose a space to keep the unchecked notes in",
        path: ["moveTargetSpaceId"],
      });
    }
  });

export const createNoteSchema = z.object({
  spaceId: z.string().min(1),
  title: z.string().trim().max(200).optional(),
  content: z.string().optional(),
  summary: z.string().trim().max(500).optional().nullable(),
  tagIds: z.array(z.string().min(1)).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().optional(),
  summary: z.string().trim().max(500).optional().nullable(),
  spaceId: z.string().min(1).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  tagIds: z.array(z.string().min(1)).optional(),
});

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .transform((value) => value.replace(/^#/, "")),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const createTaskSchema = z.object({
  noteId: z.string().min(1).optional().nullable(),
  text: z.string().trim().max(500).default(""),
  status: z.enum(["todo", "in_progress", "done"]).optional().default("todo"),
  dueAt: z.string().datetime().nullable().optional(),
});

export const updateTaskSchema = z.object({
  text: z.string().trim().max(500).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  isCompleted: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

export const createLinkAttachmentSchema = z.object({
  noteId: z.string().min(1),
  fileName: z.string().trim().min(1).max(200),
  url: z.string().url(),
  fileSize: z.number().int().nonnegative().optional().default(0),
  mimeType: z.string().trim().max(120).optional().default("application/octet-stream"),
});

export const inviteShareSchema = z.object({
  noteId: z.string().min(1),
  email: z.string().trim().email(),
  role: z.enum(["editor", "viewer"]).optional().default("editor"),
});

export const respondShareSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export const createEventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional().nullable(),
  link: z.string().url().optional().nullable(),
  noteId: z.string().min(1).optional().nullable(),
  /** Minutes before start to fire a reminder; 0 = at start; omit = no reminder. */
  remindMinutesBefore: z.number().int().min(0).max(10080).optional().nullable(),
  reminderSound: z.enum(["chime", "bell", "soft", "none"]).optional(),
});

export const createReminderSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().max(500).optional().nullable(),
  remindAt: z.string().datetime(),
  sound: z.enum(["chime", "bell", "soft", "none"]).optional().default("chime"),
  noteId: z.string().min(1).optional().nullable(),
  eventId: z.string().min(1).optional().nullable(),
});

export const updateReminderSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  body: z.string().trim().max(500).optional().nullable(),
  remindAt: z.string().datetime().optional(),
  sound: z.enum(["chime", "bell", "soft", "none"]).optional(),
  status: z.enum(["pending", "fired", "dismissed", "cancelled"]).optional(),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

export type CreateSpaceValues = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceValues = z.infer<typeof updateSpaceSchema>;
export type DeleteSpaceValues = z.infer<typeof deleteSpaceSchema>;
export type CreateNoteValues = z.infer<typeof createNoteSchema>;
export type UpdateNoteValues = z.infer<typeof updateNoteSchema>;
export type CreateTagValues = z.infer<typeof createTagSchema>;
export type UpdateTagValues = z.infer<typeof updateTagSchema>;
export type CreateTaskValues = z.infer<typeof createTaskSchema>;
export type UpdateTaskValues = z.infer<typeof updateTaskSchema>;
export type CreateLinkAttachmentValues = z.infer<typeof createLinkAttachmentSchema>;
export type InviteShareValues = z.infer<typeof inviteShareSchema>;
export type CreateEventValues = z.infer<typeof createEventSchema>;
export type CreateReminderValues = z.infer<typeof createReminderSchema>;
export type UpdateReminderValues = z.infer<typeof updateReminderSchema>;
 