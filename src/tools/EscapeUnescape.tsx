import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function EscapeUnescape() {
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
    const [type, setType] = useState<'html' | 'url' | 'java' | 'json'>('html');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const process = () => {
        try {
            if (!input) {
                setResult('');
                return;
            }

            let res = '';
            if (mode === 'escape') {
                switch (type) {
                    case 'html':
                        res = input.replace(/[&<>"']/g, (m) => ({
                            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
                        }[m] || m));
                        break;
                    case 'url':
                        res = encodeURIComponent(input);
                        break;
                    case 'java':
                        res = JSON.stringify(input).slice(1, -1).replace(/'/g, "\\'");
                        break;
                    case 'json':
                        res = JSON.stringify(input).slice(1, -1);
                        break;
                }
            } else {
                switch (type) {
                    case 'html':
                        const doc = new DOMParser().parseFromString(input, 'text/html');
                        res = doc.documentElement.textContent || '';
                        break;
                    case 'url':
                        res = decodeURIComponent(input);
                        break;
                    case 'java':
                        res = JSON.parse(`"${input.replace(/\\'/g, "'")}"`);
                        break;
                    case 'json':
                        res = JSON.parse(`"${input}"`);
                        break;
                }
            }
            setResult(res);
        } catch (err) {
            setResult('Error: Invalid input for selected operation');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <RefreshCw className="w-6 h-6 text-blue-500" />
                    Escape / Unescape Tool
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Operation</label>
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => { setMode('escape'); process(); }}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'escape'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                            >
                                Escape
                            </button>
                            <button
                                onClick={() => { setMode('unescape'); process(); }}
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'unescape'
                                        ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                    }`}
                            >
                                Unescape
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => { setType(e.target.value as any); process(); }}
                            className="input-field w-full"
                        >
                            <option value="html">HTML Entities</option>
                            <option value="url">URL Encoding</option>
                            <option value="java">Java / C# String</option>
                            <option value="json">JSON String</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Input</label>
                        <textarea
                            value={input}
                            onChange={(e) => { setInput(e.target.value); }}
                            onBlur={process}
                            className="w-full h-32 input-field font-mono text-sm"
                            placeholder="Enter text here..."
                        />
                    </div>

                    <button onClick={process} className="btn-primary w-full">
                        Convert
                    </button>

                    {result && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">Result</label>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={result}
                                readOnly
                                className="w-full h-32 input-field font-mono text-sm bg-slate-50 dark:bg-slate-800"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
