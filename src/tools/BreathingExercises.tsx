import { useState, useEffect } from 'react';

export default function BreathingExercises() {
  const [exercise, setExercise] = useState<'box' | 'diaphragm' | '478'>('box');
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);

  const exercises: Record<string, { in: number; hold: number; out: number; label: Record<string, string> }> = {
    box: { in: 4, hold: 4, out: 4, label: { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale' } },
    diaphragm: { in: 4, hold: 0, out: 8, label: { inhale: 'Inhale', hold: '', exhale: 'Exhale' } },
    '478': { in: 4, hold: 7, out: 8, label: { inhale: 'Inhale', hold: 'Hold', exhale: 'Exhale' } },
  };

  const currentExercise = exercises[exercise];
  const phases = [
    { phase: 'inhale' as const, duration: currentExercise.in },
    { phase: 'hold' as const, duration: currentExercise.hold },
    { phase: 'exhale' as const, duration: currentExercise.out },
  ].filter(p => p.duration > 0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setCount(prev => {
        const nextCount = prev + 1;
        const currentPhaseObj = phases.find(p => p.phase === phase);
        const currentPhaseDuration = currentPhaseObj?.duration || 4;
        if (nextCount > currentPhaseDuration) {
          const currentIdx = phases.findIndex(p => p.phase === phase);
          if (currentIdx >= 0) {
            const nextPhase = phases[(currentIdx + 1) % phases.length];
            setPhase(nextPhase.phase);
          }
          return 0;
        }
        return nextCount;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, phase, phases]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Breathing Exercises</h2>
      
      <label>
        Exercise
        <select value={exercise} onChange={e => {setExercise(e.target.value as any); setPhase('inhale'); setCount(0);}} className="input-field">
          <option value="box">Box Breathing (4-4-4)</option>
          <option value="diaphragm">Diaphragm (4-8)</option>
          <option value="478">4-7-8 Breathing</option>
        </select>
      </label>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 p-8 rounded-lg text-center space-y-4">
        <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 capitalize">
          {currentExercise.label[phase]}
        </div>
        <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">
          {(phases.find(p => p.phase === phase)?.duration || 0) - count}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setIsRunning(!isRunning)} className={isRunning ? 'btn-secondary' : 'btn-primary'}>
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => { setIsRunning(false); setPhase('inhale'); setCount(0); }} className="btn-secondary">
            Reset
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-sm space-y-3">
        <div className="font-medium">💡 Exercise Guide</div>
        <div>
          <div className="font-medium mb-1">Box Breathing (4-4-4)</div>
          <div className="text-xs">Good for: Stress relief, focus</div>
        </div>
        <div>
          <div className="font-medium mb-1">Diaphragm (4-8)</div>
          <div className="text-xs">Good for: Relaxation, anxiety</div>
        </div>
        <div>
          <div className="font-medium mb-1">4-7-8 Breathing</div>
          <div className="text-xs">Good for: Sleep, deep relaxation</div>
        </div>
      </div>
    </div>
  );
}
