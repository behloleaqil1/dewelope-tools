'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CsvRowFilter - Filter CSV rows by column value conditions.
 */
export default function CsvRowFilter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [column, setColumn] = useState('0');
  const [condition, setCondition] = useState<'equals' | 'contains' | 'gt' | 'lt' | 'regex'>('contains');
  const [filterValue, setFilterValue] = useState('');
  const [keepMatches, setKeepMatches] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const filter = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter CSV data.'); return; }
    if (!filterValue.trim() && condition !== 'regex') { setError('Please enter a filter value.'); return; }

    const lines = input.split('\n');
    if (lines.length < 2) { setError('Need at least a header and one data row.'); return; }

    const header = lines[0];
    const colIdx = parseInt(column);
    const dataLines = lines.slice(1).filter((l) => l.trim());

    const matches = dataLines.filter((line) => {
      const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      const cellValue = cells[colIdx] || '';

      let isMatch = false;
      switch (condition) {
        case 'equals': isMatch = cellValue === filterValue; break;
        case 'contains': isMatch = cellValue.toLowerCase().includes(filterValue.toLowerCase()); break;
        case 'gt': isMatch = parseFloat(cellValue) > parseFloat(filterValue); break;
        case 'lt': isMatch = parseFloat(cellValue) < parseFloat(filterValue); break;
        case 'regex': try { isMatch = new RegExp(filterValue).test(cellValue); } catch { isMatch = false; } break;
      }
      return keepMatches ? isMatch : !isMatch;
    });

    setResult([header, ...matches].join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">CSV Data</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"name,age,city\nAlice,30,NYC\nBob,25,LA\nCharlie,35,NYC"} rows={6} aria-label={`CSV input for ${toolName}`} className="input-field font-mono" />
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-col`} className="block text-sm font-medium text-gray-700 mb-1">Column Index (0-based)</label>
            <input id={`${toolId}-col`} type="text" inputMode="numeric" value={column} onChange={(e) => setColumn(e.target.value)} placeholder="0" aria-label={`Column index for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-cond`} className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select id={`${toolId}-cond`} value={condition} onChange={(e) => setCondition(e.target.value as typeof condition)} aria-label="Filter condition" className="input-field">
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="gt">Greater Than</option>
              <option value="lt">Less Than</option>
              <option value="regex">Regex</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">Filter Value</label>
            <input id={`${toolId}-value`} type="text" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} placeholder="e.g. NYC" aria-label={`Filter value for ${toolName}`} className="input-field" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={keepMatches} onChange={(e) => setKeepMatches(e.target.checked)} aria-label="Keep matching rows" className="rounded" />
              Keep matches (uncheck to remove)
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={filter} className="btn-primary" aria-label="Filter CSV rows">Filter</button>

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
