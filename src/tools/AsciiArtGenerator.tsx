import { useState } from 'react';
import { Copy, Check, Type } from 'lucide-react';

const fontMap: Record<string, string[]> = {
    'A': ['  __  ', ' /  \\ ', '/ /\\ \\', '|-||-|', '| || |'],
    'B': [' ___  ', '|   \\ ', '| - < ', '|___/ '],
    'C': ['  __ ', ' / _]', '| (_ ', ' \\__]'],
    'D': [' ___  ', '|   \\ ', '| |  |', '|___/ '],
    'E': [' ___', '| __]', '| _]', '|___]'],
    'F': [' ___', '| __]', '| _]', '|_| '],
    'G': ['  __ ', ' / _]', '| [__', ' \\___]'],
    'H': [' _  _', '| || |', '| __ |', '|_||_|'],
    'I': [' _ ', '| |', '| |', '|_|'],
    'J': ['   _', '  | |', '_ | |', '(___|'],
    'K': [' _  _', '| |/ /', '|   < ', '|_|\\_\\'],
    'L': [' _  ', '| | ', '| |_', '|___|'],
    'M': [' _  _', '| \\/ |', '|    |', '|_||_|'],
    'N': [' _  _', '| \\| |', '| .` |', '|_|\\_|'],
    'O': ['  __ ', ' /  \\', '| () |', ' \\__/'],
    'P': [' ___ ', '| _ \\', '|  _/', '|_|  '],
    'Q': ['  __ ', ' /  \\', '| () |', ' \\_\\\\\\'],
    'R': [' ___ ', '| _ \\', '|   /', '|_|_\\'],
    'S': [' ___', '/ __]', '\\__ \\', '[___/'],
    'T': [' ____', '|_  _|', '  | | ', '  |_| '],
    'U': [' _  _', '| || |', '| || |', ' \\__/ '],
    'V': ['_  _', '| || |', '\\ \\/ /', ' \\__/ '],
    'W': [' _    _', '| |  | |', '| |/\\| |', ' \\_/\\_/ '],
    'X': ['__  __', '\\ \\/ /', ' >  < ', '/_/\\_\\'],
    'Y': ['__  __', '\\ \\/ /', ' \\  / ', '  |_|  '],
    'Z': ['____', '|_  /', ' / / ', '/___|'],
    ' ': ['  ', '  ', '  ', '  '],
    '0': ['  ___ ', ' / _ \\', '| (_) |', ' \\___/'],
    '1': [' _', '/ |', '| |', '|_|'],
    '2': [' ___ ', '|_  )', ' / / ', '/___|'],
    '3': [' ____', '|__ /', ' |_ \\', '|___/'],
    '4': [' _ _  ', '| | | ', '|_  _|', '  |_| '],
    '5': [' ___ ', '| __|', '|__ \\', '|___/'],
    '6': ['  __ ', ' / / ', '/ _ \\', '\\___/'],
    '7': ['____ ', '|__  |', '  / /', ' /_/ '],
    '8': [' ___ ', '( _ )', '/ _ \\', '\\___/'],
    '9': [' ___ ', '/ _ \\', '\\_, /', ' /_/ '],
    '.': ['   ', '   ', '   ', ' . '],
    '!': [' _ ', '| |', '|_|', '(_)'],
    '?': ['___ ', '  / ', ' ?  ', '(_) '],
};

export default function AsciiArtGenerator() {
    const [text, setText] = useState('HELLO');
    const [copied, setCopied] = useState(false);

    const generateArt = (input: string) => {
        const lines = ['', '', '', ''];
        const uppercaseInput = input.toUpperCase();

        for (const char of uppercaseInput) {
            const art = fontMap[char] || fontMap[' '];
            // Normalize height to 4 lines
            for (let i = 0; i < 4; i++) {
                if (art[i]) {
                    lines[i] += art[i] + ' ';
                } else {
                    lines[i] += ' '.repeat(art[0]?.length || 3) + ' ';
                }
            }
        }
        return lines.join('\n');
    };

    const asciiArt = generateArt(text);

    const handleCopy = () => {
        navigator.clipboard.writeText(asciiArt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                    <Type className="w-5 h-5 text-indigo-500" />
                    ASCII Banner Text
                </h3>

                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type text here..."
                    className="input-field text-xl font-mono tracking-wider"
                    maxLength={20}
                />
                <p className="text-xs text-slate-500 mt-2">Max 20 characters. Supports A-Z, 0-9, basic punctuation.</p>
            </div>

            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                    <span className="text-sm font-medium text-slate-300">Generated Art</span>
                    <button
                        onClick={handleCopy}
                        className="text-xs flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
                <div className="p-8 overflow-x-auto flex justify-center">
                    <pre className="font-mono text-xs md:text-sm lg:text-base leading-none text-green-400 whitespace-pre">
                        {asciiArt}
                    </pre>
                </div>
            </div>
        </div>
    );
}
