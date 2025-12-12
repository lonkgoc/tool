import { useState, useEffect, useCallback } from 'react';
import { Droplet, Bell, BellOff, Download, RotateCcw, Plus, Trophy } from 'lucide-react';

export default function WaterReminder() {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem('waterGoal');
    return saved ? Number(saved) : 2000;
  });
  const [consumed, setConsumed] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('waterConsumed_' + today);
    return saved ? Number(saved) : 0;
  });
  const [reminderInterval, setReminderInterval] = useState(() => {
    const saved = localStorage.getItem('waterReminderInterval');
    return saved ? Number(saved) : 60;
  });
  const [enabled, setEnabled] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<{ date: string; amount: number }[]>(() => {
    const saved = localStorage.getItem('waterHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('waterGoal', String(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('waterReminderInterval', String(reminderInterval));
  }, [reminderInterval]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('waterConsumed_' + today, String(consumed));
  }, [consumed]);

  useEffect(() => {
    localStorage.setItem('waterHistory', JSON.stringify(history));
  }, [history]);

  // Play sound notification
  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch { }
  }, []);

  useEffect(() => {
    if (enabled && reminderInterval > 0) {
      const timer = window.setInterval(() => {
        playSound();
        setNotification('💧 Time to drink water!');
        setTimeout(() => setNotification(null), 5000);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Water Reminder', {
            body: `Time to drink water! You've consumed ${consumed}ml today.`,
          });
        }
      }, reminderInterval * 60 * 1000);
      return () => clearInterval(timer);
    }
  }, [enabled, reminderInterval, consumed, playSound]);

  const requestNotification = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addWater = (amount: number) => {
    const newAmount = consumed + amount;
    setConsumed(newAmount);
    if (newAmount >= goal && consumed < goal) {
      playSound();
      showNotification('🎉 Daily goal achieved!');
    } else {
      showNotification(`+${amount}ml added!`);
    }
  };

  const resetToday = () => {
    // Save to history before reset
    const today = new Date().toISOString().split('T')[0];
    if (consumed > 0) {
      const existing = history.find(h => h.date === today);
      if (existing) {
        setHistory(history.map(h => h.date === today ? { ...h, amount: consumed } : h));
      } else {
        setHistory([...history, { date: today, amount: consumed }]);
      }
    }
    setConsumed(0);
    showNotification('Reset for today');
  };

  const exportHistory = () => {
    const today = new Date().toISOString().split('T')[0];
    const allHistory = [...history];
    if (!allHistory.find(h => h.date === today) && consumed > 0) {
      allHistory.push({ date: today, amount: consumed });
    }
    const csv = 'Date,Amount (ml),Goal (ml),Percentage\n' +
      allHistory.map(h => `${h.date},${h.amount},${goal},${((h.amount / goal) * 100).toFixed(1)}%`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'water-history.csv';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('History exported!');
  };

  const percentage = Math.min(100, (consumed / goal) * 100);
  const glassesCount = Math.floor(consumed / 250);

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Droplet className="w-6 h-6 text-blue-500" />
            Water Reminder
          </h2>
          {consumed >= goal && <Trophy className="w-6 h-6 text-yellow-500 animate-bounce" />}
        </div>

        {/* Progress Display */}
        <div className="text-center py-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200 dark:text-slate-700" />
              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="none"
                className="text-blue-500" strokeDasharray={`${percentage * 3.52} 352`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{percentage.toFixed(0)}%</div>
                <div className="text-xs text-slate-500">{glassesCount} glasses</div>
              </div>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{consumed}ml / {goal}ml</div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[150, 250, 500, 750].map(amount => (
            <button key={amount} onClick={() => addWater(amount)} className="btn-secondary text-sm flex flex-col items-center py-2">
              <Plus className="w-4 h-4" />
              {amount}ml
            </button>
          ))}
        </div>

        {/* Goal Setting */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Daily Goal: {goal}ml ({(goal / 250).toFixed(1)} glasses)
          </label>
          <input type="range" min="1000" max="5000" step="250" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="w-full" />
        </div>

        {/* Reminder Settings */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reminder: every {reminderInterval} min
          </label>
          <input type="range" min="15" max="120" step="15" value={reminderInterval} onChange={(e) => setReminderInterval(Number(e.target.value))} className="w-full" />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={() => { if (!enabled) requestNotification(); setEnabled(!enabled); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${enabled ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            {enabled ? 'Reminders On' : 'Reminders Off'}
          </button>
          <button onClick={resetToday} className="btn-secondary flex items-center gap-1">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={exportHistory} className="btn-secondary flex items-center gap-1">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Adults should drink 2-3 liters of water daily. Set reminders to stay hydrated throughout the day!
      </div>
    </div>
  );
}
