import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Tag } from "lucide-react";
import { Note, Tag as TagType } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SortAsc, ListFilter } from "lucide-react";

interface NoteWithTags extends Note {
  tags?: TagType[];
}

interface NoteListProps {
  notes: NoteWithTags[];
  activeNoteId?: number;
  onSelectNote: (note: NoteWithTags) => void;
  title: string;
  isVisible: boolean;
  onClose?: () => void;
}

const NoteList = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  title,
  isVisible,
  onClose
}: NoteListProps) => {
  // Format date for display
  const formatDate = (date: Date | string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={cn(
      "w-full sm:w-80 lg:w-96 border-r border-border bg-card overflow-hidden flex flex-col h-full",
      "fixed sm:relative inset-0 z-40 sm:z-auto transition-transform sm:transform-none",
      isVisible ? "translate-x-0" : "translate-x-full sm:translate-x-0"
    )}>
      <div className="p-2 border-b border-border bg-muted flex items-center justify-between">
        <div className="text-sm font-medium">{title} ({notes.length} notes)</div>
        <div className="flex">
          <Button variant="ghost" size="icon" title="Sort" className="h-8 w-8">
            <SortAsc className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="View Options" className="h-8 w-8">
            <ListFilter className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="sm:hidden h-8 w-8"
            >
              &times;
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "note-item p-3 cursor-pointer hover:bg-accent",
                note.id === activeNoteId && "active"
              )}
              onClick={() => onSelectNote(note)}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className={cn(
                  "font-medium truncate",
                  note.id === activeNoteId && "text-primary"
                )}>
                  {note.title}
                </h3>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              
              <div className="text-sm text-muted-foreground line-clamp-2">
                {/* Remove markdown syntax for preview */}
                {note.content.replace(/[#*_~`[\]()]/g, '').substring(0, 100)}
              </div>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>{note.tags.map(t => t.name).join(', ')}</span>
                </div>
              )}
            </div>
          ))}
          
          {notes.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              No notes found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NoteList;
