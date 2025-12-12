import { useState } from 'react';
import { Copy, Check, Download, AlertCircle } from 'lucide-react';

export default function XmlFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [minified, setMinified] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  // More robust XML formatter
  const formatXml = (xml: string, indent: number = 2): string => {
    try {
      // Validate XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }

      // Remove unnecessary whitespace
      let formatted = xml.replace(/>\s+</g, '><');
      
      // Parse and format with proper indentation
      const indent_str = ' '.repeat(indent);
      let depth = 0;
      let result = '';
      let inTag = false;
      let tagStart = 0;

      for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i];
        const nextChar = formatted[i + 1];
        const prevChar = formatted[i - 1];

        if (char === '<') {
          inTag = true;
          tagStart = i;
          
          // Check if this is a closing tag
          if (nextChar === '/' || (formatted.substring(i, i + 2) === '<?')) {
            // Don't change depth for closing tags yet
          } else if (formatted.substring(i, i + 9) === '<!CDATA[') {
            // Handle CDATA
          } else if (nextChar !== '!' && nextChar !== '?') {
            // Opening tag - we'll increase depth after closing >
          }
        } else if (char === '>') {
          inTag = false;
          const tag = formatted.substring(tagStart, i + 1);
          
          // Add current tag
          if (tag.startsWith('</')) {
            // Closing tag - decrease depth first
            depth = Math.max(0, depth - 1);
            result += indent_str.repeat(depth) + tag + '\n';
          } else if (tag.endsWith('/>') || tag.startsWith('<?') || tag.startsWith('<!')) {
            // Self-closing or special tags
            result += indent_str.repeat(depth) + tag + '\n';
          } else if (tag.startsWith('<![CDATA[') && tag.endsWith(']]>')) {
            result += indent_str.repeat(depth) + tag + '\n';
          } else {
            // Opening tag
            result += indent_str.repeat(depth) + tag + '\n';
            depth++;
          }
        }
      }

      return result.trim() + '\n';
    } catch (err) {
      throw new Error('Invalid XML format');
    }
  };

  // Simpler alternative formatter using regex
  const formatXmlSimple = (xml: string, indentSize: number): string => {
    try {
      // Validate
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'application/xml');
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Invalid XML');
      }

      const indent = ' '.repeat(indentSize);
      let formatted = '';
      let depth = 0;
      
      // Split by tags
      const lines = xml
        .replace(/></g, '>\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      for (const line of lines) {
        if (line.startsWith('</')) {
          // Closing tag
          depth = Math.max(0, depth - 1);
          formatted += indent.repeat(depth) + line + '\n';
        } else if (line.endsWith('/>') || line.startsWith('<?') || line.startsWith('<!')) {
          // Self-closing or declaration/doctype
          formatted += indent.repeat(depth) + line + '\n';
        } else if (line.startsWith('<')) {
          // Opening tag
          formatted += indent.repeat(depth) + line + '\n';
          if (!line.startsWith('<?') && !line.startsWith('<!')) {
            depth++;
          }
        } else {
          // Text content
          formatted += indent.repeat(depth) + line + '\n';
        }
      }

      return formatted;
    } catch (err) {
      throw new Error('Invalid XML format');
    }
  };

  const handleFormat = () => {
    setError('');
    if (!input.trim()) {
      setError('Please enter XML to format');
      setFormatted('');
      setMinified('');
      return;
    }

    try {
      const formattedXml = formatXmlSimple(input, indentSize);
      setFormatted(formattedXml);
      
      // Also create minified version
      const minified = formattedXml.replace(/\n\s*/g, '').trim();
      setMinified(minified);
    } catch (err: any) {
      setError(err.message || 'Invalid XML format');
      setFormatted('');
      setMinified('');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            XML Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your XML here..."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white font-mono text-sm h-48"
          />
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Indent Size
            </label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
              <option value={1}>1 space</option>
            </select>
          </div>
          <button
            onClick={handleFormat}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Format
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>

      {formatted && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Formatted XML</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(formatted, 'formatted')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {copied === 'formatted' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'formatted' ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => download(formatted, 'formatted.xml')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          <textarea
            value={formatted}
            readOnly
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white font-mono text-sm h-96"
          />
        </div>
      )}

      {minified && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Minified XML</h3>
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(minified, 'minified')}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                {copied === 'minified' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'minified' ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={() => download(minified, 'minified.xml')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          <textarea
            value={minified}
            readOnly
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 dark:text-white font-mono text-sm h-32"
          />
        </div>
      )}
    </div>
  );
}
