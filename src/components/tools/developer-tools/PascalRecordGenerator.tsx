'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PascalRecordGenerator - Generate Pascal/Delphi record type definitions from JSON input.
 */
export default function PascalRecordGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [recordName, setRecordName] = useState('TMyRecord');
  const [error, setError] = useState('');

  function inferPascalType(value: unknown): string {
    if (value === null) return 'Variant';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Integer' : 'Double';
    }
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return `array of ${inferPascalType(value[0])}`;
      }
      return 'array of Variant';
    }
    if (typeof value === 'object') return 'TNestedRecord';
    return 'Variant';
  }

  function toPascalCase(str: string): string {
    return str
      .replace(/[_\-\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
      .replace(/^(.)/, (_, c) => c.toUpperCase());
  }

  function generateRecord(obj: Record<string, unknown>, name: string): string {
    const lines: string[] = [];
    lines.push(`type`);
    lines.push(`  ${name} = record`);
    for (const [key, value] of Object.entries(obj)) {
      const fieldName = toPascalCase(key);
      const fieldType = inferPascalType(value);
      lines.push(`    ${fieldName}: ${fieldType};`);
    }
    lines.push(`  end;`);
    return lines.join('\n');
  }

  function handleGenerate() {
    setError('');
    setOutput('');
    if (!input.trim()) {
      setError('Please enter JSON input.');
      return;
    }
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('JSON must be an object (not an array or primitive).');
        return;
      }
      const result = generateRecord(parsed, recordName || 'TMyRecord');
      setOutput(result);
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Record Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
          placeholder="TMyRecord"
          aria-label="Pascal record name"
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <button
          onClick={handleGenerate}
          className="btn-primary mt-2"
        >
          Generate Record
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pascal Record</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
