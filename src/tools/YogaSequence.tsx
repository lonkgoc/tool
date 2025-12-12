import { useState } from 'react';

export default function YogaSequence() {
  const [duration, setDuration] = useState(30);
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const sequences: Record<string, Record<string, string[]>> = {
    beginner: {
      '15': ['Child\'s Pose (2 min)', 'Cat-Cow (2 min)', 'Downward Dog (1 min)', 'Mountain Pose (1 min)', 'Forward Fold (1 min)', 'Savasana (8 min)'],
      '30': ['Child\'s Pose (2 min)', 'Cat-Cow (3 min)', 'Downward Dog (2 min)', 'Mountain Pose (1 min)', 'Warrior I (2 min)', 'Tree Pose (2 min)', 'Forward Fold (2 min)', 'Savasana (14 min)'],
      '60': ['Warm-up (5 min)', 'Sun Salutations (10 min)', 'Standing Poses (20 min)', 'Forward Folds (10 min)', 'Backbends (5 min)', 'Twists (5 min)', 'Savasana (5 min)'],
    },
    intermediate: {
      '30': ['Warm-up (2 min)', 'Sun Salutations A (5 min)', 'Sun Salutations B (5 min)', 'Warrior Series (8 min)', 'Triangle & Revolved (5 min)', 'Savasana (5 min)'],
      '60': ['Warm-up (3 min)', 'Sun Salutations (10 min)', 'Standing Sequences (20 min)', 'Balancing Poses (10 min)', 'Backbends (7 min)', 'Forward Folds (5 min)', 'Savasana (5 min)'],
    },
    advanced: {
      '60': ['Warm-up (3 min)', 'Sun Salutations (10 min)', 'Arm Balance Practice (15 min)', 'Inversions (10 min)', 'Deep Backbends (10 min)', 'Cool Down (7 min)', 'Savasana (5 min)'],
    },
  };

  const sequence = sequences[level]?.[String(duration)] || sequences[level]['30'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Yoga Sequence Generator</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <label>
          Duration (minutes)
          <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="input-field">
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </label>
        <label>
          Level
          <select value={level} onChange={e => setLevel(e.target.value as any)} className="input-field">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 px-4 py-3">
          <div className="font-semibold capitalize">{level} - {duration} Minutes</div>
        </div>
        <div className="p-4 space-y-3">
          {sequence.map((pose, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded">
              <div className="text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">{idx + 1}.</div>
              <div className="text-sm">{pose}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">🧘 Tips</div>
        <div>• Breathe deeply throughout the practice</div>
        <div>• Listen to your body and modify poses as needed</div>
        <div>• Savasana (corpse pose) is essential for recovery</div>
        <div>• Practice consistently for best results</div>
      </div>
    </div>
  );
}
