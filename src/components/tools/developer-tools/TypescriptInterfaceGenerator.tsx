'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TypescriptInterfaceGenerator - Generate TypeScript interfaces from JSON sample data.
 */
export default function TypescriptInterfaceGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [interfaceName, setInterfaceName] = useState('MyInterface');

  const inferType = (value: unknown): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemType = inferType(value[0]);
      return `${itemType}[]`;
    }
    if (typeof value === 'object') return 'object';
    return typeof value;
  };

  const generateInterface = (): string => {
    if (!input.trim()) return '';
    try {
      const parsed = JSON.parse(input);
      const lines: string[] = [];

      const processObject = (obj: Record<string, unknown>, name: string, depth: number): string[] => {
        const result: string[] = [];
        const indent = '  '.repeat(depth);
        result.push(`${indent}export interface ${name} {`);

        for (const [key, value] of Object.entries(obj)) {
          const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;

          if (value === null) {
            result.push(`${indent}  ${safeKey}: null;`);
          } else if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
              const subName = key.charAt(0).toUpperCase() + key.slice(1).replace(/s$/, '') + 'Item';
              result.push(`${indent}  ${safeKey}: ${subName}[];`);
              lines.push(...processObject(value[0] as Record<string, unknown>, subName, depth));
              lines.push('');
            } else {
              const itemType = value.length > 0 ? inferType(value[0]) : 'unknown';
              result.push(`${indent}  ${safeKey}: ${itemType}[];`);
            }
          } else if (typeof value === 'object') {
            const subName = key.charAt(0).toUpperCase() + key.slice(1);
            result.push(`${indent}  ${safeKey}: ${subName};`);
            lines.push(...processObject(value as Record<string, unknown>, subName, depth));
            lines.push('');
          } else {
            result.push(`${indent}  ${safeKey}: ${typeof value};`);
          }
        }

        result.push(`${indent}}`);
        return result;
      };

      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          lines.push(...processObject(parsed[0] as Record<string, unknown>, interfaceName, 0));
        } else {
          lines.push(`export type ${interfaceName} = ${inferType(parsed[0])}[];`);
        }
      } else if (typeof parsed === 'object') {
        lines.push(...processObject(parsed as Record<string, unknown>, interfaceName, 0));
      }

      return lines.join('\n');
    } catch {
      return '// Error: Invalid JSON input';
    }
  };

  const result = generateInterface();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Interface Name</label>
        <input id={`${toolId}-name`} type="text" value={interfaceName} onChange={(e) => setInterfaceName(e.target.value)} placeholder="MyInterface" aria-label={`Interface name for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Sample</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder='{"name": "John", "age": 30, "email": "john@example.com"}' aria-label={`JSON input for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
