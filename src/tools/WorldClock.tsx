import { useState, useEffect } from 'react';
import { Plus, X, Globe, Clock } from 'lucide-react';

interface Timezone {
  id: string;
  name: string;
  timezone: string;
}

const popularTimezones: Timezone[] = [
  { id: 'utc', name: 'UTC', timezone: 'UTC' },
  { id: 'ny', name: 'New York', timezone: 'America/New_York' },
  { id: 'la', name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { id: 'chicago', name: 'Chicago', timezone: 'America/Chicago' },
  { id: 'toronto', name: 'Toronto', timezone: 'America/Toronto' },
  { id: 'london', name: 'London', timezone: 'Europe/London' },
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris' },
  { id: 'berlin', name: 'Berlin', timezone: 'Europe/Berlin' },
  { id: 'moscow', name: 'Moscow', timezone: 'Europe/Moscow' },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { id: 'shanghai', name: 'Shanghai', timezone: 'Asia/Shanghai' },
  { id: 'hongkong', name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore' },
  { id: 'mumbai', name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { id: 'dubai', name: 'Dubai', timezone: 'Asia/Dubai' },
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney' },
  { id: 'auckland', name: 'Auckland', timezone: 'Pacific/Auckland' },
  { id: 'saopaulo', name: 'São Paulo', timezone: 'America/Sao_Paulo' },
];

export default function WorldClock() {
  const [clocks, setClocks] = useState<Timezone[]>(() => {
    const saved = localStorage.getItem('worldClocks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Validate that the saved data maps to valid timezones
        return parsed.filter((c: Timezone) =>
          popularTimezones.some(p => p.id === c.id)
        );
      } catch {
        return [popularTimezones[0]];
      }
    }
    return [popularTimezones[0]];
  });

  const [currentTime, setCurrentTime] = useState<Record<string, { time: string; date: string; offset: string }>>({});
  const [localTimezone, setLocalTimezone] = useState('');
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Save clocks to localStorage
  useEffect(() => {
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
  }, [clocks]);

  // Detect local timezone
  useEffect(() => {
    try {
      setLocalTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setLocalTimezone('Unknown');
    }
  }, []);

  // Update times every second
  useEffect(() => {
    const updateTime = () => {
      const times: Record<string, { time: string; date: string; offset: string }> = {};
      const now = new Date();

      clocks.forEach(clock => {
        try {
          const time = now.toLocaleString('en-US', {
            timeZone: clock.timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          });

          const date = now.toLocaleString('en-US', {
            timeZone: clock.timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          // Calculate offset from local time
          const localOffset = now.getTimezoneOffset();
          const tzDate = new Date(now.toLocaleString('en-US', { timeZone: clock.timezone }));
          const localDate = new Date(now.toLocaleString('en-US', { timeZone: localTimezone || 'UTC' }));
          const diffMs = tzDate.getTime() - localDate.getTime();
          const diffHours = Math.round(diffMs / (1000 * 60 * 60));

          let offset = '';
          if (diffHours > 0) {
            offset = `+${diffHours}h`;
          } else if (diffHours < 0) {
            offset = `${diffHours}h`;
          } else {
            offset = 'Same time';
          }

          times[clock.id] = { time, date, offset };
        } catch (e) {
          times[clock.id] = { time: 'Invalid', date: '', offset: '' };
        }
      });
      setCurrentTime(times);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clocks, localTimezone]);

  const addClock = (timezone: Timezone) => {
    if (!clocks.find(c => c.id === timezone.id)) {
      setClocks([...clocks, timezone]);
    }
    setShowAddPanel(false);
  };

  const removeClock = (id: string) => {
    setClocks(clocks.filter(c => c.id !== id));
  };

  const availableTimezones = popularTimezones.filter(tz => !clocks.find(c => c.id === tz.id));

  // Determine if it's day or night for a timezone (rough estimate)
  const isDaytime = (tzId: string) => {
    const timeStr = currentTime[tzId]?.time || '';
    const hourMatch = timeStr.match(/^(\d+):/);
    if (hourMatch) {
      const hour = parseInt(hourMatch[1]);
      const isPM = timeStr.includes('PM');
      const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
      return hour24 >= 6 && hour24 < 18;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Local Time Indicator */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-100">
          <Clock className="w-4 h-4" />
          <strong>Your timezone:</strong> {localTimezone}
        </div>
      </div>

      {/* Clock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clocks.map(clock => {
          const data = currentTime[clock.id];
          const isDay = isDaytime(clock.id);

          return (
            <div
              key={clock.id}
              className={`card relative overflow-hidden ${isDay
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700'
                  : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800'
                }`}
            >
              {/* Day/Night Indicator */}
              <div className="absolute top-2 left-2 text-lg">
                {isDay ? '☀️' : '🌙'}
              </div>

              <button
                onClick={() => removeClock(clock.id)}
                className="absolute top-2 right-2 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Remove clock"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{clock.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{clock.timezone}</p>
                  </div>
                </div>

                <div className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {data?.time || 'Loading...'}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {data?.date || ''}
                  </span>
                  {data?.offset && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${data.offset === 'Same time'
                        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'
                      }`}>
                      {data.offset}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Timezone Section */}
      <div className="card">
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="w-full flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Timezone</span>
        </button>

        {showAddPanel && availableTimezones.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableTimezones.map(timezone => (
                <button
                  key={timezone.id}
                  onClick={() => addClock(timezone)}
                  className="btn-secondary text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  {timezone.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {showAddPanel && availableTimezones.length === 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-slate-500">
            All timezones have been added!
          </div>
        )}
      </div>
    </div>
  );
}
