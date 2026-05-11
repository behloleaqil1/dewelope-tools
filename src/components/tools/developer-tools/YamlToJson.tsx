'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * YamlToJson - Converts YAML-like text to JSON format.
 * Supports basic YAML with key: value pairs, nested objects via indentation,
 * arrays with dash syntax, and common scalar types.
 */
export default function YamlToJson({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function parseYaml(yaml: string): unknown {
    const lines = yaml.split('\n');
    const result: Record<string, unknown> = {};
    const stack: { indent: number; obj: Record<string, unknown> }[] = [{ indent: -1, obj: result }];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim() || line.trim().startsWith('#')) continue;

      const indent = line.search(/\S/);
      const content = line.trim();

      // Handle array items
      if (content.startsWith('- ')) {
        const value = content.slice(2).trim();
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
          stack.pop();
        }
        const parent = stack[stack.length - 1].obj;
        const lastKey = Object.keys(parent).pop();
        if (lastKey) {
          if (!Array.isArray(parent[lastKey])) {
            parent[lastKey] = [];
          }
          (parent[lastKey] as unknown[]).push(parseScalar(value));
        }
        continue;
      }

      const colonIdx = content.indexOf(':');
      if (colonIdx === -1) continue;

      const key = content.slice(0, colonIdx).trim();
      const rawValue = content.slice(colonIdx + 1).trim();

      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }

      const current = stack[stack.length - 1].obj;

      if (rawValue === '' || rawValue === '|' || rawValue === '>') {
        const nested: Record<string, unknown> = {};
        current[key] = nested;
        stack.push({ indent, obj: nested });
      } else {
        current[key] = parseScalar(rawValue);
      }
    }

    return result;
  }

  function parseScalar(value: string): unknown {
    if (value === 'true' || value === 'True' || value === 'TRUE') return true;
    if (value === 'false' || value === 'False' || value === 'FALSE') return false;
    if (value === 'null' || value === 'Null' || value === 'NULL' || value === '~') return null;
    if (/^-?\d+$/.test(value)) return parseInt(value, 10);
    if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  }

  function handleConvert() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter YAML content to convert');
      return;
    }

    try {
      const parsed = parseYaml(trimmed);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setError('Failed to parse YAML. Please check your input format.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          YAML Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'name: John Doe\nage: 30\nhobbies:\n  - reading\n  - coding\naddress:\n  city: New York\n  zip: "10001"'}
          aria-label={`YAML input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={handleConvert} aria-label="Convert YAML to JSON" className="btn-primary">
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">JSON Output</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
