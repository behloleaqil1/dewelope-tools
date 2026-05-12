'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function DatePatternGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [output, setOutput] = useState('');

  const generate = () => {
    const d = new Date(date + 'T12:00:00');
    if (isNaN(d.getTime())) { setOutput('Enter a valid date'); return; }
    const formats = [
      ['YYYY-MM-DD', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`],
      ['MM/DD/YYYY', `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`],
      ['DD/MM/YYYY', `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`],
      ['Month DD, YYYY', d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })],
      ['DD Month YYYY', `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'long' })} ${d.getFullYear()}`],
      ['Day, Month DD', d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })],
      ['ISO 8601', d.toISOString()],
      ['Unix Timestamp', String(Math.floor(d.getTime() / 1000))],
    ];
    setOutput(formats.map(([label, val]) => `${label}: ${val}`).join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" aria-label={`Date for ${toolName}`} />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Formats</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
