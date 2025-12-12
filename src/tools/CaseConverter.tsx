import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const conversions = {
    uppercase: input.toUpperCase(),
    lowercase: input.toLowerCase(),
    titleCase: input.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    sentenceCase: input.charAt(0).toUpperCase() + input.slice(1).toLowerCase(),
    camelCase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, ''),
    pascalCase: input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => 
      word.toUpperCase()
    ).replace(/\s+/g, ''),
    snakeCase: input.toLowerCase().replace(/\s+/g, '_'),
    kebabCase: input.toLowerCase().replace(/\s+/g, '-'),
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setCopiedType(type);
    setTimeout(() => {
      setCopied(false);
      setCopiedType(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Enter text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-32 input-field"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(conversions).map(([type, value]) => (
          <div key={type} className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                {type.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <button
                onClick={() => copyToClipboard(value, type)}
                className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
                aria-label={`Copy ${type}`}
              >
                {copied && copiedType === type ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg font-mono text-sm break-all">
              {value || '...'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

