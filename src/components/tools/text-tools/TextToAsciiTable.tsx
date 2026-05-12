'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToAsciiTable - Format data as ASCII art table with borders.
 */
export default function TextToAsciiTable({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input.trim()) { setOutput(''); return; }

    const sep = delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : '|';
    const rows = input.trim().split('\n').map(line => line.split(sep).map(cell => cell.trim()));

    const colCount = Math.max(...rows.map(r => r.length));
    // Normalize rows
    const normalized = rows.map(r => {
      while (r.length < colCount) r.push('');
      return r;
    });

    // Calculate column widths
    const widths: number[] = [];
    for (let c = 0; c < colCount; c++) {
      widths.push(Math.max(...normalized.map(r => r[c].length), 3));
    }

    const horizontalLine = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';
    const formatRow = (row: string[]) => '| ' + row.map((cell, i) => cell.padEnd(widths[i])).join(' | ') + ' |';

    const lines: string[] = [];
    lines.push(horizontalLine);
    if (normalized.length > 0) {
      lines.push(formatRow(normalized[0]));
      lines.push('+' + widths.map(w => '='.repeat(w + 2)).join('+') + '+');
      for (let i = 1; i < normalized.length; i++) {
        lines.push(formatRow(normalized[i]));
        lines.push(horizontalLine);
      }
    }

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
            <select id={`${toolId}-delim`} value={delimiter} onChange={e => setDelimiter(e.target.value)} aria-label="Delimiter" className="input-field">
              <option value="tab">Tab</option>
              <option value="comma">Comma</option>
              <option value="pipe">Pipe (|)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Data (one row per line)</label>
            <textarea id={`${toolId}-input`} value={input} onChange={e => setInput(e.target.value)} placeholder={"Name\tAge\tCity\nAlice\t30\tNew York\nBob\t25\tLondon"} aria-label={`Data input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate ASCII Table</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ASCII Table</label>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
