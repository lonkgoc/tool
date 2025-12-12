import { useState } from 'react';
import { Shuffle, Copy, Check } from 'lucide-react';

const excuses = [
  "My dog ate my homework.",
  "I had a family emergency.",
  "My internet was down.",
  "I was stuck in traffic.",
  "My alarm didn't go off.",
  "I had a doctor's appointment.",
  "My car broke down.",
  "I was helping a friend in need.",
  "I had a power outage.",
  "My phone died and I lost track of time.",
  "I was at a funeral.",
  "I had food poisoning.",
  "My computer crashed.",
  "I was in a meeting.",
  "I had to take care of my sick pet."
];

export default function ExcuseGenerator() {
  const [excuse, setExcuse] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setExcuse(excuses[Math.floor(Math.random() * excuses.length)]);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(excuse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Excuse Generator</h2>

        <button
          onClick={generate}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Shuffle className="w-5 h-5" />
          <span>Generate Excuse</span>
        </button>

        {excuse && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
              <div className="text-4xl mb-4">😅</div>
              <div className="text-xl font-semibold text-yellow-900 dark:text-yellow-100">
                {excuse}
              </div>
            </div>

            <button
              onClick={copy}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Excuse'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


