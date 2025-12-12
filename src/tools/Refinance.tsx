import { useState } from 'react';

export default function Refinance(){
  const [oldPayment, setOldPayment] = useState<number>(1500);
  const [newPayment, setNewPayment] = useState<number>(1200);
  const [costs, setCosts] = useState<number>(3000);

  const monthlySaving = oldPayment - newPayment;
  const monthsToBreakEven = monthlySaving>0 ? Math.ceil(costs / monthlySaving) : Infinity;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Refinance Break-Even</h2>
      <label>Old monthly payment ($)
        <input className="input-field" value={oldPayment} onChange={e=>setOldPayment(parseFloat(e.target.value)||0)} />
      </label>
      <label>New monthly payment ($)
        <input className="input-field" value={newPayment} onChange={e=>setNewPayment(parseFloat(e.target.value)||0)} />
      </label>
      <label>Refinancing costs ($)
        <input className="input-field" value={costs} onChange={e=>setCosts(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Months to break even: {monthsToBreakEven===Infinity? 'No savings' : monthsToBreakEven}</div>
    </div>
  );
}
