'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * KotlinDataClassGenerator - Generates Kotlin data class definitions from JSON input.
 * Infers types, handles nested objects and arrays, and produces idiomatic Kotlin code.
 */
export default function KotlinDataClassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [className, setClassName] = useState('Root');

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function inferType(value: unknown, key: string, classes: string[]): string {
    if (value === null) return 'Any?';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'Int' : 'Double';
    if (typeof value === 'boolean') return 'Boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<Any>';
      const itemType = inferType(value[0], key, classes);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedName = capitalize(key);
      generateClass(value as Record<string, unknown>, nestedName, classes);
      return nestedName;
    }
    return 'Any';
  }

  function generateClass(obj: Record<string, unknown>, name: string, classes: string[]): void {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const type = inferType(value, key, classes);
      const nullable = value === null ? '?' : '';
      fields.push(`    val ${key}: ${type}${nullable}`);
    }
    const classStr = `data class ${name}(\n${fields.join(',\n')}\n)`;
    classes.push(classStr);
  }

  function handleConvert() {
    setError(undefined);
    setOutput('');

    if (!input.trim()) {
      setError('Please enter JSON to convert');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      if (typeof parsed !== 'object' || parsed === null) {
        setError('JSON must be an object or array');
        return;
      }

      const classes: string[] = [];
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateClass(parsed[0] as Record<string, unknown>, className, classes);
        } else {
          setError('Array must contain at least one object');
          return;
        }
      } else {
        generateClass(parsed as Record<string, unknown>, className, classes);
      }

      setOutput(classes.reverse().join('\n\n'));
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
          placeholder="Root"
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

      <button onClick={handleConvert} aria-label="Generate Kotlin data class" className="btn-primary">
        Generate Data Class
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Kotlin Data Class</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
