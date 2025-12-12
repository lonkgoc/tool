import { useState } from 'react';

export default function MacroCalculator() {
  const [weight, setWeight] = useState(180);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');
  const [goal, setGoal] = useState<'loss' | 'maintain' | 'gain'>('maintain');

  const tdeeMultiplier = activityLevel === 'sedentary' ? 1.2 : activityLevel === 'moderate' ? 1.55 : 1.9;
  const bmr = 10 * weight + 6.25 * 175 - 5 * 35 + 5; // Avg height/age
  const tdee = Math.round(bmr * tdeeMultiplier);
  
  let calories = tdee;
  if (goal === 'loss') calories = Math.round(tdee * 0.85);
  if (goal === 'gain') calories = Math.round(tdee * 1.1);

  const protein = Math.round((calories * 0.3) / 4);
  const fat = Math.round((calories * 0.3) / 9);
  const carbs = Math.round((calories * 0.4) / 4);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Macro Calculator</h2>
      
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
        <label>
          Goal
          <select value={goal} onChange={e => setGoal(e.target.value as any)} className="input-field">
            <option value="loss">Weight Loss</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Muscle Gain</option>
          </select>
        </label>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Daily Calorie Target</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{calories} kcal</div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-500">Protein</div>
          <div className="text-2xl font-bold">{protein}g</div>
          <div className="text-xs text-slate-500">{Math.round((protein * 4 / calories) * 100)}%</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-500">Carbs</div>
          <div className="text-2xl font-bold">{carbs}g</div>
          <div className="text-xs text-slate-500">{Math.round((carbs * 4 / calories) * 100)}%</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
          <div className="text-xs text-slate-500">Fat</div>
          <div className="text-2xl font-bold">{fat}g</div>
          <div className="text-xs text-slate-500">{Math.round((fat * 9 / calories) * 100)}%</div>
        </div>
      </div>
    </div>
  );
}
