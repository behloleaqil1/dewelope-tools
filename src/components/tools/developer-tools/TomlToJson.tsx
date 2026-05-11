'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TomlToJson - Converts TOML configuration format to JSON.
 * Parses TOML syntax including tables, arrays, strings, numbers, booleans, and dates.
 */
export default function TomlToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const parseTOML = (toml: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    let currentTable: Record<string, unknown> = result;
    const lines = toml.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines and comments
      if (!line || line.startsWith('#')) continue;

      // Handle table headers [table]
      const tableMatch = line.match(/^\[([^\]]+)\]$/);
      if (tableMatch) {
        const keys = tableMatch[1].split('.');
        currentTable = result;
        for (const key of keys) {
          const k = key.trim().replace(/^["']|["']$/g, '');
          if (!(k in currentTable)) {
            currentTable[k] = {};
          }
          currentTable = currentTable[k] as Record<string, unknown>;
        }
        continue;
      }

      // Handle array of tables [[table]]
      const arrayTableMatch = line.match(/^\[\[([^\]]+)\]\]$/);
      if (arrayTableMatch) {
        const keys = arrayTableMatch[1].split('.');
        let target: Record<string, unknown> = result;
        for (let j = 0; j < keys.length - 1; j++) {
          const k = keys[j].trim().replace(/^["']|["']$/g, '');
          if (!(k in target)) target[k] = {};
          target = target[k] as Record<string, unknown>;
        }
        const lastKey = keys[keys.length - 1].trim().replace(/^["']|["']$/g, '');
        if (!(lastKey in target)) target[lastKey] = [];
        const arr = target[lastKey] as Record<string, unknown>[];
        const newObj: Record<string, unknown> = {};
        arr.push(newObj);
        currentTable = newObj;
        continue;
      }

      // Handle key-value pairs
      const kvMatch = line.match(/^([^=]+?)\s*=\s*(.+)$/);
      if (kvMatch) {
        const key = kvMatch[1].trim().replace(/^["']|["']$/g, '');
        const rawValue = kvMatch[2].trim();
        currentTable[key] = parseValue(rawValue);
      }
    }

    return result;
  };

  const parseValue = (val: string): unknown => {
    // Multi-line basic strings
    if (val === '"""' || val.startsWith('"""')) {
      return val.replace(/^"""|"""$/g, '').trim();
    }
    // Basic string
    if (val.startsWith('"') && val.endsWith('"')) {
      return val.slice(1, -1).replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\').replace(/\\"/g, '"');
    }
    // Literal string
    if (val.startsWith("'") && val.endsWith("'")) {
      return val.slice(1, -1);
    }
    // Boolean
    if (val === 'true') return true;
    if (val === 'false') return false;
    // Integer (with underscores)
    if (/^[+-]?\d[\d_]*$/.test(val)) {
      return parseInt(val.replace(/_/g, ''), 10);
    }
    // Float
    if (/^[+-]?\d[\d_]*\.[\d_]*([eE][+-]?\d+)?$/.test(val) || /^[+-]?\d+[eE][+-]?\d+$/.test(val)) {
      return parseFloat(val.replace(/_/g, ''));
    }
    // Special floats
    if (val === 'inf' || val === '+inf') return Infinity;
    if (val === '-inf') return -Infinity;
    if (val === 'nan' || val === '+nan' || val === '-nan') return NaN;
    // Date/datetime
    if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
      return val;
    }
    // Array
    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      if (!inner) return [];
      const items = splitArrayItems(inner);
      return items.map((item) => parseValue(item.trim()));
    }
    // Inline table
    if (val.startsWith('{') && val.endsWith('}')) {
      const inner = val.slice(1, -1).trim();
      if (!inner) return {};
      const obj: Record<string, unknown> = {};
      const pairs = inner.split(',');
      for (const pair of pairs) {
        const m = pair.match(/^\s*([^=]+?)\s*=\s*(.+?)\s*$/);
        if (m) {
          obj[m[1].trim().replace(/^["']|["']$/g, '')] = parseValue(m[2].trim());
        }
      }
      return obj;
    }
    // Fallback: return as string
    return val;
  };

  const splitArrayItems = (str: string): string[] => {
    const items: string[] = [];
    let depth = 0;
    let current = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inString) {
        current += ch;
        if (ch === stringChar && str[i - 1] !== '\\') inString = false;
      } else if (ch === '"' || ch === "'") {
        inString = true;
        stringChar = ch;
        current += ch;
      } else if (ch === '[' || ch === '{') {
        depth++;
        current += ch;
      } else if (ch === ']' || ch === '}') {
        depth--;
        current += ch;
      } else if (ch === ',' && depth === 0) {
        items.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) items.push(current);
    return items;
  };

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter TOML content');
      setOutput('');
      return;
    }

    try {
      const parsed = parseTOML(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(`Invalid TOML: ${e instanceof Error ? e.message : 'Parse error'}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          TOML Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'[package]\nname = "my-app"\nversion = "1.0.0"\n\n[dependencies]\nreact = "^18.0.0"'}
          aria-label={`TOML input for ${toolName}`}
          className="input-field h-56 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert TOML to JSON" className="btn-primary">
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">JSON Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
