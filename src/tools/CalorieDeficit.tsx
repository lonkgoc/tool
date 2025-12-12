import { useState } from 'react';

export default function CalorieDeficit() {
  const [tdee, setTdee] = useState(2500);
  const [goalWeight, setGoalWeight] = useState(180);
  const [currentWeight, setCurrentWeight] = useState(200);
  const [weeksTarget, setWeeksTarget] = useState(12);

  const totalLossNeeded = currentWeight - goalWeight;
  const caloriesPerPound = 3500;
  const totalCalorieDeficit = totalLossNeeded * caloriesPerPound;
  const dailyDeficit = Math.round(totalCalorieDeficit / (weeksTarget * 7));
  const poundsPerWeek = (dailyDeficit * 7) / caloriesPerPound;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Calorie Deficit Calculator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Daily TDEE (kcal)
          <input type="number" value={tdee} onChange={e => setTdee(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Current Weight (lbs)
          <input type="number" value={currentWeight} onChange={e => setCurrentWeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Goal Weight (lbs)
          <input type="number" value={goalWeight} onChange={e => setGoalWeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Weeks to Goal
          <input type="number" value={weeksTarget} onChange={e => setWeeksTarget(parseInt(e.target.value) || 1)} className="input-field" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Daily Calorie Intake</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{tdee - dailyDeficit} kcal</div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Deficit: {dailyDeficit} kcal/day</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">Weight Loss Rate</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{poundsPerWeek.toFixed(1)} lbs/week</div>
          <div className="text-xs text-slate-600 dark:text-slate-500 mt-1">Total: {totalLossNeeded} lbs</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900 dark:to-orange-900 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">✅ Safe Rate: 1-2 lbs/week</div>
        {poundsPerWeek > 2 && <div className="text-amber-700 dark:text-amber-200">⚠️ Rate is aggressive. Increase calories for safety.</div>}
        {poundsPerWeek < 0.5 && <div className="text-amber-700 dark:text-amber-200">💡 Rate is slow. Increase deficit for faster progress.</div>}
      </div>
    </div>
  );
}
