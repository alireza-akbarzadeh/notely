export type NoteTag = {
  id: string;
  name: string;
  color: string;
};

export type NoteSummary = {
  id: string;
  spaceId: string;
  userId: string;
  title: string;
  content: string;
  summary: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags: NoteTag[];
};

export type SpaceSummary = {
  id: string;
  userId: string;
  name: string;
  icon: string | null;
  sortOrder: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NoteTask = {
  id: string;
  noteId: string;
  userId: string;
  text: string;
  isCompleted: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type NoteAttachment = {
  id: string;
  noteId: string;
  userId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storage: string;
  url: string | null;
  createdAt: string;
};
