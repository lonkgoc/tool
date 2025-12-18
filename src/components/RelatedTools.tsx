
import { Link } from 'react-router-dom';
import { tools } from '../data/tools';

interface RelatedToolsProps {
    currentToolSlug: string;
    category: string;
}

export default function RelatedTools({ currentToolSlug, category }: RelatedToolsProps) {
    // Get other tools in the same category
    const relatedTools = tools
        .filter(t => t.category === category && t.slug !== currentToolSlug && t.id !== "0")
        .slice(0, 4); // Show up to 4 related tools

    // If not enough tools in the same category, fill with other popular tools
    if (relatedTools.length < 4) {
        const otherTools = tools
            .filter(t => t.category !== category && t.slug !== currentToolSlug && t.id !== "0" && !relatedTools.includes(t))
            .slice(0, 4 - relatedTools.length);
        relatedTools.push(...otherTools);
    }

    if (relatedTools.length === 0) return null;

    return (
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Related Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedTools.map((tool) => (
                    <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 truncate">
                            {tool.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {tool.description}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
