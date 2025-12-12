import { useState } from 'react';

export default function MileageReimbursement(){
  const [miles, setMiles] = useState<number>(100);
  const [rate, setRate] = useState<number>(0.655);
  const reimbursement = miles * rate;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Mileage Reimbursement</h2>
      <label>Miles
        <input className="input-field" value={miles} onChange={e=>setMiles(parseFloat(e.target.value)||0)} />
      </label>
      <label>Rate ($ per mile)
        <input className="input-field" value={rate} onChange={e=>setRate(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Reimbursement: ${reimbursement.toFixed(2)}</div>
    </div>
  );
}
