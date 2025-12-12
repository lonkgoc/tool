import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function ColorPalette() {
  const [palette, setPalette] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const generatePalette = () => {
    const colors: string[] = [];
    for (let i = 0; i < 5; i++) {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 60 + Math.floor(Math.random() * 40);
      const lightness = 40 + Math.floor(Math.random() * 30);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    setPalette(colors);
  };

  const hexFromHSL = (hsl: string) => {
    const match = hsl.match(/\d+/g);
    if (!match) return '#000000';
    const h = parseInt(match[0]) / 360;
    const s = parseInt(match[1]) / 100;
    const l = parseInt(match[2]) / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h < 1/6) { r = c; g = x; }
    else if (h < 2/6) { r = x; g = c; }
    else if (h < 3/6) { g = c; b = x; }
    else if (h < 4/6) { g = x; b = c; }
    else if (h < 5/6) { r = x; b = c; }
    else { r = c; b = x; }
    
    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <button onClick={generatePalette} className="btn-primary w-full flex items-center justify-center space-x-2">
        <RefreshCw className="w-5 h-5" />
        <span>Generate Color Palette</span>
      </button>

      {palette.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {palette.map((color, index) => {
            const hex = hexFromHSL(color);
            return (
              <div
                key={index}
                className="card cursor-pointer group"
                onClick={() => copyToClipboard(hex)}
              >
                <div
                  className="w-full h-32 rounded-xl mb-3"
                  style={{ backgroundColor: color }}
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">HEX</span>
                    {copied === hex && <Check className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {hex}
                  </div>
                  <div className="font-mono text-xs text-slate-600 dark:text-slate-400">
                    {color}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

