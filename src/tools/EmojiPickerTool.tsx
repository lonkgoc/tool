import { useState } from 'react';
import { Copy, Check, Smile } from 'lucide-react';

const emojiCategories = {
    'Recent & Popular': ['😂', '❤️', '👍', '🔥', '✨', '😊', '🙏', '🎉', '🌟', '🤔'],
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '🙂', '🙃', '😉', '😇', '🥰', '😍', '🤩'],
    'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙'],
    'Objects': ['💻', '📱', '📷', '💡', '🔦', '🔋', '🔌', '🕯️', '🧯', '🗑️', '🛢️', '🛒'],
    'Symbols': ['✅', '❌', '❤️', '💔', '❣️', '💜', '🖤', '💯', '💢', '💥', '💫', '💦', '💨'],
};

export default function EmojiPickerTool() {
    const [selected, setSelected] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = (emoji: string) => {
        setSelected(emoji);
        navigator.clipboard.writeText(emoji);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <Smile className="w-6 h-6 text-blue-500" />
                    Emoji Picker
                </h2>

                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-center h-24 flex items-center justify-center relative">
                        {selected ? (
                            <div className="text-6xl animate-bounce">{selected}</div>
                        ) : (
                            <div className="text-slate-400">Click an emoji to copy</div>
                        )}
                        {copied && (
                            <div className="absolute top-2 right-2 text-green-500 text-sm font-medium flex items-center gap-1">
                                <Check className="w-4 h-4" /> Copied
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {Object.entries(emojiCategories).map(([category, emojis]) => (
                            <div key={category}>
                                <h3 className="text-sm font-medium text-slate-500 mb-3">{category}</h3>
                                <div className="grid grid-cols-8 md:grid-cols-10 gap-2">
                                    {emojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => handleCopy(emoji)}
                                            className="aspect-square flex items-center justify-center text-2xl hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
