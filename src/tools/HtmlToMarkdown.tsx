import { useState } from 'react';
import { Code, ArrowRight, Copy, Check, Download, Upload } from 'lucide-react';

export default function HtmlToMarkdown() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const htmlToMarkdown = (html: string): string => {
        let md = html;

        // Headers
        md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
        md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
        md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
        md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
        md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
        md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

        // Bold and italic
        md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
        md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
        md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
        md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

        // Links and images
        md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
        md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
        md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

        // Lists
        md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        md = md.replace(/<\/?ul[^>]*>/gi, '\n');
        md = md.replace(/<\/?ol[^>]*>/gi, '\n');

        // Paragraphs and breaks
        md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
        md = md.replace(/<br[^>]*\/?>/gi, '\n');

        // Code
        md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
        md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, '```\n$1\n```\n');

        // Blockquote
        md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
            return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n\n';
        });

        // Horizontal rule
        md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

        // Remove remaining tags
        md = md.replace(/<[^>]+>/g, '');

        // Decode HTML entities
        md = md.replace(/&nbsp;/g, ' ');
        md = md.replace(/&amp;/g, '&');
        md = md.replace(/&lt;/g, '<');
        md = md.replace(/&gt;/g, '>');
        md = md.replace(/&quot;/g, '"');

        // Clean up extra whitespace
        md = md.replace(/\n{3,}/g, '\n\n');

        return md.trim();
    };

    const handleConvert = () => {
        if (!input.trim()) return;
        setOutput(htmlToMarkdown(input));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                setInput(text);
                setOutput(htmlToMarkdown(text));
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
        const blob = new Blob([output], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Code className="w-6 h-6 text-purple-500" />
                    HTML to Markdown
                </h2>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">HTML Input</label>
                        <label className="text-sm text-blue-500 cursor-pointer flex items-center gap-1">
                            <Upload className="w-4 h-4" /> Upload File
                            <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="input-field h-40 font-mono text-sm"
                        placeholder="<h1>Heading</h1>&#10;<p><strong>Bold</strong> and <em>italic</em> text.</p>"
                    />
                </div>

                <button onClick={handleConvert} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
                    <ArrowRight className="w-5 h-5" /> Convert to Markdown
                </button>

                {output && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="font-medium">Markdown Output</label>
                            <div className="flex gap-2">
                                <button onClick={handleDownload} className="btn-secondary p-2"><Download className="w-4 h-4" /></button>
                                <button onClick={handleCopy} className="btn-secondary p-2">
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <textarea value={output} readOnly className="input-field h-40 font-mono text-sm" />
                    </div>
                )}
            </div>
        </div>
    );
}
