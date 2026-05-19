'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownTableGenerator - Generate markdown tables from input data.
 */
export default function MarkdownTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rows, setRows] = useState('3');
  const [cols, setCols] = useState('3');
  const [headers, setHeaders] = useState('');
  const [data, setData] = useState('');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const generate = () => {
    setError('');
    setResult('');
    const numCols = parseInt(cols) || 3;
    const numRows = parseInt(rows) || 3;

    const headerCells = headers.trim()
      ? headers.split(/[,|\t]/).map((h) => h.trim())
      : Array.from({ length: numCols }, (_, i) => `Header ${i + 1}`);

    while (headerCells.length < numCols) headerCells.push(`Col ${headerCells.length + 1}`);

    const alignChar = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : '---';
    const separator = headerCells.map(() => alignChar);

    const dataRows: string[][] = [];
    if (data.trim()) {
      const lines = data.trim().split('\n');
      for (const line of lines) {
        const cells = line.split(/[,|\t]/).map((c) => c.trim());
        while (cells.length < numCols) cells.push('');
        dataRows.push(cells.slice(0, numCols));
      }
    } else {
      for (let r = 0; r < numRows; r++) {
        dataRows.push(Array.from({ length: numCols }, (_, c) => `Row ${r + 1} Col ${c + 1}`));
      }
    }

    const headerLine = `| ${headerCells.slice(0, numCols).join(' | ')} |`;
    const sepLine = `| ${separator.slice(0, numCols).join(' | ')} |`;
    const bodyLines = dataRows.map((row) => `| ${row.join(' | ')} |`);

    setResult([headerLine, sepLine, ...bodyLines].join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-rows`} className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
            <input id={`${toolId}-rows`} type="text" inputMode="numeric" value={rows} onChange={(e) => setRows(e.target.value)} placeholder="3" aria-label={`Rows for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
            <input id={`${toolId}-cols`} type="text" inputMode="numeric" value={cols} onChange={(e) => setCols(e.target.value)} placeholder="3" aria-label={`Columns for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select id={`${toolId}-align`} value={alignment} onChange={(e) => setAlignment(e.target.value as 'left' | 'center' | 'right')} aria-label="Column alignment" className="input-field">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-headers`} className="block text-sm font-medium text-gray-700 mb-1">Headers (comma separated, optional)</label>
          <input id={`${toolId}-headers`} type="text" value={headers} onChange={(e) => setHeaders(e.target.value)} placeholder="Name, Age, City" aria-label={`Headers for ${toolName}`} className="input-field" />
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-data`} className="block text-sm font-medium text-gray-700 mb-1">Data (comma separated per row, optional)</label>
          <textarea id={`${toolId}-data`} value={data} onChange={(e) => setData(e.target.value)} placeholder={"Alice, 30, NYC\nBob, 25, LA"} rows={4} aria-label={`Data for ${toolName}`} className="input-field font-mono" />
        </div>
      </InputArea>

      <button onClick={generate} className="btn-primary" aria-label="Generate markdown table">Generate Table</button>

      <OutputArea hasContent={result.length > 0}>
        {result && (
          <div className="space-y-3">
            <pre className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto whitespace-pre-wrap font-mono">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
