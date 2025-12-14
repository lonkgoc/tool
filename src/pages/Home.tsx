import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { categories, tools, searchTools } from '../data/tools';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const featuredTools = tools.slice(0, 8);
  const filteredTools = searchQuery ? searchTools(searchQuery) : tools;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12 lg:py-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tool260 - Free Online Tools
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Tool260: Free Online Tools & Converters
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Your all-in-one platform for 260+ free online tools. No sign-up required.
          </p>

          <div className="max-w-3xl mx-auto mb-12 text-slate-600 dark:text-slate-400 prose dark:prose-invert">
            <p>
              Welcome to <strong>Tool260</strong>, the best place for <em>free online file converters</em>, image editors, and developer utilities.
              Whether you need to convert a PDF, resize an image, or minify code, Tool260 provides unlimited access with no registration.
              Our fast, secure, and privacy-focused tools run directly in your browser.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools like 'pdf to word' or 'css minifier'..."
                className="w-full pl-14 pr-6 py-4 text-lg input-field shadow-lg"
                aria-label="Search tools"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
            </div>
            {searchQuery && filteredTools.length > 0 && (
              <div className="mt-4 glass rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto">
                {filteredTools.slice(0, 10).map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.slug}`}
                    className="block px-6 py-4 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors border-b border-white/10 dark:border-slate-700/30 last:border-0 text-left"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{tool.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tool.description}</div>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </section>

        {/* Category Cards */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((category) => {
              const categoryTools = tools.filter(t => t.category === category);
              return (
                <Link
                  key={category}
                  to={`/search?category=${encodeURIComponent(category)}`}
                  className="tool-card group"
                >
                  <div className="text-2xl mb-3">📁</div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {categoryTools.length} tools
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Tools Carousel */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="tool-card"
              >
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* All Tools Grid */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">All Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.slug}`}
                className="tool-card"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

