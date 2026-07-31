import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

import { db, noteTags, notes, spaces, tags } from "@/lib/db";
import { requireNoteAccess } from "@/lib/notes/access";
import { listSharedWithMe } from "@/lib/notes/shares";
import type {
  CreateNoteValues,
  CreateSpaceValues,
  CreateTagValues,
  UpdateNoteValues,
  UpdateSpaceValues,
} from "@/lib/validations/notes";

function summarize(content: string, explicit?: string | null) {
  if (explicit !== undefined && explicit !== null) return explicit;
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed.length > 140 ? `${trimmed.slice(0, 137)}…` : trimmed;
}

export async function listSpaces(userId: string) {
  return db
    .select()
    .from(spaces)
    .where(eq(spaces.userId, userId))
    .orderBy(asc(spaces.sortOrder), asc(spaces.name));
}

export async function ensureDefaultSpace(userId: string) {
  const existing = await listSpaces(userId);
  if (existing.length > 0) return existing[0]!;

  const id = randomUUID();
  const now = new Date();
  await db.insert(spaces).values({
    id,
    userId,
    name: "Personal",
    icon: "notebook",
    sortOrder: 0,
    isFavorite: true,
    createdAt: now,
    updatedAt: now,
  });

  const [space] = await db.select().from(spaces).where(eq(spaces.id, id)).limit(1);
  return space!;
}

export async function createSpace(userId: string, input: CreateSpaceValues) {
  const id = randomUUID();
  const now = new Date();
  await db.insert(spaces).values({
    id,
    userId,
    name: input.name,
    icon: input.icon ?? null,
    isFavorite: input.isFavorite ?? false,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  });
  const [space] = await db.select().from(spaces).where(eq(spaces.id, id)).limit(1);
  return space!;
}

export async function updateSpace(
  userId: string,
  spaceId: string,
  input: UpdateSpaceValues,
) {
  const [existing] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!existing) return null;

  await db
    .update(spaces)
    .set({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
      updatedAt: new Date(),
    })
    .where(eq(spaces.id, spaceId));

  const [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId)).limit(1);
  return space!;
}

export async function deleteSpace(userId: string, spaceId: string) {
  const [existing] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!existing) return false;
  await db.delete(spaces).where(eq(spaces.id, spaceId));
  return true;
}

async function tagsForNotes(noteIds: string[]) {
  if (noteIds.length === 0) {
    return new Map<string, Array<typeof tags.$inferSelect>>();
  }

  const rows = await db
    .select({
      noteId: noteTags.noteId,
      tag: tags,
    })
    .from(noteTags)
    .innerJoin(tags, eq(noteTags.tagId, tags.id))
    .where(inArray(noteTags.noteId, noteIds));

  const map = new Map<string, Array<typeof tags.$inferSelect>>();
  for (const row of rows) {
    const list = map.get(row.noteId) ?? [];
    list.push(row.tag);
    map.set(row.noteId, list);
  }
  return map;
}

function serializeNote(
  row: typeof notes.$inferSelect,
  noteTagList: Array<typeof tags.$inferSelect>,
  extras?: { isShared?: boolean; sharedRole?: string | null; accessRole?: string },
) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    tags: noteTagList,
    isShared: extras?.isShared ?? false,
    sharedRole: extras?.sharedRole ?? null,
    accessRole: extras?.accessRole ?? "owner",
  };
}

export async function listNotes(
  userId: string,
  options?: { spaceId?: string; favoritesOnly?: boolean; sharedOnly?: boolean },
) {
  if (options?.sharedOnly) {
    const shared = await listSharedWithMe(userId);
    const tagMap = await tagsForNotes(shared.map((row) => row.id));
    return shared.map((row) => ({
      ...row,
      tags: tagMap.get(row.id) ?? [],
      accessRole: row.sharedRole === "viewer" ? "viewer" : "editor",
    }));
  }

  const conditions = [eq(notes.userId, userId)];
  if (options?.spaceId) conditions.push(eq(notes.spaceId, options.spaceId));
  if (options?.favoritesOnly) conditions.push(eq(notes.isFavorite, true));

  const rows = await db
    .select()
    .from(notes)
    .where(and(...conditions))
    .orderBy(desc(notes.isPinned), desc(notes.updatedAt));

  const tagMap = await tagsForNotes(rows.map((row) => row.id));
  return rows.map((row) =>
    serializeNote(row, tagMap.get(row.id) ?? [], {
      isShared: false,
      accessRole: "owner",
    }),
  );
}

export async function getNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access) return null;

  const [row] = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  if (!row) return null;

  const tagMap = await tagsForNotes([row.id]);
  return serializeNote(row, tagMap.get(row.id) ?? [], {
    isShared: access.role !== "owner",
    sharedRole: access.role === "owner" ? null : access.role,
    accessRole: access.role,
  });
}

async function assertSpaceOwned(userId: string, spaceId: string) {
  const [space] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  return space ?? null;
}

async function syncNoteTags(ownerUserId: string, noteId: string, tagIds: string[]) {
  if (tagIds.length > 0) {
    const owned = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.userId, ownerUserId), inArray(tags.id, tagIds)));
    if (owned.length !== tagIds.length) {
      throw new Error("One or more tags were not found");
    }
  }

  await db.delete(noteTags).where(eq(noteTags.noteId, noteId));
  if (tagIds.length > 0) {
    await db.insert(noteTags).values(tagIds.map((tagId) => ({ noteId, tagId })));
  }
}

export async function createNote(userId: string, input: CreateNoteValues) {
  const space = await assertSpaceOwned(userId, input.spaceId);
  if (!space) throw new Error("Space not found");

  const id = randomUUID();
  const now = new Date();
  const content = input.content ?? "";
  const title = input.title?.trim() || "Untitled";

  await db.insert(notes).values({
    id,
    spaceId: input.spaceId,
    userId,
    title,
    content,
    summary: summarize(content, input.summary),
    createdAt: now,
    updatedAt: now,
  });

  if (input.tagIds?.length) {
    await syncNoteTags(userId, id, input.tagIds);
  }

  return getNote(userId, id);
}

export async function updateNote(
  userId: string,
  noteId: string,
  input: UpdateNoteValues,
) {
  const access = await requireNoteAccess(userId, noteId, "edit");
  if (!access) return null;

  const [existing] = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  if (!existing) return null;

  if (input.spaceId) {
    if (access.role !== "owner") {
      throw new Error("Only the owner can move this note");
    }
    const space = await assertSpaceOwned(userId, input.spaceId);
    if (!space) throw new Error("Space not found");
  }

  const nextContent = input.content ?? existing.content;
  const nextSummary =
    input.summary !== undefined
      ? input.summary
      : input.content !== undefined
        ? summarize(nextContent)
        : existing.summary;

  await db
    .update(notes)
    .set({
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.spaceId !== undefined ? { spaceId: input.spaceId } : {}),
      ...(input.isPinned !== undefined && access.role === "owner"
        ? { isPinned: input.isPinned }
        : {}),
      ...(input.isFavorite !== undefined && access.role === "owner"
        ? { isFavorite: input.isFavorite }
        : {}),
      summary: nextSummary,
      updatedAt: new Date(),
    })
    .where(eq(notes.id, noteId));

  if (input.tagIds && access.role === "owner") {
    await syncNoteTags(access.ownerId, noteId, input.tagIds);
  }

  return getNote(userId, noteId);
}

export async function deleteNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "share");
  if (!access || access.role !== "owner") return false;
  await db.delete(notes).where(eq(notes.id, noteId));
  return true;
}

export async function listTags(userId: string) {
  return db
    .select()
    .from(tags)
    .where(eq(tags.userId, userId))
    .orderBy(asc(tags.name));
}

export async function createTag(userId: string, input: CreateTagValues) {
  const id = randomUUID();
  await db.insert(tags).values({
    id,
    userId,
    name: input.name,
    color: input.color ?? "#3b82f6",
  });
  const [tag] = await db.select().from(tags).where(eq(tags.id, id)).limit(1);
  return tag!;
}

export async function deleteTag(userId: string, tagId: string) {
  const [existing] = await db
    .select()
    .from(tags)
    .where(and(eq(tags.id, tagId), eq(tags.userId, userId)))
    .limit(1);
  if (!existing) return false;
  await db.delete(tags).where(eq(tags.id, tagId));
  return true;
}
