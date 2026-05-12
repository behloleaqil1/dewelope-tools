'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CsvToMarkdownTable({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const convert = () => {
    if (!input.trim()) { setOutput(''); return; }
    const lines = input.split('\n').filter(l => l.trim());
    if (lines.length === 0) { setOutput(''); return; }
    const rows = lines.map(line => line.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    const header = `| ${rows[0].join(' | ')} |`;
    const separator = `| ${rows[0].map(() => '---').join(' | ')} |`;
    const body = rows.slice(1).map(row => `| ${row.join(' | ')} |`);
    setOutput([header, separator, ...body].join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">CSV Data</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Name,Age,City&#10;John,30,NYC&#10;Jane,25,LA" aria-label={`Input for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to Markdown</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
