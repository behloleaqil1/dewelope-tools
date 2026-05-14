'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToTableConverter - Convert delimited text into formatted ASCII or markdown tables.
 */
export default function TextToTableConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [outputFormat, setOutputFormat] = useState<'markdown' | 'ascii'>('markdown');
  const [hasHeader, setHasHeader] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const convert = () => {
    setError('');
    setResult('');
    if (!input.trim()) { setError('Please enter text to convert.'); return; }

    const delim = delimiter === '\\t' ? '\t' : delimiter;
    const lines = input.trim().split('\n').filter((l) => l.trim());
    const rows = lines.map((line) => line.split(delim).map((cell) => cell.trim()));

    if (rows.length === 0) { setError('No data found.'); return; }

    const numCols = Math.max(...rows.map((r) => r.length));
    const normalizedRows = rows.map((r) => {
      while (r.length < numCols) r.push('');
      return r;
    });

    if (outputFormat === 'markdown') {
      const header = normalizedRows[0];
      const separator = header.map(() => '---');
      const dataRows = hasHeader ? normalizedRows.slice(1) : normalizedRows;
      const headerLine = hasHeader ? `| ${header.join(' | ')} |` : `| ${Array.from({ length: numCols }, (_, i) => `Col ${i + 1}`).join(' | ')} |`;
      const sepLine = `| ${separator.join(' | ')} |`;
      const bodyLines = (hasHeader ? dataRows : normalizedRows).map((r) => `| ${r.join(' | ')} |`);
      setResult([headerLine, sepLine, ...bodyLines].join('\n'));
    } else {
      const colWidths = Array.from({ length: numCols }, (_, i) =>
        Math.max(...normalizedRows.map((r) => (r[i] || '').length), 3)
      );
      const border = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+';
      const formatRow = (row: string[]) => '|' + row.map((cell, i) => ` ${cell.padEnd(colWidths[i])} `).join('|') + '|';

      const lines: string[] = [border];
      if (hasHeader) {
        lines.push(formatRow(normalizedRows[0]));
        lines.push(border);
        normalizedRows.slice(1).forEach((r) => lines.push(formatRow(r)));
      } else {
        normalizedRows.forEach((r) => lines.push(formatRow(r)));
      }
      lines.push(border);
      setResult(lines.join('\n'));
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"Name,Age,City\nAlice,30,NYC\nBob,25,LA"} rows={6} aria-label={`Input text for ${toolName}`} className="input-field font-mono" />
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div>
            <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
            <select id={`${toolId}-delim`} value={delimiter} onChange={(e) => setDelimiter(e.target.value)} aria-label="Delimiter" className="input-field">
              <option value=",">Comma</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe</option>
              <option value=";">Semicolon</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
            <select id={`${toolId}-format`} value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as 'markdown' | 'ascii')} aria-label="Output format" className="input-field">
              <option value="markdown">Markdown</option>
              <option value="ascii">ASCII</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} aria-label="First row is header" className="rounded" />
              First row is header
            </label>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert to table">Convert</button>

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
