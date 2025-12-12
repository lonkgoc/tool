import { useState } from 'react';

export default function WaistToHip() {
  const [waist, setWaist] = useState(32);
  const [hip, setHip] = useState(38);
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const ratio = (waist / hip).toFixed(2);

  const getHealthStatus = () => {
    const r = parseFloat(ratio);
    if (gender === 'male') {
      if (r < 0.95) return { status: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' };
      if (r < 1.0) return { status: 'Moderate Risk', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900' };
      return { status: 'High Risk', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900' };
    } else {
      if (r < 0.8) return { status: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' };
      if (r < 0.85) return { status: 'Moderate Risk', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900' };
      return { status: 'High Risk', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900' };
    }
  };

  const health = getHealthStatus();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Waist-to-Hip Ratio</h2>
      
      <div className="grid grid-cols-3 gap-3">
        <label>
          Waist (inches)
          <input type="number" value={waist} onChange={e => setWaist(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Hip (inches)
          <input type="number" value={hip} onChange={e => setHip(parseFloat(e.target.value) || 0)} className="input-field" />
        </label>
        <label>
          Gender
          <select value={gender} onChange={e => setGender(e.target.value as any)} className="input-field">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
      </div>

      <div className={`${health.bg} p-4 rounded-lg border border-slate-200 dark:border-slate-700`}>
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Waist-to-Hip Ratio</div>
        <div className="text-3xl font-bold mb-2">{ratio}</div>
        <div className={`text-sm font-medium ${health.color}`}>{health.status}</div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-sm font-medium mb-3">📊 Health Categories</div>
        <div className="space-y-2 text-sm">
          {gender === 'male' ? (
            <>
              <div className="flex justify-between"><span>Low Risk:</span><span className="font-mono">{'<'} 0.95</span></div>
              <div className="flex justify-between"><span>Moderate Risk:</span><span className="font-mono">0.95 - 1.00</span></div>
              <div className="flex justify-between"><span>High Risk:</span><span className="font-mono">{'>'} 1.00</span></div>
            </>
          ) : (
            <>
              <div className="flex justify-between"><span>Low Risk:</span><span className="font-mono">{'<'} 0.80</span></div>
              <div className="flex justify-between"><span>Moderate Risk:</span><span className="font-mono">0.80 - 0.85</span></div>
              <div className="flex justify-between"><span>High Risk:</span><span className="font-mono">{'>'} 0.85</span></div>
            </>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm">
        <div className="font-medium mb-2">💡 About</div>
        <div>Waist-to-hip ratio is an indicator of body fat distribution and associated health risks. It's particularly useful for assessing cardiovascular health.</div>
      </div>
    </div>
  );
}
