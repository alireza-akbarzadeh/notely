export type RealtimeEventType =
  | "note.created"
  | "note.updated"
  | "note.deleted"
  | "tasks.changed"
  | "attachments.changed"
  | "ping"
  | "connected";

export type RealtimeEvent = {
  type: RealtimeEventType;
  noteId?: string;
  clientId?: string | null;
  actorUserId?: string;
  at: string;
};

export type RealtimePublishInput = {
  type: Exclude<RealtimeEventType, "ping" | "connected">;
  noteId: string;
  actorUserId: string;
  clientId?: string | null;
};
