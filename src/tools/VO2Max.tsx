import { useState } from 'react';

export default function VO2Max() {
  const [restingHR, setRestingHR] = useState(60);
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Simplified VO2 Max estimation (requires actual fitness test for accuracy)
  // Karvonen formula as basis
  const maxHR = 220 - age;
  const vo2Max = gender === 'male' 
    ? 15.3 * (maxHR / restingHR)
    : 15.3 * (maxHR / restingHR) * 0.95;

  const getVO2Category = () => {
    if (gender === 'male') {
      if (vo2Max < 25) return 'Poor';
      if (vo2Max < 35) return 'Average';
      if (vo2Max < 40) return 'Good';
      if (vo2Max < 50) return 'Excellent';
      return 'Superior';
    } else {
      if (vo2Max < 22) return 'Poor';
      if (vo2Max < 27) return 'Average';
      if (vo2Max < 30) return 'Good';
      if (vo2Max < 38) return 'Excellent';
      return 'Superior';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">VO2 Max Estimator</h2>
      
      <div className="grid grid-cols-3 gap-4">
        <label>
          Resting HR (bpm)
          <input type="number" value={restingHR} onChange={e => setRestingHR(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Age
          <input type="number" value={age} onChange={e => setAge(parseInt(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Gender
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Estimated VO2 Max</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{vo2Max.toFixed(1)}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">ml/kg/min</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Fitness Level</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getVO2Category()}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">({gender === 'male' ? 'Male' : 'Female'})</div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">📊 Note</div>
        <div>For accurate VO2 Max measurement, perform a fitness test (treadmill or bike ergometer) with heart rate monitoring.</div>
      </div>
    </div>
  );
}
