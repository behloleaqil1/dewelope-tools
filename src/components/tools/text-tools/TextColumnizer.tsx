'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextColumnizer - Splits text into multiple columns or joins columns back into single text.
 * Useful for formatting data into tabular layouts.
 */
export default function TextColumnizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [columns, setColumns] = useState('2');
  const [separator, setSeparator] = useState('tab');
  const [output, setOutput] = useState('');

  function columnize() {
    if (!input.trim()) return;

    const lines = input.split('\n').filter((l) => l.trim().length > 0);
    const numCols = Math.max(1, Math.min(10, parseInt(columns) || 2));
    const sep = separator === 'tab' ? '\t' : separator === 'pipe' ? ' | ' : '  ';

    const rows: string[][] = [];
    for (let i = 0; i < lines.length; i += numCols) {
      const row: string[] = [];
      for (let j = 0; j < numCols; j++) {
        row.push(lines[i + j] || '');
      }
      rows.push(row);
    }

    // Calculate column widths for alignment
    const widths: number[] = Array(numCols).fill(0);
    for (const row of rows) {
      row.forEach((cell, i) => {
        widths[i] = Math.max(widths[i], cell.length);
      });
    }

    const formatted = rows.map((row) =>
      row.map((cell, i) => cell.padEnd(widths[i])).join(sep).trimEnd()
    ).join('\n');

    setOutput(formatted);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter items (one per line) for {toolName}
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Item 1&#10;Item 2&#10;Item 3&#10;Item 4&#10;Item 5&#10;Item 6"
          aria-label={`Text input for ${toolName}`}
          className="input-field h-36 resize-y font-mono text-sm"
        />
        <div className="flex gap-3 mt-3 items-end">
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-xs text-gray-500 mb-1">Columns</label>
            <input id={`${toolId}-cols`} type="number" min="1" max="10" value={columns} onChange={(e) => setColumns(e.target.value)} aria-label="Number of columns" className="input-field w-16 text-sm" />
          </div>
          <div>
            <label htmlFor={`${toolId}-sep`} className="block text-xs text-gray-500 mb-1">Separator</label>
            <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label="Column separator" className="input-field text-sm">
              <option value="tab">Tab</option>
              <option value="pipe">Pipe (|)</option>
              <option value="spaces">Spaces</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={columnize} aria-label="Arrange into columns" className="btn-primary">Columnize</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Column Output</label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
