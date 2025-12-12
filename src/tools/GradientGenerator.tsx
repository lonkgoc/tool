import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function GradientGenerator() {
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#8b5cf6');
  const [angle, setAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  const cssCode = `background: ${gradient};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Color 1
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="flex-1 input-field font-mono"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Color 2
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="w-16 h-16 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="flex-1 input-field font-mono"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Angle: {angle}°
        </label>
        <input
          type="range"
          min="0"
          max="360"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="card">
        <div
          className="w-full h-64 rounded-xl mb-4"
          style={{ background: gradient }}
        />
        <div className="flex items-center justify-between">
          <code className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm">
            {cssCode}
          </code>
          <button
            onClick={copyToClipboard}
            className="btn-secondary ml-3 p-3"
            aria-label="Copy CSS"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

