import { useState } from 'react';
import { FileJson, ArrowRightLeft, Download, Copy, Check, AlertCircle } from 'lucide-react';

type ConversionType = 'json-csv' | 'csv-json' | 'json-xml' | 'xml-json' | 'json-yaml' | 'yaml-json' | 'json-toml' | 'toml-json' | 'json-excel' | 'excel-json';

interface DataConverterProps {
    initialMode?: ConversionType;
    hideTabs?: boolean;
}

export default function DataConverter({ initialMode = 'json-csv', hideTabs = false }: DataConverterProps) {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [conversionType, setConversionType] = useState<ConversionType>(initialMode);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const conversions = [
        { id: 'json-csv', label: 'JSON → CSV', from: 'JSON', to: 'CSV' },
        { id: 'csv-json', label: 'CSV → JSON', from: 'CSV', to: 'JSON' },
        { id: 'json-xml', label: 'JSON → XML', from: 'JSON', to: 'XML' },
        { id: 'xml-json', label: 'XML → JSON', from: 'XML', to: 'JSON' },
        { id: 'json-yaml', label: 'JSON → YAML', from: 'JSON', to: 'YAML' },
        { id: 'yaml-json', label: 'YAML → JSON', from: 'YAML', to: 'JSON' },
        { id: 'json-toml', label: 'JSON → TOML', from: 'JSON', to: 'TOML' },
        { id: 'toml-json', label: 'TOML → JSON', from: 'TOML', to: 'JSON' },
        { id: 'json-excel', label: 'JSON → Excel', from: 'JSON', to: 'Excel' },
        { id: 'excel-json', label: 'Excel → JSON', from: 'Excel', to: 'JSON' },
    ] as const;

    // JSON to CSV
    const jsonToCsv = (jsonStr: string): string => {
        const data = JSON.parse(jsonStr);
        const arr = Array.isArray(data) ? data : [data];
        if (arr.length === 0) return '';

        const headers = Object.keys(arr[0]);
        const csvRows = [headers.join(',')];

        for (const row of arr) {
            const values = headers.map(h => {
                const val = row[h];
                const escaped = String(val ?? '').replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }
        return csvRows.join('\n');
    };

    // CSV to JSON
    const csvToJson = (csvStr: string): string => {
        const lines = csvStr.trim().split('\n');
        if (lines.length < 2) return '[]';

        const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
        const result: any[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/(".*?"|[^,]+)/g) || [];
            const obj: any = {};
            headers.forEach((h, idx) => {
                let val = values[idx] || '';
                val = val.replace(/^"|"$/g, '').replace(/""/g, '"');
                // Try to parse numbers
                if (!isNaN(Number(val)) && val !== '') {
                    obj[h] = Number(val);
                } else if (val.toLowerCase() === 'true') {
                    obj[h] = true;
                } else if (val.toLowerCase() === 'false') {
                    obj[h] = false;
                } else {
                    obj[h] = val;
                }
            });
            result.push(obj);
        }
        return JSON.stringify(result, null, 2);
    };

    // JSON to XML
    const jsonToXml = (jsonStr: string): string => {
        const data = JSON.parse(jsonStr);

        const toXml = (obj: any, rootName = 'root'): string => {
            if (Array.isArray(obj)) {
                return obj.map(item => `<item>${typeof item === 'object' ? toXml(item, '') : item}</item>`).join('\n');
            }
            if (typeof obj === 'object' && obj !== null) {
                let xml = rootName ? `<${rootName}>` : '';
                for (const [key, value] of Object.entries(obj)) {
                    if (Array.isArray(value)) {
                        xml += `<${key}>${value.map(v => `<item>${typeof v === 'object' ? toXml(v, '') : v}</item>`).join('')}</${key}>`;
                    } else if (typeof value === 'object' && value !== null) {
                        xml += `<${key}>${toXml(value, '')}</${key}>`;
                    } else {
                        xml += `<${key}>${value}</${key}>`;
                    }
                }
                xml += rootName ? `</${rootName}>` : '';
                return xml;
            }
            return String(obj);
        };

        return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data)}`;
    };

    // XML to JSON
    const xmlToJson = (xmlStr: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlStr, 'text/xml');

        const parseNode = (node: Element): any => {
            const obj: any = {};

            // Handle attributes
            for (const attr of Array.from(node.attributes)) {
                obj[`@${attr.name}`] = attr.value;
            }

            // Handle children
            for (const child of Array.from(node.children)) {
                const key = child.tagName;
                const value = child.children.length > 0 ? parseNode(child) : child.textContent;

                if (obj[key] !== undefined) {
                    if (!Array.isArray(obj[key])) {
                        obj[key] = [obj[key]];
                    }
                    obj[key].push(value);
                } else {
                    obj[key] = value;
                }
            }

            // If only text content
            if (node.children.length === 0 && Object.keys(obj).length === 0) {
                return node.textContent;
            }

            return obj;
        };

        const root = doc.documentElement;
        return JSON.stringify({ [root.tagName]: parseNode(root) }, null, 2);
    };

    // JSON to YAML
    const jsonToYaml = (jsonStr: string, indent = 0): string => {
        const data = JSON.parse(jsonStr);

        const toYaml = (obj: any, level: number): string => {
            const spaces = '  '.repeat(level);

            if (Array.isArray(obj)) {
                return obj.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return `${spaces}-\n${toYaml(item, level + 1)}`;
                    }
                    return `${spaces}- ${item}`;
                }).join('\n');
            }

            if (typeof obj === 'object' && obj !== null) {
                return Object.entries(obj).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return `${spaces}${key}:\n${toYaml(value, level + 1)}`;
                    }
                    return `${spaces}${key}: ${value}`;
                }).join('\n');
            }

            return String(obj);
        };

        return toYaml(data, indent);
    };

    // YAML to JSON
    const yamlToJson = (yamlStr: string): string => {
        const lines = yamlStr.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
        const result: any = {};
        const stack: { obj: any; indent: number }[] = [{ obj: result, indent: -1 }];

        for (const line of lines) {
            const indent = line.search(/\S/);
            const trimmed = line.trim();

            // Pop stack until we find the right parent
            while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
                stack.pop();
            }
            const parent = stack[stack.length - 1].obj;

            if (trimmed.startsWith('- ')) {
                // Array item
                const value = trimmed.substring(2);
                if (!Array.isArray(parent)) {
                    const key = Object.keys(parent).pop();
                    if (key && !Array.isArray(parent[key])) {
                        parent[key as string].push(parseYamlValue(value));
                    } else if (key) {
                        // fallback if key exists but parent[key] is array, or other case
                        parent[key as string].push(parseYamlValue(value));
                    } else {
                        // this theoretically shouldn't happen if structure is valid yaml seq in map
                        parent.push(parseYamlValue(value));
                    }
                } else {
                    parent.push(parseYamlValue(value));
                }
            } else if (trimmed.includes(':')) {
                const colonIdx = trimmed.indexOf(':');
                const key = trimmed.substring(0, colonIdx).trim();
                const value = trimmed.substring(colonIdx + 1).trim();

                if (value) {
                    parent[key] = parseYamlValue(value);
                } else {
                    parent[key] = {};
                    stack.push({ obj: parent[key], indent });
                }
            }
        }

        return JSON.stringify(result, null, 2);
    };

    const parseYamlValue = (value: string): any => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        if (!isNaN(Number(value)) && value !== '') return Number(value);
        return value.replace(/^['"]|['"]$/g, '');
    };

    // TOML conversions (Dynamic)
    const jsonToToml = async (jsonStr: string): Promise<string> => {
        const data = JSON.parse(jsonStr);
        // @ts-ignore
        const TOML = await import('@iarna/toml');
        return TOML.stringify(data);
    };

    const tomlToJson = async (tomlStr: string): Promise<string> => {
        // @ts-ignore
        const TOML = await import('@iarna/toml');
        const data = TOML.parse(tomlStr);
        return JSON.stringify(data, null, 2);
    };

    // Excel conversions (Dynamic)
    const [excelBlob, setExcelBlob] = useState<Blob | null>(null);

    const jsonToExcel = async (jsonStr: string) => {
        const data = JSON.parse(jsonStr);
        const XLSX = await import('xlsx');
        const arr = Array.isArray(data) ? data : [data];
        const ws = XLSX.utils.json_to_sheet(arr);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        setExcelBlob(blob);
        return "[Excel file ready to download]";
    };

    const excelToJson = async (file: File): Promise<string> => {
        const XLSX = await import('xlsx');
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet);
                    resolve(JSON.stringify(json, null, 2));
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleConvert = async () => {
        setError('');
        setOutput('');
        setExcelBlob(null);

        if (!input.trim() && conversionType !== 'excel-json') {
            setError('Please enter input data');
            return;
        }

        setLoading(true);

        try {
            let result = '';
            switch (conversionType) {
                case 'json-csv': result = jsonToCsv(input); break;
                case 'csv-json': result = csvToJson(input); break;
                case 'json-xml': result = jsonToXml(input); break;
                case 'xml-json': result = xmlToJson(input); break;
                case 'json-yaml': result = jsonToYaml(input); break;
                case 'yaml-json': result = yamlToJson(input); break;
                case 'json-toml': result = await jsonToToml(input); break;
                case 'toml-json': result = await tomlToJson(input); break;
                case 'json-excel': result = await jsonToExcel(input); break;
                case 'excel-json':
                    setError('Please upload an Excel file for conversion');
                    return;
            }
            setOutput(result);
        } catch (err: any) {
            setError(`Conversion error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (excelBlob) {
            const url = URL.createObjectURL(excelBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            return;
        }
        const ext = conversionType.split('-')[1];
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        if (conversionType === 'excel-json' || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            try {
                const jsonStr = await excelToJson(file);
                setInput(jsonStr);
                setOutput(jsonStr);
            } catch (err: any) {
                setError('Failed to parse Excel file: ' + err.message);
            } finally {
                setLoading(false);
            }
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInput(event.target?.result as string);
                setLoading(false);
            };
            reader.readAsText(file);
        }
    };

    const currentConversion = conversions.find(c => c.id === conversionType)!;

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                    <FileJson className="w-6 h-6 text-blue-500" />
                    {hideTabs ? currentConversion.label : 'Data Format Converter'}
                </h2>

                {!hideTabs && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Conversion Type
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {conversions.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { setConversionType(c.id as ConversionType); setOutput(''); setError(''); }}
                                    className={`p-3 rounded-lg border-2 font-medium transition-all ${conversionType === c.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                                        }`}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <input
                        type="file"
                        accept={conversionType.includes('excel') ? ".xlsx,.xls,.csv" : ".json,.csv,.xml,.yaml,.yml,.txt,.toml"}
                        onChange={handleFileUpload}
                        className="input-field"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Input ({currentConversion.from})
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="input-field font-mono text-sm h-48"
                        placeholder={`Paste your ${currentConversion.from} here...`}
                    />
                </div>

                <button
                    onClick={handleConvert}
                    disabled={loading}
                    className="btn-primary w-full mb-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <ArrowRightLeft className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Converting...' : `Convert to ${currentConversion.to}`}
                </button>

                {error && (
                    <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                {output && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Output ({currentConversion.to})
                            </label>
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="btn-secondary text-sm flex items-center gap-1">
                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button onClick={handleDownload} className="btn-secondary text-sm flex items-center gap-1">
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            className="input-field font-mono text-sm h-48"
                        />
                    </div>
                )}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="font-medium mb-2">Supported Conversions:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>JSON ↔ CSV (arrays of objects)</li>
                    <li>JSON ↔ XML (nested structures)</li>
                    <li>JSON ↔ YAML (configuration format)</li>
                    <li>JSON ↔ TOML (configuration format)</li>
                    <li>JSON ↔ Excel (via xlsx)</li>
                </ul>
            </div>
        </div>
    );
}
