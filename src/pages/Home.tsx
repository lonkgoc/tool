import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import { Helmet } from 'react-helmet-async';
import { categories, tools, searchTools } from '../data/tools';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter out homepage entry (id "0") from regular display
  const actualTools = tools.filter(t => t.id !== "0");
  const featuredTools = actualTools.slice(0, 8);
  const filteredTools = searchQuery ? searchTools(searchQuery) : actualTools;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        <Helmet>
          <title>Tool 260 - Free Online Tools & Converters (No Account Needed)</title>
          <meta name="description" content="Tool 260 (Tool 260) provides 260+ free online tools for developers and daily tasks. Convert files, edit images, and calculate finance with Tool 260." />
          <meta name="keywords" content="tool 260, tool260, tool 260 free, tool 260 com, tool260.com, free online tools, online converters" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Tool 260",
              "alternateName": "Tool260",
              "url": "https://tool260.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tool260.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })}
          </script>
        </Helmet>
        {/* Hero Section */}
        <section className="text-center py-12 lg:py-20 animate-fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tool 260 - Free Online Tools
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            Tool 260: Official Online Utility Suite & Converters
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto">
            Your ultimate digital toolbox. Not a hardware kit—we provide 260+ free online software tools, calculators, and converters.
          </p>

          <div className="max-w-4xl mx-auto mb-16 text-slate-600 dark:text-slate-400 text-lg leading-relaxed space-y-6 text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 text-center mb-6">
              The #1 Choice for Tool 260 Online Utilities
            </h2>
            <p>
              Welcome to <strong>Tool 260</strong>, your premier destination for free, high-quality online utilities.
              We believe that simple tasks shouldn't require complex software or expensive subscriptions.
              That's why we've built a comprehensive library of <strong>260+ free tools</strong> that run directly in your browser, covering everything from <strong>PDF conversion</strong> and <strong>image editing</strong> to <strong>finance calculators</strong> and <strong>developer utilities</strong>.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">⚡ Private & Secure Processing</h3>
                <p>
                  Privacy is built into our DNA. Most of our tools, especially our <strong>file converters</strong> and <strong>image editors</strong>, process data locally on your device.
                  This means your sensitive documents and personal photos never leave your computer, ensuring total data privacy and blazing fast execution.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500/50 transition-colors">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">💎 Professional Tools, Zero Cost</h3>
                <p>
                  Forget about monthly fees or "freemium" limits. Tool 260 provides professional-grade <strong>PDF tools</strong>, <strong>JSON formatters</strong>, and <strong>BMI calculators</strong> completely free.
                  No sign-up, no credit cards, and no watermarks—just the tools you need, whenever you need them.
                </p>
              </div>
            </div>
            <p className="text-center pt-6">
              Browse our categories below to discover powerful <em>SEO tools</em>, <em>text manipulators</em>, and <em>productivity planners</em>.
              Tool 260 is optimized for all devices, so you can convert files or calculate loans on the go.
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
                    to={tool.slug === 'home' ? '/' : `/tools/${tool.slug}`}
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
              const categoryTools = actualTools.filter(t => t.category === category);
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
                to={tool.slug === 'home' ? '/' : `/tools/${tool.slug}`}
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
            {actualTools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.slug === 'home' ? '/' : `/tools/${tool.slug}`}
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

