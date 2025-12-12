import { useState, useEffect } from 'react';
import { Target, Plus, Trash2, Check, Download, Calendar, Flag } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
  milestones: Milestone[];
  createdAt: string;
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    if (saved) {
      try {
        return JSON.parse(saved).map((g: any) => ({
          ...g,
          milestones: g.milestones || [],
          createdAt: g.createdAt || new Date().toISOString()
        }));
      } catch { return []; }
    }
    return [];
  });
  const [newGoal, setNewGoal] = useState({ title: '', description: '', targetDate: '' });
  const [notification, setNotification] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const addGoal = () => {
    if (newGoal.title.trim()) {
      setGoals([...goals, {
        id: Date.now().toString(),
        ...newGoal,
        progress: 0,
        completed: false,
        milestones: [],
        createdAt: new Date().toISOString()
      }]);
      setNewGoal({ title: '', description: '', targetDate: '' });
      showNotification('Goal added! 🎯');
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.max(0, Math.min(100, progress)) } : g));
  };

  const toggleComplete = (id: string) => {
    setGoals(goals.map(g => g.id === id ? {
      ...g,
      completed: !g.completed,
      progress: g.completed ? g.progress : 100
    } : g));
    const goal = goals.find(g => g.id === id);
    if (goal && !goal.completed) showNotification('Goal completed! 🎉');
  };

  const deleteGoal = (id: string) => {
    if (deleteConfirm === id) {
      setGoals(goals.filter(g => g.id !== id));
      setDeleteConfirm(null);
      showNotification('Goal deleted');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const addMilestone = (goalId: string) => {
    if (!newMilestone.trim()) return;
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      return { ...g, milestones: [...g.milestones, { id: Date.now().toString(), title: newMilestone, completed: false }] };
    }));
    setNewMilestone('');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const milestones = g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      const completedCount = milestones.filter(m => m.completed).length;
      const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : g.progress;
      return { ...g, milestones, progress };
    }));
  };

  const deleteMilestone = (goalId: string, milestoneId: string) => {
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      return { ...g, milestones: g.milestones.filter(m => m.id !== milestoneId) };
    }));
  };

  const exportGoals = () => {
    const blob = new Blob([JSON.stringify(goals, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goals-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Goals exported!');
  };

  const getDaysRemaining = (targetDate: string) => {
    if (!targetDate) return null;
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const completedGoals = goals.filter(g => g.completed).length;
  const activeGoals = goals.filter(g => !g.completed).length;

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white">
          {notification}
        </div>
      )}

      {/* Stats */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="text-2xl font-bold text-blue-600">{goals.length}</div>
            <div className="text-xs text-slate-600">Total</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
            <div className="text-2xl font-bold text-yellow-600">{activeGoals}</div>
            <div className="text-xs text-slate-600">Active</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            <div className="text-xs text-slate-600">Done</div>
          </div>
        </div>
      )}

      {/* Add Goal Form */}
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Target className="w-6 h-6" /> Goal Tracker
        </h2>
        <div className="space-y-3 mb-4">
          <input type="text" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Goal title" className="w-full input-field" />
          <textarea value={newGoal.description} onChange={e => setNewGoal({ ...newGoal, description: e.target.value })} placeholder="Description (optional)" className="w-full input-field h-16" />
          <input type="date" value={newGoal.targetDate} onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })} className="w-full input-field" />
          <button onClick={addGoal} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Goal
          </button>
        </div>
        {goals.length > 0 && (
          <button onClick={exportGoals} className="btn-secondary w-full text-sm flex items-center justify-center gap-1">
            <Download className="w-4 h-4" /> Export Goals
          </button>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map(goal => {
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isExpanded = expandedGoal === goal.id;

          return (
            <div key={goal.id} className={`card ${goal.completed ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className={`font-semibold text-slate-900 dark:text-slate-100 ${goal.completed ? 'line-through' : ''}`}>{goal.title}</h3>
                  {goal.description && <p className="text-sm text-slate-600 dark:text-slate-400">{goal.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-2 text-xs text-slate-500">
                    {goal.targetDate && (
                      <span className={`flex items-center gap-1 ${daysRemaining !== null && daysRemaining < 0 ? 'text-red-500' : daysRemaining !== null && daysRemaining <= 7 ? 'text-yellow-500' : ''}`}>
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.targetDate).toLocaleDateString()}
                        {daysRemaining !== null && ` (${daysRemaining >= 0 ? `${daysRemaining}d left` : 'overdue'})`}
                      </span>
                    )}
                    <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleComplete(goal.id)} className={`p-2 rounded-lg ${goal.completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteGoal(goal.id)} className={`p-2 rounded-lg ${deleteConfirm === goal.id ? 'bg-red-500 text-white animate-pulse' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Progress</span>
                  <span className="font-semibold">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all ${goal.completed ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${goal.progress}%` }} />
                </div>
                {!goal.completed && (
                  <input type="range" min="0" max="100" value={goal.progress} onChange={e => updateProgress(goal.id, Number(e.target.value))} className="w-full mt-2" />
                )}
              </div>

              {/* Milestones Toggle */}
              <button onClick={() => setExpandedGoal(isExpanded ? null : goal.id)} className="mt-3 text-sm text-blue-600 flex items-center gap-1">
                <Flag className="w-4 h-4" /> Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
              </button>

              {/* Milestones */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyPress={e => e.key === 'Enter' && addMilestone(goal.id)} placeholder="Add milestone" className="flex-1 input-field text-sm" />
                    <button onClick={() => addMilestone(goal.id)} className="btn-secondary text-sm">Add</button>
                  </div>
                  <div className="space-y-1">
                    {goal.milestones.map(m => (
                      <div key={m.id} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <button onClick={() => toggleMilestone(goal.id, m.id)} className={`p-1 rounded ${m.completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600'}`}>
                          <Check className="w-3 h-3" />
                        </button>
                        <span className={`flex-1 text-sm ${m.completed ? 'line-through text-slate-400' : ''}`}>{m.title}</span>
                        <button onClick={() => deleteMilestone(goal.id, m.id)} className="text-slate-400 hover:text-red-500">×</button>
                      </div>
                    ))}
                    {goal.milestones.length === 0 && <p className="text-xs text-slate-400 text-center py-2">No milestones yet</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {goals.length === 0 && <div className="text-center py-12 text-slate-500">No goals yet. Add one to get started! 🎯</div>}
      </div>
    </div>
  );
}
