import { useState } from 'react';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface WeeklyTask {
  id: string;
  day: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WeeklyPlanner() {
  const [tasks, setTasks] = useState<WeeklyTask[]>(() => {
    const saved = localStorage.getItem('weeklyPlan');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay()]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const saveToStorage = (newTasks: WeeklyTask[]) => {
    localStorage.setItem('weeklyPlan', JSON.stringify(newTasks));
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const task: WeeklyTask = {
      id: Date.now().toString(),
      day: selectedDay,
      task: newTask.trim(),
      priority,
      completed: false,
    };

    const updated = [...tasks, task];
    setTasks(updated);
    saveToStorage(updated);
    setNewTask('');
    setPriority('medium');
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToStorage(updated);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    saveToStorage(updated);
  };

  const saveEdit = (id: string) => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, task: editText } : t
    );
    setTasks(updated);
    saveToStorage(updated);
    setEditingId(null);
  };

  const dayTasks = tasks.filter(t => t.day === selectedDay);
  const priorityColors = {
    low: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
  };

  const weekStats = DAYS.map(day => ({
    day: day.slice(0, 3),
    total: tasks.filter(t => t.day === day).length,
    completed: tasks.filter(t => t.day === day && t.completed).length,
  }));

  return (
    <div className="space-y-6">
      {/* Week Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
        <h3 className="font-semibold mb-3">Week Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekStats.map((stat, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(DAYS[i])}
              className={`p-2 rounded text-center transition-colors ${
                selectedDay === DAYS[i]
                  ? 'bg-white text-purple-600'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              <div className="text-xs font-bold">{stat.day}</div>
              <div className="text-sm mt-1">
                {stat.completed}/{stat.total}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Day Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Day
        </label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="input-field"
        >
          {DAYS.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Add Task Form */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Task for {selectedDay}</h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Task
          </label>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add task..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button onClick={addTask} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {dayTasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No tasks for {selectedDay}
          </div>
        ) : (
          dayTasks.map(task => (
            <div
              key={task.id}
              className={`p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5"
              />

              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                  <button
                    onClick={() => saveEdit(task.id)}
                    className="text-green-500 hover:text-green-600"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <p className={task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}>
                      {task.task}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditText(task.task);
                    }}
                    className="text-slate-400 hover:text-blue-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tasks.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tasks.filter(t => t.completed).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
