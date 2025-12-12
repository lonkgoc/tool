import { useState } from 'react';
import { FileText, ArrowRight, Copy, Check, Download, Upload, Eye } from 'lucide-react';
import { marked } from 'marked';

export default function MarkdownToHtml() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        if (!input.trim()) return;
        const html = marked(input) as string;
        setOutput(html);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setInput(text);
                setOutput(marked(text) as string);
            };
            reader.readAsText(file);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([output], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-orange-500" />
                    Markdown to HTML
                </h2>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">Markdown Input</label>
                        <label className="text-sm text-blue-500 cursor-pointer flex items-center gap-1">
                            <Upload className="w-4 h-4" /> Upload File
                            <input type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="input-field h-40 font-mono text-sm"
                        placeholder="# Heading&#10;&#10;**Bold** and *italic* text.&#10;&#10;- List item 1&#10;- List item 2"
                    />
                </div>

                <button onClick={handleConvert} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
                    <ArrowRight className="w-5 h-5" /> Convert to HTML
                </button>

                {output && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-medium">HTML Output</label>
                            <div className="flex gap-2">
                                <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary p-2">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={handleDownload} className="btn-secondary p-2"><Download className="w-4 h-4" /></button>
                                <button onClick={handleCopy} className="btn-secondary p-2">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {showPreview ? (
                            <div
                                className="p-4 bg-white dark:bg-slate-900 border rounded-xl prose dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: output }}
                            />
                        ) : (
                            <textarea value={output} readOnly className="input-field h-40 font-mono text-sm" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
