'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MongooseSchemaGenerator - Generate Mongoose schema from JSON structure.
 * Infers types from JSON values and creates a complete schema definition.
 */
export default function MongooseSchemaGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [jsonInput, setJsonInput] = useState('');
  const [modelName, setModelName] = useState('');
  const [timestamps, setTimestamps] = useState(true);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const inferType = (value: unknown): string => {
    if (value === null || value === undefined) return 'Schema.Types.Mixed';
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'Date';
      if (/^[0-9a-f]{24}$/i.test(value)) return 'Schema.Types.ObjectId';
      return 'String';
    }
    if (typeof value === 'number') return Number.isInteger(value) ? 'Number' : 'Number';
    if (typeof value === 'boolean') return 'Boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return '[Schema.Types.Mixed]';
      const itemType = inferType(value[0]);
      if (typeof value[0] === 'object' && !Array.isArray(value[0])) return `[${itemType}]`;
      return `[${itemType}]`;
    }
    if (typeof value === 'object') return 'nested';
    return 'Schema.Types.Mixed';
  };

  const buildSchema = (obj: Record<string, unknown>, indent: number): string => {
    const pad = '  '.repeat(indent);
    const lines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        lines.push(`${pad}${key}: {`);
        lines.push(buildSchema(value as Record<string, unknown>, indent + 1));
        lines.push(`${pad}},`);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && !Array.isArray(value[0])) {
        lines.push(`${pad}${key}: [{`);
        lines.push(buildSchema(value[0] as Record<string, unknown>, indent + 1));
        lines.push(`${pad}}],`);
      } else {
        const type = inferType(value);
        lines.push(`${pad}${key}: { type: ${type}, required: true },`);
      }
    }

    return lines.join('\n');
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!jsonInput.trim()) { setError('Please enter a JSON structure'); return; }
    if (!modelName.trim()) { setError('Please enter a model name'); return; }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonInput);
    } catch {
      setError('Invalid JSON. Please check your input.');
      return;
    }

    if (typeof parsed !== 'object' || Array.isArray(parsed)) {
      setError('JSON must be an object (not an array)');
      return;
    }

    const name = modelName.trim();
    const schemaName = name.charAt(0).toLowerCase() + name.slice(1) + 'Schema';

    let code = `import mongoose, { Schema, Document } from 'mongoose';\n\n`;
    code += `export interface I${name} extends Document {\n`;
    for (const [key, value] of Object.entries(parsed)) {
      const tsType = inferTsType(value);
      code += `  ${key}: ${tsType};\n`;
    }
    code += `}\n\n`;
    code += `const ${schemaName} = new Schema<I${name}>(\n  {\n`;
    code += buildSchema(parsed, 2);
    code += `\n  }`;
    if (timestamps) code += `,\n  { timestamps: true }`;
    code += `\n);\n\n`;
    code += `export default mongoose.model<I${name}>('${name}', ${schemaName});\n`;

    setOutput(code);
  };

  const inferTsType = (value: unknown): string => {
    if (value === null || value === undefined) return 'any';
    if (typeof value === 'string') {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'Date';
      return 'string';
    }
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'any[]';
      return `${inferTsType(value[0])}[]`;
    }
    if (typeof value === 'object') return 'object';
    return 'any';
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-model`} className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
            <input id={`${toolId}-model`} type="text" value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g. User" aria-label={`Model name for ${toolName}`} className="input-field w-64" />
          </div>
          <div>
            <label htmlFor={`${toolId}-json`} className="block text-sm font-medium text-gray-700 mb-1">JSON Structure</label>
            <textarea id={`${toolId}-json`} value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='{"name": "John", "age": 30, "email": "john@example.com"}' aria-label={`JSON input for ${toolName}`} className="input-field h-40 resize-y font-mono text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={timestamps} onChange={(e) => setTimestamps(e.target.checked)} />
            Include timestamps (createdAt, updatedAt)
          </label>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Mongoose schema" className="btn-primary">Generate Schema</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
