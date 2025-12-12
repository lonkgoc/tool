import { useState } from 'react';
import { Calendar, Download, Plus, Trash2, Globe } from 'lucide-react';

interface TimeSlot {
  time: string;
  timezones: Record<string, string>;
}

const popularTimezones = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai (IST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
];

export default function MeetingScheduler() {
  const [timezones, setTimezones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(17);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const generateTimeSlots = () => {
    if (startHour >= endHour) {
      showNotification('End hour must be greater than start hour');
      return;
    }

    const slots: TimeSlot[] = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const tzTimes: Record<string, string> = {};

      timezones.forEach(tz => {
        tzTimes[tz] = formatTime(time, tz);
      });

      slots.push({ time, timezones: tzTimes });
    }
    setTimeSlots(slots);
    showNotification(`Generated ${slots.length} time slots`);
  };

  const formatTime = (time: string, timezone: string) => {
    try {
      // Create a date with the selected date and base timezone (we'll use UTC as base)
      const [hours] = time.split(':').map(Number);
      const date = new Date(`${selectedDate}T${time}:00`);

      return date.toLocaleString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid';
    }
  };

  const getTimezoneLabel = (tz: string) => {
    const found = popularTimezones.find(t => t.value === tz);
    return found ? found.label.split(' ')[0] : tz.split('/').pop() || tz;
  };

  const addTimezone = () => {
    // Find a timezone not already added
    const available = popularTimezones.find(t => !timezones.includes(t.value));
    if (available) {
      setTimezones([...timezones, available.value]);
    }
  };

  const removeTimezone = (index: number) => {
    if (timezones.length > 1) {
      setTimezones(timezones.filter((_, i) => i !== index));
    }
  };

  const updateTimezone = (index: number, value: string) => {
    const newTimezones = [...timezones];
    newTimezones[index] = value;
    setTimezones(newTimezones);
  };

  const exportToTXT = () => {
    if (timeSlots.length === 0) {
      showNotification('Generate time slots first');
      return;
    }

    let content = `=== Meeting Time Comparison ===\n`;
    content += `Date: ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    content += `${'='.repeat(35)}\n\n`;

    content += `Timezones: ${timezones.map(tz => getTimezoneLabel(tz)).join(' | ')}\n\n`;

    timeSlots.forEach(slot => {
      const times = timezones.map(tz => `${getTimezoneLabel(tz)}: ${slot.timezones[tz]}`).join('  |  ');
      content += `${times}\n`;
    });

    content += `\n${'='.repeat(35)}\n`;
    content += `Generated on ${new Date().toLocaleString()}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-times-${selectedDate}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Exported to TXT!');
  };

  const exportToCSV = () => {
    if (timeSlots.length === 0) {
      showNotification('Generate time slots first');
      return;
    }

    const headers = ['Base Time (UTC)', ...timezones.map(tz => getTimezoneLabel(tz))];
    const rows = timeSlots.map(slot => {
      return [slot.time, ...timezones.map(tz => slot.timezones[tz])];
    });

    const content = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-times-${selectedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('Exported to CSV!');
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-blue-500 text-white animate-fade-in">
          {notification}
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Meeting Scheduler</span>
        </h3>

        <div className="space-y-4">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Meeting Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full input-field"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Start Hour: {startHour}:00
              </label>
              <input
                type="range"
                min="0"
                max="23"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                End Hour: {endHour}:00
              </label>
              <input
                type="range"
                min="0"
                max="24"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Timezones */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Timezones to Compare
              </label>
              <button onClick={addTimezone} className="btn-secondary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {timezones.map((tz, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={tz}
                  onChange={(e) => updateTimezone(index, e.target.value)}
                  className="flex-1 input-field"
                >
                  {popularTimezones.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {timezones.length > 1 && (
                  <button
                    onClick={() => removeTimezone(index)}
                    className="btn-secondary p-2"
                    title="Remove timezone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={generateTimeSlots} className="btn-primary w-full">
            Generate Time Slots
          </button>
        </div>
      </div>

      {/* Results Table */}
      {timeSlots.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Available Time Slots
            </h3>
            <div className="flex gap-2">
              <button onClick={exportToTXT} className="btn-secondary text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> TXT
              </button>
              <button onClick={exportToCSV} className="btn-secondary text-sm flex items-center gap-1">
                <Download className="w-4 h-4" /> CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {timezones.map((tz, i) => (
                    <th key={i} className="text-left p-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <div>{getTimezoneLabel(tz)}</div>
                      <div className="text-xs text-slate-500 font-normal">{tz}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {timezones.map((tz, j) => {
                      // Highlight business hours (9 AM - 5 PM)
                      const timeStr = slot.timezones[tz];
                      const hourMatch = timeStr.match(/^(\d+):/);
                      let isBusinessHour = false;
                      if (hourMatch) {
                        const hour = parseInt(hourMatch[1]);
                        const isPM = timeStr.includes('PM');
                        const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
                        isBusinessHour = hour24 >= 9 && hour24 < 17;
                      }

                      return (
                        <td key={j} className="p-3">
                          <span className={`font-mono text-sm px-2 py-1 rounded ${isBusinessHour
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                              : 'text-slate-600 dark:text-slate-400'
                            }`}>
                            {timeStr}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-block w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 mr-1"></span>
            Green indicates typical business hours (9 AM - 5 PM)
          </div>
        </div>
      )}
    </div>
  );
}
