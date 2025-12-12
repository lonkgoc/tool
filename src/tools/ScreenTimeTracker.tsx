import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock } from 'lucide-react';

interface ScreenTimeEntry {
  id: string;
  date: string;
  activity: string;
  duration: number;
  category: 'work' | 'social' | 'entertainment' | 'learning' | 'other';
  startTime: string;
  endTime: string;
}

const CATEGORIES = [
  { id: 'work', label: 'Work', color: 'bg-blue-500' },
  { id: 'social', label: 'Social Media', color: 'bg-pink-500' },
  { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500' },
  { id: 'learning', label: 'Learning', color: 'bg-green-500' },
  { id: 'other', label: 'Other', color: 'bg-gray-500' },
];

export default function ScreenTimeTracker() {
  const [entries, setEntries] = useState<ScreenTimeEntry[]>(() => {
    const saved = localStorage.getItem('screenTimeEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    activity: '',
    category: 'work' as const,
    startTime: '09:00',
    duration: 30,
  });

  useEffect(() => {
    localStorage.setItem('screenTimeEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (!formData.activity.trim()) return;

    const start = new Date(`${selectedDate}T${formData.startTime}`);
    const end = new Date(start.getTime() + formData.duration * 60000);
    const endTimeStr = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const entry: ScreenTimeEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      activity: formData.activity,
      category: formData.category,
      duration: formData.duration,
      startTime: formData.startTime,
      endTime: endTimeStr,
    };

    setEntries([...entries, entry]);
    setFormData({ activity: '', category: 'work', startTime: '09:00', duration: 30 });
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const todayEntries = entries.filter(e => e.date === selectedDate);
  const todayTotal = todayEntries.reduce((sum, e) => sum + e.duration, 0);

  const getCategoryTotal = (category: string) => {
    return todayEntries
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.duration, 0);
  };

  const getWeekStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekEntries = entries.filter(e => new Date(e.date) >= weekAgo);
    return weekEntries.reduce((sum, e) => sum + e.duration, 0);
  };

  const getAverageDailyTime = () => {
    const uniqueDates = new Set(entries.map(e => e.date));
    if (uniqueDates.size === 0) return 0;
    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
    return Math.round(totalMinutes / uniqueDates.size);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatTime(todayTotal)}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Today</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatTime(getWeekStats())}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">This Week</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatTime(getAverageDailyTime())}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">Daily Avg</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {entries.length}
          </div>
          <div className="text-sm text-orange-700 dark:text-orange-300">Sessions</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Today's Breakdown</h3>
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const minutes = getCategoryTotal(cat.id as any);
            const percentage = todayTotal > 0 ? (minutes / todayTotal) * 100 : 0;
            return (
              <div key={cat.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {formatTime(minutes)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`${cat.color} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Entry Form */}
      <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-slate-50 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Log Screen Time
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="input-field"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Activity
          </label>
          <input
            type="text"
            value={formData.activity}
            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            placeholder="e.g., Video Editing, Social Media, Work"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="1440"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="input-field"
            />
          </div>
        </div>

        <button onClick={addEntry} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Log Activity
        </button>
      </div>

      {/* Today's Timeline */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {new Date(selectedDate).toLocaleDateString()} Timeline
        </h3>

        {todayEntries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No entries for this date
          </div>
        ) : (
          <div className="space-y-2">
            {todayEntries
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map(entry => {
                const cat = CATEGORIES.find(c => c.id === entry.category);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${cat?.color}`} />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {entry.activity}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {entry.startTime} - {entry.endTime} ({formatTime(entry.duration)})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-100">
        <strong>💡 Screen Time Tips:</strong>
        <ul className="mt-2 space-y-1">
          <li>• Track all screen activities daily</li>
          <li>• Take breaks every 20-30 minutes</li>
          <li>• Review weekly patterns</li>
          <li>• Set realistic goals for each category</li>
        </ul>
      </div>
    </div>
  );
}
