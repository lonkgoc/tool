import { useState } from 'react';
import { Link, Copy, Check, ArrowLeftRight, AlertCircle } from 'lucide-react';

export default function UrlEncodeDecode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'full' | 'component'>('component');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter some input');
      return;
    }

    try {
      if (mode === 'encode') {
        if (encodeMode === 'component') {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(encodeURI(input));
        }
      } else {
        try {
          if (encodeMode === 'component') {
            setOutput(decodeURIComponent(input));
          } else {
            setOutput(decodeURI(input));
          }
        } catch {
          // Try the other decode method
          setOutput(decodeURIComponent(input));
        }
      }
    } catch (e: any) {
      setError('Error: Invalid URL encoding');
      setOutput('');
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { label: 'Query String', value: 'name=John Doe&city=New York' },
    { label: 'Special Chars', value: 'Hello World! @#$%^&*()' },
    { label: 'Full URL', value: 'https://example.com/path?q=hello world&lang=en' },
    { label: 'Unicode', value: 'Café résumé naïve' },
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Link className="w-6 h-6 text-blue-500" />
          URL Encoder / Decoder
        </h2>

        {/* Mode Toggle */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${mode === 'encode'
                ? 'bg-blue-500 text-white'
                : 'bg-white/50 dark:bg-slate-700/50'
              }`}
          >
            🔒 Encode
          </button>
          <button
            onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${mode === 'decode'
                ? 'bg-green-500 text-white'
                : 'bg-white/50 dark:bg-slate-700/50'
              }`}
          >
            🔓 Decode
          </button>
        </div>

        {/* Encode Mode */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setEncodeMode('component')}
            className={`px-4 py-2 rounded-lg text-sm ${encodeMode === 'component' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Component (query params)
          </button>
          <button
            onClick={() => setEncodeMode('full')}
            className={`px-4 py-2 rounded-lg text-sm ${encodeMode === 'full' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            Full URL (preserves /:?)
          </button>
        </div>

        {/* Quick Examples */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Quick Examples:
          </label>
          <div className="flex flex-wrap gap-2">
            {examples.map(ex => (
              <button
                key={ex.label}
                onClick={() => setInput(ex.value)}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm hover:bg-slate-200"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'URL-Encoded Text to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            placeholder={mode === 'encode' ? 'Enter text or URL...' : 'Paste URL-encoded string...'}
            className="w-full h-28 input-field font-mono text-sm"
          />
        </div>

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
        >
          <ArrowLeftRight className="w-5 h-5" />
          {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
        </button>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Output
              </label>
              <button onClick={copyToClipboard} className="btn-secondary p-2">
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-28 input-field font-mono text-sm"
            />
          </div>
        )}
      </div>

      {/* Character Reference */}
      <div className="card">
        <h3 className="font-semibold mb-3">Common URL Encodings</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 text-center text-sm">
          {[
            ['Space', '%20'],
            ['!', '%21'],
            ['#', '%23'],
            ['$', '%24'],
            ['&', '%26'],
            ["'", '%27'],
            ['(', '%28'],
            [')', '%29'],
            ['*', '%2A'],
            ['+', '%2B'],
            [',', '%2C'],
            ['/', '%2F'],
          ].map(([char, encoded]) => (
            <div key={char} className="bg-slate-50 dark:bg-slate-800 p-2 rounded">
              <div className="font-mono">{char}</div>
              <div className="text-xs text-slate-500">{encoded}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
