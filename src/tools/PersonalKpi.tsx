import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  entries: { date: string; value: number }[];
}

export default function PersonalKPI() {
  const [kpis, setKPIs] = useState<KPI[]>(() => {
    const saved = localStorage.getItem('personalKPIs');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [newKPI, setNewKPI] = useState({
    name: '',
    target: 100,
    unit: '%',
    category: 'health',
    frequency: 'daily' as const,
  });

  const saveToStorage = (newKPIs: KPI[]) => {
    localStorage.setItem('personalKPIs', JSON.stringify(newKPIs));
  };

  const addKPI = () => {
    if (!newKPI.name.trim()) return;

    const kpi: KPI = {
      id: Date.now().toString(),
      name: newKPI.name.trim(),
      target: newKPI.target,
      current: 0,
      unit: newKPI.unit.trim(),
      category: newKPI.category,
      frequency: newKPI.frequency,
      entries: [],
    };

    const updated = [...kpis, kpi];
    setKPIs(updated);
    saveToStorage(updated);
    setNewKPI({ name: '', target: 100, unit: '%', category: 'health', frequency: 'daily' });
    setShowForm(false);
  };

  const updateCurrent = (id: string, value: number) => {
    const updated = kpis.map(k => {
      if (k.id === id) {
        const today = new Date().toISOString().split('T')[0];
        const entries = k.entries.filter(e => e.date !== today);
        entries.push({ date: today, value });
        return { ...k, current: value, entries };
      }
      return k;
    });
    setKPIs(updated);
    saveToStorage(updated);
  };

  const deleteKPI = (id: string) => {
    const updated = kpis.filter(k => k.id !== id);
    setKPIs(updated);
    saveToStorage(updated);
  };

  const getProgress = (kpi: KPI) => {
    if (kpi.target === 0) return 0;
    return Math.round((kpi.current / kpi.target) * 100);
  };

  const categories = [
    { value: 'health', label: '💪 Health' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'productivity', label: '🎯 Productivity' },
    { value: 'learning', label: '📚 Learning' },
    { value: 'personal', label: '✨ Personal' },
  ];

  const categoryStats = {
    total: kpis.length,
    onTrack: kpis.filter(k => getProgress(k) >= 80).length,
    needsWork: kpis.filter(k => getProgress(k) < 50).length,
    average: kpis.length > 0 ? Math.round(kpis.reduce((sum, k) => sum + getProgress(k), 0) / kpis.length) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {categoryStats.total}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">KPIs</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {categoryStats.onTrack}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">On Track</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {categoryStats.needsWork}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">Needs Work</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {categoryStats.average}%
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Average</div>
        </div>
      </div>

      {/* Add KPI Form */}
      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add New KPI</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              KPI Name
            </label>
            <input
              type="text"
              value={newKPI.name}
              onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
              placeholder="e.g., Daily steps, Books read, Revenue"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target
              </label>
              <input
                type="number"
                value={newKPI.target}
                onChange={(e) => setNewKPI({ ...newKPI, target: Number(e.target.value) })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={newKPI.unit}
                onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
                placeholder="e.g., %, km, $"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Frequency
              </label>
              <select
                value={newKPI.frequency}
                onChange={(e) => setNewKPI({ ...newKPI, frequency: e.target.value as any })}
                className="input-field"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setNewKPI({ ...newKPI, category: cat.value })}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    newKPI.category === cat.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={addKPI} className="btn-primary flex-1">
              <Plus className="w-4 h-4" /> Add KPI
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-400 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add KPI
        </button>
      )}

      {/* KPIs List */}
      <div className="space-y-3">
        {kpis.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No KPIs tracked yet</p>
          </div>
        ) : (
          kpis.map(kpi => {
            const progress = getProgress(kpi);
            const status = progress >= 80 ? 'on-track' : progress >= 50 ? 'in-progress' : 'needs-work';
            const statusColor = {
              'on-track': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
              'in-progress': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
              'needs-work': 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
            };

            return (
              <div
                key={kpi.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {kpi.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {kpi.frequency} • {kpi.category}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteKPI(kpi.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                        Current Value
                      </label>
                      <div className="flex items-baseline gap-1">
                        <input
                          type="number"
                          value={kpi.current}
                          onChange={(e) => updateCurrent(kpi.id, Number(e.target.value))}
                          className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-20"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{kpi.unit}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-600 dark:text-slate-400">Target</div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {kpi.target} {kpi.unit}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Progress</span>
                      <span className={`font-semibold px-2 py-1 rounded text-xs ${statusColor[status]}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
