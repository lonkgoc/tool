import { useState, useEffect } from 'react';
import { Play, Pause, Plus, Trash2, Clock, Target, Shield, Coffee } from 'lucide-react';

interface BlockedSite {
  id: string;
  url: string;
  addedAt: number;
}

interface FocusSession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  completed: boolean;
}

export default function DistractionBlocker() {
  const [blockedSites, setBlockedSites] = useState<BlockedSite[]>(() => {
    const saved = localStorage.getItem('blockedSites');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSite, setNewSite] = useState('');
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusSessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
  }, [blockedSites]);

  useEffect(() => {
    localStorage.setItem('focusSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    } else if (isActive && timeRemaining === 0) {
      // Session ended
      if (currentSession && !isBreak) {
        const updatedSession = {
          ...currentSession,
          endTime: Date.now(),
          duration: focusDuration * 60,
          completed: true,
        };
        setSessions((prev) => [...prev, updatedSession]);
        setCurrentSession(null);
      }

      // Play notification sound
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+A');
        audio.volume = 0.5;
        audio.play().catch(() => { });
      } catch (e) { }

      // Switch between focus and break
      if (!isBreak) {
        setIsBreak(true);
        setTimeRemaining(breakDuration * 60);
      } else {
        setIsBreak(false);
        setIsActive(false);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, isBreak, currentSession, focusDuration, breakDuration]);

  const startFocus = () => {
    const session: FocusSession = {
      id: Date.now().toString(),
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      completed: false,
    };
    setCurrentSession(session);
    setTimeRemaining(focusDuration * 60);
    setIsActive(true);
    setIsBreak(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resumeTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    if (currentSession) {
      const duration = focusDuration * 60 - timeRemaining;
      if (duration > 60) {
        const updatedSession = {
          ...currentSession,
          endTime: Date.now(),
          duration,
          completed: false,
        };
        setSessions((prev) => [...prev, updatedSession]);
      }
    }
    setIsActive(false);
    setIsBreak(false);
    setTimeRemaining(0);
    setCurrentSession(null);
  };

  const addBlockedSite = () => {
    if (!newSite.trim()) return;

    let url = newSite.trim().toLowerCase();
    url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    if (blockedSites.some((s) => s.url === url)) {
      setNewSite('');
      return;
    }

    const site: BlockedSite = {
      id: Date.now().toString(),
      url,
      addedAt: Date.now(),
    };
    setBlockedSites((prev) => [...prev, site]);
    setNewSite('');
  };

  const removeBlockedSite = (id: string) => {
    setBlockedSites((prev) => prev.filter((s) => s.id !== id));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalFocusTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const completedSessions = sessions.filter((s) => s.completed).length;
  const todaySessions = sessions.filter(
    (s) => new Date(s.startTime).toDateString() === new Date().toDateString()
  );
  const todayFocusTime = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  const motivationalMessages = [
    "Stay focused! You've got this! 💪",
    "Deep work leads to great results! 🎯",
    "Every minute of focus counts! ⏱️",
    "You're building something amazing! 🚀",
    "Stay in the zone! 🔥",
  ];
  const [message] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  return (
    <div className="space-y-6">
      {/* Timer Section */}
      <div className="card text-center">
        <div className="mb-6">
          {isBreak ? (
            <Coffee className="w-16 h-16 mx-auto text-green-500 mb-2" />
          ) : isActive ? (
            <Target className="w-16 h-16 mx-auto text-blue-500 mb-2 animate-pulse" />
          ) : (
            <Shield className="w-16 h-16 mx-auto text-slate-400 mb-2" />
          )}
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isBreak ? 'Break Time!' : isActive ? 'Focus Mode' : 'Ready to Focus?'}
          </h2>
          {isActive && (
            <p className="text-sm text-slate-500 mt-1">{message}</p>
          )}
        </div>

        {/* Timer Display */}
        <div className="text-6xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-6">
          {formatTime(timeRemaining || focusDuration * 60)}
        </div>

        {/* Duration Settings */}
        {!isActive && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Focus (min)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="input-field text-center"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">
                Break (min)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="input-field text-center"
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-3">
          {!isActive && timeRemaining === 0 && (
            <button onClick={startFocus} className="btn-primary flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Focus Session
            </button>
          )}
          {isActive && (
            <button onClick={pauseTimer} className="btn-secondary flex items-center gap-2">
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          {!isActive && timeRemaining > 0 && (
            <>
              <button onClick={resumeTimer} className="btn-primary flex items-center gap-2">
                <Play className="w-5 h-5" />
                Resume
              </button>
              <button onClick={stopTimer} className="btn-secondary">
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Blocked Sites */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Blocked Sites (Reminder List)
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Keep track of distracting websites to avoid during focus sessions.
          (Browser extensions required for actual blocking)
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBlockedSite()}
            placeholder="e.g., twitter.com, reddit.com"
            className="input-field flex-1"
          />
          <button onClick={addBlockedSite} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {blockedSites.length > 0 ? (
          <ul className="space-y-2">
            {blockedSites.map((site) => (
              <li
                key={site.id}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
              >
                <span className="text-slate-700 dark:text-slate-300">{site.url}</span>
                <button
                  onClick={() => removeBlockedSite(site.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-400 py-4">
            No sites in your block list yet
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Focus Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{completedSessions}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Sessions</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {Math.floor(totalFocusTime / 60)}m
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Focus</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {todaySessions.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Today's Sessions</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">
              {Math.floor(todayFocusTime / 60)}m
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Today's Focus</div>
          </div>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all session history?')) {
                setSessions([]);
              }
            }}
            className="mt-4 text-sm text-red-500 hover:text-red-700"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Info */}
      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">How to use:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Set your focus and break durations</li>
          <li>Add distracting websites to your reminder list</li>
          <li>Start a focus session and work without distractions</li>
          <li>Take breaks when the timer indicates</li>
          <li>Track your productivity with session statistics</li>
        </ul>
      </div>
    </div>
  );
}
