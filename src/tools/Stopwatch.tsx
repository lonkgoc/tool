import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, RotateCcw, Download, Flag } from 'lucide-react';

interface Lap {
  number: number;
  time: number;
  diff: number;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10) as unknown as number;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  const formatTime = (ms: number, includeHundredths = true) => {
    const hours = Math.floor(ms / 3600000);
    const totalSeconds = Math.floor((ms % 3600000) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);

    let result = '';
    if (hours > 0) {
      result = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      result = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    if (includeHundredths) {
      result += `.${String(centiseconds).padStart(2, '0')}`;
    }

    return result;
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const start = () => setRunning(true);
  const pause = () => setRunning(false);

  const reset = () => {
    setTime(0);
    setLaps([]);
    setRunning(false);
  };

  const lap = () => {
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
    const diff = time - lastLapTime;
    const newLap: Lap = {
      number: laps.length + 1,
      time: time,
      diff: diff
    };
    setLaps([...laps, newLap]);
  };

  // Find fastest and slowest laps (by diff time)
  const getFastestLap = () => {
    if (laps.length < 2) return -1;
    let fastestIdx = 0;
    let fastestDiff = laps[0].diff;
    laps.forEach((lap, idx) => {
      if (lap.diff < fastestDiff) {
        fastestDiff = lap.diff;
        fastestIdx = idx;
      }
    });
    return fastestIdx;
  };

  const getSlowestLap = () => {
    if (laps.length < 2) return -1;
    let slowestIdx = 0;
    let slowestDiff = laps[0].diff;
    laps.forEach((lap, idx) => {
      if (lap.diff > slowestDiff) {
        slowestDiff = lap.diff;
        slowestIdx = idx;
      }
    });
    return slowestIdx;
  };

  const exportLapsCSV = () => {
    if (laps.length === 0) {
      showNotification('No laps to export');
      return;
    }

    const header = 'Lap Number,Lap Time,Split Time,Total Time\n';
    const rows = laps.map(lap => {
      return `${lap.number},${formatTime(lap.diff, false)},${formatTime(lap.diff, true)},${formatTime(lap.time, true)}`;
    }).join('\n');

    const summary = `\n\nSummary\nTotal Time,${formatTime(time, true)}\nTotal Laps,${laps.length}\n`;
    const content = header + rows + summary;

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stopwatch-laps-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Laps exported to CSV!');
  };

  const fastestLap = getFastestLap();
  const slowestLap = getSlowestLap();

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      {/* Main Stopwatch Display */}
      <div className="card text-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
        <div className="text-6xl md:text-7xl font-bold text-blue-600 dark:text-blue-400 mb-6 font-mono tracking-wide">
          {formatTime(time)}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {!running ? (
            <button onClick={start} className="btn-primary flex items-center space-x-2">
              <Play className="w-5 h-5" />
              <span>Start</span>
            </button>
          ) : (
            <button onClick={pause} className="btn-secondary flex items-center space-x-2">
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </button>
          )}
          <button
            onClick={lap}
            disabled={!running}
            className={`btn-secondary flex items-center space-x-2 ${!running ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flag className="w-5 h-5" />
            <span>Lap</span>
          </button>
          <button onClick={reset} className="btn-secondary flex items-center space-x-2">
            <Square className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Laps Section */}
      {laps.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Lap Times ({laps.length})
            </h3>
            <button
              onClick={exportLapsCSV}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Lap headers */}
          <div className="grid grid-cols-3 gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 px-3">
            <span>Lap</span>
            <span className="text-center">Split</span>
            <span className="text-right">Total</span>
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto">
            {[...laps].reverse().map((lapItem, reverseIdx) => {
              const idx = laps.length - 1 - reverseIdx;
              const isFastest = idx === fastestLap;
              const isSlowest = idx === slowestLap;

              return (
                <div
                  key={lapItem.number}
                  className={`grid grid-cols-3 gap-2 p-3 rounded-lg transition-colors ${isFastest
                    ? 'bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700'
                    : isSlowest
                      ? 'bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700'
                      : 'bg-white/50 dark:bg-slate-700/50'
                    }`}
                >
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    Lap {lapItem.number}
                    {isFastest && <span title="Fastest">🏆</span>}
                    {isSlowest && <span title="Slowest">🐢</span>}
                  </span>
                  <span className={`font-mono font-semibold text-center ${isFastest
                    ? 'text-green-600 dark:text-green-400'
                    : isSlowest
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-slate-900 dark:text-slate-100'
                    }`}>
                    +{formatTime(lapItem.diff)}
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 text-right">
                    {formatTime(lapItem.time)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Statistics */}
          {laps.length >= 2 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatTime(laps[fastestLap]?.diff || 0)}
                </div>
                <div className="text-xs text-slate-500">Fastest Lap</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatTime(Math.round(laps.reduce((sum, l) => sum + l.diff, 0) / laps.length))}
                </div>
                <div className="text-xs text-slate-500">Average</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatTime(laps[slowestLap]?.diff || 0)}
                </div>
                <div className="text-xs text-slate-500">Slowest Lap</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
