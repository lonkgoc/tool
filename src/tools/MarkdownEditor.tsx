import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Copy, Trash2, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';

export default function MarkdownEditor() {
    const [markdown, setMarkdown] = useState<string>('# Hello World\n\nStart typing to see the preview...');
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        const parseMarkdown = async () => {
            const parsed = await marked.parse(markdown);
            setHtml(parsed);
        };
        parseMarkdown();
    }, [markdown]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(html);
            alert('HTML copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy code: ', err);
        }
    };

    const handleClear = () => {
        setMarkdown('');
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        saveAs(blob, 'document.md');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
            <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Markdown Input</h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleClear}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                            title="Clear"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                            title="Download MD"
                        >
                            <FileDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <textarea
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="flex-1 w-full p-4 bg-transparent outline-none resize-none font-mono text-sm"
                    placeholder="Type markdown here..."
                />
            </div>

            <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">Preview</h3>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors text-slate-500"
                        title="Copy HTML"
                    >
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
                <div
                    className="flex-1 w-full p-4 overflow-auto prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </div>
    );
}
