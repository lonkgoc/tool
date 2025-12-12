import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Square, Bell, Volume2, VolumeX } from 'lucide-react';

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play completion sound
  const playSound = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;

      // Play an alarm-like sound pattern
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

      // Play alarm pattern (3 beeps)
      for (let i = 0; i < 3; i++) {
        playTone(880, i * 0.4, 0.25);
        playTone(660, i * 0.4 + 0.2, 0.15);
      }
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            setCompleted(true);
            playSound();
            setNotification("⏰ Time's up!");
            setTimeout(() => setNotification(null), 5000);
            return 0;
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
  }, [running, playSound]);

  const start = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total > 0) {
      setTimeLeft(total);
      setRunning(true);
      setCompleted(false);
    } else {
      setNotification("Please set a valid time");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const resume = () => {
    if (timeLeft > 0) {
      setRunning(true);
      setCompleted(false);
    }
  };

  const pause = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setTimeLeft(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setCompleted(false);
  };

  const testSound = () => {
    playSound();
    setNotification('🔔 Sound test!');
    setTimeout(() => setNotification(null), 2000);
  };

  // Quick presets
  const setPreset = (mins: number) => {
    setHours(0);
    setMinutes(mins);
    setSeconds(0);
  };

  const displayTime = () => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Calculate progress for visual indicator
  const initialTime = hours * 3600 + minutes * 60 + seconds;
  const progress = initialTime > 0 && timeLeft > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  // Determine current state
  const isInitialState = timeLeft === 0 && !running && !completed;
  const isPaused = timeLeft > 0 && !running && !completed;

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white animate-fade-in ${completed ? 'bg-green-500' : 'bg-blue-500'
          }`}>
          {notification}
        </div>
      )}

      {/* Time Input - only show when not running and timer is at 0 */}
      {isInitialState && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hours
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Seconds
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))}
                className="input-field"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400 self-center">Quick:</span>
            {[1, 5, 10, 15, 30, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => setPreset(mins)}
                className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                {mins}m
              </button>
            ))}
          </div>
        </>
      )}

      {/* Timer Display */}
      <div className={`card text-center relative overflow-hidden ${completed
        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
        }`}>
        {/* Progress bar */}
        {(running || isPaused) && (
          <div
            className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        )}

        <div className={`text-6xl font-bold mb-4 font-mono transition-colors ${completed
          ? 'text-green-600 dark:text-green-400 animate-pulse'
          : 'text-blue-600 dark:text-blue-400'
          }`}>
          {timeLeft > 0 || running ? displayTime() : '00:00:00'}
        </div>

        {completed && (
          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4 animate-bounce">
            ⏰ Time's Up!
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3 justify-center flex-wrap">
          {isInitialState && (
            <button onClick={start} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          )}

          {running && (
            <>
              <button onClick={pause} className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
              <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <Square className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button onClick={resume} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Resume</span>
              </button>
              <button onClick={reset} className="btn-secondary flex-1 flex items-center justify-center space-x-2">
                <Square className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </>
          )}

          {completed && (
            <button onClick={reset} className="btn-primary w-full flex items-center justify-center space-x-2">
              <Square className="w-5 h-5" />
              <span>New Timer</span>
            </button>
          )}
        </div>
      </div>

      {/* Sound Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`btn-secondary flex items-center space-x-2 ${!soundEnabled ? 'opacity-50' : ''}`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          <span>{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
        </button>
        <button
          onClick={testSound}
          className="btn-secondary flex items-center space-x-2"
        >
          <Bell className="w-5 h-5" />
          <span>Test</span>
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 Tip:</strong> Use the quick preset buttons to set common timer durations quickly. You can pause and resume the countdown at any time.
      </div>
    </div>
  );
}
