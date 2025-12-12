import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface FocusSession {
  id: string;
  duration: number;
  date: string;
  category: string;
  notes: string;
}

export default function FocusStats() {
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSession, setNewSession] = useState({
    duration: 25,
    category: 'work',
    notes: '',
  });

  const saveToStorage = (newSessions: FocusSession[]) => {
    localStorage.setItem('focusSessions', JSON.stringify(newSessions));
  };

  const addSession = () => {
    const session: FocusSession = {
      id: Date.now().toString(),
      duration: newSession.duration,
      date: new Date().toISOString().split('T')[0],
      category: newSession.category,
      notes: newSession.notes,
    };

    const updated = [...sessions, session];
    setSessions(updated);
    saveToStorage(updated);
    setNewSession({ duration: 25, category: 'work', notes: '' });
  };

  const deleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveToStorage(updated);
  };

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date();
  thisWeek.setDate(thisWeek.getDate() - 7);
  const thisWeekStr = thisWeek.toISOString().split('T')[0];

  const todayStats = sessions.filter(s => s.date === today);
  const weekStats = sessions.filter(s => s.date >= thisWeekStr);
  
  const todayMinutes = todayStats.reduce((sum, s) => sum + s.duration, 0);
  const weekMinutes = weekStats.reduce((sum, s) => sum + s.duration, 0);
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

  const categoryCounts = sessions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.duration;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {todayMinutes}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Today (min)</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(weekMinutes / 60)}h
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">This Week</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {Math.round(totalMinutes / 60)}h
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">Total</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {sessions.length}
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Sessions</div>
        </div>
      </div>

      {/* Add Session */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Log Focus Session</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={newSession.duration}
              onChange={(e) => setNewSession({ ...newSession, duration: Math.max(5, Number(e.target.value)) })}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={newSession.category}
              onChange={(e) => setNewSession({ ...newSession, category: e.target.value })}
              className="input-field"
            >
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="creative">Creative</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Notes
          </label>
          <input
            type="text"
            value={newSession.notes}
            onChange={(e) => setNewSession({ ...newSession, notes: e.target.value })}
            placeholder="What did you work on?"
            className="input-field"
          />
        </div>

        <button onClick={addSession} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Log Session
        </button>
      </div>

      {/* Category Breakdown */}
      {topCategory && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Focus by Category
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([category, minutes]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {Math.round(minutes / 60)}h
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(minutes / Math.max(...Object.values(categoryCounts))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Sessions</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No sessions logged yet
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...sessions].reverse().map(session => (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {session.duration} min - {session.category}
                  </div>
                  {session.notes && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {session.notes}
                    </div>
                  )}
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteSession(session.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
