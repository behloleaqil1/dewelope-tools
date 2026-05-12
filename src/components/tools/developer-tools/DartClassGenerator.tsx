'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DartClassGenerator - Generates Dart class definitions from JSON input for Flutter.
 * Infers types, handles nested objects and arrays, and produces idiomatic Dart code.
 */
export default function DartClassGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [className, setClassName] = useState('Root');

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function inferType(value: unknown, key: string, classes: string[]): string {
    if (value === null) return 'dynamic';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'double';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'List<dynamic>';
      const itemType = inferType(value[0], key, classes);
      return `List<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedName = capitalize(key);
      generateClass(value as Record<string, unknown>, nestedName, classes);
      return nestedName;
    }
    return 'dynamic';
  }

  function generateClass(obj: Record<string, unknown>, name: string, classes: string[]): void {
    const fields: string[] = [];
    const constructorParams: string[] = [];
    const fromJsonLines: string[] = [];
    const toJsonLines: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      const type = inferType(value, key, classes);
      const nullable = value === null ? '?' : '';
      fields.push(`  final ${type}${nullable} ${key};`);
      constructorParams.push(`    required this.${key},`);

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        fromJsonLines.push(`      ${key}: ${type}.fromJson(json['${key}']),`);
        toJsonLines.push(`      '${key}': ${key}.toJson(),`);
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
        const itemType = capitalize(key);
        fromJsonLines.push(`      ${key}: (json['${key}'] as List).map((e) => ${itemType}.fromJson(e)).toList(),`);
        toJsonLines.push(`      '${key}': ${key}.map((e) => e.toJson()).toList(),`);
      } else {
        fromJsonLines.push(`      ${key}: json['${key}'],`);
        toJsonLines.push(`      '${key}': ${key},`);
      }
    }

    const classStr = `class ${name} {
${fields.join('\n')}

  ${name}({
${constructorParams.join('\n')}
  });

  factory ${name}.fromJson(Map<String, dynamic> json) {
    return ${name}(
${fromJsonLines.join('\n')}
    );
  }

  Map<String, dynamic> toJson() {
    return {
${toJsonLines.join('\n')}
    };
  }
}`;
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

      <button onClick={handleConvert} aria-label="Generate Dart class" className="btn-primary">
        Generate Dart Class
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Dart Class</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
