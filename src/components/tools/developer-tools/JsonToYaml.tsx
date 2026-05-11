'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import CodeEditor from '@/components/tools/CodeEditor';

/**
 * JsonToYaml - Converts JSON input to YAML format.
 * Implements a simple YAML serializer with proper indentation for objects and arrays.
 */
export default function JsonToYaml({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter JSON to convert');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const yaml = jsonToYaml(parsed, 0);
      setOutput(yaml);
      setError(undefined);
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`);
      setOutput('');
    }
  };

  const jsonToYaml = (value: unknown, indent: number): string => {
    const prefix = '  '.repeat(indent);

    if (value === null) return 'null';
    if (value === undefined) return '~';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'number') return String(value);

    if (typeof value === 'string') {
      if (
        value.includes('\n') || value.includes(':') || value.includes('#') ||
        value.startsWith(' ') || value.endsWith(' ') || value === '' ||
        value === 'true' || value === 'false' || value === 'null' || !isNaN(Number(value))
      ) {
        return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
      }
      return value;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      const lines: string[] = [];
      for (const item of value) {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const objYaml = jsonToYaml(item, indent + 1);
          const objLines = objYaml.split('\n');
          lines.push(`${prefix}- ${objLines[0]}`);
          for (let i = 1; i < objLines.length; i++) {
            lines.push(`${prefix}  ${objLines[i]}`);
          }
        } else {
          lines.push(`${prefix}- ${jsonToYaml(item, indent + 1)}`);
        }
      }
      return lines.join('\n');
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) return '{}';
      const lines: string[] = [];
      for (const [key, val] of entries) {
        const safeKey = key.includes(':') || key.includes(' ') || key === '' ? `"${key}"` : key;
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val) && val.length === 0) {
            lines.push(`${prefix}${safeKey}: []`);
          } else if (!Array.isArray(val) && Object.keys(val).length === 0) {
            lines.push(`${prefix}${safeKey}: {}`);
          } else {
            lines.push(`${prefix}${safeKey}:`);
            lines.push(jsonToYaml(val, indent + 1));
          }
        } else {
          lines.push(`${prefix}${safeKey}: ${jsonToYaml(val, indent + 1)}`);
        }
      }
      return lines.join('\n');
    }

    return String(value);
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            JSON Input
          </label>
          <CodeEditor
            id={`${toolId}-input`}
            value={input}
            onChange={setInput}
            language="json"
            placeholder={'{\n  "name": "example",\n  "items": [1, 2, 3]\n}'}
            ariaLabel={`JSON input for ${toolName}`}
            height="h-48"
          />
        </InputArea>

        <button onClick={convert} className="btn-primary" aria-label="Convert JSON to YAML">
          Convert to YAML
        </button>
      </div>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">YAML Output</h3>
              <CopyToClipboard text={output} />
            </div>
            <CodeEditor
              value={output}
              onChange={() => {}}
              language="yaml"
              readOnly
              height="h-64"
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
