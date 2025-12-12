import { useState } from 'react';

export default function HeartRateZones() {
  const [age, setAge] = useState(35);
  const [maxHR, setMaxHR] = useState(185);

  const calculatedMaxHR = 220 - age;
  const useMaxHR = maxHR > 0 ? maxHR : calculatedMaxHR;

  const zones = [
    { name: 'Zone 2: Endurance', color: 'bg-green-500', percent: 0.6, description: 'Conversational pace' },
    { name: 'Zone 3: Aerobic', color: 'bg-yellow-500', percent: 0.7, description: 'Harder breathing' },
    { name: 'Zone 4: Threshold', color: 'bg-orange-500', percent: 0.85, description: 'Near max effort' },
    { name: 'Zone 5: VO2 Max', color: 'bg-red-500', percent: 0.95, description: 'Maximum intensity' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Heart Rate Training Zones</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Age
          <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Max HR (optional, auto-calc if blank)
          <input type="number" value={maxHR} onChange={e => setMaxHR(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-400">Max Heart Rate</div>
        <div className="text-2xl font-bold">{useMaxHR} bpm</div>
      </div>

      <div className="space-y-3">
        {zones.map((zone, idx) => {
          const bpm = Math.round(useMaxHR * zone.percent);
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`${zone.color} w-4 h-4 rounded`}></div>
                <div className="font-medium">{zone.name}</div>
              </div>
              <div className="text-2xl font-bold mb-1">{bpm} bpm</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{zone.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
