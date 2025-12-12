import { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, Bell, BellOff, Play, Timer } from 'lucide-react';

export default function EyeBreakReminder() {
  const [interval, setIntervalValue] = useState(() => {
    const saved = localStorage.getItem('eyeBreakInterval');
    return saved ? Number(saved) : 20;
  });
  const [enabled, setEnabled] = useState(false);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(20);
  const [lastReminded, setLastReminded] = useState<number | null>(null);
  const [breakCount, setBreakCount] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('eyeBreakCount_' + today);
    return saved ? Number(saved) : 0;
  });
  const [notification, setNotification] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const breakTimerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('eyeBreakInterval', String(interval));
  }, [interval]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('eyeBreakCount_' + today, String(breakCount));
  }, [breakCount]);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [660, 880, 1100].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.2);
      });
    } catch { }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const startBreak = useCallback(() => {
    playSound();
    setIsBreakActive(true);
    setBreakTimeLeft(20);
    setLastReminded(Date.now());
    setBreakCount(c => c + 1);
    showNotification('👀 Look at something 20 feet away for 20 seconds!');

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Eye Break', { body: 'Look at something 20 feet away for 20 seconds!' });
    }

    breakTimerRef.current = window.setInterval(() => {
      setBreakTimeLeft(t => {
        if (t <= 1) {
          clearInterval(breakTimerRef.current!);
          setIsBreakActive(false);
          playSound();
          showNotification('✅ Break complete! Back to work.');
          return 20;
        }
        return t - 1;
      });
    }, 1000);
  }, [playSound]);

  useEffect(() => {
    if (enabled && interval > 0) {
      timerRef.current = window.setInterval(startBreak, interval * 60 * 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [enabled, interval, startBreak]);

  useEffect(() => {
    return () => {
      if (breakTimerRef.current) clearInterval(breakTimerRef.current);
    };
  }, []);

  const requestNotification = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const toggleEnabled = () => {
    if (!enabled) requestNotification();
    setEnabled(!enabled);
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in max-w-xs">
          {notification}
        </div>
      )}

      <div className="card bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-500" />
            Eye Break Reminder
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-600">{breakCount}</div>
            <div className="text-xs text-slate-500">breaks today</div>
          </div>
        </div>

        {/* Break Mode Display */}
        {isBreakActive ? (
          <div className="text-center py-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl mb-6">
            <div className="text-6xl mb-4 animate-pulse">👀</div>
            <div className="text-4xl font-bold font-mono text-green-600 dark:text-green-400 mb-2">
              {breakTimeLeft}s
            </div>
            <div className="text-lg font-medium text-green-700 dark:text-green-300">
              Look 20 feet away!
            </div>
            <div className="text-sm text-slate-500 mt-2">Relax your eyes...</div>
          </div>
        ) : (
          <div className={`text-center py-8 rounded-xl mb-6 ${enabled ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <div className="text-6xl mb-4">{enabled ? '⏰' : '😴'}</div>
            <div className={`text-lg font-semibold ${enabled ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
              {enabled ? `Next break in ${interval} min` : 'Reminders Off'}
            </div>
          </div>
        )}

        {/* Interval Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reminder Interval: {interval} minutes
          </label>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={interval}
            onChange={e => setIntervalValue(Number(e.target.value))}
            disabled={enabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={toggleEnabled}
            className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${enabled ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
          >
            {enabled ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {enabled ? 'Stop Reminders' : 'Start Reminders'}
          </button>
          <button onClick={startBreak} disabled={isBreakActive} className="btn-secondary px-4 disabled:opacity-50">
            <Play className="w-5 h-5" />
          </button>
        </div>

        {lastReminded && !isBreakActive && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
            Last break: {new Date(lastReminded).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* 20-20-20 Rule Explanation */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-500" />
          The 20-20-20 Rule
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">20</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">minutes of work</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">20</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">feet distance</div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">20</div>
            <div className="text-xs text-slate-600 dark:text-slate-400">seconds rest</div>
          </div>
        </div>
      </div>

      <div className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 text-sm text-cyan-800 dark:text-cyan-100">
        <strong>💡 Tip:</strong> Regular eye breaks reduce digital eye strain, headaches, and dry eyes. Your eyes will thank you!
      </div>
    </div>
  );
}
