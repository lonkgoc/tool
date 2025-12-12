import { useState } from 'react';

export default function RunningPace() {
  const [distance, setDistance] = useState(5);
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const distanceInMiles = distanceUnit === 'miles' ? distance : distance / 1.60934;
  const paceSeconds = totalSeconds / distanceInMiles;
  const paceMins = Math.floor(paceSeconds / 60);
  const paceSecs = Math.round(paceSeconds % 60);
  const speedMph = (distanceInMiles / (totalSeconds / 3600)).toFixed(1);
  const speedKph = (distanceInMiles * 1.60934 / (totalSeconds / 3600)).toFixed(1);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Running Pace Calculator</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <label>
          Distance
          <input type="number" value={distance} onChange={e => setDistance(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Unit
          <select value={distanceUnit} onChange={e => setDistanceUnit(e.target.value as any)} className="input-field">
            <option value="miles">Miles</option>
            <option value="km">Kilometers</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label>
          Hours
          <input type="number" value={hours} onChange={e => setHours(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Minutes
          <input type="number" value={minutes} onChange={e => setMinutes(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Seconds
          <input type="number" value={seconds} onChange={e => setSeconds(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Pace</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{paceMins}:{String(paceSecs).padStart(2, '0')}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">min/mile</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Speed</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{speedMph} mph</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">{speedKph} kph</div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">🏃 Pace Guide</div>
        <div>Easy: 11:00 - 12:30 min/mile</div>
        <div>Tempo: 8:00 - 10:00 min/mile</div>
        <div>Threshold: 7:00 - 8:30 min/mile</div>
        <div>VO2 Max: 5:00 - 7:00 min/mile</div>
      </div>
    </div>
  );
}
