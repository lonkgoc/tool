import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Decision {
  id: string;
  criteria: { id: string; name: string; weight: number }[];
  options: { id: string; name: string; scores: Record<string, number> }[];
}

export default function DecisionMatrix() {
  const [decision, setDecision] = useState<Decision>(() => {
    const saved = localStorage.getItem('decisionMatrix');
    return saved
      ? JSON.parse(saved)
      : { criteria: [], options: [] };
  });
  const [newCriteria, setNewCriteria] = useState('');
  const [newOption, setNewOption] = useState('');

  const saveToStorage = (d: Decision) => {
    localStorage.setItem('decisionMatrix', JSON.stringify(d));
  };

  const addCriteria = () => {
    if (!newCriteria.trim()) return;

    const updated: Decision = {
      ...decision,
      criteria: [
        ...decision.criteria,
        {
          id: Date.now().toString(),
          name: newCriteria.trim(),
          weight: 1,
        },
      ],
    };
    setDecision(updated);
    saveToStorage(updated);
    setNewCriteria('');
  };

  const addOption = () => {
    if (!newOption.trim()) return;

    const scores: Record<string, number> = {};
    decision.criteria.forEach(c => {
      scores[c.id] = 5;
    });

    const updated: Decision = {
      ...decision,
      options: [
        ...decision.options,
        {
          id: Date.now().toString(),
          name: newOption.trim(),
          scores,
        },
      ],
    };
    setDecision(updated);
    saveToStorage(updated);
    setNewOption('');
  };

  const updateCriteriaWeight = (id: string, weight: number) => {
    const updated: Decision = {
      ...decision,
      criteria: decision.criteria.map(c =>
        c.id === id ? { ...c, weight } : c
      ),
    };
    setDecision(updated);
    saveToStorage(updated);
  };

  const updateScore = (optionId: string, criteriaId: string, score: number) => {
    const updated: Decision = {
      ...decision,
      options: decision.options.map(o =>
        o.id === optionId
          ? {
              ...o,
              scores: { ...o.scores, [criteriaId]: score },
            }
          : o
      ),
    };
    setDecision(updated);
    saveToStorage(updated);
  };

  const deleteCriteria = (id: string) => {
    const updated: Decision = {
      ...decision,
      criteria: decision.criteria.filter(c => c.id !== id),
      options: decision.options.map(o => {
        const scores = { ...o.scores };
        delete scores[id];
        return { ...o, scores };
      }),
    };
    setDecision(updated);
    saveToStorage(updated);
  };

  const deleteOption = (id: string) => {
    const updated: Decision = {
      ...decision,
      options: decision.options.filter(o => o.id !== id),
    };
    setDecision(updated);
    saveToStorage(updated);
  };

  const calculateScore = (option: any) => {
    let total = 0;
    let weightSum = 0;
    
    decision.criteria.forEach(c => {
      const score = option.scores[c.id] || 0;
      total += score * c.weight;
      weightSum += c.weight;
    });
    
    return weightSum === 0 ? 0 : Math.round((total / weightSum) * 10) / 10;
  };

  const bestOption = decision.options.length > 0
    ? decision.options.reduce((best, opt) =>
        calculateScore(opt) > calculateScore(best) ? opt : best
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Decision Matrix
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Compare options systematically
        </p>
      </div>

      {/* Add Criteria */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Criteria</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
            placeholder="e.g., Cost, Quality, Speed..."
            className="input-field flex-1"
          />
          <button onClick={addCriteria} className="btn-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Criteria List with Weights */}
      {decision.criteria.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Criteria Weights
          </h3>
          <div className="space-y-2">
            {decision.criteria.map(c => (
              <div key={c.id} className="flex items-center gap-2">
                <span className="w-20 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {c.name}
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={c.weight}
                  onChange={(e) => updateCriteriaWeight(c.id, Number(e.target.value))}
                  className="flex-1"
                />
                <span className="w-10 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {c.weight.toFixed(1)}
                </span>
                <button
                  onClick={() => deleteCriteria(c.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Option */}
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Add Option</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addOption()}
            placeholder="e.g., Option A, Option B..."
            className="input-field flex-1"
          />
          <button onClick={addOption} className="btn-primary">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decision Matrix Table */}
      {decision.criteria.length > 0 && decision.options.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300 dark:border-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="border border-slate-300 dark:border-slate-700 p-2 text-left font-semibold">
                  Option
                </th>
                {decision.criteria.map(c => (
                  <th
                    key={c.id}
                    className="border border-slate-300 dark:border-slate-700 p-2 text-center font-semibold text-sm"
                  >
                    {c.name}
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      (w: {c.weight.toFixed(1)})
                    </div>
                  </th>
                ))}
                <th className="border border-slate-300 dark:border-slate-700 p-2 text-center font-semibold">
                  Score
                </th>
                <th className="border border-slate-300 dark:border-slate-700 p-2 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {decision.options.map(option => {
                const score = calculateScore(option);
                const isBest = score === calculateScore(bestOption);
                
                return (
                  <tr
                    key={option.id}
                    className={
                      isBest
                        ? 'bg-green-50 dark:bg-green-900'
                        : 'bg-white dark:bg-slate-900'
                    }
                  >
                    <td className="border border-slate-300 dark:border-slate-700 p-2 font-medium">
                      {option.name}
                      {isBest && <span className="ml-2 text-sm text-green-600 dark:text-green-400">✓</span>}
                    </td>
                    {decision.criteria.map(c => (
                      <td
                        key={c.id}
                        className="border border-slate-300 dark:border-slate-700 p-2 text-center"
                      >
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={option.scores[c.id] || 5}
                          onChange={(e) =>
                            updateScore(
                              option.id,
                              c.id,
                              Math.max(1, Math.min(10, Number(e.target.value)))
                            )
                          }
                          className="w-12 text-center border border-slate-300 dark:border-slate-600 rounded px-1 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </td>
                    ))}
                    <td className="border border-slate-300 dark:border-slate-700 p-2 text-center font-bold">
                      {score}
                    </td>
                    <td className="border border-slate-300 dark:border-slate-700 p-2 text-center">
                      <button
                        onClick={() => deleteOption(option.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Result */}
      {bestOption && (
        <div className="bg-green-50 dark:bg-green-900 border-2 border-green-300 dark:border-green-700 p-4 rounded-lg text-center">
          <div className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
            Best Option
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {bestOption.name}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 mt-2">
            Score: {calculateScore(bestOption)}/10
          </div>
        </div>
      )}

      {(decision.criteria.length === 0 || decision.options.length === 0) && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          Add criteria and options to build your decision matrix
        </div>
      )}
    </div>
  );
}
