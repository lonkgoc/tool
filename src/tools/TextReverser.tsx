import { useState } from 'react';
import { Copy, Check, ArrowLeftRight } from 'lucide-react';

export default function TextReverser() {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);

    const reverseText = (text: string) => text.split('').reverse().join('');
    const reverseWords = (text: string) => text.split(' ').reverse().join(' ');
    const reverseLines = (text: string) => text.split('\n').reverse().join('\n');

    const reversedText = reverseText(input);
    const reversedWords = reverseWords(input);
    const reversedLines = reverseLines(input);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <ArrowLeftRight className="w-6 h-6 text-purple-500" />
                    Text Reverser
                </h2>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Enter Text
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type or paste text to reverse..."
                        className="w-full h-32 input-field"
                    />
                </div>
            </div>

            {input && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Reverse Characters */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Reverse Characters</h3>
                            <button
                                onClick={() => copyToClipboard(reversedText)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg h-32 overflow-auto font-mono text-sm break-all">
                            {reversedText}
                        </div>
                    </div>

                    {/* Reverse Words */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Reverse Words</h3>
                            <button
                                onClick={() => copyToClipboard(reversedWords)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg h-32 overflow-auto font-mono text-sm">
                            {reversedWords}
                        </div>
                    </div>

                    {/* Reverse Lines */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Reverse Lines</h3>
                            <button
                                onClick={() => copyToClipboard(reversedLines)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg h-32 overflow-auto font-mono text-sm whitespace-pre">
                            {reversedLines}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
