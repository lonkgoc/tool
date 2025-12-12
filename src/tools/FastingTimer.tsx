import { useState, useEffect } from 'react';

export default function FastingTimer() {
  const [protocol, setProtocol] = useState<'16:8' | '18:6' | '20:4' | '24hr' | 'custom'>('16:8');
  const [customFast, setCustomFast] = useState(16);
  const [customEat, setCustomEat] = useState(8);
  const [startTime, setStartTime] = useState(new Date().toISOString().split('T')[0] + ' 20:00');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const protocolHours: Record<string, { fast: number; eat: number }> = {
    '16:8': { fast: 16, eat: 8 },
    '18:6': { fast: 18, eat: 6 },
    '20:4': { fast: 20, eat: 4 },
    '24hr': { fast: 24, eat: 0 },
    'custom': { fast: customFast, eat: customEat },
  };

  const hours = protocolHours[protocol].fast;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - start) / 1000);
      const remaining = Math.max(0, hours * 3600 - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) setIsRunning(false);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, startTime, hours]);

  const hrs = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;
  const fastingCompleted = (1 - timeLeft / (hours * 3600)) * 100;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Intermittent Fasting Timer</h2>
      
      <label>
        Protocol
        <select value={protocol} onChange={e => setProtocol(e.target.value as any)} disabled={isRunning} className="input-field">
          <option value="16:8">16:8 (16h fast, 8h eat)</option>
          <option value="18:6">18:6 (18h fast, 6h eat)</option>
          <option value="20:4">20:4 (20h fast, 4h eat)</option>
          <option value="24hr">24-hour fast</option>
          <option value="custom">Custom</option>
        </select>
      </label>

      {protocol === 'custom' && (
        <div className="grid grid-cols-2 gap-3">
          <label>
            Fast Hours
            <input type="number" value={customFast} onChange={e => setCustomFast(parseInt(e.target.value) || 16)} className="input-field" />
          </label>
          <label>
            Eating Window Hours
            <input type="number" value={customEat} onChange={e => setCustomEat(parseInt(e.target.value) || 8)} className="input-field" />
          </label>
        </div>
      )}

      <label>
        Start Time
        <input type="datetime-local" value={startTime.replace(' ', 'T')} onChange={e => setStartTime(e.target.value.replace('T', ' '))} disabled={isRunning} className="input-field" />
      </label>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 p-8 rounded-lg text-center space-y-4">
        <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 font-mono">
          {String(hrs).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
          <div className="bg-purple-600 h-full transition-all" style={{ width: `${fastingCompleted}%` }}></div>
        </div>
        <div className="text-sm">{fastingCompleted.toFixed(0)}% complete</div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'btn-secondary' : 'btn-primary'}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => { setIsRunning(false); setTimeLeft(0); }} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">💡 Tips</div>
        <div>• Stay hydrated during fasting periods</div>
        <div>• Black coffee/tea are fine during fast</div>
        <div>• Eat nutrient-dense foods during eating window</div>
        <div>• Consult a doctor before starting IF</div>
      </div>
    </div>
  );
}
