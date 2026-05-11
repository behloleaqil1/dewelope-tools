'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TypescriptToJson - Converts TypeScript interfaces/types to example JSON objects.
 * Parses interface properties and generates sample JSON with appropriate default values.
 */
export default function TypescriptToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter a TypeScript interface or type');
      setOutput('');
      return;
    }

    setError('');

    try {
      const lines = input.trim().split('\n');
      const result: Record<string, unknown> = {};
      let insideInterface = false;

      for (const rawLine of lines) {
        const line = rawLine.trim();

        if (line.match(/^(export\s+)?(interface|type)\s+\w+/)) {
          insideInterface = true;
          continue;
        }

        if (line === '}' || line === '};') {
          insideInterface = false;
          continue;
        }

        if (!insideInterface) continue;

        const propMatch = line.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
        if (!propMatch) continue;

        const [, propName, optional, typeStr] = propMatch;
        const cleanType = typeStr.replace(/;$/, '').trim();

        result[propName] = getDefaultValue(cleanType, !!optional);
      }

      if (Object.keys(result).length === 0) {
        setError('Could not parse any properties. Make sure the input is a valid TypeScript interface or type.');
        setOutput('');
        return;
      }

      setOutput(JSON.stringify(result, null, 2));
    } catch {
      setError('Failed to parse TypeScript. Please check the format.');
      setOutput('');
    }
  };

  const getDefaultValue = (typeStr: string, isOptional: boolean): unknown => {
    if (isOptional) return null;

    const t = typeStr.toLowerCase().trim();

    if (t === 'string') return 'example';
    if (t === 'number') return 0;
    if (t === 'boolean') return false;
    if (t === 'null') return null;
    if (t === 'undefined') return null;
    if (t === 'any' || t === 'unknown') return null;
    if (t === 'date') return '2024-01-01T00:00:00.000Z';

    if (t.endsWith('[]') || t.startsWith('array<')) return [];
    if (t.startsWith('record<')) return {};

    if (t.includes('|')) {
      const parts = t.split('|').map((p) => p.trim().replace(/['"]/g, ''));
      const firstNonNull = parts.find((p) => p !== 'null' && p !== 'undefined');
      if (firstNonNull) {
        if (firstNonNull === 'string') return 'example';
        if (firstNonNull === 'number') return 0;
        if (firstNonNull === 'boolean') return false;
        if (/^['"]/.test(firstNonNull) || /^[a-z]/.test(firstNonNull)) return firstNonNull;
      }
      return null;
    }

    if (t.startsWith('{') || t === 'object') return {};

    return 'example';
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          TypeScript Interface or Type
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder={`interface User {\n  id: number;\n  name: string;\n  email: string;\n  isActive: boolean;\n  tags: string[];\n  metadata?: Record<string, any>;\n}`}
          aria-label={`TypeScript input for ${toolName}`}
          className="input-field h-56 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert to JSON" className="btn-primary">
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated JSON</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
