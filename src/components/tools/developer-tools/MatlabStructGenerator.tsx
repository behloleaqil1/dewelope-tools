'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MatlabStructGenerator - Generate MATLAB struct code from JSON input.
 * Parses JSON and produces equivalent MATLAB struct assignment statements.
 */
export default function MatlabStructGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [varName, setVarName] = useState('s');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const formatValue = (val: unknown): string => {
    if (val === null || val === undefined) return '[]';
    if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
      const items = val.map((v) => formatValue(v));
      // Check if all numeric
      const allNumeric = val.every((v) => typeof v === 'number');
      if (allNumeric) return `[${items.join(', ')}]`;
      return `{${items.join(', ')}}`;
    }
    if (typeof val === 'object') return '[]'; // nested structs simplified
    return String(val);
  };

  const generateStruct = (obj: Record<string, unknown>, prefix: string): string[] => {
    const lines: string[] = [];
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        const nested = generateStruct(val as Record<string, unknown>, `${prefix}.${key}`);
        lines.push(...nested);
      } else {
        lines.push(`${prefix}.${key} = ${formatValue(val)};`);
      }
    }
    return lines;
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON input.');
      return;
    }

    try {
      const data = JSON.parse(input.trim());

      if (typeof data !== 'object' || data === null) {
        setError('Please enter a JSON object.');
        return;
      }

      if (Array.isArray(data)) {
        // Handle array of objects as struct array
        const lines: string[] = [];
        data.forEach((item: Record<string, unknown>, idx: number) => {
          const nested = generateStruct(item, `${varName}(${idx + 1})`);
          lines.push(...nested);
        });
        setOutput(lines.join('\n'));
      } else {
        const lines = generateStruct(data, varName);
        setOutput(lines.join('\n'));
      }
    } catch {
      setError('Invalid JSON. Please enter a valid JSON object or array.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-varname`} className="block text-sm font-medium text-gray-700 mb-1">
          Variable Name
        </label>
        <input
          id={`${toolId}-varname`}
          type="text"
          value={varName}
          onChange={(e) => setVarName(e.target.value || 's')}
          placeholder="s"
          aria-label={`Variable name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Alice", "age": 30, "scores": [95, 87, 92]}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={generate}
          className="btn-primary mt-2"
        >
          Generate MATLAB Struct
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">MATLAB Struct Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
