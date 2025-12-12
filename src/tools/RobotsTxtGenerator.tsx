import { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

export default function RobotsTxtGenerator() {
    const [userAgent, setUserAgent] = useState('*');
    const [allow, setAllow] = useState<string[]>([]);
    const [disallow, setDisallow] = useState<string[]>(['/admin', '/private']);
    const [sitemap, setSitemap] = useState('');
    const [copied, setCopied] = useState(false);

    const [newAllow, setNewAllow] = useState('');
    const [newDisallow, setNewDisallow] = useState('');

    const generateOutput = () => {
        let output = `User-agent: ${userAgent}\n`;

        allow.forEach(path => {
            output += `Allow: ${path}\n`;
        });

        disallow.forEach(path => {
            output += `Disallow: ${path}\n`;
        });

        if (sitemap) {
            output += `\nSitemap: ${sitemap}`;
        }

        return output;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateOutput());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const addPath = (type: 'allow' | 'disallow') => {
        if (type === 'allow' && newAllow) {
            setAllow([...allow, newAllow]);
            setNewAllow('');
        } else if (type === 'disallow' && newDisallow) {
            setDisallow([...disallow, newDisallow]);
            setNewDisallow('');
        }
    };

    const removePath = (type: 'allow' | 'disallow', index: number) => {
        if (type === 'allow') {
            setAllow(allow.filter((_, i) => i !== index));
        } else {
            setDisallow(disallow.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-purple-500" />
                        Configuration
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">User Agent</label>
                        <input type="text" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className="input-field" placeholder="*" />
                        <p className="text-xs text-slate-500 mt-1">Use * for all bots, or specify (e.g., Googlebot)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Disallow Paths (Block)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newDisallow}
                                onChange={(e) => setNewDisallow(e.target.value)}
                                className="input-field flex-1"
                                placeholder="/path-to-block"
                                onKeyDown={(e) => e.key === 'Enter' && addPath('disallow')}
                            />
                            <button onClick={() => addPath('disallow')} className="btn-secondary">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {disallow.map((path, i) => (
                                <div key={i} className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-1 rounded text-sm flex items-center gap-2">
                                    <span>{path}</span>
                                    <button onClick={() => removePath('disallow', i)} className="hover:text-red-900 dark:hover:text-red-100">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Allow Paths (Unblock specific)</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newAllow}
                                onChange={(e) => setNewAllow(e.target.value)}
                                className="input-field flex-1"
                                placeholder="/path-to-allow"
                                onKeyDown={(e) => e.key === 'Enter' && addPath('allow')}
                            />
                            <button onClick={() => addPath('allow')} className="btn-secondary">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {allow.map((path, i) => (
                                <div key={i} className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded text-sm flex items-center gap-2">
                                    <span>{path}</span>
                                    <button onClick={() => removePath('allow', i)} className="hover:text-green-900 dark:hover:text-green-100">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sitemap URL</label>
                        <input type="url" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className="input-field" placeholder="https://example.com/sitemap.xml" />
                    </div>
                </div>
            </div>

            {/* Output */}
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
                        <span className="text-sm font-medium text-slate-300">robots.txt</span>
                        <button
                            onClick={handleCopy}
                            className="text-xs flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="p-4 font-mono text-sm text-blue-300 overflow-x-auto whitespace-pre flex-1">
                        {generateOutput()}
                    </div>
                </div>
            </div>
        </div>
    );
}
