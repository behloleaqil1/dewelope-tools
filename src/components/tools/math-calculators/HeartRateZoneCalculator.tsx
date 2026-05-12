'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function HeartRateZoneCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [age, setAge] = useState('');
  const [restHr, setRestHr] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const a = parseInt(age), rhr = parseInt(restHr) || 60;
    if (isNaN(a) || a < 10 || a > 100) { setOutput('Enter valid age (10-100)'); return; }
    const maxHr = 220 - a;
    const zones = [
      { name: 'Zone 1 (Recovery)', min: 0.5, max: 0.6 },
      { name: 'Zone 2 (Aerobic)', min: 0.6, max: 0.7 },
      { name: 'Zone 3 (Tempo)', min: 0.7, max: 0.8 },
      { name: 'Zone 4 (Threshold)', min: 0.8, max: 0.9 },
      { name: 'Zone 5 (VO2 Max)', min: 0.9, max: 1.0 },
    ];
    const lines = zones.map(z => {
      const low = Math.round((maxHr - rhr) * z.min + rhr);
      const high = Math.round((maxHr - rhr) * z.max + rhr);
      return `${z.name}: ${low}-${high} bpm`;
    });
    setOutput(`Max Heart Rate: ${maxHr} bpm\nResting HR: ${rhr} bpm\nMethod: Karvonen Formula\n\n${lines.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-age`} className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input id={`${toolId}-age`} value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className="input-field" aria-label={`Age for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-rhr`} className="block text-sm font-medium text-gray-700 mb-1">Resting Heart Rate (optional)</label>
        <input id={`${toolId}-rhr`} value={restHr} onChange={(e) => setRestHr(e.target.value)} placeholder="60" className="input-field" aria-label={`Resting HR for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Zones</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
