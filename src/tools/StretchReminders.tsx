import { useState, useEffect } from 'react';
import { StretchHorizontal, Bell, BellOff } from 'lucide-react';

export default function StretchReminders() {
  const [interval, setIntervalValue] = useState(60); // minutes
  const [enabled, setEnabled] = useState(false);
  const [notification, setNotification] = useState(false);
  const [lastReminded, setLastReminded] = useState<number | null>(null);

  useEffect(() => {
    if (enabled && interval > 0) {
      const timer = setInterval(() => {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Stretch Reminder', {
            body: 'Time to stretch! Stand up and move for a minute.',
            icon: '/favicon.ico'
          });
          setNotification(true);
          setLastReminded(Date.now());
          setTimeout(() => setNotification(false), 5000);
        }
      }, interval * 60 * 1000);
      return () => clearInterval(timer);
    }
  }, [enabled, interval]);

  const requestNotification = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <StretchHorizontal className="w-6 h-6 text-yellow-500" />
          <span>Stretch Reminders</span>
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Reminder Interval: {interval} minutes
          </label>
          <input
            type="range"
            min="15"
            max="120"
            step="5"
            value={interval}
            onChange={e => setIntervalValue(Number(e.target.value))}
            className="w-full"
            disabled={enabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-700 dark:text-slate-300">Enable Reminders</span>
          <button
            onClick={() => {
              if (!enabled) requestNotification();
              setEnabled(!enabled);
            }}
            className={`p-2 rounded-lg ${enabled ? 'bg-yellow-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
          >
            {enabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
          </button>
        </div>
        {notification && (
          <div className="mt-4 text-yellow-600 text-center">Time to stretch!</div>
        )}
        {lastReminded && (
          <div className="mt-2 text-xs text-slate-500 text-center">Last reminded: {new Date(lastReminded).toLocaleTimeString()}</div>
        )}
        <div className="mt-4 text-xs text-slate-500 text-center">
          <b>Tip:</b> Regular stretching helps prevent stiffness and boosts energy. Take a moment to move!
        </div>
      </div>
    </div>
  );
}
