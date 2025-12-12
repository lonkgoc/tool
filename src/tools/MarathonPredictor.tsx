import { useState } from 'react';

export default function MarathonPredictor() {
  const [raceTime, setRaceTime] = useState(30); // minutes for 5K
  const [raceDistance, setRaceDistance] = useState<'5k' | '10k' | 'half' | 'mile'>('5k');

  // Riegel's formula: T2 = T1 × (D2/D1)^1.06
  const distances: Record<string, number> = { '5k': 5, '10k': 10, 'half': 13.1, 'mile': 1 };
  const marathonDistance = 26.2;

  const raceDistanceValue = distances[raceDistance];
  const marathonTimeMinutes = raceTime * Math.pow(marathonDistance / raceDistanceValue, 1.06);
  const marathonHours = Math.floor(marathonTimeMinutes / 60);
  const marathonMins = Math.round(marathonTimeMinutes % 60);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Marathon Time Predictor</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Race Type
          <select value={raceDistance} onChange={e => setRaceDistance(e.target.value as any)} className="input-field">
            <option value="mile">1 Mile</option>
            <option value="5k">5K</option>
            <option value="10k">10K</option>
            <option value="half">Half Marathon</option>
          </select>
        </label>
        <label>
          Race Time (minutes)
          <input type="number" value={raceTime} onChange={e => setRaceTime(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300">Predicted Marathon Time</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{marathonHours}:{String(marathonMins).padStart(2, '0')}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{marathonTimeMinutes.toFixed(0)} minutes total</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">📊 Details</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Average Pace:</span>
            <span className="font-mono">{(marathonTimeMinutes / marathonDistance).toFixed(1)} min/mile</span>
          </div>
          <div className="flex justify-between">
            <span>Average Speed:</span>
            <span className="font-mono">{(marathonDistance / (marathonTimeMinutes / 60)).toFixed(1)} mph</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">📌 Note</div>
        <div>This uses Riegel's formula for race prediction. Actual performance may vary based on training, weather, and course conditions.</div>
      </div>
    </div>
  );
}
