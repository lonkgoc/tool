import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  toolName?: string;
  category?: string;
}

export default function Breadcrumb({ toolName, category }: BreadcrumbProps) {
  return (
    <nav className="mb-6 flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      {category && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link
            to={`/search?category=${encodeURIComponent(category)}`}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {category}
          </Link>
        </>
      )}
      {toolName && (
        <>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-medium">{toolName}</span>
        </>
      )}
    </nav>
  );
}

