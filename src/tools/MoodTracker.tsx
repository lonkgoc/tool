import { useState, useEffect } from 'react';
import { Smile, Calendar } from 'lucide-react';

const moods = [
  { emoji: '😄', label: 'Great', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😔', label: 'Bad', value: 2 },
  { emoji: '😢', label: 'Terrible', value: 1 }
];

export default function MoodTracker() {
  const [entries, setEntries] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('moodEntries');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState<number | null>(entries[selectedDate] || null);

  useEffect(() => {
    setSelectedMood(entries[selectedDate] || null);
  }, [selectedDate, entries]);

  const saveMood = (value: number) => {
    const newEntries = { ...entries, [selectedDate]: value };
    setEntries(newEntries);
    setSelectedMood(value);
    localStorage.setItem('moodEntries', JSON.stringify(newEntries));
  };

  const getMoodEmoji = (value: number) => moods.find(m => m.value === value)?.emoji || '😐';

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Smile className="w-6 h-6" />
          <span>Mood Tracker</span>
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full input-field"
          />
        </div>

        <div className="grid grid-cols-5 gap-2 mb-6">
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => saveMood(mood.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMood === mood.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
              }`}
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{mood.label}</div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-4xl mb-2">{getMoodEmoji(selectedMood)}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Mood recorded for {new Date(selectedDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Mood History</h3>
        <div className="space-y-2">
          {Object.entries(entries)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 7)
            .map(([date, mood]) => (
              <div key={date} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                <span className="text-2xl">{getMoodEmoji(mood)}</span>
              </div>
            ))}
          {Object.keys(entries).length === 0 && (
            <div className="text-center text-slate-500 py-8">No mood entries yet</div>
          )}
        </div>
      </div>
    </div>
  );
}


