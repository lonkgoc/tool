import { useState } from 'react';

export default function BillSplitter(){
  const [subtotal, setSubtotal] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(8);
  const [tip, setTip] = useState<number>(15);
  const [people, setPeople] = useState<number>(2);

  const total = subtotal * (1 + taxRate/100) * (1 + tip/100);
  const per = people>0 ? total/people : total;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bill Splitter</h2>
      <div className="grid grid-cols-2 gap-4">
        <label>
          Subtotal ($)
          <input type="number" value={subtotal} onChange={(e)=>setSubtotal(parseFloat(e.target.value)||0)} className="input-field" />
        </label>
        <label>
          Tax Rate (%)
          <input type="number" value={taxRate} onChange={(e)=>setTaxRate(parseFloat(e.target.value)||0)} className="input-field" />
        </label>
        <label>
          Tip (%)
          <input type="number" value={tip} onChange={(e)=>setTip(parseFloat(e.target.value)||0)} className="input-field" />
        </label>
        <label>
          People
          <input type="number" value={people} onChange={(e)=>setPeople(parseInt(e.target.value)||1)} className="input-field" />
        </label>
      </div>
      <div className="p-4 bg-white dark:bg-slate-900 rounded-md">
        <div className="text-sm">Total:</div>
        <div className="text-2xl font-bold">${total.toFixed(2)}</div>
        <div className="text-sm">Each pays: ${per.toFixed(2)}</div>
      </div>
    </div>
  );
}
