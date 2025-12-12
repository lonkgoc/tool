import { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, BarChart3 } from 'lucide-react';

interface DailyPlanner {
  id: string;
  time: string;
  task: string;
  duration: number;
  category: 'work' | 'personal' | 'health' | 'other';
  completed: boolean;
}

export default function DailyPlanner() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<DailyPlanner[]>(() => {
    const saved = localStorage.getItem('dailyPlan_' + date);
    return saved ? JSON.parse(saved) : [];
  });
  const [time, setTime] = useState('09:00');
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState<'work' | 'personal' | 'health' | 'other'>('work');

  useEffect(() => {
    localStorage.setItem('dailyPlan_' + date, JSON.stringify(tasks));
  }, [tasks, date]);

  useEffect(() => {
    const saved = localStorage.getItem('dailyPlan_' + date);
    setTasks(saved ? JSON.parse(saved) : []);
  }, [date]);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask: DailyPlanner = {
      id: Date.now().toString(),
      time,
      task: task.trim(),
      duration,
      category,
      completed: false,
    };

    setTasks([...tasks.sort((a, b) => a.time.localeCompare(b.time))].concat([newTask]).sort((a, b) => a.time.localeCompare(b.time)));
    setTask('');
    setTime('09:00');
    setDuration(30);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const categoryColors = {
    work: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    personal: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100',
    health: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
    other: 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);

  const sortedTasks = [...tasks].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Add Task Form */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Task to {new Date(date).toLocaleDateString()}</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="15"
              step="15"
              value={duration}
              onChange={(e) => setDuration(Math.max(15, Number(e.target.value)))}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Task
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add task..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'work' | 'personal' | 'health' | 'other')}
            className="input-field"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button onClick={addTask} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
          <BarChart3 className="w-5 h-5 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{tasks.length}</div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Tasks</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">{totalDuration}</div>
          <div className="text-xs text-green-700 dark:text-green-300">Minutes</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
          <BarChart3 className="w-5 h-5 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{completedCount}/{tasks.length}</div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Completed</div>
        </div>
      </div>

      {/* Tasks Timeline */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No tasks scheduled for this day
          </div>
        ) : (
          sortedTasks.map(t => (
            <div
              key={t.id}
              className={`p-3 rounded-lg border-l-4 flex items-center gap-3 ${
                t.completed
                  ? 'bg-slate-50 dark:bg-slate-800 border-l-gray-400 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-l-blue-500'
              }`}
            >
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id)}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {t.time} - {t.task}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {t.duration} min
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[t.category]}`}>
                {t.category}
              </span>
              <button
                onClick={() => deleteTask(t.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
