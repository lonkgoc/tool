import { useState } from 'react';
import { Code, Copy, Check, ArrowLeftRight, AlertCircle } from 'lucide-react';

const commonEntities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '£': '&pound;',
    '¥': '&yen;',
    '¢': '&cent;',
    '°': '&deg;',
    '±': '&plusmn;',
    '÷': '&divide;',
    '×': '&times;',
    '≤': '&le;',
    '≥': '&ge;',
    '≠': '&ne;',
    '∞': '&infin;',
    '←': '&larr;',
    '→': '&rarr;',
    '↑': '&uarr;',
    '↓': '&darr;',
    '•': '&bull;',
    '…': '&hellip;',
    '—': '&mdash;',
    '–': '&ndash;',
    ' ': '&nbsp;',
};

const reverseEntities = Object.fromEntries(
    Object.entries(commonEntities).map(([k, v]) => [v, k])
);

export default function HtmlEntity() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [encodeMode, setEncodeMode] = useState<'minimal' | 'all'>('minimal');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');

    const encodeHtml = (text: string): string => {
        if (encodeMode === 'minimal') {
            // Only encode essential characters
            return text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        } else {
            // Encode all non-ASCII and special characters
            let result = '';
            for (const char of text) {
                const code = char.charCodeAt(0);
                if (commonEntities[char]) {
                    result += commonEntities[char];
                } else if (code > 127 || '<>&"\''.includes(char)) {
                    result += `&#${code};`;
                } else {
                    result += char;
                }
            }
            return result;
        }
    };

    const decodeHtml = (text: string): string => {
        // Create temporary element for decoding
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    const handleConvert = () => {
        setError('');
        if (!input.trim()) {
            setError('Please enter some input');
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(encodeHtml(input));
            } else {
                setOutput(decodeHtml(input));
            }
        } catch (e: any) {
            setError('Error processing input');
            setOutput('');
        }
    };

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const insertEntity = (entity: string, char: string) => {
        if (mode === 'encode') {
            setInput(input + char);
        } else {
            setInput(input + entity);
        }
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-orange-500" />
                    HTML Entity Encoder / Decoder
                </h2>

                {/* Mode Toggle */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${mode === 'encode'
                                ? 'bg-orange-500 text-white'
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
                {mode === 'encode' && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setEncodeMode('minimal')}
                            className={`px-4 py-2 rounded-lg text-sm ${encodeMode === 'minimal' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
                        >
                            Minimal (&lt; &gt; &amp; &quot;)
                        </button>
                        <button
                            onClick={() => setEncodeMode('all')}
                            className={`px-4 py-2 rounded-lg text-sm ${encodeMode === 'all' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}
                        >
                            All Special Characters
                        </button>
                    </div>
                )}

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {mode === 'encode' ? 'Text to Encode' : 'HTML Entities to Decode'}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => { setInput(e.target.value); setError(''); }}
                        placeholder={mode === 'encode' ? 'Enter text with special characters...' : 'Paste HTML entities like &amp;lt; or &#60;...'}
                        className="w-full h-28 input-field font-mono text-sm"
                    />
                </div>

                {/* Convert Button */}
                <button
                    onClick={handleConvert}
                    className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
                >
                    <ArrowLeftRight className="w-5 h-5" />
                    {mode === 'encode' ? 'Encode to Entities' : 'Decode Entities'}
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
                    <div className="mb-4">
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

            {/* Common Entities Reference */}
            <div className="card">
                <h3 className="font-semibold mb-3">Common HTML Entities (click to insert)</h3>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {Object.entries(commonEntities).slice(0, 24).map(([char, entity]) => (
                        <button
                            key={entity}
                            onClick={() => insertEntity(entity, char)}
                            className="bg-slate-50 dark:bg-slate-800 p-2 rounded text-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <div className="text-lg">{char === ' ' ? '␣' : char}</div>
                            <div className="text-xs text-slate-500 font-mono truncate">{entity}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <strong>💡 When to use:</strong> HTML entities are needed when displaying special characters in HTML that might be interpreted as code (like &lt; or &gt;) or for non-ASCII characters.
            </div>
        </div>
    );
}
