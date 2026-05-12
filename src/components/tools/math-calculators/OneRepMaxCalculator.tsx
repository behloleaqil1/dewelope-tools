'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function OneRepMaxCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(weight), r = parseInt(reps);
    if (isNaN(w) || isNaN(r) || w <= 0 || r < 1 || r > 30) { setOutput('Enter valid weight and reps (1-30)'); return; }
    const brzycki = w * (36 / (37 - r));
    const epley = w * (1 + r / 30);
    const avg = (brzycki + epley) / 2;
    const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60];
    const table = pcts.map(p => `${p}% = ${(avg * p / 100).toFixed(1)} kg`).join('\n');
    setOutput(`Estimated 1RM:\nBrzycki: ${brzycki.toFixed(1)} kg\nEpley: ${epley.toFixed(1)} kg\nAverage: ${avg.toFixed(1)} kg\n\nPercentage Chart:\n${table}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Weight Lifted (kg)</label>
        <input id={`${toolId}-weight`} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="100" className="input-field" aria-label={`Weight for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-reps`} className="block text-sm font-medium text-gray-700 mb-1">Reps Performed</label>
        <input id={`${toolId}-reps`} value={reps} onChange={(e) => setReps(e.target.value)} placeholder="5" className="input-field" aria-label={`Reps for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate 1RM</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
