import { useState } from 'react';

export default function OvertimePay(){
  const [hourly, setHourly] = useState<number>(20);
  const [hours, setHours] = useState<number>(50);
  const overtimeRate = 1.5;
  const regularHours = Math.min(40, hours);
  const overtimeHours = Math.max(0, hours - 40);
  const pay = regularHours*hourly + overtimeHours*hourly*overtimeRate;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Overtime Pay</h2>
      <label>Hourly Rate ($)
        <input className="input-field" value={hourly} onChange={e=>setHourly(parseFloat(e.target.value)||0)} />
      </label>
      <label>Total Hours
        <input className="input-field" value={hours} onChange={e=>setHours(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Estimated Pay: ${pay.toFixed(2)}</div>
    </div>
  );
}
