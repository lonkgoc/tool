import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface StepsEntry { id: string; date: string; steps: number }

export default function StepsTracker() {
  const [entries, setEntries] = useState<StepsEntry[]>(() => {
    const saved = localStorage.getItem('stepsTracker');
    return saved ? JSON.parse(saved) : [];
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [steps, setSteps] = useState(0);

  const addEntry = () => {
    if (steps <= 0) return;
    const newEntry = { id: Date.now().toString(), date, steps };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('stepsTracker', JSON.stringify(updated));
    setSteps(0);
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('stepsTracker', JSON.stringify(updated));
  };

  const totalSteps = entries.reduce((sum, e) => sum + e.steps, 0);
  const avgSteps = entries.length > 0 ? Math.round(totalSteps / entries.length) : 0;
  const maxSteps = entries.length > 0 ? Math.max(...entries.map(e => e.steps)) : 0;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Steps Tracker</h2>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label>
            Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
          </label>
          <label>
            Steps
            <input type="number" value={steps} onChange={e => setSteps(parseInt(e.target.value) || 0)} className="input-field" />
          </label>
        </div>
        <button onClick={addEntry} className="btn-primary w-full"><Plus className="w-4 h-4" /> Log Steps</button>
      </div>

      {entries.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-300">Average</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{avgSteps.toLocaleString()}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">steps/day</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{(totalSteps / 1000).toFixed(1)}k</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-400">Best Day</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{maxSteps.toLocaleString()}</div>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto space-y-2 p-4">
            {entries.map(e => (
              <div key={e.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                <div>
                  <div className="font-medium text-sm">{new Date(e.date).toLocaleDateString()}</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{e.steps.toLocaleString()} steps</div>
                </div>
                <button onClick={() => deleteEntry(e.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
