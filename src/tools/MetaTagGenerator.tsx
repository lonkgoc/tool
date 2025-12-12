import { useState } from 'react';
import { Copy, Check, Search } from 'lucide-react';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0');
  const [charset, setCharset] = useState('UTF-8');
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    let tags = '';
    tags += `<!-- Standard SEO -->\n`;
    if (title) tags += `<title>${title}</title>\n`;
    if (description) tags += `<meta name="description" content="${description}" />\n`;
    if (keywords) tags += `<meta name="keywords" content="${keywords}" />\n`;
    if (author) tags += `<meta name="author" content="${author}" />\n`;

    tags += `\n<!-- Technical -->\n`;
    if (viewport) tags += `<meta name="viewport" content="${viewport}" />\n`;
    if (charset) tags += `<meta charset="${charset}" />`;

    return tags;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-green-500" />
            SEO Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Best Tools for 2024" className="input-field" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-slate-500">Important for search engines.</p>
              <p className={`text-xs ${title.length > 60 ? 'text-red-500' : 'text-slate-500'}`}>{title.length}/60 chars</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meta Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of the page content..." className="input-field h-24" />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-slate-500">Appears in search results.</p>
              <p className={`text-xs ${description.length > 160 ? 'text-red-500' : 'text-slate-500'}`}>{description.length}/160 chars</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keywords (comma separated)</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="tools, seo, generator" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author Name" className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Viewport</label>
              <input type="text" value={viewport} onChange={(e) => setViewport(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Charset</label>
              <select value={charset} onChange={(e) => setCharset(e.target.value)} className="input-field">
                <option value="UTF-8">UTF-8</option>
                <option value="ISO-8859-1">ISO-8859-1</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Output */}
      <div className="space-y-6">
        {/* SERP Preview */}
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Google Search Preview</h4>
          <div className="max-w-[600px]">
            <div className="text-sm text-[#202124] flex items-center mb-1">
              <div className="w-7 h-7 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex flex-col">
                <span className="text-[#202124]">example.com</span>
                <span className="text-[#202124] text-xs">https://example.com › ...</span>
              </div>
            </div>
            <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate leading-snug mb-1">
              {title || 'Page Title Result'}
            </h3>
            <p className="text-sm text-[#4d5156] line-clamp-2">
              {description || 'This is how your meta description will look in Google search results. Keep it relevant and enticing to improve click-through rates.'}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-sm font-medium text-slate-300">Generated Code</span>
            <button
              onClick={handleCopy}
              className="text-xs flex items-center gap-1.5 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-4 font-mono text-sm text-blue-300 overflow-x-auto whitespace-pre">
            {generateTags() || '<!-- Enter details to generate tags -->'}
          </div>
        </div>
      </div>
    </div>
  );
}
