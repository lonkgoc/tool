import { useState } from 'react';
import { Copy, Check, Globe } from 'lucide-react';

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState('');
  const [siteName, setSiteName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [type, setType] = useState('website');
  const [copied, setCopied] = useState(false);

  const generateTags = () => {
    let tags = '';
    if (title) tags += `<meta property="og:title" content="${title}" />\n`;
    if (siteName) tags += `<meta property="og:site_name" content="${siteName}" />\n`;
    if (url) tags += `<meta property="og:url" content="${url}" />\n`;
    if (description) tags += `<meta property="og:description" content="${description}" />\n`;
    if (type) tags += `<meta property="og:type" content="${type}" />\n`;
    if (image) tags += `<meta property="og:image" content="${image}" />`;
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
            <Globe className="w-5 h-5 text-blue-500" />
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page Title (og:title)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Amazing Product - Brand Name" className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Ideally 60-90 characters.</p>

          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site Name (og:site_name)</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g., Brand Name" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Page URL (og:url)</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/page" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description (og:description)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the content..." className="input-field h-24" />
            <p className="text-xs text-slate-500 mt-1">Ideally under 200 characters.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (og:image)</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.jpg" className="input-field" />
            <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x630 pixels.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type (og:type)</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="profile">profile</option>
              <option value="book">book</option>
              <option value="music.song">music.song</option>
              <option value="video.movie">video.movie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview & Output */}
      <div className="space-y-6">
        {/* Visual Preview */}
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden max-w-md mx-auto">
          <div className="bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt="OG Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/1200x630?text=Image+Preview')} />
            ) : (
              <span className="text-gray-400 text-sm">Image Preview (1200x630)</span>
            )}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="uppercase tracking-wide text-xs text-gray-500 font-semibold mb-1">{siteName || 'SITE NAME'}</div>
            <div className="block mt-1 text-lg leading-tight font-bold text-black truncate">{title || 'Page Title'}</div>
            <p className="mt-2 text-gray-500 text-sm line-clamp-2">{description || 'Page description will appear here...'}</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
            <span className="text-sm font-medium text-slate-300">Generated Meta Tags</span>
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
