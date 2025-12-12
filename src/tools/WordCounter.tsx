import { useState, useMemo } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()) : [];
    const sentences = text.match(/[.!?]+/g)?.length || 0;
    const lines = text.split('\n').length;

    return {
      words: words.length,
      characters,
      charactersNoSpaces,
      paragraphs: paragraphs.length,
      sentences,
      lines,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Enter your text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here..."
          className="w-full h-64 input-field"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {stats.words}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Words</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {stats.characters}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Characters</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {stats.charactersNoSpaces}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">No Spaces</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
            {stats.paragraphs}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Paragraphs</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
            {stats.sentences}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Sentences</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {stats.lines}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Lines</div>
        </div>
      </div>
    </div>
  );
}

