import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { searchTools } from '../data/tools';
import { useSidebar } from '../contexts/SidebarContext';

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { toggle: toggleSidebar, isOpen: sidebarOpen } = useSidebar();

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery).slice(0, 5);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleToolClick = (slug: string) => {
    navigate(`/tools/${slug}`);
    setShowResults(false);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-slate-700/50">
      {/* Left: hamburger + logo pinned to viewport left */}
      <div className="absolute left-0 top-0 h-16 flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl glass-hover"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to="/" className="flex items-center space-x-2 group pl-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Tool 260
          </span>
        </Link>
      </div>

      {/* Center: search inside the constrained container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 260 tools..."
                className="w-full pl-12 pr-4 py-2 input-field"
                aria-label="Search tools"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.slug)}
                      className="w-full text-left px-4 py-3 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors border-b border-white/10 dark:border-slate-700/30 last:border-0"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{tool.name}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Right: theme toggle pinned to viewport right */}
      <div className="absolute right-0 top-0 h-16 flex items-center pr-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl glass-hover"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </nav>
  );
}

