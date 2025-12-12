import { useState } from 'react';

interface AnalysisItem {
  id: string;
  text: string;
}

interface SWOTAnalysis {
  strengths: AnalysisItem[];
  weaknesses: AnalysisItem[];
  opportunities: AnalysisItem[];
  threats: AnalysisItem[];
}

export default function SWOTAnalysis() {
  const [swot, setSWOT] = useState<SWOTAnalysis>(() => {
    const saved = localStorage.getItem('swotAnalysis');
    return saved ? JSON.parse(saved) : {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };
  });
  const [newItems, setNewItems] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });

  const saveToStorage = (analysis: SWOTAnalysis) => {
    localStorage.setItem('swotAnalysis', JSON.stringify(analysis));
  };

  const addItem = (category: keyof SWOTAnalysis, text: string) => {
    if (!text.trim()) return;

    const updated = {
      ...swot,
      [category]: [
        ...swot[category],
        { id: Date.now().toString(), text: text.trim() },
      ],
    };
    setSWOT(updated);
    saveToStorage(updated);
    setNewItems({ ...newItems, [category]: '' });
  };

  const deleteItem = (category: keyof SWOTAnalysis, id: string) => {
    const updated = {
      ...swot,
      [category]: swot[category].filter(item => item.id !== id),
    };
    setSWOT(updated);
    saveToStorage(updated);
  };

  const categories = [
    { key: 'strengths', label: 'Strengths', icon: '💪', color: 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' },
    { key: 'weaknesses', label: 'Weaknesses', icon: '⚠️', color: 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700' },
    { key: 'opportunities', label: 'Opportunities', icon: '🎯', color: 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-700' },
    { key: 'threats', label: 'Threats', icon: '🚨', color: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700' },
  ];

  const totalItems = Object.values(swot).reduce((sum, items) => sum + items.length, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          SWOT Analysis
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-3">
          Analyze Strengths, Weaknesses, Opportunities, and Threats
        </p>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {totalItems}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Total Items
        </div>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map(category => (
          <div
            key={category.key}
            className={`border-2 ${category.color} rounded-lg p-4`}
          >
            {/* Header */}
            <div className="mb-3">
              <div className="text-2xl mb-1">{category.icon}</div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {category.label}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {swot[category.key as keyof SWOTAnalysis].length} items
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-2 mb-3 min-h-32 max-h-48 overflow-y-auto">
              {swot[category.key as keyof SWOTAnalysis].length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  No items yet
                </p>
              ) : (
                swot[category.key as keyof SWOTAnalysis].map(item => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-800 p-2 rounded text-sm flex items-center justify-between group"
                  >
                    <span className="text-slate-900 dark:text-slate-100 flex-1">
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteItem(category.key as keyof SWOTAnalysis, item.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Item */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newItems[category.key as keyof typeof newItems]}
                onChange={(e) =>
                  setNewItems({
                    ...newItems,
                    [category.key]: e.target.value,
                  })
                }
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem(
                      category.key as keyof SWOTAnalysis,
                      newItems[category.key as keyof typeof newItems]
                    );
                  }
                }}
                placeholder="Add item..."
                className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button
                onClick={() =>
                  addItem(
                    category.key as keyof SWOTAnalysis,
                    newItems[category.key as keyof typeof newItems]
                  )
                }
                className="px-2 py-1 bg-slate-600 dark:bg-slate-500 text-white rounded text-sm font-medium hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Analysis Summary
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map(category => (
            <div key={category.key} className="text-sm">
              <div className="font-medium text-slate-700 dark:text-slate-300">
                {category.label}
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {swot[category.key as keyof SWOTAnalysis].length}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 SWOT Analysis Tips:</strong>
        <ul className="mt-2 space-y-1">
          <li>• <strong>Strengths</strong>: What do you do well? What are your advantages?</li>
          <li>• <strong>Weaknesses</strong>: What could be improved? What are your limitations?</li>
          <li>• <strong>Opportunities</strong>: What market or external opportunities exist?</li>
          <li>• <strong>Threats</strong>: What external risks could you face?</li>
        </ul>
      </div>
    </div>
  );
}
