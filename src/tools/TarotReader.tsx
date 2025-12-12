import { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

const cards = [
  { name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity' },
  { name: 'The Magician', meaning: 'Manifestation, resourcefulness, power' },
  { name: 'The High Priestess', meaning: 'Intuition, sacred knowledge, divine feminine' },
  { name: 'The Empress', meaning: 'Femininity, beauty, nature, nurturing' },
  { name: 'The Emperor', meaning: 'Authority, establishment, structure' },
  { name: 'The Lovers', meaning: 'Love, harmony, relationships, values alignment' },
  { name: 'The Chariot', meaning: 'Control, willpower, success, action' },
  { name: 'Strength', meaning: 'Strength, courage, persuasion, influence' },
  { name: 'The Hermit', meaning: 'Soul searching, introspection, guidance' },
  { name: 'Wheel of Fortune', meaning: 'Good luck, karma, life cycles, destiny' }
];

export default function TarotReader() {
  const [question, setQuestion] = useState('');
  const [card, setCard] = useState<typeof cards[0] | null>(null);
  const [revealed, setRevealed] = useState(false);

  const drawCard = () => {
    if (!question.trim()) {
      alert('Please ask a question first!');
      return;
    }
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    setCard(randomCard);
    setRevealed(false);
    setTimeout(() => setRevealed(true), 1000);
  };

  const reset = () => {
    setQuestion('');
    setCard(null);
    setRevealed(false);
  };

  return (
    <div className="space-y-6">
      <div className="card text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Tarot Reader</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Ask your question
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you want to know?"
            className="w-full input-field h-24"
          />
        </div>

        <button
          onClick={drawCard}
          className="btn-primary w-full flex items-center justify-center space-x-2 mb-6"
        >
          <Sparkles className="w-5 h-5" />
          <span>Draw a Card</span>
        </button>

        {card && (
          <div className="space-y-4">
            <div className={`bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-8 text-white transition-all ${
              revealed ? 'opacity-100' : 'opacity-50'
            }`}>
              <div className="text-4xl mb-4">🃏</div>
              <div className="text-2xl font-bold mb-2">{card.name}</div>
              {revealed && (
                <div className="text-purple-100">{card.meaning}</div>
              )}
            </div>

            {revealed && (
              <button onClick={reset} className="btn-secondary w-full flex items-center justify-center space-x-2">
                <RotateCcw className="w-5 h-5" />
                <span>Ask Another Question</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


