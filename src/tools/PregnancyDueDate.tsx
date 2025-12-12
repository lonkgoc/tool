import { useState } from 'react';

export default function PregnancyDueDate() {
  const [lmp, setLmp] = useState('2024-11-30');
  
  const lmpDate = new Date(lmp);
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

  const today = new Date();
  const weeksPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pregnancy Due Date Calculator</h2>
      
      <label>
        Last Menstrual Period (LMP)
        <input type="date" value={lmp} onChange={e => setLmp(e.target.value)} className="input-field" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900 dark:to-rose-900 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-300">Due Date</div>
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{dueDate.toLocaleDateString()}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">40 weeks from LMP</div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
          <div className="text-sm text-slate-600 dark:text-slate-400">Weeks Pregnant</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{weeksPregnant}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">~{Math.floor(weeksPregnant / 4)} months</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Time Until Due Date</div>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{daysRemaining} days</div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-2">
        <div className="font-medium">👶 Pregnancy Milestones</div>
        <div>Weeks 1-12: First Trimester</div>
        <div>Weeks 13-27: Second Trimester</div>
        <div>Weeks 28-40: Third Trimester</div>
      </div>
    </div>
  );
}
