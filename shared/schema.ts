import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Notebooks table
export const notebooks = pgTable("notebooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").default("folder"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotebookSchema = createInsertSchema(notebooks).omit({
  id: true,
  createdAt: true,
});

// Tags table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  notebookId: integer("notebook_id").references(() => notebooks.id),
  isPinned: boolean("is_pinned").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

// NoteTags junction table
export const noteTags = pgTable("note_tags", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id).notNull(),
  tagId: integer("tag_id").references(() => tags.id).notNull(),
});

export const insertNoteTagSchema = createInsertSchema(noteTags).omit({
  id: true,
});

// Search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true,
});

// Types
export type Notebook = typeof notebooks.$inferSelect;
export type InsertNotebook = z.infer<typeof insertNotebookSchema>;

export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;

export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;

export type NoteTag = typeof noteTags.$inferSelect;
export type InsertNoteTag = z.infer<typeof insertNoteTagSchema>;

export type SearchHistoryItem = typeof searchHistory.$inferSelect;
export type InsertSearchHistoryItem = z.infer<typeof insertSearchHistorySchema>;
