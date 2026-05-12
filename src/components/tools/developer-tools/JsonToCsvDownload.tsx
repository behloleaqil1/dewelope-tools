'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function JsonToCsvDownload({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  const convert = () => {
    if (!input.trim()) { setError('Please enter JSON'); setOutput(''); return; }
    try {
      const data = JSON.parse(input);
      const arr = Array.isArray(data) ? data : [data];
      if (arr.length === 0) { setOutput(''); return; }
      const headers = Object.keys(arr[0]);
      const rows = arr.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
      setError(undefined);
      setOutput([headers.join(','), ...rows].join('\n'));
    } catch { setError('Invalid JSON input'); setOutput(''); }
  };

  const download = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'data.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">JSON Input</label>
        <textarea id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder='[{"name":"John","age":30}]' aria-label={`Input for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert to CSV</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-48 overflow-y-auto">{output}</pre><div className="flex gap-2"><CopyToClipboard text={output} /><button onClick={download} className="btn-primary text-sm">Download CSV</button></div></div>)}
      </OutputArea>
    </div>
  );
}
