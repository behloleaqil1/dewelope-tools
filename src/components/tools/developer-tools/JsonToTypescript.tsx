'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToTypescript - Generates TypeScript interfaces from JSON data.
 * Handles nested objects, arrays, and optional fields.
 */
export default function JsonToTypescript({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [rootName, setRootName] = useState('Root');
  const [error, setError] = useState('');

  const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

  const toInterfaceName = (key: string): string => {
    return capitalize(key.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, ''));
  };

  const getType = (value: unknown, key: string, interfaces: string[]): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemType = getType(value[0], key, interfaces);
      return `${itemType}[]`;
    }
    if (typeof value === 'object') {
      const interfaceName = toInterfaceName(key);
      generateInterface(value as Record<string, unknown>, interfaceName, interfaces);
      return interfaceName;
    }
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'unknown';
  };

  const generateInterface = (obj: Record<string, unknown>, name: string, interfaces: string[]) => {
    const lines: string[] = [];
    lines.push(`interface ${name} {`);
    for (const [key, value] of Object.entries(obj)) {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
      const type = getType(value, key, interfaces);
      lines.push(`  ${safeKey}: ${type};`);
    }
    lines.push('}');
    interfaces.push(lines.join('\n'));
  };

  const convert = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter JSON data');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(trimmed);
      setError('');

      const interfaces: string[] = [];
      const name = toInterfaceName(rootName || 'Root');

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
          generateInterface(parsed[0] as Record<string, unknown>, name, interfaces);
          const result = interfaces.reverse().join('\n\n') + `\n\ntype ${name}List = ${name}[];`;
          setOutput(result);
        } else {
          const itemType = parsed.length > 0 ? typeof parsed[0] : 'unknown';
          setOutput(`type ${name} = ${itemType}[];`);
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateInterface(parsed as Record<string, unknown>, name, interfaces);
        setOutput(interfaces.reverse().join('\n\n'));
      } else {
        setOutput(`type ${name} = ${typeof parsed};`);
      }
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Root Interface Name
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={rootName}
          onChange={(e) => setRootName(e.target.value)}
          placeholder="Root"
          aria-label={`Root interface name for ${toolName}`}
          className="input-field mb-3"
        />

        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder='{"name": "John", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} aria-label="Generate TypeScript interfaces" className="btn-primary">
        Generate TypeScript
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">TypeScript Interfaces</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
