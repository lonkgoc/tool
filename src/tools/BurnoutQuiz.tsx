import { useState } from 'react';

export default function BurnoutQuiz() {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    'I feel emotionally drained or exhausted',
    'I feel cynical or detached from my work',
    'I feel like I accomplish less than I should',
    'I feel frustrated or impatient',
    'I work too hard and neglect other areas',
    'I feel pressure to succeed',
    'I feel resentment toward my work',
    'I lack enthusiasm for projects',
  ];

  const handleResponse = (idx: number, score: number) => {
    setResponses({ ...responses, [idx]: score });
  };

  const score = Object.values(responses).reduce((a, b) => a + b, 0);
  const getRisk = () => {
    if (score < 8) return { text: 'Low Burnout Risk', color: 'text-green-600' };
    if (score < 16) return { text: 'Moderate Risk', color: 'text-yellow-600' };
    if (score < 24) return { text: 'High Risk', color: 'text-orange-600' };
    return { text: 'Critical Risk', color: 'text-red-600' };
  };

  const risk = getRisk();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Burnout Risk Assessment</h2>
      
      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3">{idx + 1}. {q}</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(val => (
                <button
                  key={val}
                  onClick={() => handleResponse(idx, val)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    responses[idx] === val
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {val}
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
          Assess Burnout Risk
        </button>
      )}

      {showResult && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Burnout Risk Level</div>
          <div className={`text-2xl font-bold ${risk.color} mb-3`}>{risk.text}</div>
          <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <div>Score: {score}/40</div>
            <div className="mt-2 font-medium">⚡ Recommendations:</div>
            <div>• Take regular breaks and time off</div>
            <div>• Set healthy work-life boundaries</div>
            <div>• Engage in relaxing activities</div>
            <div>• Consider speaking with a counselor</div>
          </div>
        </div>
      )}
    </div>
  );
}
