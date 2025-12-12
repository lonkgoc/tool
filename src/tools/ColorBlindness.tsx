import { useState } from 'react';
import { Eye } from 'lucide-react';

const testImages = [
  { number: '12', visible: true },
  { number: '8', visible: true },
  { number: '6', visible: true },
  { number: '29', visible: true },
  { number: '57', visible: true },
  { number: '45', visible: true }
];

export default function ColorBlindness() {
  const [currentTest, setCurrentTest] = useState(0);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<boolean[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = () => {
    const correct = answer === testImages[currentTest].number;
    const newResults = [...results, correct];
    setResults(newResults);
    
    if (currentTest < testImages.length - 1) {
      setCurrentTest(currentTest + 1);
      setAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const reset = () => {
    setCurrentTest(0);
    setAnswer('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Eye className="w-6 h-6" />
          <span>Color Blindness Test</span>
        </h2>

        {!showResults ? (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Test {currentTest + 1} of {testImages.length}: What number do you see in the circle?
              </p>
            </div>

            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-red-400 via-yellow-400 to-green-400 rounded-full flex items-center justify-center mb-4">
              <div className="text-6xl font-bold text-white drop-shadow-lg">
                {testImages[currentTest].number}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter the number you see
              </label>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAnswer()}
                placeholder="Enter number"
                className="w-full input-field text-center text-2xl"
              />
            </div>

            <button onClick={handleAnswer} className="btn-primary w-full">
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Test Complete
            </div>
            <div className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              You got {results.filter(r => r).length} out of {testImages.length} correct
            </div>
            <button onClick={reset} className="btn-primary">
              Take Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


