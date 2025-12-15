import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { tools, searchTools, getToolsByCategory } from '../data/tools';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  const results = category
    ? getToolsByCategory(category).filter(t => t.id !== "0")
    : query
      ? searchTools(query)
      : tools.filter(t => t.id !== "0");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {category ? category : query ? `Search Results for "${query}"` : 'All Tools'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Found {results.length} {results.length === 1 ? 'tool' : 'tools'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((tool) => (
            <Link
              key={tool.id}
              to={tool.slug === 'home' ? '/' : `/tools/${tool.slug}`}
              className="tool-card"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {tool.description}
              </p>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {tool.category}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

