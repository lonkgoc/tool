import { useState } from 'react';
import { Shuffle, RotateCcw } from 'lucide-react';

const questions = [
  { a: "Have the ability to fly", b: "Have the ability to become invisible" },
  { a: "Live without internet", b: "Live without air conditioning" },
  { a: "Always be 10 minutes late", b: "Always be 20 minutes early" },
  { a: "Have unlimited money", b: "Have unlimited time" },
  { a: "Be able to read minds", b: "Be able to see the future" },
  { a: "Have a photographic memory", b: "Have the ability to forget anything" },
  { a: "Be famous but hated", b: "Be unknown but loved" },
  { a: "Have super strength", b: "Have super speed" },
  { a: "Live in the past", b: "Live in the future" },
  { a: "Have perfect teeth", b: "Have perfect hair" }
];

export default function WouldYouRather() {
  const [question, setQuestion] = useState(questions[0]);
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  const newQuestion = () => {
    setQuestion(questions[Math.floor(Math.random() * questions.length)]);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Would You Rather?</h2>

        <div className="space-y-4 mb-6">
          <button
            onClick={() => setSelected('a')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              selected === 'a'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {question.a}
            </div>
          </button>

          <div className="text-2xl font-bold text-slate-400">OR</div>

          <button
            onClick={() => setSelected('b')}
            className={`w-full p-6 rounded-xl border-2 transition-all ${
              selected === 'b'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
            }`}
          >
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {question.b}
            </div>
          </button>
        </div>

        {selected && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-green-800 dark:text-green-200 font-semibold">
              You chose: {selected === 'a' ? question.a : question.b}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={newQuestion} className="btn-primary flex-1 flex items-center justify-center space-x-2">
            <Shuffle className="w-5 h-5" />
            <span>New Question</span>
          </button>
          <button onClick={() => setSelected(null)} className="btn-secondary flex items-center space-x-2">
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}


