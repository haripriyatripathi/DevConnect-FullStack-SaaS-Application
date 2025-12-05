import { Link, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, LogOut, UserPlus, Home, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Get initials from name
function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">DevConnect</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/developer/add" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Add Developer
                </Link>
              </Button>
              
              {/* User Avatar & Name */}
              <div className="flex items-center gap-2 ml-2 px-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                  "bg-primary/10 text-primary border border-primary/20"
                )}>
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
                <span className="text-sm font-medium text-foreground">{user?.name || 'User'}</span>
              </div>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-1">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && isAuthenticated && (
        <div className="md:hidden border-t border-border animate-fade-in bg-card">
          <div className="px-4 py-3 space-y-2">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border mb-2 pb-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                "bg-primary/10 text-primary border border-primary/20"
              )}>
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              <div>
                <p className="font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              to="/developer/add"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus className="w-4 h-4" />
              Add Developer
            </Link>
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
