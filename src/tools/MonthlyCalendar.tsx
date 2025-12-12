import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: string[];
}

export default function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('calendarEvents');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState('');

  const saveEvents = (newEvents: Record<string, string[]>) => {
    localStorage.setItem('calendarEvents', JSON.stringify(newEvents));
    setEvents(newEvents);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    
    const days: CalendarDay[] = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = today.toISOString().split('T')[0] === dateStr;
      
      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        events: events[dateStr] || [],
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    return days;
  };

  const addEvent = () => {
    if (!selectedDate || !newEvent.trim()) return;

    const updated = { ...events };
    if (!updated[selectedDate]) {
      updated[selectedDate] = [];
    }
    updated[selectedDate].push(newEvent.trim());
    saveEvents(updated);
    setNewEvent('');
  };

  const deleteEvent = (date: string, index: number) => {
    const updated = { ...events };
    updated[date] = updated[date].filter((_, i) => i !== index);
    if (updated[date].length === 0) {
      delete updated[date];
    }
    saveEvents(updated);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDayDateStr = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return null;
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Month Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {monthName}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center font-semibold text-slate-700 dark:text-slate-300 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
        {calendarDays.map((day, idx) => {
          const dateStr = getDayDateStr(day);
          const isSelected = dateStr === selectedDate;
          
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(day.isCurrentMonth ? dateStr : null)}
              className={`min-h-20 p-1 rounded text-sm transition-colors ${
                day.isCurrentMonth
                  ? day.isToday
                    ? 'bg-blue-500 text-white font-bold'
                    : isSelected
                    ? 'bg-blue-300 dark:bg-blue-700'
                    : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <div className="font-semibold">{day.date}</div>
              {day.isCurrentMonth && day.events.length > 0 && (
                <div className="text-xs mt-1 text-left">
                  {day.events.slice(0, 2).map((event, i) => (
                    <div key={i} className="truncate text-blue-600 dark:text-blue-400">
                      {event}
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-blue-600 dark:text-blue-400">+{day.events.length - 2}</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Event Details */}
      {selectedDate && (
        <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              {new Date(selectedDate).toLocaleDateString('default', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
          </div>

          {/* Add Event */}
          <div className="space-y-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEvent()}
              placeholder="Add event..."
              className="input-field"
            />
            <button onClick={addEvent} className="btn-primary w-full">
              Add Event
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-2">
            {events[selectedDate] && events[selectedDate].length > 0 ? (
              events[selectedDate].map((event, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white dark:bg-slate-800 p-3 rounded border border-blue-200 dark:border-blue-700"
                >
                  <span className="text-slate-900 dark:text-slate-100">{event}</span>
                  <button
                    onClick={() => deleteEvent(selectedDate, i)}
                    className="text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm">No events</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
