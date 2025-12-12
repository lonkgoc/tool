import { useState } from 'react';
import { Plus, Trash2, Printer, Download, Receipt } from 'lucide-react';

interface InvoiceItem {
    id: number;
    description: string;
    qty: number;
    price: number;
}

export default function InvoiceGenerator() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [number, setNumber] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<InvoiceItem[]>([
        { id: 1, description: 'Service / Product', qty: 1, price: 100 }
    ]);
    const [taxRate, setTaxRate] = useState(0);
    const [currency, setCurrency] = useState('$');

    const addItem = () => {
        setItems([...items, { id: Math.random(), description: '', qty: 1, price: 0 }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(i => i.id !== id));
    };

    const updateItem = (id: number, field: keyof InvoiceItem, value: any) => {
        setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
    };

    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Actions Bar */}
            <div className="flex justify-end gap-4 mb-6 print:hidden">
                <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
                    <Printer className="w-5 h-5" /> Print / Save PDF
                </button>
            </div>

            {/* Invoice Paper */}
            <div className="bg-white text-slate-900 shadow-xl print:shadow-none p-8 md:p-12 rounded-xl min-h-[1000px] border border-slate-200">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                <Receipt className="w-7 h-7" />
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">INVOICE</h1>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">From</label>
                                <textarea
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    placeholder="Your Name / Business\nAddress\nContact Info"
                                    className="w-full md:w-64 p-2 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none resize-none bg-transparent"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-0 text-right space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Invoice Info</label>
                            <div className="flex justify-end items-center gap-4 mb-2">
                                <span className="text-slate-600">No.</span>
                                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} className="text-right font-mono p-1 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 w-32" />
                            </div>
                            <div className="flex justify-end items-center gap-4">
                                <span className="text-slate-600">Date</span>
                                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-right font-mono p-1 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 w-36" />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Bill To</label>
                            <textarea
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="Client Name\nAddress"
                                className="w-full md:w-64 text-right p-2 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none resize-none bg-transparent"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-12">
                    <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-slate-900 font-bold text-sm uppercase text-slate-600">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2 text-right">Qty</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Total</div>
                    </div>

                    <div className="space-y-4 mt-6">
                        {items.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                                <div className="col-span-6 flex gap-2">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                        placeholder="Item description"
                                        className="w-full bg-transparent p-1 focus:outline-none focus:border-b border-blue-500"
                                    />
                                </div>
                                <div className="col-span-2 text-right">
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                                        className="w-full text-right bg-transparent p-1 focus:outline-none focus:border-b border-blue-500"
                                    />
                                </div>
                                <div className="col-span-2 text-right">
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                                        className="w-full text-right bg-transparent p-1 focus:outline-none focus:border-b border-blue-500"
                                    />
                                </div>
                                <div className="col-span-2 text-right font-medium">
                                    {currency}{(item.qty * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 print:hidden">
                        <button onClick={addItem} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Line Item
                        </button>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>{currency}{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 items-center">
                            <span className="flex items-center gap-2">
                                Tax Rate (%)
                                <input
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(Number(e.target.value))}
                                    className="w-12 text-center border-b border-slate-300 focus:border-blue-500 bg-transparent text-sm print:hidden"
                                />
                                <span className="hidden print:inline">{taxRate}%</span>
                            </span>
                            <span>{currency}{tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-slate-900">
                            <span>Total</span>
                            <span>{currency}{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-24 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm">
                    <p>Thank you for your business!</p>
                </div>
            </div>

            {/* Currency Config */}
            <div className="mt-8 flex justify-center gap-4 print:hidden">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm">
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Currency Symbol:</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent border-none font-mono">
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="£">£ (GBP)</option>
                        <option value="¥">¥ (JPY)</option>
                        <option value="₹">₹ (INR)</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
