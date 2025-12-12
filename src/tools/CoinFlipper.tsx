import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function CoinFlipper() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<('heads' | 'tails')[]>([]);

  const flip = () => {
    setFlipping(true);
    setTimeout(() => {
      const flipResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(flipResult);
      setHistory([...history, flipResult].slice(-10));
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div
          className={`w-48 h-48 rounded-full flex items-center justify-center text-6xl font-bold transition-transform duration-1000 ${
            flipping ? 'animate-spin' : ''
          } ${
            result === 'heads'
              ? 'bg-yellow-400 text-yellow-900'
              : result === 'tails'
              ? 'bg-slate-400 text-slate-900'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
          }`}
        >
          {result === 'heads' ? 'H' : result === 'tails' ? 'T' : '?'}
        </div>
        {result && !flipping && (
          <div className="mt-6 text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
            {result}!
          </div>
        )}
      </div>

      <button
        onClick={flip}
        disabled={flipping}
        className="btn-primary w-full flex items-center justify-center space-x-2"
      >
        <RefreshCw className={`w-5 h-5 ${flipping ? 'animate-spin' : ''}`} />
        <span>{flipping ? 'Flipping...' : 'Flip Coin'}</span>
      </button>

      {history.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Recent Flips
          </h3>
          <div className="flex flex-wrap gap-2">
            {history.map((flip, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  flip === 'heads'
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-slate-400 text-slate-900'
                }`}
              >
                {flip === 'heads' ? 'H' : 'T'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

