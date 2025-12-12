import { useState } from 'react';

export default function OvulationCalendar() {
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState('2024-11-01');

  const lastDate = new Date(lastPeriod);
  const ovulationDate = new Date(lastDate);
  ovulationDate.setDate(ovulationDate.getDate() + Math.round(cycleLength / 2));

  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ovulation Calendar</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Last Period Date
          <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="input-field" />
        </label>
        <label>
          Cycle Length (days)
          <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value) || 28)} className="input-field" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Ovulation Date</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{ovulationDate.toLocaleDateString()}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Day {Math.round(cycleLength / 2)}</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Next Period</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{nextPeriod.toLocaleDateString()}</div>
        </div>
      </div>

      <div className="bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">🌺 Fertile Window</div>
        <div className="text-lg font-bold text-rose-600 dark:text-rose-300 mb-2">
          {fertileStart.toLocaleDateString()} - {fertileEnd.toLocaleDateString()}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Peak fertility 12-24 hours around ovulation</div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">📅 Cycle Phases</div>
        <div>Days 1-5: Menstruation</div>
        <div>Days 6-13: Follicular Phase</div>
        <div>Days 14-16: Ovulation</div>
        <div>Days 17-28: Luteal Phase</div>
      </div>
    </div>
  );
}
