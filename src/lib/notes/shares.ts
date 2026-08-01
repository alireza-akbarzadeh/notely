import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

import { db, noteShares, notes, user } from "@/lib/db";
import { getNoteAccess, requireNoteAccess } from "@/lib/notes/access";

const inviter = alias(user, "inviter");

function serializeShare(
  row: typeof noteShares.$inferSelect,
  extras?: { noteTitle?: string; inviterName?: string },
) {
  return {
    id: row.id,
    noteId: row.noteId,
    invitedByUserId: row.invitedByUserId,
    userId: row.userId,
    email: row.email,
    role: row.role,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    noteTitle: extras?.noteTitle,
    inviterName: extras?.inviterName,
  };
}

export async function listSharesForNote(userId: string, noteId: string) {
  const access = await requireNoteAccess(userId, noteId, "share");
  if (!access) return null;

  const rows = await db
    .select()
    .from(noteShares)
    .where(eq(noteShares.noteId, noteId))
    .orderBy(asc(noteShares.createdAt));

  return rows.map((row) => serializeShare(row));
}

export async function inviteCollaborator(
  ownerId: string,
  input: { noteId: string; email: string; role?: "editor" | "viewer" },
) {
  const access = await requireNoteAccess(ownerId, input.noteId, "share");
  if (!access) throw new Error("Note not found");

  const email = input.email.trim().toLowerCase();
  if (!email) throw new Error("Email is required");

  const [owner] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, ownerId))
    .limit(1);
  if (owner?.email.toLowerCase() === email) {
    throw new Error("You already own this note");
  }

  const [invitee] = await db
    .select()
    .from(user)
    .where(ilike(user.email, email))
    .limit(1);

  if (!invitee) {
    throw new Error(
      "No Notely account with that email. They need to register first.",
    );
  }

  const [existing] = await db
    .select()
    .from(noteShares)
    .where(
      and(
        eq(noteShares.noteId, input.noteId),
        or(eq(noteShares.userId, invitee.id), eq(noteShares.email, email)),
      ),
    )
    .limit(1);

  if (existing) {
    if (existing.status === "accepted") {
      throw new Error("Already shared with this user");
    }
    await db
      .update(noteShares)
      .set({
        role: input.role ?? "editor",
        status: "pending",
        userId: invitee.id,
        updatedAt: new Date(),
      })
      .where(eq(noteShares.id, existing.id));
    const [row] = await db
      .select()
      .from(noteShares)
      .where(eq(noteShares.id, existing.id))
      .limit(1);
    return serializeShare(row!);
  }

  const id = randomUUID();
  const now = new Date();
  await db.insert(noteShares).values({
    id,
    noteId: input.noteId,
    invitedByUserId: ownerId,
    userId: invitee.id,
    email,
    role: input.role ?? "editor",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  const [row] = await db.select().from(noteShares).where(eq(noteShares.id, id)).limit(1);
  return serializeShare(row!);
}

export async function listInbox(userId: string) {
  const [me] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!me) return [];

  const rows = await db
    .select({
      share: noteShares,
      noteTitle: notes.title,
      inviterName: inviter.name,
    })
    .from(noteShares)
    .innerJoin(notes, eq(noteShares.noteId, notes.id))
    .innerJoin(inviter, eq(noteShares.invitedByUserId, inviter.id))
    .where(
      and(
        eq(noteShares.status, "pending"),
        isNull(notes.deletedAt),
        or(
          eq(noteShares.userId, userId),
          eq(noteShares.email, me.email.toLowerCase()),
        ),
      ),
    )
    .orderBy(desc(noteShares.createdAt));

  return rows.map((row) =>
    serializeShare(row.share, {
      noteTitle: row.noteTitle,
      inviterName: row.inviterName,
    }),
  );
}

export async function respondToShare(
  userId: string,
  shareId: string,
  action: "accept" | "decline",
) {
  const [me] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!me) return null;

  const [share] = await db
    .select()
    .from(noteShares)
    .where(eq(noteShares.id, shareId))
    .limit(1);
  if (!share || share.status !== "pending") return null;

  const isInvitee =
    share.userId === userId ||
    share.email.toLowerCase() === me.email.toLowerCase();
  if (!isInvitee) return null;

  if (action === "decline") {
    await db.delete(noteShares).where(eq(noteShares.id, shareId));
    return { id: shareId, status: "declined" as const };
  }

  await db
    .update(noteShares)
    .set({
      status: "accepted",
      userId,
      updatedAt: new Date(),
    })
    .where(eq(noteShares.id, shareId));

  const [row] = await db
    .select()
    .from(noteShares)
    .where(eq(noteShares.id, shareId))
    .limit(1);
  return serializeShare(row!);
}

export async function removeShare(userId: string, shareId: string) {
  const [share] = await db
    .select()
    .from(noteShares)
    .where(eq(noteShares.id, shareId))
    .limit(1);
  if (!share) return false;

  const access = await getNoteAccess(userId, share.noteId);
  const isOwner = access?.role === "owner";
  const isSelf = share.userId === userId;
  if (!isOwner && !isSelf) return false;

  await db.delete(noteShares).where(eq(noteShares.id, shareId));
  return true;
}

export async function listSharedWithMe(userId: string) {
  const rows = await db
    .select({
      note: notes,
      role: noteShares.role,
    })
    .from(noteShares)
    .innerJoin(notes, eq(noteShares.noteId, notes.id))
    .where(
      and(
        eq(noteShares.userId, userId),
        eq(noteShares.status, "accepted"),
        isNull(notes.deletedAt),
      ),
    )
    .orderBy(desc(notes.updatedAt));

  return rows.map((row) => ({
    ...row.note,
    deletedAt: row.note.deletedAt?.toISOString() ?? null,
    createdAt: row.note.createdAt.toISOString(),
    updatedAt: row.note.updatedAt.toISOString(),
    sharedRole: row.role,
    isShared: true as const,
    tags: [] as Array<{ id: string; name: string; color: string }>,
  }));
}

export async function searchNotes(userId: string, query: string) {
  const q = query.trim();
  if (!q) return [];

  const pattern = `%${q}%`;

  const owned = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.userId, userId),
        isNull(notes.deletedAt),
        or(ilike(notes.title, pattern), ilike(notes.content, pattern)),
      ),
    )
    .orderBy(desc(notes.updatedAt))
    .limit(20);

  const shared = await db
    .select({ note: notes })
    .from(noteShares)
    .innerJoin(notes, eq(noteShares.noteId, notes.id))
    .where(
      and(
        eq(noteShares.userId, userId),
        eq(noteShares.status, "accepted"),
        isNull(notes.deletedAt),
        or(ilike(notes.title, pattern), ilike(notes.content, pattern)),
      ),
    )
    .orderBy(desc(notes.updatedAt))
    .limit(20);

  const map = new Map<string, (typeof owned)[number]>();
  for (const row of owned) map.set(row.id, row);
  for (const row of shared) map.set(row.note.id, row.note);

  return [...map.values()].map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function countPendingInvites(userId: string) {
  const [me] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!me) return 0;

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(noteShares)
    .where(
      and(
        eq(noteShares.status, "pending"),
        or(
          eq(noteShares.userId, userId),
          eq(noteShares.email, me.email.toLowerCase()),
        ),
      ),
    );
  return row?.count ?? 0;
}
