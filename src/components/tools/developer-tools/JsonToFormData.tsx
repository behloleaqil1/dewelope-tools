'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToFormData - Converts JSON objects to URL-encoded form data (application/x-www-form-urlencoded).
 * Supports nested objects with bracket notation and arrays.
 */

function flattenToFormData(obj: unknown, prefix: string): [string, string][] {
  const pairs: [string, string][] = [];

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const key = prefix ? `${prefix}[${index}]` : `${index}`;
      if (typeof item === 'object' && item !== null) {
        pairs.push(...flattenToFormData(item, key));
      } else {
        pairs.push([key, String(item ?? '')]);
      }
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj).forEach(([k, v]) => {
      const key = prefix ? `${prefix}[${k}]` : k;
      if (typeof v === 'object' && v !== null) {
        pairs.push(...flattenToFormData(v, key));
      } else {
        pairs.push([key, String(v ?? '')]);
      }
    });
  } else {
    pairs.push([prefix, String(obj ?? '')]);
  }

  return pairs;
}

export default function JsonToFormData({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!input.trim()) {
      setOutput('');
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(input);
        if (typeof parsed !== 'object' || parsed === null) {
          setError('Input must be a JSON object or array');
          setOutput('');
          return;
        }
        const params = flattenToFormData(parsed, '');
        const encoded = params
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        setOutput(encoded);
        setError('');
      } catch {
        setError('Invalid JSON input');
        setOutput('');
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input]);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter JSON
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "John", "age": 30, "tags": ["dev", "js"]}'
          aria-label={`JSON input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL-Encoded Form Data</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
