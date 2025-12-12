import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Bell } from 'lucide-react';

export default function PomodoroTimer() {
  const [workMinutes, setWorkMinutes] = useState(() => {
    const saved = localStorage.getItem('pomodoroWorkMinutes');
    return saved ? Number(saved) : 25;
  });
  const [breakMinutes, setBreakMinutes] = useState(() => {
    const saved = localStorage.getItem('pomodoroBreakMinutes');
    return saved ? Number(saved) : 5;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedWork = localStorage.getItem('pomodoroWorkMinutes');
    return (savedWork ? Number(savedWork) : 25) * 60;
  });
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('pomodoroSessions');
    return saved ? Number(saved) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoroWorkMinutes', String(workMinutes));
  }, [workMinutes]);

  useEffect(() => {
    localStorage.setItem('pomodoroBreakMinutes', String(breakMinutes));
  }, [breakMinutes]);

  useEffect(() => {
    localStorage.setItem('pomodoroSessions', String(sessions));
  }, [sessions]);

  // Play notification sound
  const playSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Create a pleasant bell sound
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime + startTime);
        oscillator.stop(ctx.currentTime + startTime + duration);
      };

      // Play a pleasant chime sequence
      playTone(880, 0, 0.3);     // A5
      playTone(1047, 0.15, 0.3); // C6
      playTone(1319, 0.3, 0.5);  // E6
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  // Show notification
  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            playSound();
            if (!isBreak) {
              setSessions(s => s + 1);
              setIsBreak(true);
              showNotification('🎉 Work session complete! Time for a break.');
              return breakMinutes * 60;
            } else {
              setIsBreak(false);
              showNotification('☕ Break over! Ready for another session?');
              return workMinutes * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, isBreak, workMinutes, breakMinutes, playSound, showNotification]);

  const start = () => {
    if (timeLeft === 0) {
      setTimeLeft(isBreak ? breakMinutes * 60 : workMinutes * 60);
    }
    setRunning(true);
  };

  const pause = () => setRunning(false);

  const reset = () => {
    setRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  const resetSessions = () => {
    setSessions(0);
    showNotification('Sessions reset to 0');
  };

  const testSound = () => {
    playSound();
    showNotification('🔔 Sound test!');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const totalTime = isBreak ? breakMinutes * 60 : workMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Check if timer is at initial state (not running and at full time)
  const isInitialState = !running && timeLeft === workMinutes * 60 && !isBreak;

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      {/* Settings (only show when not running and at initial state) */}
      {isInitialState && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Work (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => {
                const val = Math.max(1, Math.min(60, Number(e.target.value)));
                setWorkMinutes(val);
                setTimeLeft(val * 60);
              }}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Break (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={breakMinutes}
              onChange={(e) => {
                const val = Math.max(1, Math.min(60, Number(e.target.value)));
                setBreakMinutes(val);
              }}
              className="input-field"
            />
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className={`card text-center relative overflow-hidden ${isBreak ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
        {/* Progress bar background */}
        <div
          className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${isBreak ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${progress}%` }}
        />

        <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          {isBreak ? '☕ Break Time' : '💪 Work Time'}
        </div>
        <div className="text-6xl font-bold font-mono mb-4">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          {!running ? (
            <button onClick={start} className="btn-primary flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button onClick={pause} className="btn-secondary flex items-center space-x-2">
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          <button onClick={reset} className="btn-secondary flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary flex items-center space-x-2"
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={testSound}
            className="btn-secondary flex items-center space-x-2"
            title="Test Sound"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sessions Counter */}
      <div className="card text-center">
        <div className="flex items-center justify-center gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {sessions}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Completed Sessions
            </div>
          </div>
          {sessions > 0 && (
            <button
              onClick={resetSessions}
              className="btn-secondary text-xs"
            >
              Reset
            </button>
          )}
        </div>
        {sessions > 0 && (
          <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Total focus time: {sessions * workMinutes} minutes
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Pomodoro Technique:</strong> Work for {workMinutes} minutes, then take a {breakMinutes}-minute break. After 4 sessions, take a longer 15-30 minute break.
      </div>
    </div>
  );
}
