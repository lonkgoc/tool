import { useState } from 'react';
import { Smile, Copy, Check, Trash2 } from 'lucide-react';

const emojiCategories = {
  'Faces': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
  'Food': ['🍎', '🍌', '🍇', '🍊', '🍋', '🍉', '🍓', '🍑', '🍒', '🍐'],
  'Travel': ['✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒'],
  'Objects': ['📱', '💻', '⌚', '📷', '🎮', '🎸', '🎨', '📚', '🎯', '🎲'],
  'Nature': ['🌲', '🌳', '🌴', '🌵', '🌷', '🌹', '🌺', '🌻', '🌼', '🌽']
};

export default function EmojiStory() {
  const [story, setStory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addEmoji = (emoji: string) => {
    setStory(story + emoji);
  };

  const clear = () => {
    setStory('');
  };

  const copy = () => {
    navigator.clipboard.writeText(story);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Smile className="w-6 h-6" />
          <span>Emoji Story Creator</span>
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Choose Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(emojiCategories).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-2 rounded-lg text-sm ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {emojiCategories[selectedCategory as keyof typeof emojiCategories].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => addEmoji(emoji)}
                  className="text-3xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Your Emoji Story
          </label>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg min-h-[100px] text-2xl">
            {story || <span className="text-slate-400">Your story will appear here...</span>}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={copy} disabled={!story} className="btn-primary flex-1 flex items-center justify-center space-x-2">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button onClick={clear} disabled={!story} className="btn-secondary flex items-center space-x-2">
            <Trash2 className="w-5 h-5" />
            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}


