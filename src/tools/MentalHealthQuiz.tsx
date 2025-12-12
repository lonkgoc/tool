import { useState } from 'react';

export default function MentalHealthQuiz() {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);

  const questions = [
    'I feel overwhelmed or anxious most days',
    'I have difficulty sleeping or sleeping too much',
    'I feel hopeless or empty',
    'I have lost interest in activities I enjoy',
    'I feel tired or lack energy',
    'I have difficulty concentrating',
    'I feel irritable or angry',
    'I am satisfied with my current mental health',
  ];

  const handleResponse = (idx: number, score: number) => {
    setResponses({ ...responses, [idx]: score });
  };

  const score = Object.values(responses).reduce((a, b) => a + b, 0);
  const getAssessment = () => {
    if (score < 8) return { text: 'Good mental health', color: 'text-green-600' };
    if (score < 16) return { text: 'Mild concerns', color: 'text-yellow-600' };
    if (score < 24) return { text: 'Moderate concerns', color: 'text-orange-600' };
    return { text: 'Significant concerns', color: 'text-red-600' };
  };

  const assessment = getAssessment();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mental Health Assessment</h2>
      
        <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="text-sm font-medium mb-3">{idx + 1}. {q}</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rVal => (
                <button
                  key={rVal}
                  onClick={() => handleResponse(idx, rVal)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    responses[idx] === rVal
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {rVal}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {responses[idx] === 1 && 'Strongly Disagree'} {responses[idx] === 3 && 'Neutral'} {responses[idx] === 5 && 'Strongly Agree'}
            </div>
          </div>
        ))}
      </div>

      {Object.keys(responses).length === questions.length && (
        <button 
          onClick={() => setShowResult(true)}
          className="btn-primary w-full"
        >
          Get Assessment
        </button>
      )}

      {showResult && (
        <div className={`bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg`}>
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">Assessment Score</div>
          <div className={`text-2xl font-bold ${assessment.color} mb-2`}>{assessment.text}</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">
            Score: {score}/40
          </div>
          <div className="mt-3 text-sm text-slate-700 dark:text-slate-300">
            If you're struggling, please reach out to a mental health professional or contact a support hotline.
          </div>
        </div>
      )}
    </div>
  );
}
