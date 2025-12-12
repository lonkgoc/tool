import { useState } from 'react';
import { Plus, Trash2, TrendingUp } from 'lucide-react';

interface OKR {
  id: string;
  objective: string;
  keyResults: { id: string; text: string; progress: number }[];
  quarter: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export default function OKRTracker() {
  const [okrs, setOKRs] = useState<OKR[]>(() => {
    const saved = localStorage.getItem('okrs');
    return saved ? JSON.parse(saved) : [];
  });
  const [newObjective, setNewObjective] = useState('');
  const [selectedOKR, setSelectedOKR] = useState<string | null>(null);
  const [newKR, setNewKR] = useState('');

  const saveToStorage = (newOKRs: OKR[]) => {
    localStorage.setItem('okrs', JSON.stringify(newOKRs));
  };

  const addOKR = () => {
    if (!newObjective.trim()) return;

    const okr: OKR = {
      id: Date.now().toString(),
      objective: newObjective.trim(),
      keyResults: [],
      quarter: new Date().getFullYear() + ' Q' + Math.ceil((new Date().getMonth() + 1) / 3),
      status: 'not-started',
    };

    const updated = [...okrs, okr];
    setOKRs(updated);
    saveToStorage(updated);
    setNewObjective('');
  };

  const addKeyResult = (okrId: string) => {
    if (!newKR.trim()) return;

    const updated = okrs.map(o => {
      if (o.id === okrId) {
        return {
          ...o,
          keyResults: [
            ...o.keyResults,
            { id: Date.now().toString(), text: newKR.trim(), progress: 0 },
          ],
        };
      }
      return o;
    });

    setOKRs(updated);
    saveToStorage(updated);
    setNewKR('');
  };

  const updateKRProgress = (okrId: string, krId: string, progress: number) => {
    const updated = okrs.map(o => {
      if (o.id === okrId) {
        return {
          ...o,
          keyResults: o.keyResults.map(kr =>
            kr.id === krId ? { ...kr, progress: Math.max(0, Math.min(100, progress)) } : kr
          ),
        };
      }
      return o;
    });

    setOKRs(updated);
    saveToStorage(updated);
  };

  const deleteOKR = (id: string) => {
    const updated = okrs.filter(o => o.id !== id);
    setOKRs(updated);
    saveToStorage(updated);
  };

  const deleteKR = (okrId: string, krId: string) => {
    const updated = okrs.map(o => {
      if (o.id === okrId) {
        return {
          ...o,
          keyResults: o.keyResults.filter(kr => kr.id !== krId),
        };
      }
      return o;
    });

    setOKRs(updated);
    saveToStorage(updated);
  };

  const getOKRProgress = (okr: OKR) => {
    if (okr.keyResults.length === 0) return 0;
    return Math.round(
      okr.keyResults.reduce((sum, kr) => sum + kr.progress, 0) / okr.keyResults.length
    );
  };

  const statusColors = {
    'not-started': 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100',
    'completed': 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100',
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {okrs.length}
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">Objectives</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {okrs.reduce((sum, o) => sum + o.keyResults.length, 0)}
          </div>
          <div className="text-xs text-purple-700 dark:text-purple-300">Key Results</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {okrs.filter(o => o.status === 'completed').length}
          </div>
          <div className="text-xs text-green-700 dark:text-green-300">Completed</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {okrs.length > 0
              ? Math.round(okrs.reduce((sum, o) => sum + getOKRProgress(o), 0) / okrs.length)
              : 0}%
          </div>
          <div className="text-xs text-orange-700 dark:text-orange-300">Avg Progress</div>
        </div>
      </div>

      {/* Add OKR */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Objective</h3>
        
        <input
          type="text"
          value={newObjective}
          onChange={(e) => setNewObjective(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addOKR()}
          placeholder="e.g., Improve product performance..."
          className="input-field"
        />
        
        <button onClick={addOKR} className="btn-primary w-full">
          <Plus className="w-4 h-4" /> Add Objective
        </button>
      </div>

      {/* OKRs List */}
      <div className="space-y-4">
        {okrs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No OKRs yet. Add your first objective to get started!</p>
          </div>
        ) : (
          okrs.map(okr => (
            <div
              key={okr.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
            >
              {/* OKR Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {okr.objective}
                  </h4>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[okr.status]}`}>
                      {okr.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {okr.quarter}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteOKR(okr.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Overall Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {getOKRProgress(okr)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${getOKRProgress(okr)}%` }}
                  />
                </div>
              </div>

              {/* Key Results */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {okr.keyResults.map(kr => (
                  <div key={kr.id} className="bg-slate-50 dark:bg-slate-800 p-2 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-900 dark:text-slate-100">
                        {kr.text}
                      </span>
                      <button
                        onClick={() => deleteKR(okr.id, kr.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={kr.progress}
                      onChange={(e) =>
                        updateKRProgress(okr.id, kr.id, Number(e.target.value))
                      }
                      className="w-full h-1"
                    />
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {kr.progress}%
                    </div>
                  </div>
                ))}

                {selectedOKR === okr.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKR}
                      onChange={(e) => setNewKR(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyResult(okr.id);
                        }
                      }}
                      placeholder="Add key result..."
                      className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      autoFocus
                    />
                    <button
                      onClick={() => addKeyResult(okr.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => setSelectedOKR(null)}
                      className="px-2 py-1 bg-slate-400 text-white rounded text-sm font-medium hover:bg-slate-500"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedOKR(okr.id)}
                    className="w-full py-1 px-2 text-sm border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 rounded"
                  >
                    + Add Key Result
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
