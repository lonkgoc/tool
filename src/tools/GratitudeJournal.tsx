import { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';

export default function GratitudeJournal() {
  const [entries, setEntries] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('gratitudeEntries');
    return saved ? JSON.parse(saved) : {};
  });
  const [today, setToday] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState(entries[today] || []);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    setItems(entries[today] || []);
  }, [today, entries]);

  const addItem = () => {
    if (newItem.trim()) {
      const updated = [...items, newItem.trim()];
      setItems(updated);
      const newEntries = { ...entries, [today]: updated };
      setEntries(newEntries);
      localStorage.setItem('gratitudeEntries', JSON.stringify(newEntries));
      setNewItem('');
    }
  };

  const deleteItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    const newEntries = { ...entries, [today]: updated };
    setEntries(newEntries);
    localStorage.setItem('gratitudeEntries', JSON.stringify(newEntries));
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <span>Gratitude Journal</span>
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={today}
            onChange={(e) => setToday(e.target.value)}
            className="w-full input-field"
          />
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="What are you grateful for today?"
            className="flex-1 input-field"
          />
          <button onClick={addItem} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <span className="text-slate-900 dark:text-slate-100 flex-1">{item}</span>
              <button
                onClick={() => deleteItem(index)}
                className="text-red-500 ml-2"
              >
                ×
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-slate-500 py-8">
              No gratitude entries for this date. Add something you're grateful for!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


