'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GroovyClassGenerator - Generate Groovy class definitions from JSON input.
 * Infers types from JSON values and produces a properly formatted Groovy class.
 */
export default function GroovyClassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [className, setClassName] = useState('MyClass');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function inferType(value: unknown): string {
    if (value === null) return 'Object';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? 'Integer' : 'Double';
    }
    if (Array.isArray(value)) {
      if (value.length > 0) {
        return `List<${inferType(value[0])}>`;
      }
      return 'List<Object>';
    }
    if (typeof value === 'object') return 'Map<String, Object>';
    return 'Object';
  }

  function generate() {
    setError('');
    setOutput('');
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter JSON input.');
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('JSON must be an object (not array or primitive).');
        return;
      }
      const lines: string[] = [];
      lines.push(`class ${className} {`);
      for (const [key, value] of Object.entries(parsed)) {
        const type = inferType(value);
        lines.push(`    ${type} ${key}`);
      }
      lines.push('');
      lines.push(`    ${className}() {}`);
      lines.push('');
      lines.push('    @Override');
      lines.push('    String toString() {');
      const fields = Object.keys(parsed).map(k => `${k}=\${${k}}`).join(', ');
      lines.push(`        return "${className}(${fields})"`);
      lines.push('    }');
      lines.push('}');
      setOutput(lines.join('\n'));
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-classname`} className="block text-sm font-medium text-gray-700 mb-1">
          Class Name
        </label>
        <input
          id={`${toolId}-classname`}
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value || 'MyClass')}
          className="input-field mb-3"
          aria-label="Groovy class name"
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
        <button onClick={generate} className="btn-primary mt-2">Generate Groovy Class</button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Groovy Class</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
