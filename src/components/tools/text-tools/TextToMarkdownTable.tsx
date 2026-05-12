'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TextToMarkdownTable - Convert tab/comma separated text to Markdown table.
 */
export default function TextToMarkdownTable({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
  const [alignment, setAlignment] = useState('left');
  const [output, setOutput] = useState('');

  const generate = () => {
    if (!input.trim()) { setOutput(''); return; }

    const sep = delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : '|';
    const rows = input.trim().split('\n').map(line => line.split(sep).map(cell => cell.trim()));

    const colCount = Math.max(...rows.map(r => r.length));
    const normalized = rows.map(r => {
      while (r.length < colCount) r.push('');
      return r;
    });

    if (normalized.length === 0) { setOutput(''); return; }

    const header = '| ' + normalized[0].join(' | ') + ' |';
    let separatorCell = '---';
    if (alignment === 'center') separatorCell = ':---:';
    else if (alignment === 'right') separatorCell = '---:';
    else separatorCell = ':---';

    const separatorRow = '| ' + Array(colCount).fill(separatorCell).join(' | ') + ' |';

    const dataRows = normalized.slice(1).map(row => '| ' + row.join(' | ') + ' |');

    const result = [header, separatorRow, ...dataRows].join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-delim`} className="block text-sm font-medium text-gray-700 mb-1">Delimiter</label>
              <select id={`${toolId}-delim`} value={delimiter} onChange={e => setDelimiter(e.target.value)} aria-label="Delimiter" className="input-field">
                <option value="tab">Tab</option>
                <option value="comma">Comma</option>
                <option value="pipe">Pipe (|)</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
              <select id={`${toolId}-align`} value={alignment} onChange={e => setAlignment(e.target.value)} aria-label="Column alignment" className="input-field">
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Input Data (first row = header)</label>
            <textarea id={`${toolId}-input`} value={input} onChange={e => setInput(e.target.value)} placeholder={"Name\tAge\tCity\nAlice\t30\tNew York\nBob\t25\tLondon"} aria-label={`Data input for ${toolName}`} className="input-field h-40 resize-y font-mono" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Convert to Markdown Table</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Markdown Table</label>
            <pre className="whitespace-pre text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
