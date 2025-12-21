import { ReactNode } from 'react';
import AdUnit from './AdUnit';

interface ToolWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolWrapper({ title, description, children }: ToolWrapperProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </div>

      <div className="card">
        {children}
      </div>

      <div className="card">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 dark:text-blue-400 font-bold">💡</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Pro Tip</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              For advanced features and unlimited usage, consider upgrading to premium tools.
              Check out our recommended partners for professional solutions.
            </p>
          </div>
        </div>
      </div>

      <AdUnit format="banner" />
    </div>
  );
}

