import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { categories, getToolsByCategory } from '../data/tools';
import { useSidebar } from '../contexts/SidebarContext';

export default function Sidebar() {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const location = useLocation();
  const { isOpen, close } = useSidebar();

  // Close sidebar when route changes on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Keep sidebar open on desktop
      } else {
        // Close sidebar on mobile after navigation
        close();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [close]);

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (window.innerWidth < 1024) {
      close();
    }
  }, [location.pathname, close]);

  const toggleCategory = (category: string) => {
    const newOpen = new Set(openCategories);
    if (newOpen.has(category)) {
      newOpen.delete(category);
    } else {
      newOpen.add(category);
    }
    setOpenCategories(newOpen);
  };

  const isActive = (slug: string) => {
    return location.pathname === `/tools/${slug}`;
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 glass border-r border-white/20 dark:border-slate-700/50 overflow-y-auto z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 lg:top-0 lg:bottom-auto lg:w-full lg:max-w-[16rem] lg:z-auto`}
      >
        <div className="p-4">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <span className="font-semibold text-slate-900 dark:text-slate-100">Menu</span>
            <button
              onClick={close}
              className="p-2 rounded-lg glass-hover"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
          {categories.map((category) => {
            const tools = getToolsByCategory(category);
            const isOpen = openCategories.has(category);
            
            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-hover text-left font-semibold text-slate-700 dark:text-slate-200"
                >
                  <span className="text-sm">{category}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {tools.map((tool) => (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive(tool.slug)
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          </nav>
        </div>
      </aside>
    </>
  );
}

