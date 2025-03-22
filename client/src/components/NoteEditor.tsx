import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Note } from "@shared/schema";

interface NoteEditorProps {
  note: Note;
  onChange: (note: Partial<Note>) => void;
}

const NoteEditor = ({ note, onChange }: NoteEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [note.content]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ content: e.target.value });
  };

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <Input
        type="text"
        value={note.title}
        onChange={handleTitleChange}
        className="w-full mb-4 text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
        placeholder="Note title"
      />
      
      <Textarea
        ref={textareaRef}
        className="markdown-editor w-full h-auto min-h-[calc(100vh-200px)] p-0 m-0 bg-transparent border-none focus:outline-none focus:ring-0 resize-none font-mono text-sm"
        value={note.content}
        onChange={handleContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};

export default NoteEditor;
