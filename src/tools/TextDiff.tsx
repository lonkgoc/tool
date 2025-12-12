import { useState } from 'react';

export default function TextDiff() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const computeDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    const diff: Array<{ line: string; type: 'same' | 'added' | 'removed' }> = [];

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';

      if (line1 === line2) {
        diff.push({ line: line1, type: 'same' });
      } else {
        if (line1) {
          diff.push({ line: line1, type: 'removed' });
        }
        if (line2) {
          diff.push({ line: line2, type: 'added' });
        }
      }
    }

    return diff;
  };

  const diff = computeDiff();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Text 1
          </label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Enter first text..."
            className="w-full h-64 input-field font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Text 2
          </label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Enter second text..."
            className="w-full h-64 input-field font-mono text-sm"
          />
        </div>
      </div>

      {diff.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Difference</h3>
          <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-sm">
            {diff.map((item, index) => (
              <div
                key={index}
                className={`p-2 rounded ${
                  item.type === 'same'
                    ? 'bg-slate-50 dark:bg-slate-800/50'
                    : item.type === 'removed'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                }`}
              >
                <span className="mr-2">
                  {item.type === 'removed' ? '-' : item.type === 'added' ? '+' : ' '}
                </span>
                {item.line || '(empty line)'}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

