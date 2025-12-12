import { useState } from 'react';

export default function CyclingPower() {
  const [weight, setWeight] = useState(180);
  const [time, setTime] = useState(60);
  const [distance, setDistance] = useState(15);
  const [elevation, setElevation] = useState(500);

  // Simplified power estimation: (weight * elevation / time) + aerodynamic component
  const gravitationalComponent = (weight * elevation) / time;
  const aerodynamicComponent = (distance * 0.5); // Simplified
  const totalPower = Math.round(gravitationalComponent + aerodynamicComponent);
  const wattPerKg = (totalPower / weight).toFixed(2);

  const getPowerCategory = () => {
    const wpk = parseFloat(wattPerKg);
    if (wpk < 1.5) return 'Untrained';
    if (wpk < 2.5) return 'Recreationally Active';
    if (wpk < 3.5) return 'Trained';
    if (wpk < 5) return 'Very Trained';
    return 'Elite';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cycling Power Calculator</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <label>
          Body Weight (lbs)
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Time (minutes)
          <input type="number" value={time} onChange={e => setTime(parseInt(e.target.value) || 1)} className="input-field" />
        </label>
        <label>
          Distance (miles)
          <input type="number" value={distance} onChange={e => setDistance(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Elevation Gain (ft)
          <input type="number" value={elevation} onChange={e => setElevation(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Power Output</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalPower}W</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{wattPerKg} W/kg</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Category</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getPowerCategory()}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">⚡ Power Zones</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>Z1 Recovery:</span><span className="font-mono">{'<'} 55%</span></div>
          <div className="flex justify-between"><span>Z2 Endurance:</span><span className="font-mono">55-75%</span></div>
          <div className="flex justify-between"><span>Z3 Tempo:</span><span className="font-mono">75-90%</span></div>
          <div className="flex justify-between"><span>Z4 Threshold:</span><span className="font-mono">90-105%</span></div>
          <div className="flex justify-between"><span>Z5 VO2 Max:</span><span className="font-mono">105-120%</span></div>
        </div>
      </div>
    </div>
  );
}
