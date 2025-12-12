import { useState } from 'react';

export default function BodyFatPercent() {
  const [method, setMethod] = useState<'brozek' | 'navy' | 'ymca'>('brozek');
  const [weight, setWeight] = useState(180);
  const [bodyFat, setBodyFat] = useState(20);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Body Fat Percentage</h2>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <label className="block">
          <span className="text-sm font-medium">Calculation Method</span>
          <select value={method} onChange={e => setMethod(e.target.value as any)} className="input-field mt-1">
            <option value="brozek">Brozek Formula</option>
            <option value="navy">Navy Formula</option>
            <option value="ymca">YMCA Formula</option>
          </select>
        </label>
        
        <label className="block">
          <span className="text-sm font-medium">Body Weight (lbs)</span>
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input-field mt-1" />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Body Fat % (from scale or calipers)</span>
          <input type="number" value={bodyFat} onChange={e => setBodyFat(parseFloat(e.target.value) || 0)} className="input-field mt-1" />
        </label>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4 rounded">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Estimated Body Fat Percentage</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{bodyFat.toFixed(1)}%</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {bodyFat < 15 && 'Essential fat levels'}
            {bodyFat >= 15 && bodyFat < 25 && 'Athlete level'}
            {bodyFat >= 25 && bodyFat < 32 && 'Fitness level'}
            {bodyFat >= 32 && 'Average'}
          </div>
        </div>
      </div>
    </div>
  );
}
