import { useState } from 'react';
import Papa from 'papaparse';
import { marked } from 'marked';
import YAML from 'js-yaml';

const operations = [
  'Base64 Encode',
  'Base64 Decode',
  'URL Encode',
  'URL Decode',
  'HTML Escape',
  'HTML Unescape',
  'JSON → CSV',
  'CSV → JSON',
  'CSV Editor',
  'JSON → YAML',
  'YAML → JSON',
  'JSON → XML (basic)',
  'XML → JSON (basic)',
  'JSON → TOML (basic)',
  'TOML → JSON (basic)',
  'Markdown → HTML',
  'HTML → Markdown (basic)'
];

function htmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function htmlUnescape(s: string) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&');
}

function jsonToXml(obj: any, rootName = 'root'): string {
  const escape = (s: string) => htmlEscape(s);
  const build = (o: any, name: string): string => {
    if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean') {
      return `<${name}>${escape(String(o))}</${name}>`;
    }
    if (Array.isArray(o)) {
      return o.map(item => build(item, name)).join('');
    }
    if (typeof o === 'object' && o !== null) {
      let inner = '';
      for (const [k, v] of Object.entries(o)) {
        inner += build(v, k);
      }
      return `<${name}>${inner}</${name}>`;
    }
    return '';
  };
  return `<?xml version="1.0" encoding="UTF-8"?>\n${build(obj, rootName)}`;
}

function xmlToJson(xmlStr: string): any {
  // Simplified XML to JSON converter
  const obj: any = {};
  const regex = /<(\w+)[^>]*>(.*?)<\/\1>|<(\w+)[^>]*\/>/g;
  let match;
  while ((match = regex.exec(xmlStr)) !== null) {
    const tag = match[1] || match[3];
    const content = match[2] || '';
    obj[tag] = content || null;
  }
  return obj;
}

function jsonToToml(obj: any): string {
  const lines: string[] = [];
  const process = (o: any, prefix = '') => {
    for (const [k, v] of Object.entries(o)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === 'string') {
        lines.push(`${key} = "${v}"`);
      } else if (typeof v === 'number' || typeof v === 'boolean') {
        lines.push(`${key} = ${v}`);
      } else if (Array.isArray(v)) {
        lines.push(`${key} = [${v.map(x => typeof x === 'string' ? `"${x}"` : x).join(', ')}]`);
      } else if (typeof v === 'object' && v !== null) {
        process(v, key);
      }
    }
  };
  process(obj);
  return lines.join('\n');
}

function tomlToJson(tomlStr: string): any {
  const obj: any = {};
  const lines = tomlStr.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([\w.]+)\s*=\s*(.+)$/);
    if (match) {
      const key = match[1];
      let value: any = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (!isNaN(Number(value))) {
        value = Number(value);
      }
      const keys = key.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    }
  }
  return obj;
}

export default function FileConverters() {
  const [op, setOp] = useState<string>(operations[0]);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [csvRows, setCsvRows] = useState<string>('');

  const run = () => {
    try {
      switch (op) {
        case 'Base64 Encode':
          setOutput(btoa(unescape(encodeURIComponent(input))));
          break;
        case 'Base64 Decode':
          setOutput(decodeURIComponent(escape(atob(input))));
          break;
        case 'URL Encode':
          setOutput(encodeURIComponent(input));
          break;
        case 'URL Decode':
          setOutput(decodeURIComponent(input));
          break;
        case 'HTML Escape':
          setOutput(htmlEscape(input));
          break;
        case 'HTML Unescape':
          setOutput(htmlUnescape(input));
          break;
        case 'JSON → CSV': {
          const data = JSON.parse(input);
          const csv = Papa.unparse(data);
          setOutput(csv);
          break;
        }
        case 'CSV → JSON': {
          const parsed = Papa.parse(input, { header: true, skipEmptyLines: true });
          setOutput(JSON.stringify(parsed.data, null, 2));
          break;
        }
        case 'CSV Editor': {
          setCsvRows(input);
          setOutput('');
          break;
        }
        case 'JSON → YAML': {
          const obj = JSON.parse(input);
          setOutput(YAML.dump(obj));
          break;
        }
        case 'YAML → JSON': {
          const obj = YAML.load(input);
          setOutput(JSON.stringify(obj, null, 2));
          break;
        }
        case 'JSON → XML (basic)': {
          const obj = JSON.parse(input);
          setOutput(jsonToXml(obj));
          break;
        }
        case 'XML → JSON (basic)': {
          setOutput(JSON.stringify(xmlToJson(input), null, 2));
          break;
        }
        case 'JSON → TOML (basic)': {
          const obj = JSON.parse(input);
          setOutput(jsonToToml(obj));
          break;
        }
        case 'TOML → JSON (basic)': {
          setOutput(JSON.stringify(tomlToJson(input), null, 2));
          break;
        }
        case 'Markdown → HTML': {
          setOutput(String((marked as any)(input)));
          break;
        }
        case 'HTML → Markdown (basic)': {
          const tmp = input.replace(/<br\s*\/?>(\s*)/gi, '\n');
          const text = tmp.replace(/<[^>]+>/g, '');
          setOutput(text);
          break;
        }
        default:
          setOutput('Operation not supported');
      }
    } catch (err: any) {
      setOutput('Error: ' + (err.message || String(err)));
    }
  };

  const applyCsvEditor = () => {
    setOutput(csvRows);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">File Converters & Editors</h2>

      <div className="grid grid-cols-3 gap-3">
        <label className="col-span-3">
          Operation
          <select value={op} onChange={e => setOp(e.target.value)} className="input-field">
            {operations.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <div className="text-sm text-slate-600 mb-1">Input</div>
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={8} className="w-full input-field" />
      </div>

      {op === 'CSV Editor' && (
        <div>
          <div className="text-sm text-slate-600 mb-1">CSV Editor (edit and click Apply)</div>
          <textarea value={csvRows} onChange={e => setCsvRows(e.target.value)} rows={8} className="w-full input-field" />
          <div className="mt-2">
            <button onClick={applyCsvEditor} className="btn">Apply</button>
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <button onClick={run} className="btn">Convert</button>
        <button onClick={() => { setOutput(''); setInput(''); setCsvRows(''); }} className="btn-ghost">Clear</button>
      </div>

      <div>
        <div className="text-sm text-slate-600 mb-1">Output</div>
        <textarea value={output} readOnly rows={8} className="w-full input-field" />
      </div>

      <div className="text-sm text-slate-500">Supports: Base64, URL, HTML entities, JSON/CSV/YAML/XML/TOML conversions, and basic Markdown/HTML conversion (all in-browser).</div>
    </div>
  );
}
