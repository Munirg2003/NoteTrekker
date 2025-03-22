import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Link, Code, Image, Table,
  CheckSquare 
} from "lucide-react";

interface MarkdownToolbarProps {
  onAction: (action: string) => void;
}

const MarkdownToolbar = ({ onAction }: MarkdownToolbarProps) => {
  return (
    <div className="markdown-toolbar flex flex-wrap">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Bold" 
        onClick={() => onAction('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8" 
        title="Italic" 
        onClick={() => onAction('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Heading 1" 
        onClick={() => onAction('h1')}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Heading 2" 
        onClick={() => onAction('h2')}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hidden sm:flex"
        title="Heading 3" 
        onClick={() => onAction('h3')}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Bulleted List" 
        onClick={() => onAction('ul')}
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Numbered List" 
        onClick={() => onAction('ol')}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Task List" 
        onClick={() => onAction('task')}
      >
        <CheckSquare className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Link" 
        onClick={() => onAction('link')}
      >
        <Link className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        title="Code" 
        onClick={() => onAction('code')}
      >
        <Code className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hidden sm:flex"
        title="Image" 
        onClick={() => onAction('image')}
      >
        <Image className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hidden md:flex"
        title="Table" 
        onClick={() => onAction('table')}
      >
        <Table className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MarkdownToolbar;
