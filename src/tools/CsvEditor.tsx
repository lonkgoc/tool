import { useState, useRef } from 'react';
import { Table, Upload, Download, Plus, Trash2, Save, ArrowUpDown, Search } from 'lucide-react';

interface Row {
    id: string;
    cells: string[];
}

export default function CsvEditor() {
    const [headers, setHeaders] = useState<string[]>(['Column 1', 'Column 2', 'Column 3']);
    const [rows, setRows] = useState<Row[]>([
        { id: '1', cells: ['', '', ''] },
        { id: '2', cells: ['', '', ''] },
        { id: '3', cells: ['', '', ''] },
    ]);
    const [fileName, setFileName] = useState('data');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            const lines = content.split('\n').filter(l => l.trim());

            if (lines.length === 0) return;

            // Parse headers
            const headerLine = lines[0];
            const parsedHeaders = parseCSVLine(headerLine);
            setHeaders(parsedHeaders);

            // Parse data rows
            const dataRows: Row[] = [];
            for (let i = 1; i < lines.length; i++) {
                const cells = parseCSVLine(lines[i]);
                // Ensure row has same number of cells as headers
                while (cells.length < parsedHeaders.length) cells.push('');
                dataRows.push({ id: Date.now().toString() + i, cells });
            }
            setRows(dataRows.length > 0 ? dataRows : [{ id: '1', cells: parsedHeaders.map(() => '') }]);
            setFileName(file.name.replace('.csv', ''));
        };
        reader.readAsText(file);
    };

    const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };

    const updateCell = (rowId: string, cellIndex: number, value: string) => {
        setRows(rows.map(row =>
            row.id === rowId
                ? { ...row, cells: row.cells.map((c, i) => i === cellIndex ? value : c) }
                : row
        ));
    };

    const updateHeader = (index: number, value: string) => {
        setHeaders(headers.map((h, i) => i === index ? value : h));
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now().toString(), cells: headers.map(() => '') }]);
    };

    const deleteRow = (id: string) => {
        if (rows.length > 1) {
            setRows(rows.filter(r => r.id !== id));
        }
    };

    const addColumn = () => {
        setHeaders([...headers, `Column ${headers.length + 1}`]);
        setRows(rows.map(row => ({ ...row, cells: [...row.cells, ''] })));
    };

    const deleteColumn = (index: number) => {
        if (headers.length > 1) {
            setHeaders(headers.filter((_, i) => i !== index));
            setRows(rows.map(row => ({ ...row, cells: row.cells.filter((_, i) => i !== index) })));
        }
    };

    const handleSort = (columnIndex: number) => {
        const newDirection = sortColumn === columnIndex && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(columnIndex);
        setSortDirection(newDirection);

        const sortedRows = [...rows].sort((a, b) => {
            const valA = a.cells[columnIndex] || '';
            const valB = b.cells[columnIndex] || '';
            const comparison = valA.localeCompare(valB, undefined, { numeric: true });
            return newDirection === 'asc' ? comparison : -comparison;
        });
        setRows(sortedRows);
    };

    const exportCSV = () => {
        const escape = (val: string) => {
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        };

        let csv = headers.map(escape).join(',') + '\n';
        rows.forEach(row => {
            csv += row.cells.map(escape).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {
        const data = rows.map(row => {
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => { obj[h] = row.cells[i] || ''; });
            return obj;
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const filteredRows = searchTerm
        ? rows.filter(row => row.cells.some(cell => cell.toLowerCase().includes(searchTerm.toLowerCase())))
        : rows;

    return (
        <div className="space-y-6">
            <div className="card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Table className="w-6 h-6 text-green-500" />
                        CSV Editor
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={exportCSV} className="btn-primary text-sm flex items-center gap-1">
                            <Download className="w-4 h-4" /> CSV
                        </button>
                        <button onClick={exportJSON} className="btn-secondary text-sm flex items-center gap-1">
                            <Download className="w-4 h-4" /> JSON
                        </button>
                    </div>
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="input-field"
                    />
                </div>

                {/* File Name & Search */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            File Name
                        </label>
                        <input
                            type="text"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Filter rows..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border border-slate-200 dark:border-slate-700 p-1 w-10">#</th>
                                {headers.map((header, i) => (
                                    <th key={i} className="border border-slate-200 dark:border-slate-700 p-1 min-w-[120px]">
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                value={header}
                                                onChange={(e) => updateHeader(i, e.target.value)}
                                                className="w-full bg-transparent font-medium text-sm p-1"
                                            />
                                            <button onClick={() => handleSort(i)} className="text-slate-400 hover:text-slate-600">
                                                <ArrowUpDown className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => deleteColumn(i)} className="text-red-400 hover:text-red-600">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="border border-slate-200 dark:border-slate-700 p-1 w-10">
                                    <button onClick={addColumn} className="text-green-500 hover:text-green-600">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row, rowIndex) => (
                                <tr key={row.id}>
                                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-center text-xs text-slate-400">
                                        {rowIndex + 1}
                                    </td>
                                    {row.cells.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border border-slate-200 dark:border-slate-700 p-1">
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => updateCell(row.id, cellIndex, e.target.value)}
                                                className="w-full bg-transparent text-sm p-1"
                                            />
                                        </td>
                                    ))}
                                    <td className="border border-slate-200 dark:border-slate-700 p-1 text-center">
                                        <button onClick={() => deleteRow(row.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button onClick={addRow} className="btn-secondary w-full flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" /> Add Row
                </button>

                <div className="mt-4 text-sm text-slate-500">
                    {headers.length} columns × {rows.length} rows
                    {searchTerm && ` (showing ${filteredRows.length})`}
                </div>
            </div>
        </div>
    );
}
