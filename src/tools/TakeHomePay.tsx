import { useState } from 'react';

export default function TakeHomePay(){
  const [gross, setGross] = useState<number>(5000);
  const [taxPct, setTaxPct] = useState<number>(20);
  const [otherDeductions, setOtherDeductions] = useState<number>(200);

  const net = gross * (1 - taxPct/100) - otherDeductions;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Take-Home Pay</h2>
      <label>Gross Pay ($)
        <input className="input-field" value={gross} onChange={e=>setGross(parseFloat(e.target.value)||0)} />
      </label>
      <label>Tax (%)
        <input className="input-field" value={taxPct} onChange={e=>setTaxPct(parseFloat(e.target.value)||0)} />
      </label>
      <label>Other Deductions ($)
        <input className="input-field" value={otherDeductions} onChange={e=>setOtherDeductions(parseFloat(e.target.value)||0)} />
      </label>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">Estimated Take-Home: ${net.toFixed(2)}</div>
    </div>
  );
}
