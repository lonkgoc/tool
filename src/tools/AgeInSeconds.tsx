import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function AgeInSeconds() {
  const [birthDate, setBirthDate] = useState('');
  const [ageInSeconds, setAgeInSeconds] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (birthDate) {
      const interval = setInterval(() => {
        calculateAge();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [birthDate]);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const now = new Date();
    const diff = now.getTime() - birth.getTime();

    if (diff < 0) {
      setAgeInSeconds(null);
      return;
    }

    const seconds = Math.floor(diff / 1000);
    setAgeInSeconds(seconds);

    const years = Math.floor(seconds / (365.25 * 24 * 60 * 60));
    const days = Math.floor((seconds % (365.25 * 24 * 60 * 60)) / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    setBreakdown({ years, days, hours, minutes, seconds: secs });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Age in Seconds Calculator
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Enter your birth date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => {
              setBirthDate(e.target.value);
              calculateAge();
            }}
            className="w-full input-field"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {ageInSeconds !== null && (
        <div className="card">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {formatNumber(ageInSeconds)}
            </div>
            <div className="text-slate-600 dark:text-slate-400">seconds old</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(breakdown.years)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Years</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(breakdown.days)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(breakdown.hours)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(breakdown.minutes)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {formatNumber(breakdown.seconds)}
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
        </div>
      )}
    </div>
  );
}


