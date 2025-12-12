import { useState } from 'react';

export default function AnxietyTest() {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    'I feel nervous or anxious',
    'I feel afraid something bad will happen',
    'I have panic or frightening thoughts',
    'I feel tense or on edge',
    'I have difficulty relaxing',
    'I feel restless or agitated',
    'I worry excessively about everyday matters',
    'I have physical symptoms like racing heart or shortness of breath',
  ];

  const handleResponse = (idx: number, score: number) => {
    setResponses({ ...responses, [idx]: score });
  };

  const score = Object.values(responses).reduce((a, b) => a + b, 0);
  const getLevel = () => {
    if (score < 6) return { text: 'Minimal Anxiety', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900' };
    if (score < 11) return { text: 'Mild Anxiety', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900' };
    if (score < 16) return { text: 'Moderate Anxiety', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900' };
    return { text: 'Severe Anxiety', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900' };
  };

  const level = getLevel();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Anxiety Assessment</h2>
      
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3">{idx + 1}. {q}</div>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map(val => (
                <button
                  key={val}
                  onClick={() => handleResponse(idx, val)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    responses[idx] === val
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {['Not at all', 'Several days', 'More than half', 'Nearly every day'][val]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(responses).length === questions.length && (
        <button 
          onClick={() => setShowResult(true)}
          className="btn-primary w-full"
        >
          Get Results
        </button>
      )}

      {showResult && (
        <div className={`${level.bg} border border-slate-200 dark:border-slate-700 p-4 rounded-lg`}>
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Anxiety Level</div>
          <div className={`text-2xl font-bold ${level.color} mb-2`}>{level.text}</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            Score: {score}/24
          </div>
          <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            Consider speaking with a healthcare provider if anxiety affects your daily life.
          </div>
        </div>
      )}
    </div>
  );
}
