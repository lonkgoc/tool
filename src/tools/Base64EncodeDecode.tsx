import { useState, useRef } from 'react';
import { Copy, Check, ArrowLeftRight, Upload, Download } from 'lucide-react';

export default function Base64EncodeDecode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Proper UTF-8 encoding support
  const utf8ToBase64 = (str: string): string => {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return btoa(binary);
  };

  const base64ToUtf8 = (base64: string): string => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  };

  const handleConvert = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter some input');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(utf8ToBase64(input));
      } else {
        // Clean input (remove whitespace, newlines)
        const cleanInput = input.replace(/\s/g, '');
        setOutput(base64ToUtf8(cleanInput));
      }
    } catch (e: any) {
      setError(`Error: ${mode === 'decode' ? 'Invalid Base64 string' : 'Could not encode input'}`);
      setOutput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    if (mode === 'encode') {
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1] || '';
        setOutput(base64);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        setInput(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-3">
        <button
          onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${mode === 'encode'
              ? 'bg-blue-500 text-white'
              : 'bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
        >
          🔒 Encode
        </button>
        <button
          onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${mode === 'decode'
              ? 'bg-green-500 text-white'
              : 'bg-white/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300'
            }`}
        >
          🔓 Decode
        </button>
      </div>

      {/* Input Type Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputType('text')}
          className={`px-4 py-2 rounded-lg text-sm ${inputType === 'text' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          📝 Text
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`px-4 py-2 rounded-lg text-sm ${inputType === 'file' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
        >
          📁 File
        </button>
      </div>

      {/* Text Input */}
      {inputType === 'text' && (
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {mode === 'encode' ? 'Text to Encode' : 'Base64 to Decode'}
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            placeholder={mode === 'encode' ? 'Enter text to encode (supports Unicode)...' : 'Paste Base64 string here...'}
            className="w-full h-32 input-field font-mono text-sm"
          />
        </div>
      )}

      {/* File Input */}
      {inputType === 'file' && (
        <label className="cursor-pointer block">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 transition-colors">
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                {fileName || (mode === 'encode' ? 'Upload file to encode' : 'Upload Base64 file')}
              </p>
            </div>
          </div>
        </label>
      )}

      {/* Convert Button */}
      {inputType === 'text' && (
        <button
          onClick={handleConvert}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ArrowLeftRight className="w-5 h-5" />
          {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
        </button>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-sm">
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
            <div className="flex gap-2">
              <button onClick={downloadOutput} className="btn-secondary p-2" title="Download">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={copyToClipboard} className="btn-secondary p-2" title="Copy">
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 input-field font-mono text-sm"
          />
          <div className="text-xs text-slate-500 mt-1">
            {output.length.toLocaleString()} characters
          </div>
        </div>
      )}

      <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
        <strong>💡 Tip:</strong> This encoder supports Unicode (emoji, non-Latin characters). For files, images are encoded as data URLs.
      </div>
    </div>
  );
}

