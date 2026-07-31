import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  icon: z.string().trim().max(32).optional().nullable(),
  isFavorite: z.boolean().optional(),
});

export const updateSpaceSchema = createSpaceSchema.partial().extend({
  sortOrder: z.number().int().optional(),
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

export type CreateSpaceValues = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceValues = z.infer<typeof updateSpaceSchema>;
export type CreateNoteValues = z.infer<typeof createNoteSchema>;
export type UpdateNoteValues = z.infer<typeof updateNoteSchema>;
export type CreateTagValues = z.infer<typeof createTagSchema>;
