'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CsvColumnExtractor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [colIndex, setColIndex] = useState('0');
  const [output, setOutput] = useState('');

  const extract = () => {
    if (!input.trim()) { setOutput(''); return; }
    const idx = parseInt(colIndex, 10);
    if (isNaN(idx) || idx < 0) { setOutput('Please enter a valid column index (0-based).'); return; }
    const lines = input.split('\n').filter(l => l.trim());
    const extracted = lines.map(line => {
      const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      return cols[idx] ?? '';
    });
    setOutput(extracted.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">CSV Data</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="name,age,city&#10;John,30,NYC" aria-label={`Input for ${toolName}`} className="input-field h-36 resize-y font-mono" />
        <label className="block text-sm font-medium text-gray-700 mt-2">Column Index (0-based)</label>
        <input type="number" value={colIndex} onChange={(e) => setColIndex(e.target.value)} className="input-field w-24" aria-label="Column index" />
      </InputArea>
      <button onClick={extract} className="btn-primary">Extract Column</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
