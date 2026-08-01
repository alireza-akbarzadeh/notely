import { and, asc, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
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

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function summarize(content: string, explicit?: string | null) {
  if (explicit !== undefined && explicit !== null) return explicit;
  const trimmed = stripHtml(content);
  if (!trimmed) return null;
  return trimmed.length > 140 ? `${trimmed.slice(0, 137)}…` : trimmed;
}

export function serializeSpace(
  row: typeof spaces.$inferSelect,
  extras?: { noteCount?: number },
) {
  return {
    ...row,
    deletedAt: row.deletedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    ...(extras?.noteCount !== undefined ? { noteCount: extras.noteCount } : {}),
  };
}

/** Ids of the user's spaces that are not in Trash — used to scope note queries. */
function activeSpaceIds(userId: string) {
  return db
    .select({ id: spaces.id })
    .from(spaces)
    .where(and(eq(spaces.userId, userId), isNull(spaces.deletedAt)));
}

export async function listSpaces(userId: string) {
  return db
    .select()
    .from(spaces)
    .where(and(eq(spaces.userId, userId), isNull(spaces.deletedAt)))
    .orderBy(asc(spaces.sortOrder), asc(spaces.name));
}

/** Spaces in Trash, newest first, each with the number of notes that come back on restore. */
export async function listTrashedSpaces(userId: string) {
  const rows = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.userId, userId), isNotNull(spaces.deletedAt)))
    .orderBy(desc(spaces.deletedAt));

  if (rows.length === 0) return [];

  const counts = await db
    .select({
      spaceId: notes.spaceId,
      count: sql<number>`count(*)::int`,
    })
    .from(notes)
    .where(
      and(
        inArray(
          notes.spaceId,
          rows.map((row) => row.id),
        ),
        isNull(notes.deletedAt),
      ),
    )
    .groupBy(notes.spaceId);

  const countBySpace = new Map(counts.map((row) => [row.spaceId, row.count]));
  return rows.map((row) =>
    serializeSpace(row, { noteCount: countBySpace.get(row.id) ?? 0 }),
  );
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
  if (!existing || existing.deletedAt) return null;

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

/**
 * Soft-delete: move the space to Trash.
 * Optional `keepNoteIds` are moved to `moveTargetSpaceId` first so they survive;
 * remaining notes stay with the space and come back on restore.
 */
export async function deleteSpace(
  userId: string,
  spaceId: string,
  options?: {
    keepNoteIds?: string[];
    moveTargetSpaceId?: string;
  },
) {
  const [existing] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!existing) return false;
  if (existing.deletedAt) return true;

  const keepNoteIds = options?.keepNoteIds ?? [];
  if (keepNoteIds.length > 0) {
    const targetId = options?.moveTargetSpaceId;
    if (!targetId || targetId === spaceId) {
      throw new Error("A different space is required to keep notes");
    }
    const target = await assertSpaceOwned(userId, targetId);
    if (!target) throw new Error("Target space not found");

    const now = new Date();
    await db
      .update(notes)
      .set({ spaceId: targetId, updatedAt: now })
      .where(
        and(
          eq(notes.userId, userId),
          eq(notes.spaceId, spaceId),
          isNull(notes.deletedAt),
          inArray(notes.id, keepNoteIds),
        ),
      );
  }

  const now = new Date();
  await db
    .update(spaces)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(spaces.id, spaceId));
  return true;
}

export async function restoreSpace(userId: string, spaceId: string) {
  const [existing] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!existing?.deletedAt) return null;

  await db
    .update(spaces)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(spaces.id, spaceId));

  const [space] = await db.select().from(spaces).where(eq(spaces.id, spaceId)).limit(1);
  return space!;
}

/** Hard-delete: permanently remove a trashed space and, by cascade, its notes. */
export async function permanentlyDeleteSpace(userId: string, spaceId: string) {
  const [existing] = await db
    .select()
    .from(spaces)
    .where(and(eq(spaces.id, spaceId), eq(spaces.userId, userId)))
    .limit(1);
  if (!existing?.deletedAt) return false;

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
    deletedAt: row.deletedAt?.toISOString() ?? null,
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
  options?: {
    spaceId?: string;
    favoritesOnly?: boolean;
    sharedOnly?: boolean;
    trashOnly?: boolean;
  },
) {
  if (options?.sharedOnly) {
    const shared = await listSharedWithMe(userId);
    const tagMap = await tagsForNotes(shared.map((row) => row.id));
    return shared.map((row) => ({
      ...row,
      deletedAt: row.deletedAt ?? null,
      tags: tagMap.get(row.id) ?? [],
      accessRole: row.sharedRole === "viewer" ? "viewer" : "editor",
    }));
  }

  const conditions = [
    eq(notes.userId, userId),
    inArray(notes.spaceId, activeSpaceIds(userId)),
  ];
  if (options?.trashOnly) {
    conditions.push(isNotNull(notes.deletedAt));
  } else {
    conditions.push(isNull(notes.deletedAt));
  }
  if (options?.spaceId) conditions.push(eq(notes.spaceId, options.spaceId));
  if (options?.favoritesOnly) conditions.push(eq(notes.isFavorite, true));

  const rows = await db
    .select()
    .from(notes)
    .where(and(...conditions))
    .orderBy(
      options?.trashOnly ? desc(notes.deletedAt) : desc(notes.isPinned),
      desc(notes.updatedAt),
    );

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

  const [joined] = await db
    .select({ note: notes })
    .from(notes)
    .innerJoin(spaces, eq(notes.spaceId, spaces.id))
    .where(and(eq(notes.id, noteId), isNull(spaces.deletedAt)))
    .limit(1);
  if (!joined) return null;
  const row = joined.note;

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
    .where(
      and(
        eq(spaces.id, spaceId),
        eq(spaces.userId, userId),
        isNull(spaces.deletedAt),
      ),
    )
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
  if (!existing || existing.deletedAt) return null;

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

/** Soft-delete: move note to Trash. Owner-only; does not require share capability. */
export async function deleteNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access || access.role !== "owner") return false;

  const [existing] = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  if (!existing) return false;
  // Already in trash — treat as success so the client can navigate to Trash.
  if (existing.deletedAt) return true;

  const now = new Date();
  await db
    .update(notes)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(notes.id, noteId));
  return true;
}

export async function restoreNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access || access.role !== "owner") return null;

  const [existing] = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  if (!existing?.deletedAt) return null;

  await db
    .update(notes)
    .set({ deletedAt: null, updatedAt: new Date() })
    .where(eq(notes.id, noteId));

  return getNote(userId, noteId);
}

/** Hard-delete: permanently remove a trashed note. */
export async function permanentlyDeleteNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "read");
  if (!access || access.role !== "owner") return false;

  const [existing] = await db.select().from(notes).where(eq(notes.id, noteId)).limit(1);
  if (!existing?.deletedAt) return false;

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
