'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FsharpRecordGenerator - Generate F# record type definitions from JSON input.
 */
export default function FsharpRecordGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [typeName, setTypeName] = useState('MyRecord');
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

      const types: string[] = [];
      const mainType = generateRecord(parsed, typeName, types);
      types.push(mainType);
      setOutput(types.join('\n\n'));
    } catch {
      setError('Invalid JSON input');
    }
  };

  const generateRecord = (obj: Record<string, unknown>, name: string, types: string[]): string => {
    const fields = Object.entries(obj).map(([key, value]) => {
      const fieldName = pascalCase(key);
      const fieldType = inferType(key, value, name, types);
      return `    ${fieldName}: ${fieldType}`;
    });

    return `type ${name} = {\n${fields.join('\n')}\n}`;
  };

  const inferType = (key: string, value: unknown, parentName: string, types: string[]): string => {
    if (value === null) return 'string option';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'int' : 'float';
    }
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'obj list';
      const itemType = inferType(key, value[0], parentName, types);
      return `${itemType} list`;
    }
    if (typeof value === 'object') {
      const nestedName = `${parentName}${pascalCase(key)}`;
      const nestedRecord = generateRecord(value as Record<string, unknown>, nestedName, types);
      types.push(nestedRecord);
      return nestedName;
    }
    return 'obj';
  };

  const pascalCase = (str: string): string => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-\s]+/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join('');
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="mb-2">
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Type Name</label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            className="input-field"
            aria-label={`Type name for ${toolName}`}
          />
        </div>
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

      <button onClick={generate} aria-label="Generate F# record" className="btn-primary">
        Generate F# Record
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">F# Record Type</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
