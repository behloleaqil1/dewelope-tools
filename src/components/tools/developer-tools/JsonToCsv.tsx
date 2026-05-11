'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JsonToCsv - Convert a JSON array of objects into CSV format.
 * Automatically extracts headers from all object keys and handles
 * proper CSV escaping for commas, quotes, and newlines.
 */
export default function JsonToCsv({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  /**
   * Escape a CSV field value. Wraps in quotes if it contains
   * commas, double quotes, or newlines.
   */
  function escapeCsvField(value: unknown): string {
    if (value === null || value === undefined) return '';
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function handleConvert() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter a JSON array of objects');
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      setError('Invalid JSON. Please enter valid JSON.');
      return;
    }

    if (!Array.isArray(parsed)) {
      setError('Input must be a JSON array. Wrap your objects in [ ].');
      return;
    }

    if (parsed.length === 0) {
      setError('The JSON array is empty. Provide at least one object.');
      return;
    }

    // Ensure all items are objects
    const objects = parsed.filter(
      (item): item is Record<string, unknown> =>
        item !== null && typeof item === 'object' && !Array.isArray(item)
    );

    if (objects.length === 0) {
      setError('The array must contain objects (not primitives or nested arrays).');
      return;
    }

    // Extract all unique keys as headers (preserving insertion order)
    const headersSet = new Set<string>();
    for (const obj of objects) {
      for (const key of Object.keys(obj)) {
        headersSet.add(key);
      }
    }
    const headers = Array.from(headersSet);

    // Build CSV rows
    const headerRow = headers.map(escapeCsvField).join(',');
    const dataRows = objects.map((obj) =>
      headers.map((key) => escapeCsvField(obj[key])).join(',')
    );

    setOutput([headerRow, ...dataRows].join('\n'));
  }

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          JSON Array
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'}
          aria-label="JSON array input for CSV conversion"
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleConvert}
        aria-label="Convert JSON to CSV"
        className="btn-primary"
      >
        Convert to CSV
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-700">CSV Output</h3>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
