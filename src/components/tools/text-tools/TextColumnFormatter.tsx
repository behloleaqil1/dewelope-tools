'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TextColumnFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [columns, setColumns] = useState('2');
  const [separator, setSeparator] = useState('  ');
  const [output, setOutput] = useState('');

  const format = () => {
    if (!input.trim()) { setOutput(''); return; }
    const numCols = parseInt(columns) || 2;
    const lines = input.split('\n').filter(l => l.trim());

    if (numCols < 1) { setOutput('Columns must be at least 1.'); return; }

    const colWidth = Math.max(...lines.map(l => l.length)) + separator.length;
    const rows = Math.ceil(lines.length / numCols);
    const result: string[] = [];

    for (let row = 0; row < rows; row++) {
      let line = '';
      for (let col = 0; col < numCols; col++) {
        const idx = col * rows + row;
        if (idx < lines.length) {
          line += col < numCols - 1 ? lines[idx].padEnd(colWidth) : lines[idx];
        }
      }
      result.push(line.trimEnd());
    }

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-cols`} className="block text-sm font-medium text-gray-700 mb-1">Number of Columns</label>
          <input id={`${toolId}-cols`} type="number" min="1" max="10" value={columns} onChange={(e) => setColumns(e.target.value)} aria-label={`Number of columns for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-sep`} className="block text-sm font-medium text-gray-700 mb-1">Column Separator</label>
          <select id={`${toolId}-sep`} value={separator} onChange={(e) => setSeparator(e.target.value)} aria-label={`Separator for ${toolName}`} className="input-field">
            <option value="  ">2 Spaces</option>
            <option value="    ">4 Spaces</option>
            <option value="\t">Tab</option>
            <option value=" | ">Pipe</option>
          </select>
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Text (one item per line)</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Apple\nBanana\nCherry\nDate\nElderberry\nFig" aria-label={`Text input for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={format} className="btn-primary">Format Columns</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
