import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Lock, Unlock, Check } from 'lucide-react';

export default function PasswordStrength() {
    const [password, setPassword] = useState('');
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        checkStrength(password);
    }, [password]);

    const checkStrength = (pwd: string) => {
        let s = 0;
        const fb = [];

        if (!pwd) {
            setScore(0);
            setFeedback([]);
            return;
        }

        // Length
        if (pwd.length > 7) s += 1;
        if (pwd.length > 11) s += 1;

        // Complexity
        if (/[A-Z]/.test(pwd)) s += 1; // has upper
        if (/[0-9]/.test(pwd)) s += 1; // has number
        if (/[^A-Za-z0-9]/.test(pwd)) s += 1; // has special

        // Penalties
        if (pwd.length > 0 && pwd.length < 8) fb.push('Too short (min 8 chars)');
        if (!/[A-Z]/.test(pwd)) fb.push('Add uppercase letters');
        if (!/[0-9]/.test(pwd)) fb.push('Add numbers');
        if (!/[^A-Za-z0-9]/.test(pwd)) fb.push('Add special characters');
        if (/^[a-zA-Z]+$/.test(pwd)) fb.push('Letters only is weak');
        if (/^[0-9]+$/.test(pwd)) fb.push('Numbers only is very weak');

        // Cap at 5
        setScore(Math.min(5, s));
        setFeedback(fb);
    };

    const getStrengthLabel = () => {
        switch (score) {
            case 0: return { label: 'Very Weak', color: 'text-red-500', barColor: 'bg-red-500' };
            case 1: return { label: 'Weak', color: 'text-orange-500', barColor: 'bg-orange-500' };
            case 2: return { label: 'Fair', color: 'text-yellow-500', barColor: 'bg-yellow-500' };
            case 3: return { label: 'Good', color: 'text-blue-500', barColor: 'bg-blue-500' };
            case 4: return { label: 'Strong', color: 'text-green-500', barColor: 'bg-green-500' };
            case 5: return { label: 'Very Strong', color: 'text-green-600', barColor: 'bg-green-600' };
            default: return { label: '', color: '', barColor: 'bg-gray-200' };
        }
    };

    const { label, color, barColor } = getStrengthLabel();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                    {score >= 4 ? <ShieldCheck className="w-8 h-8 text-green-500" /> : <ShieldAlert className="w-8 h-8 text-slate-400" />}
                    Password Strength Check
                </h2>

                <div className="relative mb-6">
                    <input
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Type a password..."
                        className="w-full text-lg px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white pr-12"
                    />
                    <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        {isVisible ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </button>
                </div>

                <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Strength</span>
                        <span className={`text-sm font-bold ${color}`}>{label}</span>
                    </div>
                    <div className="flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((idx) => (
                            <div
                                key={idx}
                                className={`flex-1 rounded-full transition-colors duration-300 ${score >= idx ? barColor : 'bg-slate-200 dark:bg-slate-700'}`}
                            />
                        ))}
                    </div>
                </div>

                {password && (
                    <div className="space-y-4">
                        {feedback.length > 0 ? (
                            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg text-sm">
                                <p className="font-semibold mb-2">Suggestions to improve:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {feedback.map((msg, i) => (
                                        <li key={i}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded-lg text-sm flex items-center gap-3">
                                <Check className="w-5 h-5" />
                                <p>Great! This is a strong password.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
