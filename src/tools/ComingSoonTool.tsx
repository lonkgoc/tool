// Generic component for tools that are coming soon but need a placeholder
import { getToolBySlug } from '../data/tools';
import { useParams } from 'react-router-dom';

interface ComingSoonToolProps {
  slug?: string;
}

export default function ComingSoonTool({ slug: propSlug }: ComingSoonToolProps = {}) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;
  const tool = slug ? getToolBySlug(slug) : null;

  return (
    <div className="space-y-4">
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚧</div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {tool?.name || 'Tool'} Coming Soon
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {tool?.description || 'This tool is under development. Check back soon!'}
        </p>
        <p className="text-sm text-slate-500">
          We're working hard to bring you this feature. Stay tuned!
        </p>
      </div>
    </div>
  );
}

