import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, useRoute } from "wouter";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NoteList from "@/components/NoteList";
import NoteContent from "@/components/NoteContent";
import { Note, Tag, Notebook, SearchHistoryItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";

interface NoteWithTags extends Note {
  tags?: Tag[];
}

const Notes = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();
  const [isSearchMatch, searchParams] = useRoute("/search");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isNoteListVisible, setNoteListVisible] = useState(false);
  const [activeNote, setActiveNote] = useState<NoteWithTags | null>(null);
  const [newNotebookDialogOpen, setNewNotebookDialogOpen] = useState(false);
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();
  const isMobile = useMobile();
  
  // Get query string parameters
  const searchQuery = isSearchMatch 
    ? new URLSearchParams(window.location.search).get('q') || ""
    : "";
  
  // Fetch notebooks
  const { data: notebooks = [] } = useQuery({
    queryKey: ['/api/notebooks'],
  });
  
  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['/api/tags'],
  });
  
  // Fetch search history
  const { data: searchHistory = [] } = useQuery({
    queryKey: ['/api/search/history'],
  });
  
  // Fetch notes based on current view (all, notebook, tag, search)
  const getNotesQueryKey = () => {
    if (isSearchMatch && searchQuery) {
      return ['/api/search', searchQuery];
    }
    
    if (params.tagId) {
      return ['/api/tags', params.tagId, 'notes'];
    }
    
    if (params.notebookId) {
      return ['/api/notes', { notebookId: params.notebookId }];
    }
    
    return ['/api/notes', { includeTags: 'true' }];
  };
  
  const { 
    data: notes = [], 
    isLoading: isLoadingNotes 
  } = useQuery({
    queryKey: getNotesQueryKey(),
    queryFn: async ({ queryKey }) => {
      const [endpoint, param, subpath] = queryKey;
      
      if (endpoint === '/api/search') {
        return await (await fetch(`${endpoint}?q=${encodeURIComponent(param as string)}`)).json();
      }
      
      if (endpoint === '/api/tags' && subpath === 'notes') {
        return await (await fetch(`${endpoint}/${param}/notes`)).json();
      }
      
      if (endpoint === '/api/notes' && typeof param === 'object') {
        const queryParams = new URLSearchParams();
        Object.entries(param).forEach(([key, value]) => {
          queryParams.append(key, value as string);
        });
        return await (await fetch(`${endpoint}?${queryParams}`)).json();
      }
      
      return await (await fetch(`${endpoint}`)).json();
    }
  });
  
  // Create notebook mutation
  const createNotebookMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest('POST', '/api/notebooks', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      setNewNotebookDialogOpen(false);
      setNewNotebookName("");
      toast({
        title: "Notebook created",
        description: "Your new notebook has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create notebook.",
        variant: "destructive"
      });
    }
  });
  
  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: async (name: string) => {
      return await apiRequest('POST', '/api/tags', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      setNewTagDialogOpen(false);
      setNewTagName("");
      toast({
        title: "Tag created",
        description: "Your new tag has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create tag.",
        variant: "destructive"
      });
    }
  });
  
  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (notebookId?: number) => {
      const data = {
        title: "Untitled Note",
        content: "",
        notebookId
      };
      return await apiRequest('POST', '/api/notes', data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setActiveNote(data);
      toast({
        title: "Note created",
        description: "Your new note has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note.",
        variant: "destructive"
      });
    }
  });
  
  // Set active note when notes are loaded
  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
    } else if (notes.length === 0) {
      setActiveNote(null);
    } else if (activeNote && !notes.find((note: NoteWithTags) => note.id === activeNote.id)) {
      // If active note is no longer in the list, select the first note
      setActiveNote(notes[0]);
    }
  }, [notes, activeNote]);
  
  // Determine page title based on current view
  const getPageTitle = () => {
    if (isSearchMatch && searchQuery) {
      return `Search: ${searchQuery}`;
    }
    
    if (params.tagId) {
      const tag = tags.find((t: Tag) => t.id === parseInt(params.tagId as string));
      return tag ? `Tag: ${tag.name}` : "Tag";
    }
    
    if (params.notebookId) {
      const notebook = notebooks.find((n: Notebook) => n.id === parseInt(params.notebookId as string));
      return notebook ? notebook.name : "Notebook";
    }
    
    return "All Notes";
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };
  
  // Handle new note creation
  const handleNewNote = () => {
    const notebookId = params.notebookId ? parseInt(params.notebookId) : undefined;
    createNoteMutation.mutate(notebookId);
  };
  
  // Handle note selection
  const handleSelectNote = (note: NoteWithTags) => {
    setActiveNote(note);
    if (isMobile) {
      setNoteListVisible(false);
    }
  };
  
  // Handle note update
  const handleNoteUpdated = (updatedNote: NoteWithTags) => {
    setActiveNote(updatedNote);
  };
  
  // Handle new notebook
  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      createNotebookMutation.mutate(newNotebookName);
    }
  };
  
  // Handle new tag
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      createTagMutation.mutate(newTagName);
    }
  };
  
  // Get active item ID for sidebar
  const getActiveId = () => {
    if (params.notebookId) {
      return `notebook-${params.notebookId}`;
    }
    
    if (params.tagId) {
      return `tag-${params.tagId}`;
    }
    
    return "";
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header 
        onSearch={handleSearch}
        onToggleSidebar={() => setSidebarOpen(true)}
        onNewNote={handleNewNote}
        showBackButton={isMobile && !isNoteListVisible && activeNote !== null}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          notebooks={notebooks}
          tags={tags}
          recentSearches={searchHistory}
          activeId={getActiveId()}
          onNewNotebook={() => setNewNotebookDialogOpen(true)}
          onNewTag={() => setNewTagDialogOpen(true)}
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Note List */}
          <NoteList 
            notes={notes}
            activeNoteId={activeNote?.id}
            onSelectNote={handleSelectNote}
            title={getPageTitle()}
            isVisible={isMobile ? isNoteListVisible : true}
            onClose={() => setNoteListVisible(false)}
          />
          
          {/* Note Content */}
          {activeNote ? (
            <NoteContent 
              note={activeNote}
              onShowNoteList={() => setNoteListVisible(true)}
              onNoteUpdated={handleNoteUpdated}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-card p-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No Note Selected</h2>
                <p className="text-muted-foreground mb-4">
                  {notes.length === 0 
                    ? "Create your first note to get started"
                    : "Select a note from the list or create a new one"}
                </p>
                <Button onClick={handleNewNote}>Create New Note</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* New Notebook Dialog */}
      <Dialog open={newNotebookDialogOpen} onOpenChange={setNewNotebookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateNotebook();
          }}>
            <div className="py-4">
              <Input
                placeholder="Notebook name"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setNewNotebookDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!newNotebookName.trim() || createNotebookMutation.isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* New Tag Dialog */}
      <Dialog open={newTagDialogOpen} onOpenChange={setNewTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateTag();
          }}>
            <div className="py-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setNewTagDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!newTagName.trim() || createTagMutation.isPending}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notes;
