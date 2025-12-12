import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface TimeBlock {
  id: string;
  time: string;
  duration: number;
  activity: string;
  focus: boolean;
}

export default function TimeBlocking() {
  const [blocks, setBlocks] = useState<TimeBlock[]>(() => {
    const saved = localStorage.getItem('timeBlocks');
    return saved ? JSON.parse(saved) : [];
  });
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [activity, setActivity] = useState('');
  const [focus, setFocus] = useState(false);

  const saveToStorage = (newBlocks: TimeBlock[]) => {
    localStorage.setItem('timeBlocks', JSON.stringify(newBlocks));
  };

  const addBlock = () => {
    if (!activity.trim()) return;

    const block: TimeBlock = {
      id: Date.now().toString(),
      time,
      duration,
      activity: activity.trim(),
      focus,
    };

    const updated = [...blocks].sort((a, b) => a.time.localeCompare(b.time));
    updated.push(block);
    updated.sort((a, b) => a.time.localeCompare(b.time));
    
    setBlocks(updated);
    saveToStorage(updated);
    setTime('09:00');
    setDuration(60);
    setActivity('');
    setFocus(false);
  };

  const deleteBlock = (id: string) => {
    const updated = blocks.filter(b => b.id !== id);
    setBlocks(updated);
    saveToStorage(updated);
  };

  const getEndTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(endMinutes / 60) % 24;
    const endMins = endMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  };

  const totalHours = blocks.reduce((sum, b) => sum + b.duration, 0) / 60;
  const focusHours = blocks.filter(b => b.focus).reduce((sum, b) => sum + b.duration, 0) / 60;

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {blocks.length}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">Scheduled Blocks</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {totalHours.toFixed(1)}h
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">Total Planned</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {focusHours.toFixed(1)}h
          </div>
          <div className="text-sm text-red-700 dark:text-red-300">Focus Time</div>
        </div>
      </div>

      {/* Add Time Block */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Time Block</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Start Time
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
            Activity
          </label>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="e.g., Deep work, Meeting, Break"
            className="input-field"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={focus}
            onChange={(e) => setFocus(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Focus Time (No interruptions)
          </span>
        </label>

        <button onClick={addBlock} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Block
        </button>
      </div>

      {/* Daily Schedule */}
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Today's Schedule</h3>
        
        {blocks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No time blocks yet. Add one to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map(block => (
              <div
                key={block.id}
                className={`p-3 rounded-lg border-l-4 flex items-center justify-between ${
                  block.focus
                    ? 'bg-red-50 dark:bg-red-900 border-l-red-500'
                    : 'bg-blue-50 dark:bg-blue-900 border-l-blue-500'
                }`}
              >
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {block.activity}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {block.time} - {getEndTime(block.time, block.duration)} ({block.duration} min)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {block.focus && (
                    <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded font-medium">
                      Focus
                    </span>
                  )}
                  <button
                    onClick={() => deleteBlock(block.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm text-green-800 dark:text-green-100">
        <strong>💡 Time Blocking Tips:</strong>
        <ul className="mt-2 space-y-1">
          <li>• Block dedicated focus time for deep work</li>
          <li>• Include breaks to avoid burnout</li>
          <li>• Group similar tasks together</li>
          <li>• Leave buffer time between important meetings</li>
        </ul>
      </div>
    </div>
  );
}
