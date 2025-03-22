import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Note, Notebook, Tag, InsertNote } from "@shared/schema";

// Get all notebooks
export function useNotebooks() {
  return useQuery({
    queryKey: ['/api/notebooks'],
  });
}

// Get a specific notebook
export function useNotebook(id: number) {
  return useQuery({
    queryKey: ['/api/notebooks', id],
    enabled: !!id,
  });
}

// Get all tags
export function useTags() {
  return useQuery({
    queryKey: ['/api/tags'],
  });
}

// Get all notes
export function useNotes(notebookId?: number) {
  const queryParams = notebookId ? `?notebookId=${notebookId}&includeTags=true` : '?includeTags=true';
  
  return useQuery({
    queryKey: ['/api/notes', notebookId],
    queryFn: async () => {
      const response = await fetch(`/api/notes${queryParams}`);
      return await response.json();
    },
  });
}

// Get a specific note
export function useNote(id: number) {
  return useQuery({
    queryKey: ['/api/notes', id],
    enabled: !!id,
  });
}

// Get notes by tag
export function useNotesByTag(tagId: number) {
  return useQuery({
    queryKey: ['/api/tags', tagId, 'notes'],
    enabled: !!tagId,
  });
}

// Search notes
export function useSearchNotes(query: string) {
  return useQuery({
    queryKey: ['/api/search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      return await response.json();
    },
    enabled: query.trim().length > 0,
  });
}

// Create a note
export function useCreateNote() {
  return useMutation({
    mutationFn: async (note: InsertNote) => {
      const response = await apiRequest('POST', '/api/notes', note);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });
}

// Update a note
export function useUpdateNote() {
  return useMutation({
    mutationFn: async ({ id, note }: { id: number, note: Partial<InsertNote> }) => {
      const response = await apiRequest('PATCH', `/api/notes/${id}`, note);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes', variables.id] });
    },
  });
}

// Delete a note
export function useDeleteNote() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/notes/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
    },
  });
}

// Get search history
export function useSearchHistory() {
  return useQuery({
    queryKey: ['/api/search/history'],
  });
}

// Create a notebook
export function useCreateNotebook() {
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest('POST', '/api/notebooks', { name });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
    },
  });
}

// Create a tag
export function useCreateTag() {
  return useMutation({
    mutationFn: async (name: string) => {
      const response = await apiRequest('POST', '/api/tags', { name });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
    },
  });
}
