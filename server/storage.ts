import {
  notebooks, tags, notes, noteTags, searchHistory,
  type Notebook, type InsertNotebook,
  type Tag, type InsertTag,
  type Note, type InsertNote,
  type NoteTag, type InsertNoteTag,
  type SearchHistoryItem, type InsertSearchHistoryItem
} from "@shared/schema";

export interface IStorage {
  // Notebooks
  getNotebooks(): Promise<Notebook[]>;
  getNotebook(id: number): Promise<Notebook | undefined>;
  createNotebook(notebook: InsertNotebook): Promise<Notebook>;
  updateNotebook(id: number, notebook: Partial<InsertNotebook>): Promise<Notebook | undefined>;
  deleteNotebook(id: number): Promise<boolean>;
  
  // Notes
  getNotes(notebookId?: number): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  
  // Tags
  getTags(): Promise<Tag[]>;
  getTag(id: number): Promise<Tag | undefined>;
  getTagByName(name: string): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<boolean>;
  
  // Note Tags
  getNoteTags(noteId: number): Promise<Tag[]>;
  getNoteIdsByTag(tagId: number): Promise<number[]>;
  addTagToNote(noteId: number, tagId: number): Promise<NoteTag>;
  removeTagFromNote(noteId: number, tagId: number): Promise<boolean>;
  
  // Search
  searchNotes(query: string): Promise<Note[]>;
  getSearchHistory(): Promise<SearchHistoryItem[]>;
  addSearchHistory(query: InsertSearchHistoryItem): Promise<SearchHistoryItem>;
}

export class MemStorage implements IStorage {
  private notebooks: Map<number, Notebook>;
  private notes: Map<number, Note>;
  private tags: Map<number, Tag>;
  private noteTags: Map<number, NoteTag>;
  private searchHistory: Map<number, SearchHistoryItem>;
  
  private notebookIdCounter: number;
  private noteIdCounter: number;
  private tagIdCounter: number;
  private noteTagIdCounter: number;
  private searchHistoryIdCounter: number;
  
  constructor() {
    this.notebooks = new Map();
    this.notes = new Map();
    this.tags = new Map();
    this.noteTags = new Map();
    this.searchHistory = new Map();
    
    this.notebookIdCounter = 1;
    this.noteIdCounter = 1;
    this.tagIdCounter = 1;
    this.noteTagIdCounter = 1;
    this.searchHistoryIdCounter = 1;
    
    // Initialize with some demo data
    this.initializeDemoData();
  }
  
  private initializeDemoData() {
    // Create default notebooks
    const personalNotebook = this.createNotebook({ name: "Personal", icon: "folder" });
    const workNotebook = this.createNotebook({ name: "Work", icon: "folder" });
    const projectsNotebook = this.createNotebook({ name: "Projects", icon: "folder" });
    
    // Create some tags
    const pianoTag = this.createTag({ name: "piano" });
    const storeTag = this.createTag({ name: "store" });
    const carTag = this.createTag({ name: "car" });
    const jellyTag = this.createTag({ name: "jelly" });
    
    // Create some notes
    const note1 = this.createNote({
      title: "Vintage Piano Store Idea",
      content: `## Check this

- [ ] Create website
- [x] Get a logo - done!
- [ ] Check online payment services
- [ ] Setup a few ads
- [x] Schedule meeting with agency

## Meetings this week

| Day | Topic | Notes |
|-----|-------|-------|
| Tue 8 June | Meeting with supplier - ask about that discount | [MeetingNotes.pdf](link) |
| Thu 10 June | Interior design meeting | |

## Poster ideas`,
      notebookId: personalNotebook.id,
      isPinned: false
    });
    
    const note2 = this.createNote({
      title: "Barn conference call",
      content: "Notes from the conference call with barn suppliers...",
      notebookId: workNotebook.id,
      isPinned: false
    });
    
    const note3 = this.createNote({
      title: "Hire accountant",
      content: "Need to hire an accountant for the business...",
      notebookId: personalNotebook.id,
      isPinned: false
    });
    
    const note4 = this.createNote({
      title: "Deploy website",
      content: "Steps to deploy the website to production server...",
      notebookId: projectsNotebook.id,
      isPinned: false
    });
    
    // Add tags to notes
    this.addTagToNote(note1.id, pianoTag.id);
    this.addTagToNote(note1.id, storeTag.id);
    this.addTagToNote(note4.id, storeTag.id);
    this.addTagToNote(note2.id, carTag.id);
    
    // Add search history
    this.addSearchHistory({ query: "meeting notes" });
    this.addSearchHistory({ query: "piano store" });
    this.addSearchHistory({ query: "website design" });
  }
  
  // Notebooks
  async getNotebooks(): Promise<Notebook[]> {
    return Array.from(this.notebooks.values());
  }
  
  async getNotebook(id: number): Promise<Notebook | undefined> {
    return this.notebooks.get(id);
  }
  
  async createNotebook(notebook: InsertNotebook): Promise<Notebook> {
    const id = this.notebookIdCounter++;
    const now = new Date();
    const newNotebook: Notebook = {
      ...notebook,
      id,
      createdAt: now
    };
    this.notebooks.set(id, newNotebook);
    return newNotebook;
  }
  
  async updateNotebook(id: number, notebook: Partial<InsertNotebook>): Promise<Notebook | undefined> {
    const existingNotebook = this.notebooks.get(id);
    if (!existingNotebook) return undefined;
    
    const updatedNotebook = {
      ...existingNotebook,
      ...notebook
    };
    this.notebooks.set(id, updatedNotebook);
    return updatedNotebook;
  }
  
  async deleteNotebook(id: number): Promise<boolean> {
    return this.notebooks.delete(id);
  }
  
  // Notes
  async getNotes(notebookId?: number): Promise<Note[]> {
    let allNotes = Array.from(this.notes.values());
    
    // Sort by updated date (newest first)
    allNotes.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    
    if (notebookId) {
      return allNotes.filter(note => note.notebookId === notebookId);
    }
    
    return allNotes;
  }
  
  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }
  
  async createNote(note: InsertNote): Promise<Note> {
    const id = this.noteIdCounter++;
    const now = new Date();
    const newNote: Note = {
      ...note,
      id,
      updatedAt: now,
      createdAt: now
    };
    this.notes.set(id, newNote);
    return newNote;
  }
  
  async updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined> {
    const existingNote = this.notes.get(id);
    if (!existingNote) return undefined;
    
    const updatedNote = {
      ...existingNote,
      ...note,
      updatedAt: new Date()
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }
  
  async deleteNote(id: number): Promise<boolean> {
    // Delete any note-tag associations
    Array.from(this.noteTags.values())
      .filter(nt => nt.noteId === id)
      .forEach(nt => this.noteTags.delete(nt.id));
    
    return this.notes.delete(id);
  }
  
  // Tags
  async getTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getTag(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }
  
  async getTagByName(name: string): Promise<Tag | undefined> {
    return Array.from(this.tags.values()).find(
      tag => tag.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async createTag(tag: InsertTag): Promise<Tag> {
    const existingTag = await this.getTagByName(tag.name);
    if (existingTag) return existingTag;
    
    const id = this.tagIdCounter++;
    const now = new Date();
    const newTag: Tag = {
      ...tag,
      id,
      createdAt: now
    };
    this.tags.set(id, newTag);
    return newTag;
  }
  
  async updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined> {
    const existingTag = this.tags.get(id);
    if (!existingTag) return undefined;
    
    const updatedTag = {
      ...existingTag,
      ...tag
    };
    this.tags.set(id, updatedTag);
    return updatedTag;
  }
  
  async deleteTag(id: number): Promise<boolean> {
    // Delete any note-tag associations
    Array.from(this.noteTags.values())
      .filter(nt => nt.tagId === id)
      .forEach(nt => this.noteTags.delete(nt.id));
    
    return this.tags.delete(id);
  }
  
  // Note Tags
  async getNoteTags(noteId: number): Promise<Tag[]> {
    const tagIds = Array.from(this.noteTags.values())
      .filter(nt => nt.noteId === noteId)
      .map(nt => nt.tagId);
    
    return tagIds.map(id => this.tags.get(id)!).filter(Boolean);
  }
  
  async getNoteIdsByTag(tagId: number): Promise<number[]> {
    return Array.from(this.noteTags.values())
      .filter(nt => nt.tagId === tagId)
      .map(nt => nt.noteId);
  }
  
  async addTagToNote(noteId: number, tagId: number): Promise<NoteTag> {
    // Check if the association already exists
    const existing = Array.from(this.noteTags.values()).find(
      nt => nt.noteId === noteId && nt.tagId === tagId
    );
    
    if (existing) return existing;
    
    const id = this.noteTagIdCounter++;
    const noteTag: NoteTag = {
      id,
      noteId,
      tagId
    };
    this.noteTags.set(id, noteTag);
    return noteTag;
  }
  
  async removeTagFromNote(noteId: number, tagId: number): Promise<boolean> {
    const noteTagToRemove = Array.from(this.noteTags.values()).find(
      nt => nt.noteId === noteId && nt.tagId === tagId
    );
    
    if (!noteTagToRemove) return false;
    
    return this.noteTags.delete(noteTagToRemove.id);
  }
  
  // Search
  async searchNotes(query: string): Promise<Note[]> {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.notes.values()).filter(note => {
      return (
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
      );
    });
  }
  
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    const items = Array.from(this.searchHistory.values());
    // Sort by created date (newest first)
    return items.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  
  async addSearchHistory(query: InsertSearchHistoryItem): Promise<SearchHistoryItem> {
    // Avoid duplicate entries (keep the most recent)
    const existingQueries = Array.from(this.searchHistory.values())
      .filter(item => item.query.toLowerCase() === query.query.toLowerCase());
    
    // Delete any existing duplicate queries
    existingQueries.forEach(item => this.searchHistory.delete(item.id));
    
    const id = this.searchHistoryIdCounter++;
    const now = new Date();
    const newItem: SearchHistoryItem = {
      ...query,
      id,
      createdAt: now
    };
    
    this.searchHistory.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();
