'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ScalaCaseClassGenerator - Generates Scala case class definitions from JSON input.
 */
export default function ScalaCaseClassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [className, setClassName] = useState('MyClass');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const inferType = (value: unknown): string => {
    if (value === null) return 'Option[String]';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'boolean') return 'Boolean';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List[Any]';
      return `List[${inferType(value[0])}]`;
    }
    if (typeof value === 'object') return 'Map[String, Any]';
    return 'Any';
  };

  const generate = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter valid JSON');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setError('JSON must be an object (not array or primitive)');
        return;
      }

      const fields = Object.entries(parsed)
        .map(([key, value]) => `  ${key}: ${inferType(value)}`)
        .join(',\n');

      const result = `case class ${className}(\n${fields}\n)`;
      setOutput(result);
    } catch {
      setError('Invalid JSON input');
    }
  };

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
          onChange={(e) => setClassName(e.target.value)}
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

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={generate} aria-label="Generate Scala case class" className="btn-primary">
        Generate Case Class
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Scala Case Class</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
