'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PaceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = parseFloat(distance);
    const totalSec = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    if (isNaN(d) || d <= 0 || totalSec <= 0) { setOutput('Enter valid distance and time'); return; }
    const paceSecPerUnit = totalSec / d;
    const paceMin = Math.floor(paceSecPerUnit / 60);
    const paceSec = Math.round(paceSecPerUnit % 60);
    const speed = (d / (totalSec / 3600)).toFixed(2);
    setOutput(`Pace: ${paceMin}:${paceSec.toString().padStart(2, '0')} min/${unit}\nSpeed: ${speed} ${unit}/h\nTotal time: ${hours || 0}h ${minutes || 0}m ${seconds || 0}s\nDistance: ${d} ${unit}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
        <div className="flex gap-2">
          <input id={`${toolId}-dist`} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="5" className="input-field flex-1" aria-label={`Distance for ${toolName}`} />
          <select value={unit} onChange={(e) => setUnit(e.target.value as 'km' | 'mi')} className="input-field w-20" aria-label="Unit"><option value="km">km</option><option value="mi">mi</option></select>
        </div>
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <div className="flex gap-2">
          <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0h" className="input-field flex-1" aria-label="Hours" />
          <input value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="25m" className="input-field flex-1" aria-label="Minutes" />
          <input value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="0s" className="input-field flex-1" aria-label="Seconds" />
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Pace</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
