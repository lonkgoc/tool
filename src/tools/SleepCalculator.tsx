import { useState } from 'react';

export default function SleepCalculator() {
  const [bedtime, setBedtime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:30');

  const parsTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };

  let sleepMinutes = parsTime(wakeTime) - parsTime(bedtime);
  if (sleepMinutes < 0) sleepMinutes += 24 * 60;
  
  const sleepHours = sleepMinutes / 60;
  const idealBedtimes = Array.from({length: 6}, (_, i) => {
    const mins = parsTime(wakeTime) - (i + 1) * 90;
    const h = Math.floor((mins % (24 * 60)) / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sleep Calculator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Bedtime
          <input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="input-field" />
        </label>
        <label>
          Wake Time
          <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} className="input-field" />
        </label>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900 dark:to-indigo-900 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300">Total Sleep Duration</div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{sleepHours.toFixed(1)} hours</div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Recommended: 7-9 hours</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-2">
        <div className="text-sm font-medium mb-3">🌙 Ideal Bedtimes (90-min cycles)</div>
        <div className="space-y-2 text-sm">
          {idealBedtimes.map((time, idx) => (
            <div key={idx} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <span>{time}</span>
              <span className="text-slate-500">{(idx + 1) * 1.5} hrs sleep</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">😴 Sleep Tips</div>
        <div>• Aim for 7-9 hours nightly</div>
        <div>• Keep consistent schedule</div>
        <div>• Cool, dark bedroom</div>
        <div>• Avoid screens 30 min before bed</div>
      </div>
    </div>
  );
}
