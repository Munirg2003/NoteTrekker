import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertNotebookSchema, 
  insertTagSchema, 
  insertNoteSchema, 
  insertSearchHistorySchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // NOTEBOOKS
  
  // Get all notebooks
  app.get("/api/notebooks", async (req, res) => {
    try {
      const notebooks = await storage.getNotebooks();
      // Count notes in each notebook
      const notebookCounts = await Promise.all(
        notebooks.map(async (notebook) => {
          const notes = await storage.getNotes(notebook.id);
          return {
            ...notebook,
            noteCount: notes.length
          };
        })
      );
      res.json(notebookCounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notebooks" });
    }
  });
  
  // Get a notebook by id
  app.get("/api/notebooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notebook = await storage.getNotebook(id);
      
      if (!notebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }
      
      const notes = await storage.getNotes(id);
      
      res.json({
        ...notebook,
        noteCount: notes.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notebook" });
    }
  });
  
  // Create a new notebook
  app.post("/api/notebooks", async (req, res) => {
    try {
      const validatedData = insertNotebookSchema.parse(req.body);
      const notebook = await storage.createNotebook(validatedData);
      res.status(201).json(notebook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notebook data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create notebook" });
    }
  });
  
  // Update a notebook
  app.patch("/api/notebooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNotebookSchema.partial().parse(req.body);
      const updatedNotebook = await storage.updateNotebook(id, validatedData);
      
      if (!updatedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }
      
      res.json(updatedNotebook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notebook data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update notebook" });
    }
  });
  
  // Delete a notebook
  app.delete("/api/notebooks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNotebook(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Notebook not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete notebook" });
    }
  });
  
  // NOTES
  
  // Get all notes (optionally filtered by notebook)
  app.get("/api/notes", async (req, res) => {
    try {
      const notebookId = req.query.notebookId ? parseInt(req.query.notebookId as string) : undefined;
      const notes = await storage.getNotes(notebookId);
      
      // Optionally include tags
      if (req.query.includeTags === "true") {
        const notesWithTags = await Promise.all(
          notes.map(async (note) => {
            const tags = await storage.getNoteTags(note.id);
            return {
              ...note,
              tags
            };
          })
        );
        return res.json(notesWithTags);
      }
      
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });
  
  // Get a note by id
  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNote(id);
      
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      // Get tags for this note
      const tags = await storage.getNoteTags(id);
      
      res.json({
        ...note,
        tags
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });
  
  // Create a new note
  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      
      // Handle tags if they were provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        const tagPromises = req.body.tags.map(async (tagName: string) => {
          // Get or create tag
          let tag = await storage.getTagByName(tagName);
          if (!tag) {
            tag = await storage.createTag({ name: tagName });
          }
          
          // Associate tag with note
          await storage.addTagToNote(note.id, tag.id);
          
          return tag;
        });
        
        const tags = await Promise.all(tagPromises);
        
        return res.status(201).json({
          ...note,
          tags
        });
      }
      
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create note" });
    }
  });
  
  // Update a note
  app.patch("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNoteSchema.partial().parse(req.body);
      const updatedNote = await storage.updateNote(id, validatedData);
      
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      // Handle tags if they were provided
      if (req.body.tags && Array.isArray(req.body.tags)) {
        // Get current tags
        const currentTags = await storage.getNoteTags(id);
        const currentTagNames = currentTags.map(tag => tag.name);
        const newTagNames = req.body.tags as string[];
        
        // Remove tags that are no longer present
        for (const tag of currentTags) {
          if (!newTagNames.includes(tag.name)) {
            await storage.removeTagFromNote(id, tag.id);
          }
        }
        
        // Add new tags
        const tagPromises = newTagNames
          .filter(tagName => !currentTagNames.includes(tagName))
          .map(async (tagName) => {
            // Get or create tag
            let tag = await storage.getTagByName(tagName);
            if (!tag) {
              tag = await storage.createTag({ name: tagName });
            }
            
            // Associate tag with note
            await storage.addTagToNote(id, tag.id);
            
            return tag;
          });
        
        await Promise.all(tagPromises);
      }
      
      // Get updated tags
      const tags = await storage.getNoteTags(id);
      
      res.json({
        ...updatedNote,
        tags
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update note" });
    }
  });
  
  // Delete a note
  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNote(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });
  
  // TAGS
  
  // Get all tags
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      
      // Count notes for each tag
      const tagsWithCount = await Promise.all(
        tags.map(async (tag) => {
          const noteIds = await storage.getNoteIdsByTag(tag.id);
          return {
            ...tag,
            noteCount: noteIds.length
          };
        })
      );
      
      res.json(tagsWithCount);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });
  
  // Get notes by tag
  app.get("/api/tags/:id/notes", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tag = await storage.getTag(id);
      
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      const noteIds = await storage.getNoteIdsByTag(id);
      const notes = await Promise.all(
        noteIds.map(async (noteId) => {
          const note = await storage.getNote(noteId);
          if (!note) return null;
          
          const tags = await storage.getNoteTags(noteId);
          
          return {
            ...note,
            tags
          };
        })
      );
      
      // Filter out any null values (from notes that might have been deleted)
      const validNotes = notes.filter(Boolean);
      
      res.json(validNotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes by tag" });
    }
  });
  
  // Create a new tag
  app.post("/api/tags", async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tag data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tag" });
    }
  });
  
  // Delete a tag
  app.delete("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTag(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });
  
  // SEARCH
  
  // Search notes
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      
      if (!query.trim()) {
        return res.json([]);
      }
      
      const results = await storage.searchNotes(query);
      
      // Add tags to search results
      const resultsWithTags = await Promise.all(
        results.map(async (note) => {
          const tags = await storage.getNoteTags(note.id);
          return {
            ...note,
            tags
          };
        })
      );
      
      // Save search query to history
      if (query.trim()) {
        await storage.addSearchHistory({ query });
      }
      
      res.json(resultsWithTags);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });
  
  // Get search history
  app.get("/api/search/history", async (req, res) => {
    try {
      const history = await storage.getSearchHistory();
      // Limit to 10 most recent searches
      res.json(history.slice(0, 10));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });
  
  // Clear search history
  app.delete("/api/search/history", async (req, res) => {
    try {
      // This is not implemented in the storage interface yet
      // For now, just return success
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear search history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
