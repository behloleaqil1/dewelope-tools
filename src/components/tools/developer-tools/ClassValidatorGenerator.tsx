'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClassValidatorGenerator - Generate class-validator decorators from JSON input.
 * Analyzes JSON structure and produces TypeScript class with appropriate decorators.
 */
export default function ClassValidatorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [className, setClassName] = useState('MyDto');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function inferDecorators(key: string, value: unknown): string[] {
    const decorators: string[] = [];

    if (typeof value === 'string') {
      decorators.push('@IsString()');
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        decorators.push('@IsEmail()');
      } else if (/^https?:\/\//.test(value)) {
        decorators.push('@IsUrl()');
      } else if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        decorators.push('@IsDateString()');
      } else if (value.length > 0 && key.toLowerCase().includes('uuid')) {
        decorators.push('@IsUUID()');
      }
      if (value.length > 0) {
        decorators.push('@IsNotEmpty()');
      }
    } else if (typeof value === 'number') {
      if (Number.isInteger(value)) {
        decorators.push('@IsInt()');
      } else {
        decorators.push('@IsNumber()');
      }
    } else if (typeof value === 'boolean') {
      decorators.push('@IsBoolean()');
    } else if (Array.isArray(value)) {
      decorators.push('@IsArray()');
      if (value.length > 0) {
        if (typeof value[0] === 'string') decorators.push('@IsString({ each: true })');
        else if (typeof value[0] === 'number') decorators.push('@IsNumber({}, { each: true })');
      }
    } else if (typeof value === 'object' && value !== null) {
      decorators.push('@IsObject()');
      decorators.push('@ValidateNested()');
      decorators.push('@Type(() => Object)');
    }

    return decorators;
  }

  function generateClass(obj: Record<string, unknown>, name: string): string {
    const lines: string[] = [];
    const imports = new Set<string>();

    const entries = Object.entries(obj);
    const properties: string[] = [];

    for (const [key, value] of entries) {
      const decorators = inferDecorators(key, value);
      for (const d of decorators) {
        const match = d.match(/@(\w+)/);
        if (match) imports.add(match[1]);
      }
      const tsType = getTypeString(value);
      properties.push(`  ${decorators.join('\n  ')}\n  ${key}: ${tsType};`);
    }

    // Build import statement
    const importList = Array.from(imports).sort();
    lines.push(`import { ${importList.join(', ')} } from 'class-validator';`);

    if (imports.has('ValidateNested') || imports.has('Type')) {
      lines.push(`import { Type } from 'class-transformer';`);
    }

    lines.push('');
    lines.push(`export class ${name} {`);
    lines.push(properties.join('\n\n'));
    lines.push('}');

    return lines.join('\n');
  }

  function getTypeString(value: unknown): string {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      return `${getTypeString(value[0])}[]`;
    }
    if (typeof value === 'object' && value !== null) return 'object';
    return 'unknown';
  }

  function handleGenerate() {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON input');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object (not array or primitive)');
        return;
      }
      const result = generateClass(parsed, className || 'MyDto');
      setOutput(result);
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-classname`} className="block text-sm font-medium text-gray-700 mb-1">
          Class Name
        </label>
        <input
          id={`${toolId}-classname`}
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="MyDto"
          aria-label={`Class name for ${toolName}`}
          className="input-field w-48 mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "John",\n  "email": "john@example.com",\n  "age": 25,\n  "active": true\n}'}
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate class-validator decorators" className="btn-primary">
        Generate Decorators
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Class</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
