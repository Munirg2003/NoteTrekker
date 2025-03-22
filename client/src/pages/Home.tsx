import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, BookOpen, Tag, Search, 
  Monitor, Smartphone, Laptop, Moon, Sun,
  Github
} from "lucide-react";
import { useTheme } from "@/hooks/useLocalStorage";

const Home = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://joplinapp.org/images/Icon512.png" 
              alt="Joplin Logo" 
              className="w-8 h-8 mr-3" 
            />
            <h1 className="text-2xl font-bold">Joplin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button asChild>
              <Link href="/notes">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your thoughts, organized</h1>
            <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
              A free, open source note-taking app that helps you organize your ideas, tasks and knowledge in markdown format.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button size="lg" asChild>
                <Link href="/notes">Start Taking Notes</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://github.com/laurent22/joplin" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Markdown Support</h3>
                  <p className="text-muted-foreground">
                    Write your notes in Markdown format with support for tables, code blocks, and more.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Notebooks</h3>
                  <p className="text-muted-foreground">
                    Organize your notes into notebooks for better structure and organization.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Tagging System</h3>
                  <p className="text-muted-foreground">
                    Add tags to your notes for easier categorization and filtering.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Powerful Search</h3>
                  <p className="text-muted-foreground">
                    Quickly find your notes with our powerful search functionality.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Dark/Light Theme</h3>
                  <p className="text-muted-foreground">
                    Switch between dark and light themes based on your preference.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                  <p className="text-muted-foreground">
                    Access your notes from any device with our responsive design.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to organize your notes?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start taking notes today and experience the power of organized thinking.
            </p>
            
            <Button size="lg" variant="secondary" asChild>
              <Link href="/notes">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Inspired by <a 
              href="https://joplinapp.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Joplin App
            </a> |&nbsp;
            <a 
              href="https://github.com/laurent22/joplin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
