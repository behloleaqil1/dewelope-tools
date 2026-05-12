'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GraphqlSchemaGenerator - Generates GraphQL schema types from JSON input.
 * Analyzes JSON structure and produces corresponding GraphQL type definitions.
 */
export default function GraphqlSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [typeName, setTypeName] = useState('Root');

  const jsonTypeToGraphql = (value: unknown, fieldName: string, types: Map<string, string>): string => {
    if (value === null || value === undefined) return 'String';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Float';
    if (typeof value === 'boolean') return 'Boolean';

    if (Array.isArray(value)) {
      if (value.length === 0) return '[String]';
      const itemType = jsonTypeToGraphql(value[0], fieldName, types);
      return `[${itemType}]`;
    }

    if (typeof value === 'object') {
      const nestedTypeName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      generateType(nestedTypeName, value as Record<string, unknown>, types);
      return nestedTypeName;
    }

    return 'String';
  };

  const generateType = (name: string, obj: Record<string, unknown>, types: Map<string, string>) => {
    const fields: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const graphqlType = jsonTypeToGraphql(value, key, types);
      fields.push(`  ${key}: ${graphqlType}`);
    }

    const typeDef = `type ${name} {\n${fields.join('\n')}\n}`;
    types.set(name, typeDef);
  };

  const convert = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter valid JSON.');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const types = new Map<string, string>();

      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          setError('Empty array. Please provide JSON with at least one object.');
          return;
        }
        if (typeof parsed[0] === 'object' && parsed[0] !== null) {
          generateType(typeName, parsed[0] as Record<string, unknown>, types);
        } else {
          setError('Array must contain objects to generate a schema.');
          return;
        }
      } else if (typeof parsed === 'object' && parsed !== null) {
        generateType(typeName, parsed as Record<string, unknown>, types);
      } else {
        setError('Input must be a JSON object or array of objects.');
        return;
      }

      // Build output with nested types first, root type last
      const typeEntries = Array.from(types.entries());
      const rootEntry = typeEntries.find(([name]) => name === typeName);
      const nestedEntries = typeEntries.filter(([name]) => name !== typeName);
      const allTypes = [...nestedEntries.map(([, def]) => def), rootEntry?.[1] || ''].filter(Boolean);

      setOutput(allTypes.join('\n\n'));
    } catch {
      setError('Invalid JSON. Please check your input syntax.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-typename`} className="block text-sm font-medium text-gray-700 mb-1">
              Root Type Name
            </label>
            <input
              id={`${toolId}-typename`}
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value || 'Root')}
              placeholder="Root"
              aria-label={`Root type name for ${toolName}`}
              className="input-field w-48"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
              JSON Input
            </label>
            <textarea
              id={`${toolId}-input`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`{\n  "id": 1,\n  "name": "John",\n  "email": "john@example.com",\n  "active": true,\n  "scores": [95, 87, 92]\n}`}
              aria-label={`JSON input for ${toolName}`}
              className="input-field h-56 resize-y font-mono text-sm"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Generate GraphQL schema" className="btn-primary">
        Generate GraphQL Schema
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">GraphQL Schema</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto max-h-96">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
