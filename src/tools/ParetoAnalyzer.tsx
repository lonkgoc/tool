import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface ParetoItem {
  id: string;
  name: string;
  value: number;
  category: string;
}

export default function ParetoAnalyzer() {
  const [items, setItems] = useState<ParetoItem[]>(() => {
    const saved = localStorage.getItem('paretoItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [formData, setFormData] = useState({ name: '', value: '', category: 'General' });

  useEffect(() => {
    localStorage.setItem('paretoItems', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!formData.name.trim() || !formData.value) return;

    const item: ParetoItem = {
      id: Date.now().toString(),
      name: formData.name,
      value: parseFloat(formData.value),
      category: formData.category,
    };

    setItems([...items, item]);
    setFormData({ name: '', value: '', category: 'General' });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  // Sort and analyze
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const total = sorted.reduce((sum, i) => sum + i.value, 0);

  let cumulative = 0;
  const analyzed = sorted.map((item, idx) => {
    cumulative += item.value;
    const percentage = (item.value / total) * 100;
    const cumulativePercentage = (cumulative / total) * 100;
    const isKey = idx < Math.ceil(sorted.length * 0.2); // Top 20%

    return {
      ...item,
      percentage,
      cumulativePercentage,
      isKey,
    };
  });

  const keyItems = analyzed.filter(i => i.isKey);
  const keyValue = keyItems.reduce((sum, i) => sum + i.value, 0);
  const keyPercentage = (keyValue / total) * 100;

  return (
    <div className="space-y-6">
      {/* Pareto Principle Display */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          The 80/20 Rule
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Identify which 20% of your efforts produce 80% of your results
        </p>

        {total > 0 && (
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  Top 20% Items ({keyItems.length})
                </span>
                <span className="font-bold text-purple-600 dark:text-purple-400">
                  {keyPercentage.toFixed(1)}% of Total Value
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all"
                  style={{ width: `${Math.min(keyPercentage, 100)}%` }}
                />
              </div>
            </div>

            {keyPercentage >= 80 && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 p-3 rounded-lg text-sm">
                ✓ Classic 80/20 pattern detected! Focus on your top items for maximum impact.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Item Form */}
      <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-slate-50 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Add Item to Analyze
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Item Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Task A"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Value / Impact
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              placeholder="100"
              step="0.1"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Projects, Customers, Tasks"
            className="input-field"
          />
        </div>

        <button onClick={addItem} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Analysis Results */}
      {items.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Pareto Analysis
          </h3>

          {/* Cumulative Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
              Cumulative Impact
            </h4>
            <div className="space-y-2">
              {analyzed.slice(0, 10).map((item, idx) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {idx + 1}. {item.name}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-xs">
                      {item.percentage.toFixed(1)}% ({item.value.toFixed(1)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full ${
                          item.isKey
                            ? 'bg-gradient-to-r from-red-500 to-orange-500'
                            : 'bg-gradient-to-r from-blue-500 to-blue-400'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 w-12 text-right">
                      {item.cumulativePercentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-4">
              By Category
            </h4>
            <div className="space-y-2">
              {Array.from(
                new Map(
                  analyzed.map(item => [
                    item.category,
                    analyzed
                      .filter(i => i.category === item.category)
                      .reduce((sum, i) => sum + i.value, 0),
                  ])
                )
              )
                .sort((a, b) => b[1] - a[1])
                .map(([category, value]) => {
                  const percentage = (value / total) * 100;
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {category}
                        </span>
                        <span className="text-slate-600 dark:text-slate-400 text-xs">
                          {percentage.toFixed(1)}% ({value.toFixed(1)})
                        </span>
                      </div>
                      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* All Items List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
              All Items ({items.length})
            </h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {analyzed.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    item.isKey
                      ? 'bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-700'
                      : 'bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {item.isKey && (
                        <span className="text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded">
                          TOP 20%
                        </span>
                      )}
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {item.category} • {item.value.toFixed(1)} ({item.percentage.toFixed(1)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-slate-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>💡 Pareto Principle (80/20 Rule)</strong>
        <ul className="mt-2 space-y-1">
          <li>• 20% of efforts typically produce 80% of results</li>
          <li>• Focus on high-impact items for efficiency</li>
          <li>• Identify and prioritize key drivers</li>
          <li>• Use this to optimize your workflow</li>
        </ul>
      </div>
    </div>
  );
}
