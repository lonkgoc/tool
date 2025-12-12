import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Bell, BellOff, RotateCcw, CheckCircle } from 'lucide-react';

export default function PostureReminder() {
  const [intervalMin, setIntervalMin] = useState<number>(() => {
    const saved = localStorage.getItem('postureIntervalMin');
    return saved ? parseInt(saved) : 30;
  });
  const [running, setRunning] = useState(false);
  const [lastReminded, setLastReminded] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [reminderCount, setReminderCount] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('postureCount_' + today);
    return saved ? parseInt(saved) : 0;
  });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('postureIntervalMin', String(intervalMin));
  }, [intervalMin]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('postureCount_' + today, String(reminderCount));
  }, [reminderCount]);

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Play a gentle chime
      [523, 659, 784].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch { }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const notify = useCallback(() => {
    const now = new Date().toISOString();
    setLastReminded(now);
    setReminderCount(c => c + 1);
    playSound();
    showNotification('🧘 Time to check your posture! Sit up straight, relax your shoulders.');

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Posture Check', { body: 'Sit up straight and relax your shoulders!' });
    }
  }, [playSound]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(notify, intervalMin * 60 * 1000);
  }, [intervalMin, notify]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    if (running) startTimer();
    else stopTimer();
    return () => stopTimer();
  }, [running, startTimer, stopTimer]);

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const toggleReminder = () => {
    if (!running) requestPermission();
    setRunning(!running);
  };

  const postureChecklist = [
    'Feet flat on the floor',
    'Back straight against chair',
    'Shoulders relaxed, not hunched',
    'Screen at eye level',
    'Elbows at 90-degree angle',
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white animate-fade-in max-w-xs">
          {notification}
        </div>
      )}

      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-500" />
            Posture Reminder
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{reminderCount}</div>
            <div className="text-xs text-slate-500">checks today</div>
          </div>
        </div>

        {/* Status Display */}
        <div className={`text-center py-8 rounded-xl mb-6 ${running ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <div className={`text-6xl mb-2 ${running ? 'animate-pulse' : ''}`}>
            {running ? '🧘' : '💺'}
          </div>
          <div className={`text-lg font-semibold ${running ? 'text-green-700 dark:text-green-300' : 'text-slate-600 dark:text-slate-400'}`}>
            {running ? 'Monitoring Active' : 'Reminder Off'}
          </div>
          {running && <div className="text-sm text-slate-500 mt-1">Next reminder in {intervalMin} min</div>}
        </div>

        {/* Interval Setting */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reminder Interval: {intervalMin} minutes
          </label>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={intervalMin}
            onChange={(e) => setIntervalMin(parseInt(e.target.value))}
            disabled={running}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          <button onClick={toggleReminder} className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${running ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}>
            {running ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            {running ? 'Stop Reminders' : 'Start Reminders'}
          </button>
          <button onClick={notify} className="btn-secondary px-4">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {lastReminded && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Last reminder: {new Date(lastReminded).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Posture Checklist */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          Good Posture Checklist
        </h3>
        <ul className="space-y-2">
          {postureChecklist.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-xs">{i + 1}</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-100">
        <strong>💡 Tip:</strong> Good posture reduces back pain, increases energy, and improves focus. Take a break every 30 minutes!
      </div>
    </div>
  );
}
