import { useState } from 'react';
import { FileText, ArrowRightLeft, Download, Copy, Check, AlertCircle, Eye } from 'lucide-react';
import { marked } from 'marked';

type ConversionType = 'md-html' | 'html-md' | 'md-txt' | 'html-txt';

export default function MarkdownConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [conversionType, setConversionType] = useState<ConversionType>('md-html');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const conversions = [
        { id: 'md-html', label: 'Markdown → HTML', from: 'Markdown', to: 'HTML' },
        { id: 'html-md', label: 'HTML → Markdown', from: 'HTML', to: 'Markdown' },
        { id: 'md-txt', label: 'Markdown → Plain Text', from: 'Markdown', to: 'Text' },
        { id: 'html-txt', label: 'HTML → Plain Text', from: 'HTML', to: 'Text' },
    ] as const;

    // Markdown to HTML (using marked library if available, else basic conversion)
    const markdownToHtml = (md: string): string => {
        try {
            if (typeof marked === 'function') {
                return marked(md) as string;
            }
        } catch { }

        // Basic markdown to HTML conversion
        let html = md;

        // Headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Bold and italic
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/\_\_(.+?)\_\_/g, '<strong>$1</strong>');
        html = html.replace(/\_(.+?)\_/g, '<em>$1</em>');

        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');

        // Links and images
        html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />');
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

        // Lists
        html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
        html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
        html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

        // Blockquotes
        html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

        // Horizontal rules
        html = html.replace(/^---$/gm, '<hr />');

        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<p>' + html + '</p>';
        html = html.replace(/<p><\/p>/g, '');

        return html;
    };

    // HTML to Markdown
    const htmlToMarkdown = (html: string): string => {
        let md = html;

        // Remove doctype and html/body tags
        md = md.replace(/<!DOCTYPE[^>]*>/gi, '');
        md = md.replace(/<\/?html[^>]*>/gi, '');
        md = md.replace(/<\/?head[^>]*>[\s\S]*?<\/head>/gi, '');
        md = md.replace(/<\/?body[^>]*>/gi, '');

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
        md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');

        // Code
        md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
        md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

        // Lists
        md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
        md = md.replace(/<\/?ul[^>]*>/gi, '\n');
        md = md.replace(/<\/?ol[^>]*>/gi, '\n');

        // Blockquotes
        md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');

        // Horizontal rules
        md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

        // Paragraphs and line breaks
        md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
        md = md.replace(/<br[^>]*\/?>/gi, '\n');
        md = md.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

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

    // Markdown to Plain Text
    const markdownToText = (md: string): string => {
        let text = md;

        // Remove headers markers
        text = text.replace(/^#{1,6}\s*/gm, '');

        // Remove emphasis markers
        text = text.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
        text = text.replace(/\*\*(.+?)\*\*/g, '$1');
        text = text.replace(/\*(.+?)\*/g, '$1');
        text = text.replace(/\_\_(.+?)\_\_/g, '$1');
        text = text.replace(/\_(.+?)\_/g, '$1');

        // Remove code blocks, keep content
        text = text.replace(/```[\w]*\n([\s\S]*?)```/g, '$1');
        text = text.replace(/`(.+?)`/g, '$1');

        // Convert links to text
        text = text.replace(/!\[(.+?)\]\(.+?\)/g, '[$1]');
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)');

        // Remove list markers
        text = text.replace(/^[\*\-]\s*/gm, '• ');
        text = text.replace(/^\d+\.\s*/gm, '');

        // Remove blockquote markers
        text = text.replace(/^>\s*/gm, '');

        // Remove horizontal rules
        text = text.replace(/^---$/gm, '');

        return text.trim();
    };

    // HTML to Plain Text
    const htmlToText = (html: string): string => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || '';
    };

    const handleConvert = () => {
        setError('');
        setOutput('');

        if (!input.trim()) {
            setError('Please enter input');
            return;
        }

        try {
            let result = '';
            switch (conversionType) {
                case 'md-html': result = markdownToHtml(input); break;
                case 'html-md': result = htmlToMarkdown(input); break;
                case 'md-txt': result = markdownToText(input); break;
                case 'html-txt': result = htmlToText(input); break;
            }
            setOutput(result);
        } catch (err: any) {
            setError(`Conversion error: ${err.message}`);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const extMap: Record<string, string> = {
            'md-html': 'html', 'html-md': 'md', 'md-txt': 'txt', 'html-txt': 'txt'
        };
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${extMap[conversionType]}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInput(event.target?.result as string);
            };
            reader.readAsText(file);
        }
    };

    const currentConversion = conversions.find(c => c.id === conversionType)!;

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-500" />
                    Markdown / HTML Converter
                </h2>

                {/* Conversion Type */}
                <div className="mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {conversions.map(c => (
                            <button
                                key={c.id}
                                onClick={() => { setConversionType(c.id as ConversionType); setOutput(''); setError(''); }}
                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${conversionType === c.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                                    }`}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <input
                        type="file"
                        accept=".md,.html,.htm,.txt"
                        onChange={handleFileUpload}
                        className="input-field"
                    />
                </div>

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Input ({currentConversion.from})
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="input-field font-mono text-sm h-48"
                        placeholder={`Paste your ${currentConversion.from} here...`}
                    />
                </div>

                {/* Convert Button */}
                <button onClick={handleConvert} className="btn-primary w-full mb-4 flex items-center justify-center gap-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    Convert to {currentConversion.to}
                </button>

                {/* Error */}
                {error && (
                    <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* Output */}
                {output && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Output ({currentConversion.to})
                            </label>
                            <div className="flex gap-2">
                                {conversionType === 'md-html' && (
                                    <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary text-sm flex items-center gap-1">
                                        <Eye className="w-4 h-4" /> {showPreview ? 'Code' : 'Preview'}
                                    </button>
                                )}
                                <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-1">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                                <button onClick={handleDownload} className="btn-secondary text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {showPreview && conversionType === 'md-html' ? (
                            <div
                                className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                                dangerouslySetInnerHTML={{ __html: output }}
                            />
                        ) : (
                            <textarea
                                value={output}
                                readOnly
                                className="input-field font-mono text-sm h-48"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
