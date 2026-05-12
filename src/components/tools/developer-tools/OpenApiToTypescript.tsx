'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OpenApiToTypescript - Generates TypeScript types from OpenAPI/Swagger schema JSON.
 * Parses schema definitions and produces corresponding TypeScript interfaces.
 */
export default function OpenApiToTypescript({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function mapType(prop: Record<string, unknown>): string {
    const type = prop.type as string | undefined;
    const ref = prop.$ref as string | undefined;
    const items = prop.items as Record<string, unknown> | undefined;
    const enumVals = prop.enum as string[] | undefined;

    if (ref) {
      const parts = ref.split('/');
      return parts[parts.length - 1];
    }
    if (enumVals) {
      return enumVals.map((v) => `'${v}'`).join(' | ');
    }
    switch (type) {
      case 'integer':
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'array':
        return items ? `${mapType(items)}[]` : 'unknown[]';
      case 'object':
        return 'Record<string, unknown>';
      default:
        return 'string';
    }
  }

  function generate() {
    setError(undefined);
    setOutput('');

    if (!input.trim()) {
      setError('Please paste an OpenAPI/Swagger JSON schema');
      return;
    }

    try {
      const schema = JSON.parse(input);
      const definitions = schema.definitions || schema.components?.schemas || schema.schemas || {};

      if (Object.keys(definitions).length === 0) {
        setError('No schema definitions found. Ensure your JSON has "definitions" or "components.schemas".');
        return;
      }

      const lines: string[] = [];

      for (const [name, def] of Object.entries(definitions)) {
        const definition = def as Record<string, unknown>;
        const properties = definition.properties as Record<string, Record<string, unknown>> | undefined;
        const required = (definition.required as string[]) || [];

        lines.push(`export interface ${name} {`);

        if (properties) {
          for (const [propName, propDef] of Object.entries(properties)) {
            const optional = required.includes(propName) ? '' : '?';
            const tsType = mapType(propDef);
            const desc = propDef.description as string | undefined;
            if (desc) {
              lines.push(`  /** ${desc} */`);
            }
            lines.push(`  ${propName}${optional}: ${tsType};`);
          }
        }

        lines.push('}');
        lines.push('');
      }

      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          OpenAPI/Swagger JSON Schema
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"definitions": {"User": {"type": "object", "properties": {"id": {"type": "integer"}, "name": {"type": "string"}}}}}'
          aria-label={`JSON schema input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={generate} aria-label="Generate TypeScript types" className="btn-primary">
        Generate TypeScript
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">TypeScript Interfaces</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
