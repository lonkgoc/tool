import { useState } from 'react';
import { Copy, Trash2, ArrowDown } from 'lucide-react';

interface BaseMinifierProps {
    title: string;
    language: string;
    placeholder: string;
    onMinify: (input: string) => string;
}

function BaseMinifier({ title, language, placeholder, onMinify }: BaseMinifierProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const handleMinify = () => {
        setError('');
        if (!input.trim()) {
            setOutput('');
            return;
        }
        try {
            const minified = onMinify(input);
            setOutput(minified);
        } catch (err: any) {
            setError(err.message || 'Error minifying content');
        }
    };

    const handleCopy = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            // Could show toast here
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-200">{language} Input</label>
                    <button
                        onClick={() => { setInput(''); setOutput(''); setError(''); }}
                        className="text-sm text-slate-500 hover:text-red-500 flex items-center space-x-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear</span>
                    </button>
                </div>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full h-96 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-none"
                    placeholder={placeholder}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-slate-200">Minified Output</label>
                    <button
                        onClick={handleCopy}
                        disabled={!output}
                        className={`text-sm flex items-center space-x-1 ${!output ? 'text-slate-400 cursor-not-allowed' : 'text-blue-500 hover:text-blue-600'}`}
                    >
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                    </button>
                </div>
                <div className="relative">
                    <textarea
                        readOnly
                        value={output}
                        className="w-full h-96 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-sm resize-none outline-none"
                        placeholder="Minified code will appear here..."
                    />
                    {error && (
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-sm border-t border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            <div className="md:col-span-2 flex justify-center">
                <button
                    onClick={handleMinify}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
                >
                    <ArrowDown className="w-5 h-5" />
                    <span>Minify {language}</span>
                </button>
            </div>
        </div>
    );
}

// Implementations

export function JsonMinifier() {
    const minify = (input: string) => {
        return JSON.stringify(JSON.parse(input));
    };
    return <BaseMinifier title="JSON Minifier" language="JSON" placeholder='{"key": "value"}' onMinify={minify} />;
}

export function CssMinifier() {
    const minify = (input: string) => {
        return input
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .replace(/\s*([{:;,}])\s*/g, '$1') // Remove space around chars
            .replace(/;}/g, '}') // Remove last semicolon
            .trim();
    };
    return <BaseMinifier title="CSS Minifier" language="CSS" placeholder=".class { color: red; }" onMinify={minify} />;
}

export function JavascriptMinifier() {
    const minify = (input: string) => {
        // Very basic minification
        return input
            .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
            .replace(/\/\/.*/g, '') // single-line comments
            .replace(/\s+/g, ' ') // collapse whitespace
            .replace(/\s*([=+\-*/%&|!<>?:;,{}()\[\]])\s*/g, '$1') // remove space around operators
            .trim();
    };
    return <BaseMinifier title="JavaScript Minifier" language="JavaScript" placeholder="function hello() { console.log('world'); }" onMinify={minify} />;
}

export function SqlMinifier() {
    const minify = (input: string) => {
        return input
            .replace(/--.*/g, '') // Remove comments
            .replace(/\s+/g, ' ') // Collapse whitespace
            .trim();
    };
    return <BaseMinifier title="SQL Minifier" language="SQL" placeholder="SELECT * FROM table WHERE id = 1;" onMinify={minify} />;
}

export function HtmlMinifier() {
    const minify = (input: string) => {
        return input
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/>\s+</g, '><') // Remove space between tags
            .replace(/\s+/g, ' ') // Collapse whitespace inside tags
            .trim();
    };
    return <BaseMinifier title="HTML Minifier" language="HTML" placeholder="<div>  <p>Hello</p>  </div>" onMinify={minify} />;
}

export function XmlMinifier() {
    const minify = (input: string) => {
        return input
            .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
            .replace(/>\s+</g, '><') // Remove space between tags
            .replace(/\s+/g, ' ')
            .trim();
    };
    return <BaseMinifier title="XML Minifier" language="XML" placeholder="<root>  <item>Value</item> </root>" onMinify={minify} />;
}
