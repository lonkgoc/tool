import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat'
];

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLorem = () => {
    const result: string[] = [];
    for (let p = 0; p < paragraphs; p++) {
      const words: string[] = [];
      for (let w = 0; w < wordsPerParagraph; w++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      // Capitalize first letter
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      result.push(words.join(' ') + '.');
    }
    setOutput(result.join('\n\n'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Number of Paragraphs: {paragraphs}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={paragraphs}
            onChange={(e) => setParagraphs(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Words per Paragraph: {wordsPerParagraph}
          </label>
          <input
            type="range"
            min="10"
            max="200"
            value={wordsPerParagraph}
            onChange={(e) => setWordsPerParagraph(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <button onClick={generateLorem} className="btn-primary w-full">
        Generate Lorem Ipsum
      </button>

      {output && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Generated Text
            </label>
            <button
              onClick={copyToClipboard}
              className="btn-secondary flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              <span>Copy</span>
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 input-field"
          />
        </div>
      )}
    </div>
  );
}

