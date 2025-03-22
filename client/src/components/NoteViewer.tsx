import { useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { Note } from "@shared/schema";

interface NoteViewerProps {
  note: Note;
}

const NoteViewer = ({ note }: NoteViewerProps) => {
  // Render markdown to HTML
  const renderedContent = useMemo(() => {
    return renderMarkdown(note.content);
  }, [note.content]);

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <h1 className="mb-4 text-lg font-semibold">{note.title}</h1>
      
      <div 
        className="markdown-viewer"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </div>
  );
};

export default NoteViewer;
