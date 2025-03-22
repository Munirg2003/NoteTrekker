import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { FolderIcon, Tag, History, PlusCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Notebook, Tag as TagType, SearchHistoryItem } from "@shared/schema";

interface SidebarProps {
  notebooks: (Notebook & { noteCount: number })[];
  tags: (TagType & { noteCount: number })[];
  recentSearches: SearchHistoryItem[];
  activeId?: string;
  onNewNotebook: () => void;
  onNewTag: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ 
  notebooks, 
  tags, 
  recentSearches, 
  activeId, 
  onNewNotebook,
  onNewTag,
  isOpen,
  onClose
}: SidebarProps) => {
  const [location] = useLocation();
  
  const isActiveNotebook = (id: number) => {
    return location === `/notes/${id}` || activeId === `notebook-${id}`;
  };
  
  const isActiveTag = (id: number) => {
    return location === `/tags/${id}` || activeId === `tag-${id}`;
  };

  return (
    <div 
      className={cn(
        "w-64 border-r border-border bg-sidebar dark:bg-sidebar-background text-sidebar-foreground fixed md:relative inset-0 z-50 md:z-auto transition-transform md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 md:hidden" 
        onClick={onClose}
      >
        &times;
      </Button>
      
      <ScrollArea className="h-full">
        <div className="p-2">
          {/* Notebooks Section */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-sidebar-foreground/80">NOTEBOOKS</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onNewNotebook}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1 mb-4">
            <Link href="/notes">
              <div className={cn(
                "sidebar-item flex items-center px-2 py-1.5 cursor-pointer hover:bg-sidebar-accent",
                location === "/notes" && "active"
              )}>
                <FolderIcon className="mr-2 h-4 w-4 text-sidebar-foreground/70" />
                <span>All Notes</span>
              </div>
            </Link>
            
            {notebooks.map((notebook) => (
              <Link key={notebook.id} href={`/notes/${notebook.id}`}>
                <div className={cn(
                  "sidebar-item flex items-center px-2 py-1.5 cursor-pointer hover:bg-sidebar-accent",
                  isActiveNotebook(notebook.id) && "active"
                )}>
                  <FolderIcon className="mr-2 h-4 w-4 text-sidebar-foreground/70" />
                  <span>{notebook.name}</span>
                  <span className="ml-auto text-xs text-sidebar-foreground/60">{notebook.noteCount}</span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Tags Section */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-medium text-sidebar-foreground/80">TAGS</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={onNewTag}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-1 mb-4">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/tags/${tag.id}`}>
                <div className={cn(
                  "sidebar-item flex items-center px-2 py-1.5 cursor-pointer hover:bg-sidebar-accent",
                  isActiveTag(tag.id) && "active"
                )}>
                  <Tag className="mr-2 h-4 w-4 text-sidebar-foreground/70" />
                  <span>{tag.name}</span>
                  <span className="ml-auto text-xs text-sidebar-foreground/60">{tag.noteCount}</span>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-medium text-sidebar-foreground/80">RECENT SEARCHES</h2>
              </div>
              
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <Link 
                    key={search.id} 
                    href={`/search?q=${encodeURIComponent(search.query)}`}
                  >
                    <div className="sidebar-item flex items-center px-2 py-1.5 cursor-pointer hover:bg-sidebar-accent">
                      <History className="mr-2 h-4 w-4 text-sidebar-foreground/70" />
                      <span>{search.query}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
