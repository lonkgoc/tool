import { useState } from 'react';
import { Shuffle, Copy, Check } from 'lucide-react';

const words = ['apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'galaxy', 'hammer', 'island', 'jungle'];
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbols = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

export default function PasswordWheel() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = words;
    if (includeNumbers) chars = [...chars, ...numbers];
    if (includeSymbols) chars = [...chars, ...symbols];
    
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(result);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Password Wheel Generator</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Length: {length}
            </label>
            <input
              type="range"
              min="6"
              max="32"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Include Numbers</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Include Symbols</span>
            </label>
          </div>

          <button onClick={generate} className="btn-primary w-full flex items-center justify-center space-x-2">
            <Shuffle className="w-5 h-5" />
            <span>Generate Password</span>
          </button>
        </div>

        {password && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <div className="font-mono text-lg text-center text-slate-900 dark:text-slate-100 break-all">
                {password}
              </div>
            </div>
            <button
              onClick={copy}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Password'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


