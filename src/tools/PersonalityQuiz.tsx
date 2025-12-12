import { useState } from 'react';
import { Brain, RotateCcw } from 'lucide-react';

const questions = [
  { q: "You prefer working", a: ["Alone", "In a team"] },
  { q: "You make decisions based on", a: ["Logic", "Emotions"] },
  { q: "You recharge by", a: ["Being alone", "Being with people"] },
  { q: "You focus on", a: ["Details", "The big picture"] },
  { q: "You prefer", a: ["Planning", "Spontaneity"] }
];

export default function PersonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const introvert = newAnswers.filter(a => a === 0).length;
      const resultType = introvert > questions.length / 2 ? 'Introvert' : 'Extrovert';
      setResult(resultType);
    }
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center justify-center space-x-2">
          <Brain className="w-6 h-6" />
          <span>Personality Quiz</span>
        </h2>

        {!result && (
          <>
            <div className="mb-6">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                {questions[currentQuestion].q}
              </div>
              <div className="space-y-3">
                {questions[currentQuestion].a.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="btn-primary w-full text-left p-4"
                  >
                    {answer}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {result && (
          <div className="space-y-4">
            <div className="text-6xl mb-4">🎭</div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              You are an {result}!
            </div>
            <div className="text-slate-600 dark:text-slate-400">
              {result === 'Introvert'
                ? "You prefer quiet environments and recharge by spending time alone. You think before you speak and enjoy deep conversations."
                : "You're energized by social interactions and enjoy being around people. You think out loud and enjoy group activities."}
            </div>
            <button onClick={reset} className="btn-primary mt-6 flex items-center justify-center space-x-2 mx-auto">
              <RotateCcw className="w-5 h-5" />
              <span>Take Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


