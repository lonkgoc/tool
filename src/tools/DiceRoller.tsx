import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function DiceRoller() {
  const [sides, setSides] = useState(6);
  const [count, setCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const newResults: number[] = [];
      for (let i = 0; i < count; i++) {
        newResults.push(Math.floor(Math.random() * sides) + 1);
      }
      setResults(newResults);
      setRolling(false);
    }, 500);
  };

  const total = results.reduce((sum, val) => sum + val, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Sides: {sides}
          </label>
          <input
            type="range"
            min="2"
            max="20"
            value={sides}
            onChange={(e) => setSides(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Dice: {count}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <button
        onClick={roll}
        disabled={rolling}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <RefreshCw className={`w-5 h-5 ${rolling ? 'animate-spin' : ''}`} />
        <span>{rolling ? 'Rolling...' : 'Roll Dice'}</span>
      </button>

      {results.length > 0 && (
        <div className="card">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="w-20 h-20 rounded-xl bg-blue-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg"
              >
                {result}
              </div>
            ))}
          </div>
          {count > 1 && (
            <div className="text-center text-lg font-semibold text-slate-900 dark:text-slate-100">
              Total: {total}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

