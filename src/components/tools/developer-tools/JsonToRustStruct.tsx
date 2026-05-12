'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToRustStruct - Generates Rust struct definitions from JSON input.
 * Infers types, handles nested objects and arrays, and produces idiomatic Rust code with serde derives.
 */
export default function JsonToRustStruct({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [structName, setStructName] = useState('Root');

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function toSnakeCase(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  function inferType(value: unknown, key: string, structs: string[]): string {
    if (value === null) return 'Option<String>';
    if (typeof value === 'string') return 'String';
    if (typeof value === 'number') return Number.isInteger(value) ? 'i64' : 'f64';
    if (typeof value === 'boolean') return 'bool';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'Vec<serde_json::Value>';
      const itemType = inferType(value[0], key, structs);
      return `Vec<${itemType}>`;
    }
    if (typeof value === 'object') {
      const nestedName = capitalize(key);
      generateStruct(value as Record<string, unknown>, nestedName, structs);
      return nestedName;
    }
    return 'serde_json::Value';
  }

  function generateStruct(obj: Record<string, unknown>, name: string, structs: string[]): void {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const type = inferType(value, key, structs);
      const snakeKey = toSnakeCase(key);
      const renameAttr = snakeKey !== key ? `    #[serde(rename = "${key}")]\n` : '';
      fields.push(`${renameAttr}    pub ${snakeKey}: ${type},`);
    }
    const structStr = `#[derive(Debug, Serialize, Deserialize)]\npub struct ${name} {\n${fields.join('\n')}\n}`;
    structs.push(structStr);
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

      const structs: string[] = [];
      if (Array.isArray(parsed)) {
        if (parsed.length > 0 && typeof parsed[0] === 'object') {
          generateStruct(parsed[0] as Record<string, unknown>, structName, structs);
        } else {
          setError('Array must contain at least one object');
          return;
        }
      } else {
        generateStruct(parsed as Record<string, unknown>, structName, structs);
      }

      const header = 'use serde::{Serialize, Deserialize};\n\n';
      setOutput(header + structs.reverse().join('\n\n'));
    } catch {
      setError('Invalid JSON. Please check your input.');
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-structname`} className="block text-sm font-medium text-gray-700 mb-1">
          Struct Name
        </label>
        <input
          id={`${toolId}-structname`}
          type="text"
          value={structName}
          onChange={(e) => setStructName(e.target.value)}
          placeholder="Root"
          aria-label={`Struct name for ${toolName}`}
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

      <button onClick={handleConvert} aria-label="Generate Rust struct" className="btn-primary">
        Generate Rust Struct
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rust Struct</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
