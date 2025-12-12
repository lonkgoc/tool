import { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const options = ['Yes', 'No', 'Maybe', 'Probably', 'Probably Not', 'Definitely', 'Definitely Not'];

export default function YesNoWheel() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const spin = () => {
    if (spinning) return;
    
    setSpinning(true);
    setResult(null);
    
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const randomIndex = Math.floor(Math.random() * options.length);
    const finalRotation = rotation + (spins * 360) + (randomIndex * (360 / options.length));
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setResult(options[randomIndex]);
      setSpinning(false);
    }, 2000);
  };

  const reset = () => {
    setRotation(0);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Yes/No Wheel
        </h2>
        
        <div className="relative w-80 h-80 mx-auto mb-8">
          <div
            className="w-full h-full rounded-full border-8 border-slate-300 dark:border-slate-600 relative overflow-hidden transition-transform duration-2000"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {options.map((option, index) => {
              const angle = (360 / options.length) * index;
              const isHighlighted = result === option;
              return (
                <div
                  key={index}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right ${
                    isHighlighted ? 'bg-blue-500' : index % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300'
                  }`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90"
                    style={{ transformOrigin: 'center', transform: `translate(-50%, -50%) rotate(${angle + 90}deg)` }}
                  >
                    <span className="text-white font-semibold text-sm">{option}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-blue-600"></div>
          </div>
        </div>

        {result && (
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {result}
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={spin}
            disabled={spinning}
            className="btn-primary flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{spinning ? 'Spinning...' : 'Spin the Wheel'}</span>
          </button>
          {result && (
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


