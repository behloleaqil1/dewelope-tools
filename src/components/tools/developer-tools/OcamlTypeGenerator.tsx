'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OcamlTypeGenerator - Generate OCaml type definitions from JSON input.
 * Parses JSON and produces corresponding OCaml record types.
 */
export default function OcamlTypeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [typeName, setTypeName] = useState('root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const inferOcamlType = (value: unknown, name: string, types: string[]): string => {
    if (value === null) return 'string option';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'float';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'string list';
      const elemType = inferOcamlType(value[0], name + '_item', types);
      return `${elemType} list`;
    }
    if (typeof value === 'object') {
      const recName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      generateRecord(value as Record<string, unknown>, recName, types);
      return recName;
    }
    return 'string';
  };

  const generateRecord = (obj: Record<string, unknown>, name: string, types: string[]) => {
    const fields: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const fieldName = key.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
      const fieldType = inferOcamlType(val, name + '_' + fieldName, types);
      fields.push(`  ${fieldName} : ${fieldType};`);
    }
    types.push(`type ${name} = {\n${fields.join('\n')}\n}`);
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter valid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const types: string[] = [];
      const rootName = typeName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'root';

      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        generateRecord(parsed, rootName, types);
      } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        generateRecord(parsed[0] as Record<string, unknown>, rootName, types);
      } else {
        setError('JSON must be an object or array of objects');
        return;
      }

      setOutput(types.join('\n\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Root Type Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
          placeholder="e.g. user"
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
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate OCaml types" className="btn-primary">
        Generate OCaml Types
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">OCaml Type Definitions</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
