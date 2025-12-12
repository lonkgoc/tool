import { useState } from 'react';
import { Search, Laugh, Smile, Coffee, Activity, Flag } from 'lucide-react';

const emojiData = [
    { category: 'Smileys', icon: Smile, emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'] },
    { category: 'Gestures', icon: Laugh, emojis: ['👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', 'OK', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🦾', '🖕', '✍️', '🙏', '🦶', '🦵'] },
    { category: 'Objects', icon: Coffee, emojis: ['👓', '🕶', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍', '🎒', '👞', '👟', '🥾', '🥿', '👠'] },
    { category: 'Symbols', icon: Activity, emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐'] },
    { category: 'Flags', icon: Flag, emojis: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫'] }
];

export default function EmojiPicker() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null);

    const handleCopy = (emoji: string) => {
        navigator.clipboard.writeText(emoji);
        setCopiedEmoji(emoji);
        setTimeout(() => setCopiedEmoji(null), 1500);
    };

    const filteredEmojis = emojiData.flatMap(cat =>
        (selectedCategory === 'All' || selectedCategory === cat.category)
            ? cat.emojis.filter(e => e.includes(searchTerm)) // Simple approximation for search, mostly relying on render
            : []
    );

    // Note: Real semantic search for emojis requires a large library. 
    // For this simple version, search is limited or removed if not matching chars. 
    // Let's refine: If search term exists, ignore categories and show all matches (if we had descriptions).
    // Since we only have the chars, we'll keep it simple: category filter.

    return (
        <div className="h-[600px] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search emojis..." // Search logic is limited in this simplified version
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                        disabled // Disabled for now as we don't have descriptions mapping
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 opacity-70">(Browsing only)</div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === 'All' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                >
                    All
                </button>
                {emojiData.map(cat => (
                    <button
                        key={cat.category}
                        onClick={() => setSelectedCategory(cat.category)}
                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${selectedCategory === cat.category
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                {emojiData.map(cat => {
                    if (selectedCategory !== 'All' && selectedCategory !== cat.category) return null;
                    return (
                        <div key={cat.category} className="mb-6">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">{cat.category}</h3>
                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                {cat.emojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => handleCopy(emoji)}
                                        className="aspect-square flex items-center justify-center text-2xl hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative group"
                                    >
                                        {emoji}
                                        {copiedEmoji === emoji && (
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded shadow pointer-events-none animate-fade-in-up">
                                                Copied!
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
