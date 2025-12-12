import { useState, useEffect } from 'react';
import { Plus, Trash2, Lightbulb } from 'lucide-react';

interface ReflectionEntry {
  id: string;
  date: string;
  prompt: string;
  response: string;
}

const PROMPTS = [
  "What am I most grateful for today?",
  "What challenge did I overcome today?",
  "How did I help someone today?",
  "What made me smile today?",
  "What did I learn today?",
  "What am I proud of today?",
  "How did I grow today?",
  "What could I improve tomorrow?",
  "Who did I appreciate today?",
  "What was the best part of my day?",
  "How did I take care of myself today?",
  "What am I looking forward to?",
  "What am I worried about?",
  "How can I be kinder tomorrow?",
  "What inspired me today?",
  "How did I show courage today?",
  "What would make tomorrow better?",
  "What surprised me today?",
  "How did I connect with others?",
  "What are my intentions for tomorrow?",
];

export default function ReflectionPrompts() {
  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    const saved = localStorage.getItem('reflectionEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [response, setResponse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('reflectionEntries', JSON.stringify(entries));
  }, [entries]);

  const getRandomPrompt = () => {
    const random = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setCurrentPrompt(random);
  };

  const saveResponse = () => {
    if (!response.trim()) return;

    const entry: ReflectionEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      prompt: currentPrompt,
      response: response.trim(),
    };

    setEntries([entry, ...entries]);
    setResponse('');
    getRandomPrompt();
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const getTodayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);
  const weekEntries = entries.filter(e => {
    const entryDate = new Date(e.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return entryDate >= weekAgo;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {getTodayEntry ? '✓' : '○'}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Today</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {weekEntries.length}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">This Week</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {entries.length}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">Total</div>
        </div>
      </div>

      {/* Reflection Form */}
      <div className="bg-gradient-to-br from-purple-50 dark:from-purple-900 to-blue-50 dark:to-blue-900 border-2 border-purple-200 dark:border-purple-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Daily Reflection
          </h3>
        </div>

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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Today's Prompt
            </label>
            <button
              onClick={getRandomPrompt}
              className="text-xs px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600"
            >
              🔄 New Prompt
            </button>
          </div>
          <div className="bg-white dark:bg-slate-800 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
            <p className="text-lg font-semibold text-purple-700 dark:text-purple-300 italic">
              "{currentPrompt}"
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Reflection
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Write your thoughts here..."
            className="input-field resize-none h-32"
          />
        </div>

        <button onClick={saveResponse} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Save Reflection
        </button>
      </div>

      {/* All Prompts Available */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Available Prompts</h3>
        <div className="grid grid-cols-2 gap-2">
          {PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPrompt(prompt)}
              className={`text-sm p-2 rounded text-left transition-colors ${
                currentPrompt === prompt
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Past Reflections */}
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Past Reflections</h3>
        
        {entries.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No reflections yet. Start with today's prompt!
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {entries.map(entry => (
              <div
                key={entry.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic mt-1">
                      "{entry.prompt}"
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-slate-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm">
                  {entry.response}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Encouragement */}
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>✨ Reflection Tips:</strong>
        <ul className="mt-2 space-y-1">
          <li>• Spend 5-10 minutes on each prompt</li>
          <li>• Be honest and authentic</li>
          <li>• Write without judgment</li>
          <li>• Review past reflections for patterns</li>
          <li>• Use prompts for personal growth</li>
        </ul>
      </div>
    </div>
  );
}
