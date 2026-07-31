import { and, eq, or } from "drizzle-orm";

import { db, noteShares, notes } from "@/lib/db";

export type NoteAccessRole = "owner" | "editor" | "viewer";

export type NoteAccess = {
  noteId: string;
  ownerId: string;
  role: NoteAccessRole;
  canEdit: boolean;
  canShare: boolean;
};

export async function getNoteAccess(
  userId: string,
  noteId: string,
): Promise<NoteAccess | null> {
  const [note] = await db
    .select({ id: notes.id, userId: notes.userId })
    .from(notes)
    .where(eq(notes.id, noteId))
    .limit(1);

  if (!note) return null;

  if (note.userId === userId) {
    return {
      noteId: note.id,
      ownerId: note.userId,
      role: "owner",
      canEdit: true,
      canShare: true,
    };
  }

  const [share] = await db
    .select()
    .from(noteShares)
    .where(
      and(
        eq(noteShares.noteId, noteId),
        eq(noteShares.userId, userId),
        eq(noteShares.status, "accepted"),
      ),
    )
    .limit(1);

  if (!share) return null;

  const role: NoteAccessRole = share.role === "viewer" ? "viewer" : "editor";
  return {
    noteId: note.id,
    ownerId: note.userId,
    role,
    canEdit: role === "editor",
    canShare: false,
  };
}

export async function requireNoteAccess(
  userId: string,
  noteId: string,
  mode: "read" | "edit" | "share" = "read",
) {
  const access = await getNoteAccess(userId, noteId);
  if (!access) return null;
  if (mode === "edit" && !access.canEdit) return null;
  if (mode === "share" && !access.canShare) return null;
  return access;
}

export function sharedNoteCondition(userId: string) {
  return or(
    eq(notes.userId, userId),
    and(
      eq(noteShares.userId, userId),
      eq(noteShares.status, "accepted"),
      eq(noteShares.noteId, notes.id),
    ),
  );
}
