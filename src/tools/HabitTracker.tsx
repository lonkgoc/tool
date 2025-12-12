import { useState, useEffect } from 'react';
import { Plus, Check, X, Calendar, Download, TrendingUp } from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  streak: number;
  longestStreak: number;
  lastCompleted: string | null;
  completedDates: string[];
  createdAt: string;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      try {
        return JSON.parse(saved).map((h: any) => ({
          ...h,
          completedDates: Array.isArray(h.completedDates) ? h.completedDates : Array.from(h.completedDates || []),
          longestStreak: h.longestStreak || h.streak || 0,
          createdAt: h.createdAt || new Date().toISOString()
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [newHabit, setNewHabit] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addHabit = () => {
    if (newHabit.trim()) {
      setHabits([...habits, {
        id: Date.now().toString(),
        name: newHabit,
        streak: 0,
        longestStreak: 0,
        lastCompleted: null,
        completedDates: [],
        createdAt: new Date().toISOString()
      }]);
      setNewHabit('');
      showNotification('Habit added! 💪');
    }
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;

      const completedDates = [...habit.completedDates];
      const todayIndex = completedDates.indexOf(today);

      if (todayIndex >= 0) {
        // Remove today's completion
        completedDates.splice(todayIndex, 1);
        const newStreak = calculateStreak(completedDates);
        return {
          ...habit,
          completedDates,
          streak: newStreak,
          lastCompleted: completedDates.length > 0 ? completedDates[completedDates.length - 1] : null
        };
      } else {
        // Add today's completion
        completedDates.push(today);
        completedDates.sort();
        const newStreak = calculateStreak(completedDates);
        const newLongestStreak = Math.max(habit.longestStreak, newStreak);
        showNotification(`Great job! 🎉 ${newStreak} day streak!`);
        return {
          ...habit,
          completedDates,
          streak: newStreak,
          longestStreak: newLongestStreak,
          lastCompleted: today
        };
      }
    }));
  };

  const calculateStreak = (dates: string[]) => {
    if (dates.length === 0) return 0;

    const sortedDates = [...dates].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Streak must include today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const deleteHabit = (id: string) => {
    if (deleteConfirm === id) {
      setHabits(habits.filter(h => h.id !== id));
      setDeleteConfirm(null);
      showNotification('Habit deleted');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(habits, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habits-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Habits exported!');
  };

  // Get last 7 days for the calendar view
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        isToday: i === 0
      });
    }
    return days;
  };

  const last7Days = getLast7Days();
  const today = new Date().toISOString().split('T')[0];

  // Calculate overall stats
  const totalCompletions = habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  const avgStreak = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length) : 0;
  const todayCompleted = habits.filter(h => h.completedDates.includes(today)).length;

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      {/* Stats Cards */}
      {habits.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{todayCompleted}/{habits.length}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Today</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{avgStreak}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Avg Streak</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalCompletions}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
          </div>
        </div>
      )}

      {/* Add Habit Form */}
      <div className="card">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            placeholder="Enter habit name (e.g., Exercise, Read, Meditate)"
            className="flex-1 input-field"
          />
          <button onClick={addHabit} className="btn-primary flex items-center gap-1">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* 7-Day Calendar Header */}
        {habits.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last 7 Days
              </h3>
              <button onClick={exportToJSON} className="btn-secondary text-xs flex items-center gap-1">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>

            {/* Calendar Grid Header */}
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr repeat(7, 40px) 60px' }}>
              <div className="text-xs font-medium text-slate-500">Habit</div>
              {last7Days.map(day => (
                <div key={day.date} className={`text-center text-xs ${day.isToday ? 'font-bold text-blue-600' : 'text-slate-500'}`}>
                  <div>{day.dayName}</div>
                  <div>{day.dayNum}</div>
                </div>
              ))}
              <div className="text-center text-xs font-medium text-slate-500">Streak</div>
            </div>
          </div>
        )}

        {/* Habits with Calendar Row */}
        <div className="space-y-2">
          {habits.map(habit => (
            <div
              key={habit.id}
              className="grid items-center gap-2 p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
              style={{ gridTemplateColumns: '1fr repeat(7, 40px) 60px' }}
            >
              {/* Habit Name */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-medium text-slate-900 dark:text-slate-100 truncate">{habit.name}</span>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className={`p-1 rounded transition-colors flex-shrink-0 ${deleteConfirm === habit.id
                      ? 'text-red-600 animate-pulse'
                      : 'text-slate-400 hover:text-red-500'
                    }`}
                  title={deleteConfirm === habit.id ? 'Click again to confirm' : 'Delete habit'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 7 Day Checkboxes */}
              {last7Days.map(day => {
                const isCompleted = habit.completedDates.includes(day.date);
                const isToday = day.isToday;

                return (
                  <button
                    key={day.date}
                    onClick={() => isToday && toggleHabit(habit.id)}
                    disabled={!isToday}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-all ${isCompleted
                        ? 'bg-green-500 text-white'
                        : isToday
                          ? 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'
                          : 'bg-slate-100 dark:bg-slate-800 cursor-not-allowed opacity-50'
                      } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                  >
                    {isCompleted && <Check className="w-4 h-4" />}
                  </button>
                );
              })}

              {/* Streak */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className={`w-4 h-4 ${habit.streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span className={`font-bold ${habit.streak > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                    {habit.streak}
                  </span>
                </div>
                {habit.longestStreak > habit.streak && (
                  <div className="text-[10px] text-slate-400">best: {habit.longestStreak}</div>
                )}
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No habits yet. Add one to get started! 🌱
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      {habits.length > 0 && habits.length < 3 && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
          <strong>💡 Tip:</strong> Start with 1-3 habits. Once they become automatic (usually 2-3 weeks), add more.
        </div>
      )}
    </div>
  );
}
