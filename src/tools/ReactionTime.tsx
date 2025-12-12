import { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw } from 'lucide-react';

export default function ReactionTime() {
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [times, setTimes] = useState<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const startTest = () => {
    setWaiting(true);
    setReady(false);
    setReactionTime(null);

    const delay = Math.random() * 3000 + 2000; // 2-5 seconds

    timeoutRef.current = window.setTimeout(() => {
      setWaiting(false);
      setReady(true);
      startTimeRef.current = Date.now();
    }, delay) as unknown as number;
  };

  const handleClick = () => {
    if (waiting) {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setWaiting(false);
      setReady(false);
      setReactionTime(null);
      alert('Too early! Wait for the green screen.');
      return;
    }

    if (ready && startTimeRef.current) {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setTimes([...times, time]);
      setReady(false);
      startTimeRef.current = null;
    }
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setWaiting(false);
    setReady(false);
    setReactionTime(null);
    startTimeRef.current = null;
  };

  const average = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const best = times.length > 0 ? Math.min(...times) : 0;

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Zap className="w-6 h-6" />
          <span>Reaction Time Test</span>
        </h2>

        <div
          onClick={handleClick}
          className={`h-96 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${waiting
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : ready
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
        >
          {waiting && (
            <div className="text-white text-2xl font-bold">Wait for green...</div>
          )}
          {ready && (
            <div className="text-white text-2xl font-bold">CLICK NOW!</div>
          )}
          {!waiting && !ready && (
            <div className="text-slate-600 dark:text-slate-400 text-xl">Click to start</div>
          )}
        </div>

        {reactionTime !== null && (
          <div className="mt-4 text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {reactionTime}ms
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {reactionTime < 200 ? 'Excellent!' : reactionTime < 300 ? 'Good!' : reactionTime < 400 ? 'Average' : 'Slow'}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button onClick={startTest} className="btn-primary flex-1">
            Start Test
          </button>
          <button onClick={reset} className="btn-secondary flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {times.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{average}ms</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{best}ms</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Recent Times:</div>
            <div className="flex flex-wrap gap-2">
              {times.slice(-5).map((time, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                  {time}ms
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


