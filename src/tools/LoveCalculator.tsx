import { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function LoveCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [percentage, setPercentage] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const calculateLove = () => {
    if (!name1.trim() || !name2.trim()) {
      alert('Please enter both names!');
      return;
    }

    // Simple love calculator algorithm
    const combined = (name1.toLowerCase() + name2.toLowerCase()).replace(/\s/g, '');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    const result = Math.abs(hash) % 101;
    setPercentage(result);

    // Generate message based on percentage
    if (result >= 80) {
      setMessage('Perfect match! You two are meant to be together! 💕');
    } else if (result >= 60) {
      setMessage('Great compatibility! You have a strong connection! ❤️');
    } else if (result >= 40) {
      setMessage('Good match! There is potential for a great relationship! 💖');
    } else if (result >= 20) {
      setMessage('Moderate compatibility. Give it time and see what happens! 💝');
    } else {
      setMessage('It might be challenging, but love can grow! 💗');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="text-center mb-6">
          <Heart className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Love Calculator
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Calculate the love compatibility between two names
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="Enter first name"
              className="w-full input-field"
            />
          </div>

          <div className="text-center">
            <Heart className="w-8 h-8 mx-auto text-red-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Second Name
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="Enter second name"
              className="w-full input-field"
            />
          </div>

          <button
            onClick={calculateLove}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Calculate Love</span>
          </button>
        </div>
      </div>

      {percentage !== null && (
        <div className="card text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold text-red-500 mb-2">{percentage}%</div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-red-400 to-pink-500 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300">{message}</p>
        </div>
      )}
    </div>
  );
}


