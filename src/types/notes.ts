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
