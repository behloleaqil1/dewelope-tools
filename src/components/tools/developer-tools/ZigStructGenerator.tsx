'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZigStructGenerator - Generate Zig struct definitions from JSON input.
 * Parses JSON and produces corresponding Zig struct types.
 */
export default function ZigStructGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [structName, setStructName] = useState('Root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const inferZigType = (value: unknown, name: string, structs: string[]): string => {
    if (value === null) return '?[]const u8';
    if (typeof value === 'string') return '[]const u8';
    if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]const []const u8';
      const elemType = inferZigType(value[0], name + 'Item', structs);
      return `[]const ${elemType}`;
    }
    if (typeof value === 'object') {
      const nestedName = capitalize(name.replace(/[^a-zA-Z0-9]/g, ''));
      generateStruct(value as Record<string, unknown>, nestedName, structs);
      return nestedName;
    }
    return '[]const u8';
  };

  const generateStruct = (obj: Record<string, unknown>, name: string, structs: string[]) => {
    const fields: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      const fieldName = key.replace(/[^a-zA-Z0-9_]/g, '_');
      const fieldType = inferZigType(val, name + capitalize(fieldName), structs);
      fields.push(`    ${fieldName}: ${fieldType},`);
    }
    structs.push(`const ${name} = struct {\n${fields.join('\n')}\n};`);
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
      const structs: string[] = [];
      const rootName = capitalize(structName.trim().replace(/[^a-zA-Z0-9]/g, '') || 'Root');

      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        generateStruct(parsed, rootName, structs);
      } else if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        generateStruct(parsed[0] as Record<string, unknown>, rootName, structs);
      } else {
        setError('JSON must be an object or array of objects');
        return;
      }

      setOutput(structs.join('\n\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Struct Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={structName}
          onChange={(e) => setStructName(e.target.value)}
          placeholder="e.g. User"
          aria-label={`Struct name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "Alice", "age": 30, "score": 9.5}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate Zig struct" className="btn-primary">
        Generate Zig Struct
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zig Struct Definition</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
