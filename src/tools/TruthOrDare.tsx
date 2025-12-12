import { useState } from 'react';
import {Shuffle, RotateCcw} from 'lucide-react';

const truths = [
  "What's the most embarrassing thing that's ever happened to you?",
  "What's your biggest fear?",
  "Who was your first crush?",
  "What's the worst lie you've ever told?",
  "What's something you're afraid to tell your parents?",
  "What's the most trouble you've ever gotten into?",
  "What's your biggest regret?",
  "What's something you've never told your best friend?",
  "What's the meanest thing you've ever said to someone?",
  "What's your most embarrassing childhood memory?"
];

const dares = [
  "Do your best impression of someone in the room.",
  "Sing a song chosen by the group.",
  "Dance with no music for one minute.",
  "Let the group go through your phone for one minute.",
  "Eat a spoonful of a condiment.",
  "Call your crush and put them on speakerphone.",
  "Do 20 push-ups.",
  "Let someone else post a status on your social media.",
  "Wear your clothes inside out for the rest of the game.",
  "Do your best celebrity impression."
];

export default function TruthOrDare() {
  const [mode, setMode] = useState<'truth' | 'dare' | null>(null);
  const [question, setQuestion] = useState('');

  const pickTruth = () => {
    setMode('truth');
    setQuestion(truths[Math.floor(Math.random() * truths.length)]);
  };

  const pickDare = () => {
    setMode('dare');
    setQuestion(dares[Math.floor(Math.random() * dares.length)]);
  };

  const reset = () => {
    setMode(null);
    setQuestion('');
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Truth or Dare</h2>

        {!mode && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={pickTruth}
              className="btn-primary h-32 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">💭</div>
              <div className="text-lg font-semibold">Truth</div>
            </button>
            <button
              onClick={pickDare}
              className="btn-secondary h-32 flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl">⚡</div>
              <div className="text-lg font-semibold">Dare</div>
            </button>
          </div>
        )}

        {question && (
          <div className="space-y-4">
            <div className={`p-8 rounded-xl ${
              mode === 'truth' 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' 
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500'
            }`}>
              <div className="text-4xl mb-4">{mode === 'truth' ? '💭' : '⚡'}</div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {mode === 'truth' ? 'Truth' : 'Dare'}
              </div>
              <div className="text-lg text-slate-700 dark:text-slate-300">{question}</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={mode === 'truth' ? pickTruth : pickDare}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>New {mode === 'truth' ? 'Truth' : 'Dare'}</span>
              </button>
              <button onClick={reset} className="btn-secondary flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


