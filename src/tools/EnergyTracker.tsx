import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface EnergyLevel {
  id: string;
  time: string;
  level: number;
  activity: string;
  notes: string;
}

export default function EnergyTracker() {
  const [entries, setEntries] = useState<EnergyLevel[]>(() => {
    const saved = localStorage.getItem('energyTracker');
    return saved ? JSON.parse(saved) : [];
  });
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
  const [level, setLevel] = useState(5);
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('energyTracker', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    const entry: EnergyLevel = {
      id: Date.now().toString(),
      time,
      level,
      activity: activity.trim(),
      notes: notes.trim(),
    };

    setEntries([...entries, entry]);
    setActivity('');
    setNotes('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getAverageEnergy = () => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((sum, e) => sum + e.level, 0) / entries.length);
  };

  const getPeakTime = () => {
    if (entries.length === 0) return 'N/A';
    const peak = entries.reduce((max, e) => e.level > max.level ? e : max);
    return peak.time;
  };

  const getLowTime = () => {
    if (entries.length === 0) return 'N/A';
    const low = entries.reduce((min, e) => e.level < min.level ? e : min);
    return low.time;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {getAverageEnergy()}/10
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">Avg Energy</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getPeakTime()}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Peak Time</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {getLowTime()}
          </div>
          <div className="text-xs text-red-700 dark:text-red-300">Low Time</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {entries.length}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Logged</div>
        </div>
      </div>

      {/* Add Entry Form */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Log Energy Level</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Activity
            </label>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="What are you doing?"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Energy Level: <strong>{level}/10</strong>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mt-1">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes..."
            className="input-field resize-none h-16"
          />
        </div>

        <button onClick={addEntry} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Log Entry
        </button>
      </div>

      {/* Energy Chart */}
      {entries.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Energy Timeline
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...entries].reverse().map(entry => (
              <div
                key={entry.id}
                className="bg-white dark:bg-slate-900 p-3 rounded border-l-4"
                style={{
                  borderLeftColor: `hsl(${entry.level * 12}, 80%, 50%)`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {entry.time} - {entry.activity || 'Unnamed activity'}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{ width: `${entry.level * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {entry.level}/10
                  </span>
                </div>

                {entry.notes && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    {entry.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {entries.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No energy entries logged yet
        </div>
      )}
    </div>
  );
}
