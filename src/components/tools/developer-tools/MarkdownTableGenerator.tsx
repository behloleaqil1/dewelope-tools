'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MarkdownTableGenerator - Generates Markdown tables from configurable rows/columns with alignment options.
 */
export default function MarkdownTableGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [headers, setHeaders] = useState<string[]>(['Header 1', 'Header 2', 'Header 3']);
  const [cells, setCells] = useState<string[][]>([
    ['Row 1', 'Data', 'Data'],
    ['Row 2', 'Data', 'Data'],
    ['Row 3', 'Data', 'Data'],
  ]);
  const [output, setOutput] = useState('');

  const updateGrid = (newRows: number, newCols: number) => {
    const r = Math.max(1, Math.min(20, newRows));
    const c = Math.max(1, Math.min(10, newCols));
    setRows(r);
    setCols(c);

    const newHeaders = Array.from({ length: c }, (_, i) => headers[i] || `Header ${i + 1}`);
    setHeaders(newHeaders);

    const newCells = Array.from({ length: r }, (_, ri) =>
      Array.from({ length: c }, (_, ci) => (cells[ri] && cells[ri][ci]) || 'Data')
    );
    setCells(newCells);
  };

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const updateCell = (row: number, col: number, value: string) => {
    const newCells = cells.map((r, ri) => ri === row ? r.map((c, ci) => ci === col ? value : c) : [...r]);
    setCells(newCells);
  };

  const generate = () => {
    const separator = alignment === 'center' ? ':---:' : alignment === 'right' ? '---:' : '---';
    const headerRow = '| ' + headers.join(' | ') + ' |';
    const separatorRow = '| ' + Array(cols).fill(separator).join(' | ') + ' |';
    const dataRows = cells.map((row) => '| ' + row.join(' | ') + ' |');
    setOutput([headerRow, separatorRow, ...dataRows].join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label htmlFor={`${toolId}-rows`} className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
            <input id={`${toolId}-rows`} type="number" min={1} max={20} value={rows} onChange={(e) => updateGrid(parseInt(e.target.value) || 1, cols)} aria-label={`Number of rows for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Columns</label>
            <input id={`${toolId}-cols`} type="number" min={1} max={10} value={cols} onChange={(e) => updateGrid(rows, parseInt(e.target.value) || 1)} aria-label={`Number of columns for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <select id={`${toolId}-align`} value={alignment} onChange={(e) => setAlignment(e.target.value as 'left' | 'center' | 'right')} aria-label={`Column alignment for ${toolName}`} className="input-field">
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-1">
                    <input type="text" value={h} onChange={(e) => updateHeader(i, e.target.value)} className="input-field text-xs w-full" aria-label={`Header ${i + 1}`} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1">
                      <input type="text" value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} className="input-field text-xs w-full" aria-label={`Cell row ${ri + 1} column ${ci + 1}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Markdown table" className="btn-primary">
        Generate Table
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Markdown Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
