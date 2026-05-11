'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CsvColumnExtractor - Extract specific columns from CSV data by column name or index.
 * Supports custom delimiters and outputs extracted columns as CSV.
 */
export default function CsvColumnExtractor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [columns, setColumns] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [mode, setMode] = useState<'name' | 'index'>('name');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const extract = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Please enter CSV data');
      return;
    }

    if (!columns.trim()) {
      setOutput('');
      setError('Please specify columns to extract');
      return;
    }

    setError('');

    const lines = input.trim().split('\n');
    if (lines.length === 0) {
      setError('No data found');
      return;
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === delimiter && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const requestedCols = columns.split(',').map((c) => c.trim());

    let indices: number[] = [];

    if (mode === 'name') {
      indices = requestedCols.map((name) => {
        const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
        return idx;
      });

      const notFound = requestedCols.filter((_, i) => indices[i] === -1);
      if (notFound.length > 0) {
        setError(`Column(s) not found: ${notFound.join(', ')}. Available: ${headers.join(', ')}`);
        setOutput('');
        return;
      }
    } else {
      indices = requestedCols.map((idx) => {
        const num = parseInt(idx, 10);
        return isNaN(num) ? -1 : num - 1;
      });

      const invalid = indices.filter((i) => i < 0 || i >= headers.length);
      if (invalid.length > 0) {
        setError(`Invalid column index. Valid range: 1 to ${headers.length}`);
        setOutput('');
        return;
      }
    }

    const resultLines = lines.map((line) => {
      const fields = parseLine(line);
      return indices.map((i) => fields[i] || '').join(delimiter);
    });

    setOutput(resultLines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          CSV Data
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={"name,age,city,email\nAlice,30,NYC,alice@example.com\nBob,25,LA,bob@example.com"}
          aria-label={`CSV data input for ${toolName}`}
          className="input-field h-40 resize-y font-mono"
        />
      </InputArea>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
            Select By
          </label>
          <select
            id={`${toolId}-mode`}
            value={mode}
            onChange={(e) => setMode(e.target.value as 'name' | 'index')}
            aria-label={`Column selection mode for ${toolName}`}
            className="input-field"
          >
            <option value="name">Column Name</option>
            <option value="index">Column Index (1-based)</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-columns`} className="block text-sm font-medium text-gray-700 mb-1">
            Columns (comma-separated)
          </label>
          <input
            id={`${toolId}-columns`}
            type="text"
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder={mode === 'name' ? 'name, city' : '1, 3'}
            aria-label={`Columns to extract for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-delimiter`} className="block text-sm font-medium text-gray-700 mb-1">
            Delimiter
          </label>
          <select
            id={`${toolId}-delimiter`}
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            aria-label={`Delimiter for ${toolName}`}
            className="input-field"
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value={'\t'}>Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </InputArea>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button onClick={extract} aria-label="Extract columns" className="btn-primary">
        Extract Columns
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Extracted Columns</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-64 overflow-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
