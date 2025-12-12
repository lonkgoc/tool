import { useState } from 'react';

export default function WaterIntake() {
  const [weight, setWeight] = useState(180);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');

  const baseWater = weight * 0.5; // Base: half your body weight in oz
  const activityBonus = activityLevel === 'sedentary' ? 0 : activityLevel === 'moderate' ? 12 : 20;
  const totalOz = baseWater + activityBonus;
  const totalMl = totalOz * 29.5735;
  const cups = totalOz / 8;
  const liters = totalMl / 1000;
  const glassesPerDay = Math.round(cups);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Daily Water Intake Calculator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Body Weight (lbs)
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Activity Level
          <select value={activityLevel} onChange={e => setActivityLevel(e.target.value as any)} className="input-field">
            <option value="sedentary">Sedentary</option>
            <option value="moderate">Moderate</option>
            <option value="active">Very Active</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Daily Water Intake</div>
          <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{totalOz.toFixed(0)} oz</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">≈ {liters.toFixed(1)}L or {cups.toFixed(1)} cups</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Per Glass</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{glassesPerDay}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">8 oz glasses per day</div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">💧 Hydration Tips</div>
        <div>• Drink before you're thirsty</div>
        <div>• More in hot weather or during exercise</div>
        <div>• Monitor urine color (pale = hydrated)</div>
        <div>• Spread intake throughout the day</div>
      </div>
    </div>
  );
}
