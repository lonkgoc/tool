// Template for creating new tools quickly
import { useState } from 'react';

interface ToolTemplateProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export default function ToolTemplate({ title, description, children }: ToolTemplateProps) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{description}</p>
        {children || (
          <div className="text-center py-12">
            <p className="text-slate-500">This tool is being developed. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}


