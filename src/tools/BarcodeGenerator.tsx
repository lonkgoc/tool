import { useState, useRef, useEffect } from 'react';
import { Download, Copy, Check, RefreshCw } from 'lucide-react';

// Code 128 encoding patterns (subset B - ASCII 32-127)
const CODE128_PATTERNS: Record<number, string> = {
  0: '11011001100', 1: '11001101100', 2: '11001100110', 3: '10010011000',
  4: '10010001100', 5: '10001001100', 6: '10011001000', 7: '10011000100',
  8: '10001100100', 9: '11001001000', 10: '11001000100', 11: '11000100100',
  12: '10110011100', 13: '10011011100', 14: '10011001110', 15: '10111001100',
  16: '10011101100', 17: '10011100110', 18: '11001110010', 19: '11001011100',
  20: '11001001110', 21: '11011100100', 22: '11001110100', 23: '11101101110',
  24: '11101001100', 25: '11100101100', 26: '11100100110', 27: '11101100100',
  28: '11100110100', 29: '11100110010', 30: '11011011000', 31: '11011000110',
  32: '11000110110', 33: '10100011000', 34: '10001011000', 35: '10001000110',
  36: '10110001000', 37: '10001101000', 38: '10001100010', 39: '11010001000',
  40: '11000101000', 41: '11000100010', 42: '10110111000', 43: '10110001110',
  44: '10001101110', 45: '10111011000', 46: '10111000110', 47: '10001110110',
  48: '11101110110', 49: '11010001110', 50: '11000101110', 51: '11011101000',
  52: '11011100010', 53: '11011101110', 54: '11101011000', 55: '11101000110',
  56: '11100010110', 57: '11101101000', 58: '11101100010', 59: '11100011010',
  60: '11101111010', 61: '11001000010', 62: '11110001010', 63: '10100110000',
  64: '10100001100', 65: '10010110000', 66: '10010000110', 67: '10000101100',
  68: '10000100110', 69: '10110010000', 70: '10110000100', 71: '10011010000',
  72: '10011000010', 73: '10000110100', 74: '10000110010', 75: '11000010010',
  76: '11001010000', 77: '11110111010', 78: '11000010100', 79: '10001111010',
  80: '10100111100', 81: '10010111100', 82: '10010011110', 83: '10111100100',
  84: '10011110100', 85: '10011110010', 86: '11110100100', 87: '11110010100',
  88: '11110010010', 89: '11011011110', 90: '11011110110', 91: '11110110110',
  92: '10101111000', 93: '10100011110', 94: '10001011110', 95: '10111101000',
  96: '10111100010', 97: '11110101000', 98: '11110100010', 99: '10111011110',
  100: '10111101110', 101: '11101011110', 102: '11110101110',
  103: '11010000100', // Start Code B
  104: '11010010000', // Start Code A
  105: '11010011100', // Start Code C
  106: '1100011101011', // Stop pattern
};

const START_CODE_B = 104;
const STOP_CODE = 106;

function encodeCode128B(text: string): string {
  let pattern = CODE128_PATTERNS[START_CODE_B]; // Start with Code B
  let checksum = START_CODE_B;

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const value = charCode - 32; // Code B: ASCII 32 maps to value 0

    if (value < 0 || value > 95) {
      continue; // Skip unsupported characters
    }

    pattern += CODE128_PATTERNS[value];
    checksum += value * (i + 1);
  }

  // Add checksum
  const checksumValue = checksum % 103;
  pattern += CODE128_PATTERNS[checksumValue];

  // Add stop pattern
  pattern += CODE128_PATTERNS[STOP_CODE];

  return pattern;
}

export default function BarcodeGenerator() {
  const [text, setText] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [barHeight, setBarHeight] = useState(80);
  const [barWidth, setBarWidth] = useState(2);
  const [showText, setShowText] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateBarcode = () => {
    if (!text.trim()) {
      alert('Please enter text to generate barcode');
      return;
    }

    const pattern = encodeCode128B(text);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate dimensions
    const quietZone = 10 * barWidth;
    const barcodeWidth = pattern.length * barWidth;
    const textHeight = showText ? 20 : 0;
    const totalWidth = barcodeWidth + (quietZone * 2);
    const totalHeight = barHeight + textHeight + 20;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw barcode
    ctx.fillStyle = '#000000';
    let x = quietZone;

    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === '1') {
        ctx.fillRect(x, 10, barWidth, barHeight);
      }
      x += barWidth;
    }

    // Draw text below barcode
    if (showText) {
      ctx.fillStyle = '#000000';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(text, totalWidth / 2, barHeight + 25);
    }

    setBarcodeUrl(canvas.toDataURL('image/png'));
  };

  const handleDownload = () => {
    if (barcodeUrl) {
      const a = document.createElement('a');
      a.href = barcodeUrl;
      a.download = `barcode-${text.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      a.click();
    }
  };

  const copyBarcode = async () => {
    if (!canvasRef.current) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b!), 'image/png');
      });
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback: copy data URL
      if (barcodeUrl) {
        navigator.clipboard.writeText(barcodeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleClear = () => {
    setText('');
    setBarcodeUrl(null);
  };

  // Auto-generate on settings change if text exists
  useEffect(() => {
    if (text.trim() && barcodeUrl) {
      generateBarcode();
    }
  }, [barHeight, barWidth, showText]);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Barcode Generator (Code 128)
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Enter text or number
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateBarcode()}
              placeholder="Enter text to generate barcode (ASCII characters)"
              className="w-full input-field"
              maxLength={50}
            />
            <p className="text-xs text-slate-500 mt-1">
              Supports ASCII characters (letters, numbers, symbols)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bar Height: {barHeight}px
              </label>
              <input
                type="range"
                min="40"
                max="150"
                value={barHeight}
                onChange={(e) => setBarHeight(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bar Width: {barWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={barWidth}
                onChange={(e) => setBarWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showText"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showText" className="text-sm text-slate-700 dark:text-slate-300">
              Show text below barcode
            </label>
          </div>

          <div className="flex gap-3">
            <button onClick={generateBarcode} className="btn-primary flex-1">
              Generate Barcode
            </button>
            {barcodeUrl && (
              <button onClick={handleClear} className="btn-secondary">
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} className="hidden" />

      {barcodeUrl && (
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Generated Barcode
          </h3>
          <div className="bg-white p-6 rounded-lg mb-4 flex justify-center">
            <img src={barcodeUrl} alt="Barcode" className="max-w-full" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary flex-1 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={copyBarcode}
              className="btn-secondary flex items-center space-x-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
        <p className="font-medium mb-2">About Code 128:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>High-density barcode used in logistics and retail</li>
          <li>Supports all ASCII characters (letters, numbers, symbols)</li>
          <li>Includes automatic checksum for error detection</li>
          <li>Scannable by most barcode readers</li>
        </ul>
      </div>
    </div>
  );
}
