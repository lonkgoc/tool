import { useState } from 'react';
import { RotateCcw, Plus, Trash2 } from 'lucide-react';

export default function WheelOfNames() {
  const [names, setNames] = useState<string[]>(() => {
    const saved = localStorage.getItem('wheelNames');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const addName = () => {
    if (newName.trim()) {
      const updated = [...names, newName.trim()];
      setNames(updated);
      localStorage.setItem('wheelNames', JSON.stringify(updated));
      setNewName('');
    }
  };

  const spin = () => {
    if (names.length === 0) return;
    setSpinning(true);
    setWinner(null);
    
    const spins = 5 + Math.random() * 5;
    const randomIndex = Math.floor(Math.random() * names.length);
    const finalRotation = rotation + (spins * 360) + (randomIndex * (360 / names.length));
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setWinner(names[randomIndex]);
      setSpinning(false);
    }, 2000);
  };

  const deleteName = (index: number) => {
    const updated = names.filter((_, i) => i !== index);
    setNames(updated);
    localStorage.setItem('wheelNames', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Wheel of Names</h2>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addName()}
            placeholder="Add a name"
            className="flex-1 input-field"
          />
          <button onClick={addName} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {names.map((name, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <span className="text-slate-900 dark:text-slate-100">{name}</span>
              <button onClick={() => deleteName(index)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {names.length > 0 && (
          <div className="relative w-80 h-80 mx-auto mb-6">
            <div
              className="w-full h-full rounded-full border-8 border-slate-300 dark:border-slate-600 relative overflow-hidden transition-transform duration-2000"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 2s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              {names.map((name, index) => {
                const angle = (360 / names.length) * index;
                const isWinner = winner === name;
                return (
                  <div
                    key={index}
                    className={`absolute w-1/2 h-1/2 origin-bottom-right ${
                      isWinner ? 'bg-blue-500' : index % 2 === 0 ? 'bg-blue-400' : 'bg-blue-300'
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
                      <span className="text-white font-semibold text-sm">{name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-transparent border-t-blue-600"></div>
            </div>
          </div>
        )}

        {winner && (
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {winner}
            </div>
            <div className="text-slate-600 dark:text-slate-400">Winner!</div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={spin}
            disabled={spinning || names.length === 0}
            className="btn-primary flex-1"
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel'}
          </button>
          {winner && (
            <button onClick={() => setWinner(null)} className="btn-secondary">
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


