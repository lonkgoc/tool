import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Workout { id: string; date: string; exercise: string; sets: number; reps: number; weight: number }

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('workoutLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const addWorkout = () => {
    if (!exercise.trim()) return;
    const newWorkout = { id: Date.now().toString(), date, exercise, sets, reps, weight };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('workoutLog', JSON.stringify(updated));
    setExercise('');
    setSets(3);
    setReps(10);
    setWeight(0);
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem('workoutLog', JSON.stringify(updated));
  };

  const todayWorkouts = workouts.filter(w => w.date === date);
  const totalVolume = todayWorkouts.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Workout Log</h2>
      
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
        <label>
          Date
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        </label>
        <label>
          Exercise
          <input type="text" value={exercise} onChange={e => setExercise(e.target.value)} placeholder="e.g., Bench Press" className="input-field" />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label>
            Sets
            <input type="number" value={sets} onChange={e => setSets(parseInt(e.target.value) || 0)} className="input-field" />
          </label>
          <label>
            Reps
            <input type="number" value={reps} onChange={e => setReps(parseInt(e.target.value) || 0)} className="input-field" />
          </label>
          <label>
            Weight (lbs)
            <input type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value) || 0)} className="input-field" />
          </label>
        </div>
        <button onClick={addWorkout} className="btn-primary w-full"><Plus className="w-4 h-4" /> Add Workout</button>
      </div>

      {todayWorkouts.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Total Volume Today</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{totalVolume.toLocaleString()} lbs</div>
        </div>
      )}

      {workouts.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="max-h-80 overflow-y-auto space-y-2 p-4">
            {workouts.map(w => (
              <div key={w.id} className="flex justify-between items-start p-3 bg-slate-50 dark:bg-slate-800 rounded">
                <div>
                  <div className="text-sm text-slate-500">{new Date(w.date).toLocaleDateString()}</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{w.exercise}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{w.sets}x{w.reps} @ {w.weight} lbs</div>
                </div>
                <button onClick={() => deleteWorkout(w.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
