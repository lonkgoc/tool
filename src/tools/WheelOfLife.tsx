import { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';

interface WheelSegment {
  id: string;
  category: string;
  score: number; // 0-10
  notes: string;
}

const DEFAULT_SEGMENTS = [
  { id: '1', category: 'Health & Fitness', score: 5, notes: '' },
  { id: '2', category: 'Family & Friends', score: 5, notes: '' },
  { id: '3', category: 'Career & Purpose', score: 5, notes: '' },
  { id: '4', category: 'Personal Growth', score: 5, notes: '' },
  { id: '5', category: 'Finance', score: 5, notes: '' },
  { id: '6', category: 'Recreation & Fun', score: 5, notes: '' },
  { id: '7', category: 'Mental Health', score: 5, notes: '' },
  { id: '8', category: 'Environment & Home', score: 5, notes: '' },
];

export default function WheelOfLife() {
  const [segments, setSegments] = useState<WheelSegment[]>(() => {
    const saved = localStorage.getItem('wheelOfLife');
    return saved ? JSON.parse(saved) : DEFAULT_SEGMENTS;
  });
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('wheelOfLife', JSON.stringify(segments));
  }, [segments]);

  const updateScore = (id: string, score: number) => {
    setSegments(segments.map(s => (s.id === id ? { ...s, score: Math.min(10, Math.max(0, score)) } : s)));
  };

  const updateNotes = (id: string, notes: string) => {
    setSegments(segments.map(s => (s.id === id ? { ...s, notes } : s)));
  };

  const addSegment = () => {
    const newId = (Math.max(...segments.map(s => parseInt(s.id) || 0)) + 1).toString();
    setSegments([
      ...segments,
      { id: newId, category: `Area ${newId}`, score: 5, notes: '' },
    ]);
  };

  const deleteSegment = (id: string) => {
    setSegments(segments.filter(s => s.id !== id));
    if (selectedSegment === id) setSelectedSegment(null);
  };

  const averageScore = segments.length > 0 ? segments.reduce((sum, s) => sum + s.score, 0) / segments.length : 0;
  const lowScores = segments.filter(s => s.score <= 4);
  const highScores = segments.filter(s => s.score >= 8);

  // SVG visualization
  const radius = 150;
  const centerX = 200;
  const centerY = 200;
  const segmentAngle = (360 / segments.length) * (Math.PI / 180);

  const getPoint = (index: number, distance: number) => {
    const angle = index * segmentAngle - Math.PI / 2;
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle),
    };
  };

  const points = segments.map((segment, idx) => {
    const scoreDistance = (segment.score / 10) * radius;
    return getPoint(idx, scoreDistance);
  });

  const pathData = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  return (
    <div className="space-y-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Visualization */}
        <div className="lg:col-span-1 flex justify-center items-start">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <svg width="400" height="400" viewBox="0 0 400 400" className="w-full max-w-sm">
              {/* Background circles */}
              {[2, 4, 6, 8, 10].map(score => (
                <circle
                  key={score}
                  cx={centerX}
                  cy={centerY}
                  r={(score / 10) * radius}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  className="dark:stroke-slate-700"
                />
              ))}

              {/* Radial lines */}
              {segments.map((_, idx) => {
                const p = getPoint(idx, radius);
                return (
                  <line
                    key={`line-${idx}`}
                    x1={centerX}
                    y1={centerY}
                    x2={p.x}
                    y2={p.y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    className="dark:stroke-slate-700"
                  />
                );
              })}

              {/* Polygon */}
              <path
                d={pathData}
                fill="url(#gradient)"
                fillOpacity="0.6"
                stroke="#3b82f6"
                strokeWidth="2"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Points and labels */}
              {segments.map((segment, idx) => {
                const p = getPoint(idx, radius + 30);
                const centerP = getPoint(idx, radius / 2);
                return (
                  <g key={`label-${idx}`}>
                    <circle
                      cx={centerP.x}
                      cy={centerP.y}
                      r="6"
                      fill="#3b82f6"
                      opacity="0.8"
                      cursor="pointer"
                      onClick={() => setSelectedSegment(segment.id)}
                    />
                    <text
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      fill="#1f2937"
                      className="dark:fill-slate-100"
                      pointerEvents="none"
                    >
                      {segment.category.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
              Average Score: <strong className="text-lg">{averageScore.toFixed(1)}/10</strong>
            </p>
          </div>
        </div>

        {/* Segments List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {highScores.length}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">Strong Areas (8+)</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {lowScores.length}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">Areas to Improve (≤4)</div>
            </div>
          </div>

          {/* Segments Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Life Areas
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {segments.map(segment => (
                <div
                  key={segment.id}
                  onClick={() => setSelectedSegment(segment.id)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSegment === segment.id
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {segment.category}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        segment.score >= 8
                          ? 'text-green-600 dark:text-green-400'
                          : segment.score >= 6
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : segment.score >= 4
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {segment.score}/10
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={segment.score}
                      onChange={(e) => updateScore(segment.id, parseInt(e.target.value))}
                      className="w-full"
                    />

                    {selectedSegment === segment.id && (
                      <div className="space-y-2">
                        <textarea
                          value={segment.notes}
                          onChange={(e) => updateNotes(segment.id, e.target.value)}
                          placeholder="Notes for improvement..."
                          className="w-full input-field resize-none h-20 text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addSegment();
                            }}
                            className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                          >
                            <Plus className="w-3 h-3 inline mr-1" /> Add Area
                          </button>
                          {segments.length > 4 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSegment(segment.id);
                              }}
                              className="text-xs px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {lowScores.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
            🎯 Areas to Improve
          </h3>
          <div className="space-y-2">
            {lowScores.map(segment => (
              <div key={segment.id} className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-300 font-bold">•</span>
                <div>
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    {segment.category} ({segment.score}/10)
                  </p>
                  {segment.notes && (
                    <p className="text-sm text-amber-800 dark:text-amber-200">{segment.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
        <strong>🎡 Wheel of Life Overview</strong>
        <ul className="mt-2 space-y-1">
          <li>• Assess all major life areas on a scale of 1-10</li>
          <li>• Visualize balance across different domains</li>
          <li>• Identify growth opportunities</li>
          <li>• Set goals to improve lower-scoring areas</li>
        </ul>
      </div>
    </div>
  );
}
