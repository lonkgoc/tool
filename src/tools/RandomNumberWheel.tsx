import { useState } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

export default function RandomNumberWheel() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [number, setNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    setSpinning(true);
    setNumber(null);
    
    const spins = 5 + Math.random() * 5;
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    const finalRotation = rotation + (spins * 360) + (randomNum * (360 / (max - min + 1)));
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setNumber(randomNum);
      setSpinning(false);
    }, 2000);
  };

  const reset = () => {
    setNumber(null);
    setRotation(0);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Random Number Wheel</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Min: {min}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={min}
              onChange={(e) => setMin(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="0"
              max="1000"
              value={min}
              onChange={(e) => setMin(Math.max(0, Math.min(Number(e.target.value), max - 1)))}
              className="w-full mt-2 input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max: {max}
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="w-full"
            />
            <input
              type="number"
              min="1"
              max="1000"
              value={max}
              onChange={(e) => setMax(Math.min(1000, Math.max(Number(e.target.value), min + 1)))}
              className="w-full mt-2 input-field"
            />
          </div>
        </div>

        <div className="relative w-80 h-80 mx-auto mb-6">
          <div
            className="w-full h-full rounded-full border-8 border-slate-300 dark:border-slate-600 relative overflow-hidden transition-transform duration-2000"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {Array.from({ length: Math.min(12, max - min + 1) }, (_, i) => {
              const angle = (360 / Math.min(12, max - min + 1)) * i;
              return (
                <div
                  key={i}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right ${
                    i % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300'
                  }`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
                  }}
                />
              );
            })}
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-blue-600"></div>
          </div>
        </div>

        {number !== null && (
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {number}
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              Range: {min} - {max}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={spin}
            disabled={spinning || min >= max}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <Shuffle className="w-5 h-5" />
            <span>{spinning ? 'Spinning...' : 'Spin the Wheel'}</span>
          </button>
          {number !== null && (
            <button onClick={reset} className="btn-secondary flex items-center space-x-2">
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


