import { useState, useEffect, useRef } from 'react';
import { Clock, Trophy } from 'lucide-react';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Programming is the art of telling another human being what one wants the computer to do.",
  "The best way to predict the future is to invent it.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code."
];

export default function TypingTest() {
  const [text, setText] = useState(sampleTexts[0]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (started && !finished && time > 0) {
      const words = input.trim().split(/\s+/).filter(w => w).length;
      setWpm(Math.round((words / time) * 60));
      
      let correct = 0;
      for (let i = 0; i < Math.min(input.length, text.length); i++) {
        if (input[i] === text[i]) correct++;
      }
      setAccuracy(Math.round((correct / Math.max(input.length, 1)) * 100));
    }
  }, [input, time, started, finished, text]);

  useEffect(() => {
    if (started && !finished) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, finished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    
    if (!started && value.length > 0) {
      setStarted(true);
    }
    
    if (value === text) {
      setFinished(true);
      setStarted(false);
    }
  };

  const reset = () => {
    setInput('');
    setStarted(false);
    setTime(0);
    setWpm(0);
    setAccuracy(100);
    setFinished(false);
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  };

  const getCharClass = (index: number) => {
    if (index >= input.length) return '';
    if (input[index] === text[index]) return 'text-green-500';
    return 'text-red-500 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Clock className="w-6 h-6" />
          <span>Typing Test</span>
        </h2>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{wpm}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{time}s</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Time</div>
              </div>
            </div>
            <button onClick={reset} className="btn-secondary">
              Reset
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4 min-h-[100px]">
            <p className="text-lg leading-relaxed">
              {text.split('').map((char, i) => (
                <span key={i} className={getCharClass(i)}>
                  {char}
                </span>
              ))}
            </p>
          </div>

          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Start typing..."
            className="w-full input-field font-mono text-lg h-32"
            disabled={finished}
            autoFocus
          />
        </div>

        {finished && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-green-600 dark:text-green-400" />
            <div className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
              Congratulations!
            </div>
            <div className="text-green-800 dark:text-green-200">
              You typed at {wpm} WPM with {accuracy}% accuracy
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


