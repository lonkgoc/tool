import { useState, useEffect } from 'react';

export default function MeditationTimer() {
  const [duration, setDuration] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Play completion sound
          try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.frequency.value = 528;
            g.gain.value = 0.1;
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            setTimeout(() => { o.stop(); ctx.close(); }, 500);
          } catch (e) { /* ignore */ }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Meditation Timer</h2>
      
      <label>
        Duration (minutes)
        <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value) || 1)} disabled={isRunning} className="input-field" />
      </label>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-8 rounded-lg text-center space-y-4">
        <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 font-mono">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => setIsRunning(!isRunning)} 
            className={`px-6 py-2 rounded font-medium ${isRunning ? 'btn-secondary' : 'btn-primary'}`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={() => { setIsRunning(false); setTimeLeft(duration * 60); }} 
            className="btn-secondary px-6 py-2"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[5, 10, 15].map(min => (
          <button 
            key={min}
            onClick={() => { setDuration(min); setIsRunning(false); }}
            disabled={isRunning}
            className="btn-secondary disabled:opacity-50"
          >
            {min} min
          </button>
        ))}
      </div>

      <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">🧘 Meditation Tips</div>
        <div>• Find a quiet, comfortable space</div>
        <div>• Focus on your breath</div>
        <div>• Let thoughts pass without judgment</div>
        <div>• Start with 5-10 minutes daily</div>
      </div>
    </div>
  );
}
