'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToYamlConverter - Convert JSON to YAML format.
 */
export default function JsonToYamlConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const jsonToYaml = (obj: unknown, indent: number = 0, indentWidth: number = 2): string => {
    const pad = ' '.repeat(indent);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#') || obj.startsWith(' ') || obj.startsWith('{') || obj.startsWith('[')) {
        return `"${obj.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map((item) => {
        const val = jsonToYaml(item, indent + indentWidth, indentWidth);
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const lines = val.split('\n');
          return `${pad}- ${lines[0]}\n${lines.slice(1).map((l) => `${pad}  ${l}`).join('\n')}`;
        }
        return `${pad}- ${val}`;
      }).join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      return entries.map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const nested = jsonToYaml(value, indent + indentWidth, indentWidth);
          return `${pad}${key}:\n${nested}`;
        }
        return `${pad}${key}: ${jsonToYaml(value, indent + indentWidth, indentWidth)}`;
      }).join('\n');
    }

    return String(obj);
  };

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter JSON text.'); return; }

    try {
      const parsed = JSON.parse(input);
      const indentW = parseInt(indentSize) || 2;
      setResult(jsonToYaml(parsed, 0, indentW));
    } catch {
      setError('Invalid JSON. Please check the input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'{\n  "name": "John",\n  "age": 30,\n  "tags": ["dev", "design"]\n}'} rows={8} aria-label={`JSON input for ${toolName}`} className="input-field font-mono" />
        <div className="mt-3">
          <label htmlFor={`${toolId}-indent`} className="block text-sm font-medium text-gray-700 mb-1">Indent Width</label>
          <select id={`${toolId}-indent`} value={indentSize} onChange={(e) => setIndentSize(e.target.value)} aria-label="Indent width" className="input-field w-24">
            <option value="2">2 spaces</option>
            <option value="4">4 spaces</option>
          </select>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert JSON to YAML">Convert</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono max-h-96">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
