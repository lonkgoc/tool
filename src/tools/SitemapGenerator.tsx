import { useState } from 'react';
import { Copy, Check, Network, Plus, Trash2 } from 'lucide-react';

interface SitemapUrl {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: string;
}

export default function SitemapGenerator() {
    const [urls, setUrls] = useState<SitemapUrl[]>([
        { loc: 'https://example.com/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' }
    ]);
    const [copied, setCopied] = useState(false);

    // New entry state
    const [newLoc, setNewLoc] = useState('');
    const [newFreq, setNewFreq] = useState('monthly');
    const [newPriority, setNewPriority] = useState('0.8');

    const addUrl = () => {
        if (!newLoc) return;
        setUrls([...urls, {
            loc: newLoc,
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: newFreq as any,
            priority: newPriority
        }]);
        setNewLoc('');
    };

    const removeUrl = (index: number) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const generateXml = () => {
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        urls.forEach(u => {
            xml += `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`;
        });

        xml += `
</urlset>`;
        return xml.trim();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateXml());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Network className="w-5 h-5 text-indigo-500" />
                        Sitemap URLs
                    </h3>

                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30">
                        <h4 className="text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Add New URL</h4>
                        <div className="space-y-3">
                            <input
                                type="url"
                                value={newLoc}
                                onChange={(e) => setNewLoc(e.target.value)}
                                className="input-field w-full"
                                placeholder="https://example.com/page"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={newFreq}
                                    onChange={(e) => setNewFreq(e.target.value)}
                                    className="input-field flex-1"
                                >
                                    {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                                <select
                                    value={newPriority}
                                    onChange={(e) => setNewPriority(e.target.value)}
                                    className="input-field w-24"
                                >
                                    {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                                <button onClick={addUrl} className="btn-primary flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
                        {urls.map((url, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg flex justify-between items-start group">
                                <div className="overflow-hidden">
                                    <div className="font-mono text-sm truncate text-blue-600 dark:text-blue-400 font-medium" title={url.loc}>{url.loc}</div>
                                    <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                        <span>{url.lastmod}</span>
                                        <span>{url.changefreq}</span>
                                        <span>{url.priority}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeUrl(i)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {urls.length === 0 && (
                            <p className="text-center text-slate-500 text-sm py-4">No URLs added yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                        <span className="text-sm font-medium text-slate-300">sitemap.xml</span>
                        <button
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4 font-mono text-sm text-blue-300 overflow-x-auto whitespace-pre flex-1">
                        {generateXml()}
                    </div>
                </div>
            </div>
        </div>
    );
}
