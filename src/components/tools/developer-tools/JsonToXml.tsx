'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToXml - Convert JSON data to XML format.
 * Handles nested objects, arrays, and primitive values.
 */

function jsonToXml(obj: unknown, rootName: string = 'root', indent: string = ''): string {
  if (obj === null || obj === undefined) {
    return `${indent}<${rootName}></${rootName}>`;
  }

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return `${indent}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => jsonToXml(item, rootName, indent)).join('\n');
  }

  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    if (entries.length === 0) {
      return `${indent}<${rootName}></${rootName}>`;
    }
    const children = entries.map(([key, value]) => {
      const safeName = key.replace(/[^a-zA-Z0-9_-]/g, '_');
      return jsonToXml(value, safeName, indent + '  ');
    }).join('\n');
    return `${indent}<${rootName}>\n${children}\n${indent}</${rootName}>`;
  }

  return `${indent}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default function JsonToXml({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [rootElement, setRootElement] = useState('root');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const convert = () => {
    if (!input.trim()) {
      setError('Please enter JSON data');
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setError(undefined);
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
      const xmlBody = jsonToXml(parsed, rootElement || 'root');
      setOutput(`${xmlHeader}\n${xmlBody}`);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="mb-3">
          <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Element Name</label>
          <input
            id={`${toolId}-root`}
            type="text"
            value={rootElement}
            onChange={(e) => setRootElement(e.target.value)}
            placeholder="root"
            className="input-field text-sm w-48"
            aria-label="Root element name"
          />
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter JSON
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError(undefined);
          }}
          placeholder={'{\n  "name": "John",\n  "age": 30,\n  "hobbies": ["reading", "coding"]\n}'}
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
      </InputArea>

      <button onClick={convert} aria-label="Convert JSON to XML" className="btn-primary">
        Convert to XML
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">XML Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
