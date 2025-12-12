import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function DaysUntil() {
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (targetDate) {
      const interval = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      calculateTimeLeft();
      return () => clearInterval(interval);
    }
  }, [targetDate]);

  const calculateTimeLeft = () => {
    if (!targetDate) return;

    const target = new Date(targetDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeLeft({ days, hours, minutes, seconds });
  };

  const isPast = () => {
    if (!targetDate) return false;
    return new Date(targetDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Days Until Calculator
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Select target date
          </label>
          <input
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full input-field"
          />
        </div>
      </div>

      {targetDate && (
        <div className="card">
          {isPast() ? (
            <div className="text-center py-8">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                This date has passed
              </div>
              <p className="text-slate-500 dark:text-slate-500">
                Please select a future date
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {timeLeft.days}
                </div>
                <div className="text-slate-600 dark:text-slate-400">days remaining</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Seconds</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Updates every second</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}


