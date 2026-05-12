'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ZodSchemaGenerator - Generate Zod validation schema from JSON input.
 * Analyzes JSON structure and produces corresponding Zod schema code.
 */
export default function ZodSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [schemaName, setSchemaName] = useState('mySchema');

  function inferZodType(value: unknown, indent: number): string {
    const pad = '  '.repeat(indent);
    if (value === null) return 'z.null()';
    if (typeof value === 'string') return 'z.string()';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
    }
    if (typeof value === 'boolean') return 'z.boolean()';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'z.array(z.unknown())';
      const itemType = inferZodType(value[0], indent);
      return `z.array(${itemType})`;
    }
    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return 'z.object({})';
      const fields = entries.map(([key, val]) => {
        const type = inferZodType(val, indent + 1);
        return `${pad}  ${key}: ${type}`;
      });
      return `z.object({\n${fields.join(',\n')},\n${pad}})`;
    }
    return 'z.unknown()';
  }

  function generate() {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to convert');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const zodType = inferZodType(parsed, 0);
      const name = schemaName.trim() || 'mySchema';
      const lines: string[] = [
        `import { z } from 'zod';`,
        '',
        `const ${name} = ${zodType};`,
        '',
        `type ${name.charAt(0).toUpperCase() + name.slice(1)}Type = z.infer<typeof ${name}>;`,
      ];
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Schema Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          placeholder="e.g. userSchema"
          aria-label={`Schema name for ${toolName}`}
          className="input-field w-64 mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "John",\n  "age": 30,\n  "email": "john@example.com",\n  "active": true\n}'}
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate Zod schema" className="btn-primary">
        Generate Zod Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Zod Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
