import { useState, useEffect } from 'react';
import { Clock, RotateCcw, Pause, Play } from 'lucide-react';

interface PomodoroSession {
  id: string;
  date: string;
  duration: number;
  category: string;
  completed: boolean;
}

export default function PomodoroHistory() {
  const [sessions, setSessions] = useState<PomodoroSession[]>(() => {
    const saved = localStorage.getItem('pomodoroHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [category, setCategory] = useState('work');

  useEffect(() => {
    localStorage.setItem('pomodoroHistory', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= 25 * 60) {
            setIsRunning(false);
            const session: PomodoroSession = {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              duration: 25,
              category,
              completed: true,
            };
            setSessions([...sessions, session]);
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, sessions, category]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setTimer(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const stats = {
    total: sessions.length,
    today: sessions.filter(s => s.date === new Date().toISOString().split('T')[0]).length,
    thisWeek: sessions.filter(s => {
      const sessionDate = new Date(s.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length,
    totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
  };

  const categoryBreakdown = sessions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-lg font-semibold mb-4">Pomodoro Timer</h2>
        <div className="text-6xl font-bold font-mono mb-4">
          {formatTime(timer)}
        </div>
        <div className="flex gap-4 justify-center mb-4">
          <button
            onClick={toggleTimer}
            className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded text-slate-900 font-medium"
        >
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="creative">Creative</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.today}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Today</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.thisWeek}</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">This Week</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.total}</div>
          <div className="text-xs text-green-700 dark:text-green-300">Total</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {Math.round(stats.totalMinutes / 60)}h
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300">Focused</div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryBreakdown).length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">By Category</h3>
          <div className="space-y-2">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300 capitalize">{cat}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{count} sessions</span>
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
            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No Pomodoro sessions yet</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {[...sessions].reverse().slice(0, 20).map(session => (
              <div
                key={session.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {session.duration} min - {session.category}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
                {session.completed && (
                  <div className="text-green-500 font-bold">✓</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
