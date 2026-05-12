'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AgeAtDateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const birth = new Date(birthDate), target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) { setOutput('Enter valid dates'); return; }
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(target.getFullYear(), target.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / 86400000);
    setOutput(`Age at ${targetDate}: ${years} years, ${months} months, ${days} days\nTotal days: ${totalDays.toLocaleString()}\nTotal weeks: ${Math.floor(totalDays / 7).toLocaleString()}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-birth`} className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
        <input id={`${toolId}-birth`} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="input-field" aria-label={`Birth date for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-target`} className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
        <input id={`${toolId}-target`} type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="input-field" aria-label={`Target date for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Age</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
