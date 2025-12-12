import { useState } from 'react';

export default function HeightPredictor() {
  const [fatherHeight, setFatherHeight] = useState(72);
  const [motherHeight, setMotherHeight] = useState(66);
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');

  // Mid-parental height formula
  const midParentalHeight = (fatherHeight + motherHeight) / 2;
  const predictedHeight = gender === 'boy' 
    ? midParentalHeight + 2.5 
    : midParentalHeight - 2.5;

  const rangeHigh = predictedHeight + 4;
  const rangeLow = predictedHeight - 4;

  const heightFt = Math.floor(predictedHeight / 12);
  const heightIn = Math.round(predictedHeight % 12);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Height Predictor</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <label>
          Father Height (in)
          <input type="number" value={fatherHeight} onChange={e => setFatherHeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Mother Height (in)
          <input type="number" value={motherHeight} onChange={e => setMotherHeight(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Gender
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input-field">
            <option value="boy">Boy</option>
            <option value="girl">Girl</option>
          </select>
        </label>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Predicted Adult Height</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{heightFt}'{heightIn}"</div>
        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{predictedHeight.toFixed(1)} inches</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">📏 Typical Range</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Low Range:</span>
            <span className="font-mono">{Math.floor(rangeLow / 12)}'{Math.round(rangeLow % 12)}"</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Predicted:</span>
            <span className="font-mono font-bold">{heightFt}'{heightIn}"</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>High Range:</span>
            <span className="font-mono">{Math.floor(rangeHigh / 12)}'{Math.round(rangeHigh % 12)}"</span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">📌 Note</div>
        <div>This is an estimate using the mid-parental height formula. Actual height can vary based on nutrition, genetics, and environmental factors.</div>
      </div>
    </div>
  );
}
