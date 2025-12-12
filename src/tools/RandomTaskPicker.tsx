import { useState, useCallback } from 'react';
import { Shuffle, Plus, Trash2, Sparkles, Download } from 'lucide-react';

export default function RandomTaskPicker() {
  const [tasks, setTasks] = useState<string[]>(() => {
    const saved = localStorage.getItem('randomTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const saveToStorage = (updated: string[]) => {
    setTasks(updated);
    localStorage.setItem('randomTasks', JSON.stringify(updated));
  };

  const addTask = () => {
    if (newTask.trim()) {
      if (tasks.includes(newTask.trim())) {
        showNotification('Task already exists!');
        return;
      }
      saveToStorage([...tasks, newTask.trim()]);
      setNewTask('');
      showNotification('Task added!');
    }
  };

  const playSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.15);
      });
    } catch { }
  }, []);

  const pickRandom = () => {
    if (tasks.length === 0) return;

    setIsSpinning(true);
    setSelectedTask(null);

    // Visual spinning effect
    let spins = 0;
    const maxSpins = 15;
    const interval = setInterval(() => {
      setSelectedTask(tasks[Math.floor(Math.random() * tasks.length)]);
      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        const final = tasks[Math.floor(Math.random() * tasks.length)];
        setSelectedTask(final);
        setIsSpinning(false);
        playSound();
      }
    }, 100);
  };

  const deleteTask = (index: number) => {
    const taskToDelete = tasks[index];
    saveToStorage(tasks.filter((_, i) => i !== index));
    if (selectedTask === taskToDelete) setSelectedTask(null);
    showNotification('Task removed');
  };

  const clearAll = () => {
    if (confirm('Clear all tasks?')) {
      saveToStorage([]);
      setSelectedTask(null);
      showNotification('All tasks cleared');
    }
  };

  const exportTasks = () => {
    const text = tasks.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'random-tasks.txt';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Tasks exported!');
  };

  const importTasks = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const imported = text.split('\n').map(t => t.trim()).filter(t => t);
          const merged = [...new Set([...tasks, ...imported])];
          saveToStorage(merged);
          showNotification(`Imported ${imported.length} tasks!`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-purple-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-purple-500" />
          Random Task Picker
        </h2>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a task to the pool"
            className="flex-1 input-field"
          />
          <button onClick={addTask} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-4 text-slate-400">Add some tasks to get started!</div>
          ) : (
            tasks.map((task, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-all ${selectedTask === task && !isSpinning ? 'bg-purple-200 dark:bg-purple-800 ring-2 ring-purple-500' : 'bg-slate-50 dark:bg-slate-800'
                }`}>
                <span className="text-slate-900 dark:text-slate-100">{task}</span>
                <button onClick={() => deleteTask(index)} className="text-red-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pick Button */}
        <button
          onClick={pickRandom}
          disabled={tasks.length === 0 || isSpinning}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg disabled:opacity-50"
        >
          {isSpinning ? (
            <Sparkles className="w-6 h-6 animate-spin" />
          ) : (
            <Shuffle className="w-6 h-6" />
          )}
          {isSpinning ? 'Picking...' : 'Pick Random Task'}
        </button>

        {/* Result */}
        {selectedTask && !isSpinning && (
          <div className="mt-4 p-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-center animate-fade-in">
            <div className="text-sm text-white/80 mb-1">Your task is:</div>
            <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              {selectedTask}
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Actions */}
        {tasks.length > 0 && (
          <div className="flex gap-2 mt-4">
            <button onClick={exportTasks} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-sm">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={importTasks} className="btn-secondary flex-1 text-sm">Import</button>
            <button onClick={clearAll} className="btn-secondary flex-1 text-sm text-red-500">Clear All</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">{tasks.length}</div>
          <div className="text-sm text-slate-500">Tasks in Pool</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-pink-600">{tasks.length > 0 ? (100 / tasks.length).toFixed(1) : 0}%</div>
          <div className="text-sm text-slate-500">Chance per Task</div>
        </div>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-sm text-purple-800 dark:text-purple-100">
        <strong>💡 Tip:</strong> Can't decide what to do? Add your options and let fate decide! Great for choosing between tasks, restaurants, or activities.
      </div>
    </div>
  );
}
