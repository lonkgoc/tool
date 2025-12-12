import { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle2, Circle, Tag, Calendar, Download, AlertCircle } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  tags: string[];
  createdAt: string;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

export default function AdvancedTodoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification('error', 'Please enter a task title');
      return;
    }

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      dueDate,
      tags,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setTagInput('');
    showNotification('success', 'Task added successfully!');
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          showNotification('success', 'Task completed! 🎉');
        }
        return { ...todo, completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    if (deleteConfirm === id) {
      setTodos(todos.filter(todo => todo.id !== id));
      setDeleteConfirm(null);
      showNotification('success', 'Task deleted');
    } else {
      setDeleteConfirm(id);
      // Auto-cancel confirm after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount > 0) {
      setTodos(todos.filter(todo => !todo.completed));
      showNotification('success', `Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`);
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Tasks exported to JSON!');
  };

  const exportToTXT = () => {
    const lines = todos.map(todo => {
      const status = todo.completed ? '✓' : '○';
      const priority = `[${todo.priority.toUpperCase()}]`;
      const date = todo.dueDate ? ` (Due: ${new Date(todo.dueDate).toLocaleDateString()})` : '';
      const tags = todo.tags.length > 0 ? ` #${todo.tags.join(' #')}` : '';
      let line = `${status} ${priority} ${todo.title}${date}${tags}`;
      if (todo.description) {
        line += `\n   ${todo.description}`;
      }
      return line;
    }).join('\n\n');

    const header = `=== Todo List Export ===\n${new Date().toLocaleString()}\n${'='.repeat(25)}\n\n`;
    const stats = `\n\n--- Stats ---\nTotal: ${todos.length} | Active: ${todos.filter(t => !t.completed).length} | Completed: ${todos.filter(t => t.completed).length}`;

    const blob = new Blob([header + lines + stats], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Tasks exported to TXT!');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const priorityColor = {
    low: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    medium: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100',
    high: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100',
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in ${notification.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
          }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task..."
            className="input-field resize-none h-20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag and press Enter..."
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-primary"
            >
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </form>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {' '}
              ({todos.filter(t => {
                if (f === 'active') return !t.completed;
                if (f === 'completed') return t.completed;
                return true;
              }).length})
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {todos.some(t => t.completed) && (
            <button
              onClick={clearCompleted}
              className="btn-secondary text-sm"
            >
              Clear Completed
            </button>
          )}
          {todos.length > 0 && (
            <>
              <button
                onClick={exportToJSON}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> JSON
              </button>
              <button
                onClick={exportToTXT}
                className="btn-secondary text-sm flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> TXT
              </button>
            </>
          )}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            {filter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${filter} tasks.`}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`p-4 border rounded-lg transition-colors ${todo.completed
                  ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-semibold ${todo.completed
                          ? 'line-through text-slate-500 dark:text-slate-400'
                          : 'text-slate-900 dark:text-slate-100'
                        }`}
                    >
                      {todo.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${priorityColor[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>

                  {todo.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      {todo.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                    {todo.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {todo.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {todo.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={`transition-colors ${deleteConfirm === todo.id
                      ? 'text-red-600 dark:text-red-400 animate-pulse'
                      : 'text-slate-400 hover:text-red-500'
                    }`}
                  title={deleteConfirm === todo.id ? 'Click again to confirm delete' : 'Delete task'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {todos.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-500">
            {todos.filter(t => t.completed).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">
            {todos.filter(t => !t.completed).length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Remaining</div>
        </div>
      </div>
    </div>
  );
}
