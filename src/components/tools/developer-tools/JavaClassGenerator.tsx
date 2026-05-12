'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JavaClassGenerator - Generate Java POJO class from JSON input.
 * Parses JSON and creates a Java class with private fields, getters, setters, and constructors.
 */
export default function JavaClassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [className, setClassName] = useState('MyClass');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const getJavaType = (value: unknown): string => {
    if (value === null) return 'Object';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    if (Array.isArray(value)) {
      if (value.length > 0) return `List<${getJavaType(value[0]).replace(/^int$/, 'Integer').replace(/^double$/, 'Double').replace(/^boolean$/, 'Boolean')}>`;
      return 'List<Object>';
    }
    if (typeof value === 'object') return 'Object';
    return 'Object';
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const generate = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('Input must be a JSON object (not array or primitive).');
        setOutput('');
        return;
      }

      const fields = Object.entries(parsed);
      const lines: string[] = [];

      lines.push(`public class ${className} {`);
      lines.push('');

      // Fields
      for (const [key, value] of fields) {
        lines.push(`    private ${getJavaType(value)} ${key};`);
      }
      lines.push('');

      // No-arg constructor
      lines.push(`    public ${className}() {}`);
      lines.push('');

      // All-args constructor
      const params = fields.map(([key, value]) => `${getJavaType(value)} ${key}`).join(', ');
      lines.push(`    public ${className}(${params}) {`);
      for (const [key] of fields) {
        lines.push(`        this.${key} = ${key};`);
      }
      lines.push('    }');
      lines.push('');

      // Getters and setters
      for (const [key, value] of fields) {
        const type = getJavaType(value);
        const cap = capitalize(key);
        lines.push(`    public ${type} get${cap}() {`);
        lines.push(`        return ${key};`);
        lines.push('    }');
        lines.push('');
        lines.push(`    public void set${cap}(${type} ${key}) {`);
        lines.push(`        this.${key} = ${key};`);
        lines.push('    }');
        lines.push('');
      }

      lines.push('}');
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON input.');
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-class`} className="block text-sm font-medium text-gray-700 mb-1">
          Class Name
        </label>
        <input
          id={`${toolId}-class`}
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value || 'MyClass')}
          placeholder="MyClass"
          aria-label={`Class name for ${toolName}`}
          className="input-field mb-3"
        />
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Input
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "active": true}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={generate} className="btn-primary">Generate Java Class</button>

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
