import { useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface AffiliateCornerProps {
  affiliateLinks?: { name: string; url: string; description: string }[];
}

export default function AffiliateCorner({ affiliateLinks }: AffiliateCornerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!affiliateLinks || affiliateLinks.length === 0 || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-slide-up">
      <div className="glass rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recommended for you</h3>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {affiliateLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="nofollow sponsored"
              className="block p-3 rounded-xl bg-white/50 dark:bg-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {link.description}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 ml-2" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

