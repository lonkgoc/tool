import { useState } from 'react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState('g');

  let matches: RegExpMatchArray[] = [];
  let error = '';

  try {
    if (pattern) {
      const regex = new RegExp(pattern, flags);
      const allMatches = [...testString.matchAll(regex)];
      matches = allMatches;
    }
  } catch (e) {
    error = (e as Error).message;
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Regular Expression
        </label>
        <input
          type="text"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="/pattern/flags"
          className="input-field font-mono"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Flags
        </label>
        <div className="flex flex-wrap gap-3">
          {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
            <label key={flag} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={flags.includes(flag)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFlags(flags + flag);
                  } else {
                    setFlags(flags.replace(flag, ''));
                  }
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">{flag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex..."
          className="w-full h-32 input-field font-mono text-sm"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      )}

      {pattern && !error && (
        <div className="card">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Matches: {matches.length}
          </div>
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg font-mono text-sm"
                >
                  Match {index + 1}: "{match[0]}" at position {match.index}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 dark:text-slate-400">No matches found</p>
          )}
        </div>
      )}
    </div>
  );
}

