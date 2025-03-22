import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useLocalStorage";
import { 
  Search, Menu, Plus, RefreshCw, Moon, Sun, Settings,
  ChevronLeft
} from "lucide-react";

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
  onNewNote: () => void;
  showBackButton?: boolean;
}

const Header = ({ 
  onSearch, 
  onToggleSidebar, 
  onNewNote, 
  showBackButton 
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme } = useTheme();
  const [_, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-card dark:bg-card shadow-sm border-b border-border flex items-center justify-between p-2">
      <div className="flex items-center">
        {showBackButton ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setLocation("/notes")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <Link href="/" className="flex items-center ml-2">
          <img 
            src="https://joplinapp.org/images/Icon512.png" 
            alt="Joplin Logo" 
            className="w-6 h-6 mr-2" 
          />
          <h1 className="text-lg font-medium hidden sm:block">Joplin</h1>
        </Link>
      </div>
      
      <div className="flex items-center space-x-1">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 pr-4 py-1.5 h-9 w-[150px] md:w-[200px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
        </form>
        
        <Button variant="ghost" size="icon" title="New Note" onClick={onNewNote}>
          <Plus className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" title="Sync Notes">
          <RefreshCw className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          title="Toggle Theme"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon" title="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
