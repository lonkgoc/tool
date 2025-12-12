import { useState } from 'react';

export default function OneRepMax() {
  const [weight, setWeight] = useState(185);
  const [reps, setReps] = useState(8);

  // Brzeski Formula: 1RM = weight × (36 / (37 - reps))
  const oneRM = weight * (36 / (37 - reps));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">One Rep Max Calculator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Weight (lbs)
          <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Reps Completed
          <input type="number" value={reps} onChange={e => setReps(parseInt(e.target.value) || 1)} className="input-field" />
        </label>
      </div>

      <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Estimated One-Rep Max</div>
        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{oneRM.toFixed(1)} lbs</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">Training Percentages</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span>50%:</span><span className="font-mono">{(oneRM * 0.5).toFixed(0)} lbs</span></div>
          <div className="flex justify-between"><span>75%:</span><span className="font-mono">{(oneRM * 0.75).toFixed(0)} lbs</span></div>
          <div className="flex justify-between"><span>90%:</span><span className="font-mono">{(oneRM * 0.9).toFixed(0)} lbs</span></div>
        </div>
      </div>
    </div>
  );
}
