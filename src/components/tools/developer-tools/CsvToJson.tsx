'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CsvToJson - Converts CSV text into a JSON array of objects.
 * First row is treated as headers. Handles quoted fields with commas inside.
 */
export default function CsvToJson({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  /**
   * Parse a single CSV line respecting quoted fields.
   * Handles commas inside double-quoted values and escaped quotes ("").
   */
  function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < line.length && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
    }

    fields.push(current.trim());
    return fields;
  }

  function handleConvert() {
    setError(undefined);
    setOutput('');

    const trimmed = input.trim();
    if (!trimmed) {
      setError('Please enter CSV data');
      return;
    }

    const lines = trimmed.split(/\r?\n/).filter((line) => line.trim() !== '');

    if (lines.length < 2) {
      setError('CSV must have at least a header row and one data row');
      return;
    }

    const headers = parseCsvLine(lines[0]);

    if (headers.some((h) => h === '')) {
      setError('Header row contains empty column names');
      return;
    }

    const result: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const obj: Record<string, string> = {};

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j] !== undefined ? values[j] : '';
      }

      result.push(obj);
    }

    setOutput(JSON.stringify(result, null, 2));
  }

  return (
    <div className="space-y-5">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          CSV Data
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'name,age,city\nAlice,30,"New York"\nBob,25,"San Francisco"'}
          aria-label="CSV data input for JSON conversion"
          className="input-field h-48 resize-y font-mono text-sm"
        />
      </InputArea>

      <button
        onClick={handleConvert}
        aria-label="Convert CSV to JSON"
        className="btn-primary"
      >
        Convert to JSON
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-700">JSON Output</h3>
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
