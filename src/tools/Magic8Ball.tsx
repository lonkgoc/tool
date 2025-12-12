import { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

const responses = [
  'It is certain',
  'It is decidedly so',
  'Without a doubt',
  'Yes definitely',
  'You may rely on it',
  'As I see it, yes',
  'Most likely',
  'Outlook good',
  'Yes',
  'Signs point to yes',
  'Reply hazy, try again',
  'Ask again later',
  'Better not tell you now',
  'Cannot predict now',
  'Concentrate and ask again',
  "Don't count on it",
  'My reply is no',
  'My sources say no',
  'Outlook not so good',
  'Very doubtful',
];

export default function Magic8Ball() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const askQuestion = () => {
    if (!question.trim()) {
      alert('Please ask a question first!');
      return;
    }

    setIsShaking(true);
    setTimeout(() => {
      const randomAnswer = responses[Math.floor(Math.random() * responses.length)];
      setAnswer(randomAnswer);
      setIsShaking(false);
    }, 1000);
  };

  const reset = () => {
    setQuestion('');
    setAnswer(null);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <div className="mb-6">
          <div
            className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br from-blue-900 to-black flex items-center justify-center relative transition-transform ${
              isShaking ? 'animate-bounce' : ''
            }`}
          >
            {answer ? (
              <div className="text-center px-8">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-6xl">8</span>
                </div>
                <p className="text-white text-lg font-semibold">{answer}</p>
              </div>
            ) : (
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <span className="text-6xl">8</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Ask your question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
              placeholder="Will I have a good day?"
              className="w-full input-field"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={askQuestion} className="btn-primary flex-1 flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Ask the Magic 8-Ball</span>
            </button>
            {answer && (
              <button onClick={reset} className="btn-secondary flex items-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


