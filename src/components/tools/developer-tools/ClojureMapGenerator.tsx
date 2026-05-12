'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClojureMapGenerator - Generate Clojure map/record definitions from JSON input.
 */
export default function ClojureMapGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [recordName, setRecordName] = useState('MyRecord');
  const [mode, setMode] = useState<'map' | 'record'>('map');
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter valid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object');
        return;
      }

      if (mode === 'map') {
        setOutput(jsonToClojureMap(parsed, 0));
      } else {
        setOutput(jsonToDefrecord(parsed, recordName));
      }
    } catch {
      setError('Invalid JSON input');
    }
  };

  const jsonToClojureMap = (obj: Record<string, unknown>, indent: number): string => {
    const pad = '  '.repeat(indent);
    const innerPad = '  '.repeat(indent + 1);
    const entries = Object.entries(obj);

    if (entries.length === 0) return '{}';

    const lines = entries.map(([key, value]) => {
      const clojureKey = `:${kebabCase(key)}`;
      const clojureVal = valueToClojure(value, indent + 1);
      return `${innerPad}${clojureKey} ${clojureVal}`;
    });

    return `{${lines.length > 0 ? '\n' : ''}${lines.join('\n')}${lines.length > 0 ? '\n' + pad : ''}}`;
  };

  const valueToClojure = (value: unknown, indent: number): string => {
    if (value === null) return 'nil';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'number') return String(value);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value)) {
      const items = value.map((v) => valueToClojure(v, indent));
      return `[${items.join(' ')}]`;
    }
    if (typeof value === 'object') {
      return jsonToClojureMap(value as Record<string, unknown>, indent);
    }
    return 'nil';
  };

  const jsonToDefrecord = (obj: Record<string, unknown>, name: string): string => {
    const fields = Object.keys(obj).map((k) => kebabCase(k));
    const example = jsonToClojureMap(obj, 0);

    return `(defrecord ${name} [${fields.join(' ')}])\n\n;; Example instance:\n(map->${name}\n  ${example})`;
  };

  const kebabCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .toLowerCase();
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-2">
          <label className="block text-sm font-medium text-gray-700">Mode:</label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'map'} onChange={() => setMode('map')} className="mr-1" />
            Map
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={mode === 'record'} onChange={() => setMode('record')} className="mr-1" />
            Defrecord
          </label>
        </div>
        {mode === 'record' && (
          <div className="mb-2">
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Record Name</label>
            <input
              id={`${toolId}-name`}
              type="text"
              value={recordName}
              onChange={(e) => setRecordName(e.target.value)}
              className="input-field"
              aria-label={`Record name for ${toolName}`}
            />
          </div>
        )}
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"firstName": "John", "age": 30, "isActive": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate Clojure code" className="btn-primary">
        Generate Clojure
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Clojure Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
