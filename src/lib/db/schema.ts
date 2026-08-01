import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  twoFactorEnabled: boolean("twoFactorEnabled").default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const twoFactor = pgTable("twoFactor", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backupCodes").notNull(),
  verified: boolean("verified").default(true),
  failedVerificationCount: integer("failedVerificationCount").default(0),
  lockedUntil: timestamp("lockedUntil"),
});

export const spaces = pgTable("spaces", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  sortOrder: integer("sortOrder").notNull().default(0),
  isFavorite: boolean("isFavorite").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  spaceId: text("spaceId")
    .notNull()
    .references(() => spaces.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull().default("Untitled"),
  content: text("content").notNull().default(""),
  summary: text("summary"),
  isPinned: boolean("isPinned").notNull().default(false),
  isFavorite: boolean("isFavorite").notNull().default(false),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#3b82f6"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const noteTags = pgTable(
  "note_tags",
  {
    noteId: text("noteId")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: text("tagId")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.noteId, table.tagId] })],
);

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  noteId: text("noteId")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  text: text("text").notNull().default(""),
  isCompleted: boolean("isCompleted").notNull().default(false),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const attachments = pgTable("attachments", {
  id: text("id").primaryKey(),
  noteId: text("noteId")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fileName: text("fileName").notNull(),
  fileSize: integer("fileSize").notNull().default(0),
  mimeType: text("mimeType").notNull().default("application/octet-stream"),
  /** link = external URL, db = bytes in data column, blob = Vercel Blob URL */
  storage: text("storage").notNull().default("link"),
  url: text("url"),
  data: text("data"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const noteShares = pgTable("note_shares", {
  id: text("id").primaryKey(),
  noteId: text("noteId")
    .notNull()
    .references(() => notes.id, { onDelete: "cascade" }),
  invitedByUserId: text("invitedByUserId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  userId: text("userId").references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("editor"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  link: text("link"),
  noteId: text("noteId").references(() => notes.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
