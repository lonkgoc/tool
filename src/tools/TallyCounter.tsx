import { useState } from 'react';
import { Plus, Minus, RotateCcw, Trash2, Edit2, Play } from 'lucide-react';

interface Counter {
    id: number;
    name: string;
    count: number;
    color: string;
}

export default function TallyCounter() {
    const [counters, setCounters] = useState<Counter[]>([
        { id: 1, name: 'General Count', count: 0, color: 'bg-blue-500' },
    ]);

    const colors = [
        'bg-blue-500', 'bg-green-500', 'bg-red-500',
        'bg-purple-500', 'bg-orange-500', 'bg-pink-500'
    ];

    const addCounter = () => {
        const newId = Math.max(0, ...counters.map(c => c.id)) + 1;
        setCounters([
            ...counters,
            {
                id: newId,
                name: `Counter ${newId}`,
                count: 0,
                color: colors[newId % colors.length]
            }
        ]);
    };

    const updateCount = (id: number, delta: number) => {
        setCounters(counters.map(c =>
            c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c
        ));
    };

    const resetCount = (id: number) => {
        setCounters(counters.map(c =>
            c.id === id ? { ...c, count: 0 } : c
        ));
    };

    const deleteCounter = (id: number) => {
        setCounters(counters.filter(c => c.id !== id));
    };

    const renameCounter = (id: number, newName: string) => {
        setCounters(counters.map(c =>
            c.id === id ? { ...c, name: newName } : c
        ));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={addCounter}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus className="w-5 h-5" /> Add New Counter
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {counters.map(counter => (
                    <div key={counter.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                        <div className={`h-2 ${counter.color}`}></div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <input
                                    type="text"
                                    value={counter.name}
                                    onChange={(e) => renameCounter(counter.id, e.target.value)}
                                    className="font-semibold text-lg bg-transparent border-b border-transparent focus:border-slate-300 dark:focus:border-slate-600 focus:outline-none w-full mr-2 text-slate-900 dark:text-slate-100"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => resetCount(counter.id)}
                                        className="text-slate-400 hover:text-orange-500 p-1 rounded"
                                        title="Reset"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                    {counters.length > 1 && (
                                        <button
                                            onClick={() => deleteCounter(counter.id)}
                                            className="text-slate-400 hover:text-red-500 p-1 rounded"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center py-8">
                                <span className="text-7xl font-bold font-mono text-slate-800 dark:text-slate-100 tabular-nums">
                                    {counter.count}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <button
                                    onClick={() => updateCount(counter.id, -1)}
                                    className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 py-3 rounded-lg flex items-center justify-center"
                                >
                                    <Minus className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => updateCount(counter.id, 1)}
                                    className={`${counter.color} text-white hover:brightness-110 py-3 rounded-lg flex items-center justify-center`}
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
