import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note, Tag as TagType } from "@shared/schema";
import NoteEditor from "./NoteEditor";
import NoteViewer from "./NoteViewer";
import MarkdownToolbar from "./MarkdownToolbar";
import { 
  ArrowLeft, Pencil, Eye, Info, Tag, MoreHorizontal,
  ChevronLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useMobile } from "@/hooks/use-mobile";

interface NoteWithTags extends Note {
  tags?: TagType[];
}

interface NoteContentProps {
  note: NoteWithTags;
  onShowNoteList: () => void;
  onNoteUpdated: (note: NoteWithTags) => void;
}

const NoteContent = ({ note, onShowNoteList, onNoteUpdated }: NoteContentProps) => {
  const [editedNote, setEditedNote] = useState<NoteWithTags>(note);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('split');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const isMobile = useMobile();
  
  // Update local state when the note prop changes
  useEffect(() => {
    setEditedNote(note);
  }, [note]);
  
  // Apply the edits to the note and save it
  const handleNoteChange = (changes: Partial<Note>) => {
    const updatedNote = { ...editedNote, ...changes };
    setEditedNote(updatedNote);
    
    // Debounce save to reduce API calls
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeout = setTimeout(async () => {
      try {
        await apiRequest('PATCH', `/api/notes/${note.id}`, changes);
        queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
        onNoteUpdated(updatedNote);
      } catch (error) {
        toast({
          title: "Failed to save note",
          description: "Your changes could not be saved. Please try again.",
          variant: "destructive"
        });
      }
    }, 1000);
    
    setSaveTimeout(timeout);
  };
  
  // Insert markdown syntax at cursor position
  const handleMarkdownAction = (action: string) => {
    // This would be implemented to insert markdown syntax
    // at the current cursor position in the editor
    console.log("Markdown action:", action);
  };
  
  const TabView = () => (
    <Tabs 
      defaultValue="split"
      value={viewMode}
      onValueChange={(value) => setViewMode(value as 'edit' | 'preview' | 'split')}
      className="w-full h-full flex flex-col"
    >
      <div className="flex justify-between items-center p-2 border-b border-border bg-muted">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onShowNoteList}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <TabsList>
            <TabsTrigger value="edit" title="Edit">
              <Pencil className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </TabsTrigger>
            <TabsTrigger value="preview" title="Preview">
              <Eye className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="split" title="Split View">
              <span className="hidden sm:inline">Split</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="border-r border-border mx-2 h-6"></div>
          
          <MarkdownToolbar onAction={handleMarkdownAction} />
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" title="Add Tag">
            <Tag className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="Info">
            <Info className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title="More Options">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <TabsContent value="edit" className="flex-1 overflow-hidden m-0 p-0">
        <NoteEditor note={editedNote} onChange={handleNoteChange} />
      </TabsContent>
      
      <TabsContent value="preview" className="flex-1 overflow-hidden m-0 p-0">
        <NoteViewer note={editedNote} />
      </TabsContent>
      
      <TabsContent value="split" className="flex-1 overflow-hidden m-0 p-0 flex">
        <div className="w-1/2 border-r border-border overflow-y-auto">
          <NoteEditor note={editedNote} onChange={handleNoteChange} />
        </div>
        <div className="w-1/2 overflow-y-auto">
          <NoteViewer note={editedNote} />
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="flex-1 flex flex-col bg-card overflow-hidden">
      <TabView />
    </div>
  );
};

export default NoteContent;
