import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Grid3X3 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  urgent: boolean;
  important: boolean;
  createdAt: string;
}

export default function PriorityMatrix() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('priorityMatrixTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('priorityMatrixTasks', JSON.stringify(tasks));
  }, [tasks]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask.trim(),
        urgent: false,
        important: false,
        createdAt: new Date().toISOString()
      }]);
      setNewTask('');
      showNotification('Task added to Eliminate quadrant');
    }
  };

  const toggleUrgent = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, urgent: !t.urgent } : t));
  };

  const toggleImportant = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, important: !t.important } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    showNotification('Task removed');
  };

  const clearQuadrant = (urgent: boolean, important: boolean) => {
    setTasks(tasks.filter(t => !(t.urgent === urgent && t.important === important)));
    showNotification('Quadrant cleared');
  };

  const exportMatrix = () => {
    const q = {
      do: tasks.filter(t => t.urgent && t.important),
      schedule: tasks.filter(t => !t.urgent && t.important),
      delegate: tasks.filter(t => t.urgent && !t.important),
      eliminate: tasks.filter(t => !t.urgent && !t.important)
    };

    let text = '=== Eisenhower Priority Matrix ===\n\n';
    text += '📌 DO FIRST (Urgent & Important)\n' + q.do.map(t => '  • ' + t.text).join('\n') + '\n\n';
    text += '📅 SCHEDULE (Important, Not Urgent)\n' + q.schedule.map(t => '  • ' + t.text).join('\n') + '\n\n';
    text += '👥 DELEGATE (Urgent, Not Important)\n' + q.delegate.map(t => '  • ' + t.text).join('\n') + '\n\n';
    text += '🗑️ ELIMINATE (Not Urgent, Not Important)\n' + q.eliminate.map(t => '  • ' + t.text).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'priority-matrix.txt';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Matrix exported!');
  };

  const quadrants = {
    do: tasks.filter(t => t.urgent && t.important),
    schedule: tasks.filter(t => !t.urgent && t.important),
    delegate: tasks.filter(t => t.urgent && !t.important),
    eliminate: tasks.filter(t => !t.urgent && !t.important)
  };

  const QuadrantCard = ({ title, emoji, tasks: items, bgColor, borderColor, urgent, important }: {
    title: string; emoji: string; tasks: Task[]; bgColor: string; borderColor: string; urgent: boolean; important: boolean
  }) => (
    <div className={`${bgColor} ${borderColor} border-2 rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm flex items-center gap-1">
          <span>{emoji}</span> {title}
        </h3>
        <span className="text-xs bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-2 min-h-[100px] max-h-[200px] overflow-y-auto">
        {items.map(task => (
          <div key={task.id} className="flex items-center justify-between p-2 bg-white/70 dark:bg-slate-800/70 rounded-lg text-sm">
            <span className="flex-1 text-slate-800 dark:text-slate-200">{task.text}</span>
            <button onClick={() => deleteTask(task.id)} className="text-red-400 hover:text-red-600 ml-2">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No tasks</div>}
      </div>
      {items.length > 0 && (
        <button onClick={() => clearQuadrant(urgent, important)} className="w-full mt-2 text-xs text-slate-500 hover:text-red-500">
          Clear
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Grid3X3 className="w-6 h-6 text-blue-500" />
            Eisenhower Priority Matrix
          </h2>
          {tasks.length > 0 && (
            <button onClick={exportMatrix} className="btn-secondary text-sm flex items-center gap-1">
              <Download className="w-4 h-4" /> Export
            </button>
          )}
        </div>

        {/* Add Task */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 input-field"
          />
          <button onClick={addTask} className="btn-primary">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <QuadrantCard title="DO FIRST" emoji="🔥" tasks={quadrants.do}
            bgColor="bg-red-50 dark:bg-red-900/20" borderColor="border-red-300 dark:border-red-700" urgent={true} important={true} />
          <QuadrantCard title="SCHEDULE" emoji="📅" tasks={quadrants.schedule}
            bgColor="bg-blue-50 dark:bg-blue-900/20" borderColor="border-blue-300 dark:border-blue-700" urgent={false} important={true} />
          <QuadrantCard title="DELEGATE" emoji="👥" tasks={quadrants.delegate}
            bgColor="bg-yellow-50 dark:bg-yellow-900/20" borderColor="border-yellow-300 dark:border-yellow-700" urgent={true} important={false} />
          <QuadrantCard title="ELIMINATE" emoji="🗑️" tasks={quadrants.eliminate}
            bgColor="bg-gray-50 dark:bg-gray-900/20" borderColor="border-gray-300 dark:border-gray-700" urgent={false} important={false} />
        </div>

        {/* Task Editor */}
        {tasks.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Categorize Tasks</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <span className="flex-1 text-sm truncate">{task.text}</span>
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={task.urgent} onChange={() => toggleUrgent(task.id)} className="rounded" />
                    <span className={task.urgent ? 'text-red-600 font-medium' : 'text-slate-500'}>Urgent</span>
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" checked={task.important} onChange={() => toggleImportant(task.id)} className="rounded" />
                    <span className={task.important ? 'text-blue-600 font-medium' : 'text-slate-500'}>Important</span>
                  </label>
                  <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-100">
        <strong>💡 The Eisenhower Matrix:</strong> Prioritize tasks by urgency and importance. Do urgent+important first, schedule important tasks, delegate urgent-only, and eliminate the rest.
      </div>
    </div>
  );
}
