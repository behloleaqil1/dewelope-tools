'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToGraphqlSchema - Generate GraphQL schema types from JSON data.
 * Analyzes JSON structure and produces corresponding GraphQL type definitions.
 */
export default function JsonToGraphqlSchema({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [rootTypeName, setRootTypeName] = useState('Root');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input.trim()) { setOutput(''); setError(''); return; }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        const types: string[] = [];
        buildType(parsed, rootTypeName, types);
        setOutput(types.join('\n\n'));
        setError('');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid JSON');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, rootTypeName]);

  function getGraphQLType(value: unknown, key: string, types: string[]): string {
    if (value === null || value === undefined) return 'String';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Float';
    if (typeof value === 'boolean') return 'Boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[String]';
      const itemType = getGraphQLType(value[0], key, types);
      return `[${itemType}]`;
    }
    if (typeof value === 'object') {
      const typeName = key.charAt(0).toUpperCase() + key.slice(1);
      buildType(value as Record<string, unknown>, typeName, types);
      return typeName;
    }
    return 'String';
  }

  function buildType(obj: unknown, typeName: string, types: string[]) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return;
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const gqlType = getGraphQLType(value, key, types);
      fields.push(`  ${key}: ${gqlType}`);
    }
    const typeStr = `type ${typeName} {\n${fields.join('\n')}\n}`;
    if (!types.includes(typeStr)) types.push(typeStr);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">
          Root Type Name
        </label>
        <input
          id={`${toolId}-root`}
          type="text"
          value={rootTypeName}
          onChange={(e) => setRootTypeName(e.target.value || 'Root')}
          placeholder="Root"
          aria-label={`Root type name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"id": 1, "name": "Example", "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">GraphQL Schema</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
