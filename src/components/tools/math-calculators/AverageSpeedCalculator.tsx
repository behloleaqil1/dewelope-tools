'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function AverageSpeedCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [distUnit, setDistUnit] = useState('km');
  const [timeUnit, setTimeUnit] = useState('hours');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const d = parseFloat(distance), t = parseFloat(time);
    if (isNaN(d) || isNaN(t) || t === 0) { setOutput('Enter valid distance and time (time > 0)'); return; }
    const speed = d / t;
    setOutput(`Average Speed: ${speed.toFixed(2)} ${distUnit}/${timeUnit}\nDistance: ${d} ${distUnit}\nTime: ${t} ${timeUnit}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
        <div className="flex gap-2">
          <input id={`${toolId}-dist`} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="100" className="input-field flex-1" aria-label={`Distance for ${toolName}`} />
          <select value={distUnit} onChange={(e) => setDistUnit(e.target.value)} className="input-field w-24" aria-label="Distance unit"><option value="km">km</option><option value="mi">mi</option><option value="m">m</option></select>
        </div>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time</label>
        <div className="flex gap-2">
          <input id={`${toolId}-time`} value={time} onChange={(e) => setTime(e.target.value)} placeholder="2" className="input-field flex-1" aria-label={`Time for ${toolName}`} />
          <select value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)} className="input-field w-24" aria-label="Time unit"><option value="hours">hrs</option><option value="minutes">min</option><option value="seconds">sec</option></select>
        </div>
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Speed</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
