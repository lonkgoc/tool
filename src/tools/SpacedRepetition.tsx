import { useState, useEffect } from 'react';
import { Plus, Trash2, RotateCw } from 'lucide-react';

interface FlashCard {
  id: string;
  front: string;
  back: string;
  deck: string;
  interval: number;
  easeFactor: number;
  nextReview: string;
  repetitions: number;
  quality: number;
}

export default function SpacedRepetition() {
  const [cards, setCards] = useState<FlashCard[]>(() => {
    const saved = localStorage.getItem('flashCards');
    return saved ? JSON.parse(saved) : [];
  });
  const [decks, setDecks] = useState<string[]>(() => {
    const saved = localStorage.getItem('flashCardDecks');
    return saved ? JSON.parse(saved) : ['Default'];
  });
  const [selectedDeck, setSelectedDeck] = useState('Default');
  const [newDeckName, setNewDeckName] = useState('');
  const [formData, setFormData] = useState({ front: '', back: '', deck: 'Default' });
  const [reviewMode, setReviewMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem('flashCards', JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem('flashCardDecks', JSON.stringify(decks));
  }, [decks]);

  const addCard = () => {
    if (!formData.front.trim() || !formData.back.trim()) return;

    const card: FlashCard = {
      id: Date.now().toString(),
      front: formData.front,
      back: formData.back,
      deck: formData.deck || selectedDeck,
      interval: 1,
      easeFactor: 2.5,
      nextReview: new Date().toISOString().split('T')[0],
      repetitions: 0,
      quality: 0,
    };

    setCards([...cards, card]);
    setFormData({ front: '', back: '', deck: formData.deck });
  };

  const addDeck = () => {
    if (!newDeckName.trim()) return;
    if (!decks.includes(newDeckName)) {
      setDecks([...decks, newDeckName]);
      setSelectedDeck(newDeckName);
      setNewDeckName('');
    }
  };

  const deleteDeck = (deck: string) => {
    setDecks(decks.filter(d => d !== deck));
    setCards(cards.filter(c => c.deck !== deck));
    if (selectedDeck === deck) {
      setSelectedDeck(decks[0] || 'Default');
    }
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const deckCards = cards.filter(c => c.deck === selectedDeck);
  const dueCards = deckCards.filter(c => new Date(c.nextReview) <= new Date());

  // SM-2 Algorithm
  const calculateNextReview = (quality: number, card: FlashCard) => {
    let newEaseFactor = card.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    newEaseFactor = Math.max(1.3, newEaseFactor);

    let newInterval = 1;
    if (card.repetitions === 0) {
      newInterval = 1;
    } else if (card.repetitions === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(card.interval * newEaseFactor);
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + newInterval);

    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReview: nextDate.toISOString().split('T')[0],
    };
  };

  const answerCard = (quality: number) => {
    const card = dueCards[currentCardIndex];
    if (!card) return;

    const updates = calculateNextReview(quality, card);
    setCards(
      cards.map(c =>
        c.id === card.id
          ? {
              ...c,
              ...updates,
              repetitions: c.repetitions + 1,
              quality,
            }
          : c
      )
    );

    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setCardFlipped(false);
    } else {
      setReviewMode(false);
      setCurrentCardIndex(0);
      setCardFlipped(false);
    }
  };

  const stats = {
    total: deckCards.length,
    due: dueCards.length,
    reviewed: deckCards.filter(c => c.repetitions > 0).length,
  };

  const qualityLabels = [
    { value: 0, label: 'Again' },
    { value: 1, label: 'Hard' },
    { value: 2, label: 'Good' },
    { value: 3, label: 'Easy' },
    { value: 4, label: 'Perfect' },
  ];

  return (
    <div className="space-y-6">
      {/* Deck Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Decks</h3>
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {decks.map(deck => (
            <div key={deck} className="relative flex-shrink-0">
              <button
                onClick={() => setSelectedDeck(deck)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDeck === deck
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {deck}
              </button>
              {deck !== 'Default' && (
                <button
                  onClick={() => deleteDeck(deck)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="New deck name"
            className="input-field flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addDeck()}
          />
          <button onClick={addDeck} className="btn-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.total}</div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Total Cards</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.due}</div>
          <div className="text-sm text-red-700 dark:text-red-300">Due Today</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.reviewed}</div>
          <div className="text-sm text-green-700 dark:text-green-300">Reviewed</div>
        </div>
      </div>

      {reviewMode && dueCards.length > 0 ? (
        /* Review Mode */
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Card {currentCardIndex + 1} / {dueCards.length}
            </h3>
            <button
              onClick={() => {
                setReviewMode(false);
                setCurrentCardIndex(0);
                setCardFlipped(false);
              }}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Exit Review
            </button>
          </div>

          {/* Flashcard */}
          <button
            onClick={() => setCardFlipped(!cardFlipped)}
            className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-8 text-center min-h-64 flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {cardFlipped ? 'Answer' : 'Question'}
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {cardFlipped
                  ? dueCards[currentCardIndex]?.back
                  : dueCards[currentCardIndex]?.front}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                Click to flip
              </p>
            </div>
          </button>

          {/* Quality Rating Buttons */}
          {cardFlipped && (
            <div className="grid grid-cols-5 gap-2">
              {qualityLabels.map(q => (
                <button
                  key={q.value}
                  onClick={() => answerCard(q.value)}
                  className={`py-3 rounded-lg font-medium text-sm transition-colors ${
                    q.value === 0
                      ? 'bg-red-500 hover:bg-red-600'
                      : q.value === 1
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : q.value === 2
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : q.value === 3
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Main View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Card Form */}
          <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900 to-slate-50 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              New Card
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Deck
              </label>
              <select
                value={formData.deck || selectedDeck}
                onChange={(e) => setFormData({ ...formData, deck: e.target.value })}
                className="input-field"
              >
                {decks.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Front (Question)
              </label>
              <textarea
                value={formData.front}
                onChange={(e) => setFormData({ ...formData, front: e.target.value })}
                placeholder="Enter question or prompt..."
                className="input-field resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Back (Answer)
              </label>
              <textarea
                value={formData.back}
                onChange={(e) => setFormData({ ...formData, back: e.target.value })}
                placeholder="Enter answer or explanation..."
                className="input-field resize-none h-24"
              />
            </div>

            <button onClick={addCard} className="btn-primary w-full">
              <Plus className="w-4 h-4" /> Add Card
            </button>
          </div>

          {/* Card List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedDeck} Cards
              </h3>
              {stats.due > 0 && (
                <button
                  onClick={() => {
                    setReviewMode(true);
                    setCurrentCardIndex(0);
                    setCardFlipped(false);
                  }}
                  className="btn-primary text-sm"
                >
                  <RotateCw className="w-4 h-4" /> Review ({stats.due})
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {deckCards.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No cards in this deck
                </div>
              ) : (
                deckCards.map(card => {
                  const isDue = new Date(card.nextReview) <= new Date();
                  return (
                    <div
                      key={card.id}
                      className={`p-3 rounded-lg border ${
                        isDue
                          ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                            {card.front}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                            {card.back}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                            Reps: {card.repetitions} | Next: {card.nextReview}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-slate-400 hover:text-red-500 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>📚 Spaced Repetition (SM-2 Algorithm)</strong>
        <ul className="mt-2 space-y-1">
          <li>• Shows cards at optimal intervals</li>
          <li>• Improves long-term memory retention</li>
          <li>• Reviews "Due Today" cards regularly</li>
          <li>• Rate each answer to adjust timing</li>
        </ul>
      </div>
    </div>
  );
}
