'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HaskellTypeGenerator - Generates Haskell data types from JSON input.
 * Parses JSON structure and produces corresponding Haskell algebraic data types.
 */
export default function HaskellTypeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [typeName, setTypeName] = useState('MyType');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function inferType(value: unknown, fieldName: string): string {
    if (value === null) return 'Maybe String';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    if (typeof value === 'boolean') return 'Bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[String]';
      return `[${inferType(value[0], fieldName)}]`;
    }
    if (typeof value === 'object') return capitalize(fieldName);
    return 'String';
  }

  function generateHaskellType(obj: Record<string, unknown>, name: string): string {
    const lines: string[] = [];
    const nestedTypes: string[] = [];
    const fields = Object.entries(obj);

    lines.push(`data ${name} = ${name}`);
    lines.push(`  {`);

    fields.forEach(([key, value], idx) => {
      const haskellType = inferType(value, key);
      const fieldName = `${name.charAt(0).toLowerCase()}${name.slice(1)}${capitalize(key)}`;
      const separator = idx < fields.length - 1 ? ',' : '';
      lines.push(`    ${fieldName} :: ${haskellType}${separator}`);

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        nestedTypes.push(generateHaskellType(value as Record<string, unknown>, capitalize(key)));
      }
    });

    lines.push(`  } deriving (Show, Eq)`);

    if (nestedTypes.length > 0) {
      lines.push('');
      lines.push(nestedTypes.join('\n\n'));
    }

    return lines.join('\n');
  }

  function handleGenerate() {
    setError(undefined);
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON input');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('JSON must be an object at the top level');
        return;
      }

      const name = typeName.trim() || 'MyType';
      const result = generateHaskellType(parsed, name);
      setOutput(result);
    } catch {
      setError('Invalid JSON input. Please check your syntax.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Type Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="MyType"
          aria-label={`Type name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Alice", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate Haskell types" className="btn-primary">
        Generate Haskell Type
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Haskell Data Type</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
