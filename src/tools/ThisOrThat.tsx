import { useState } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

const options = [
  { a: "Pizza", b: "Burger" },
  { a: "Coffee", b: "Tea" },
  { a: "Summer", b: "Winter" },
  { a: "Beach", b: "Mountains" },
  { a: "Movies", b: "TV Shows" },
  { a: "Books", b: "Movies" },
  { a: "City", b: "Countryside" },
  { a: "Dogs", b: "Cats" },
  { a: "Sweet", b: "Savory" },
  { a: "Morning", b: "Night" }
];

export default function ThisOrThat() {
  const [pair, setPair] = useState(options[0]);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const newPair = () => {
    setPair(options[Math.floor(Math.random() * options.length)]);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">This or That</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setSelected('a')}
            className={`p-8 rounded-xl border-2 transition-all ${
              selected === 'a'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pair.a}
            </div>
          </button>

          <button
            onClick={() => setSelected('b')}
            className={`p-8 rounded-xl border-2 transition-all ${
              selected === 'b'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {pair.b}
            </div>
          </button>
        </div>

        {selected && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-green-800 dark:text-green-200 font-semibold">
              You chose: {selected === 'a' ? pair.a : pair.b}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={newPair} className="btn-primary flex-1 flex items-center justify-center space-x-2">
            <Shuffle className="w-5 h-5" />
            <span>New Pair</span>
          </button>
          <button onClick={() => setSelected(null)} className="btn-secondary flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}


