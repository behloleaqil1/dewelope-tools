'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function TimeCardCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [entries, setEntries] = useState('09:00-17:00\n09:00-17:30\n08:30-17:00\n09:00-17:00\n09:00-16:30');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const lines = entries.split('\n').filter(l => l.trim());
    let totalMinutes = 0;
    const daily: string[] = [];
    lines.forEach((line, i) => {
      const match = line.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      if (!match) { daily.push(`Day ${i + 1}: Invalid format`); return; }
      const startMin = parseInt(match[1]) * 60 + parseInt(match[2]);
      const endMin = parseInt(match[3]) * 60 + parseInt(match[4]);
      const diff = endMin - startMin;
      totalMinutes += diff;
      daily.push(`Day ${i + 1}: ${(diff / 60).toFixed(2)} hours`);
    });
    const totalHours = totalMinutes / 60;
    setOutput(`${daily.join('\n')}\n\nTotal: ${totalHours.toFixed(2)} hours (${totalMinutes} minutes)\nAverage: ${(totalHours / lines.length).toFixed(2)} hours/day`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-entries`} className="block text-sm font-medium text-gray-700 mb-1">Clock In/Out (HH:MM-HH:MM per line)</label>
        <textarea id={`${toolId}-entries`} value={entries} onChange={(e) => setEntries(e.target.value)} placeholder="09:00-17:00" aria-label={`Entries for ${toolName}`} className="input-field h-36 resize-y font-mono" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Hours</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
