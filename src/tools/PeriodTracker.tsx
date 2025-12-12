import { useState } from 'react';

export default function PeriodTracker() {
  const [periods, setPeriods] = useState<{id: string; startDate: string; endDate: string}[]>(() => {
    const saved = localStorage.getItem('periodTracker');
    return saved ? JSON.parse(saved) : [];
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const savePeriod = () => {
    if (!startDate || !endDate) return;
    const newPeriod = { id: Date.now().toString(), startDate, endDate };
    const updated = [...periods, newPeriod].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    setPeriods(updated);
    localStorage.setItem('periodTracker', JSON.stringify(updated));
    setStartDate('');
    setEndDate('');
  };

  const deletePeriod = (id: string) => {
    const updated = periods.filter(p => p.id !== id);
    setPeriods(updated);
    localStorage.setItem('periodTracker', JSON.stringify(updated));
  };

  const avgCycleLength = periods.length > 1 
    ? Math.round(periods.slice(0, 3).reduce((sum, p, i, arr) => {
        if (i === 0) return sum;
        const prev = new Date(arr[i - 1].startDate);
        const curr = new Date(p.startDate);
        return sum + Math.floor((prev.getTime() - curr.getTime()) / (24 * 60 * 60 * 1000));
      }, 0) / Math.min(2, periods.length - 1))
    : 28;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Period Tracker</h2>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label>
            Start Date
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
          </label>
          <label>
            End Date
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
          </label>
        </div>
        <button onClick={savePeriod} className="btn-primary w-full">Log Period</button>
      </div>

      {periods.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900 dark:to-pink-900 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-300">Average Cycle</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{avgCycleLength} days</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Periods Logged</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{periods.length}</div>
          </div>
        </div>
      )}

      {periods.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto space-y-2 p-4">
            {periods.map(p => {
              const start = new Date(p.startDate);
              const end = new Date(p.endDate);
              const duration = Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) + 1;
              return (
                <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded">
                  <div>
                    <div className="font-medium text-sm">{start.toLocaleDateString()} - {end.toLocaleDateString()}</div>
                    <div className="text-xs text-slate-500">{duration} days</div>
                  </div>
                  <button onClick={() => deletePeriod(p.id)} className="text-red-500 hover:text-red-700 text-sm">✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
