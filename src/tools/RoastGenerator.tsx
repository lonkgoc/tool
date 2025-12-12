import { useState } from 'react';
import { Shuffle, Copy, Check } from 'lucide-react';

const roasts = [
  "You're so slow, you make a snail look like Usain Bolt.",
  "If I had a dollar for every brain you don't have, I'd have one dollar.",
  "You're the reason why aliens don't visit Earth.",
  "I've seen better logic in a fortune cookie.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "You're not stupid; you just have bad luck thinking.",
  "I'd agree with you, but then we'd both be wrong.",
  "You're proof that evolution can go in reverse.",
  "I've seen people with more personality in a pet rock.",
  "You're the human equivalent of a participation trophy."
];

export default function RoastGenerator() {
  const [roast, setRoast] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setRoast(roasts[Math.floor(Math.random() * roasts.length)]);
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(roast);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Roast Generator</h2>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            ⚠️ Warning: These roasts are for entertainment purposes only. Use responsibly!
          </p>
        </div>

        <button
          onClick={generate}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Shuffle className="w-5 h-5" />
          <span>Generate Roast</span>
        </button>

        {roast && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
              <div className="text-4xl mb-4">🔥</div>
              <div className="text-xl font-semibold text-red-900 dark:text-red-100">
                {roast}
              </div>
            </div>

            <button
              onClick={copy}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy Roast'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


