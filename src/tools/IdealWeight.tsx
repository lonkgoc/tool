import { useState } from 'react';

export default function IdealWeight() {
  const [height, setHeight] = useState(70);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [frame, setFrame] = useState<'small' | 'medium' | 'large'>('medium');

  // Devine formula for ideal body weight
  const devineIBW = gender === 'male' 
    ? 50 + 2.3 * (height - 60)
    : 45.5 + 2.3 * (height - 60);

  // Hamwi formula variation
  const hamwiIBW = gender === 'male'
    ? 48 + 2.7 * (height - 60)
    : 45.5 + 2.2 * (height - 60);

  const frameAdjustment = frame === 'small' ? -10 : frame === 'large' ? 10 : 0;
  const adjustedIBW = (devineIBW + frameAdjustment);

  const bmiHealthyRange = { low: 18.5, high: 24.9 };
  const minWeightHealthy = Math.round((height * height * bmiHealthyRange.low) / 703);
  const maxWeightHealthy = Math.round((height * height * bmiHealthyRange.high) / 703);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Ideal Body Weight</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <label>
          Height (inches)
          <input type="number" value={height} onChange={e => setHeight(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Gender
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Frame Size
          <select value={frame} onChange={e => setFrame(e.target.value as any)} className="input-field">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Ideal Body Weight</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{adjustedIBW.toFixed(0)} lbs</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Devine Formula</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">BMI-Based Range</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{minWeightHealthy} - {maxWeightHealthy} lbs</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">BMI 18.5-24.9</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">📊 Comparison</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Devine:</span>
            <span className="font-mono">{devineIBW.toFixed(0)} lbs</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Hamwi:</span>
            <span className="font-mono">{hamwiIBW.toFixed(0)} lbs</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Healthy BMI Range:</span>
            <span className="font-mono">{minWeightHealthy} - {maxWeightHealthy} lbs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
