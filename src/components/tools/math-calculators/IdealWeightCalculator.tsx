'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function IdealWeightCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const h = parseFloat(height);
    if (isNaN(h) || h < 100 || h > 250) { setOutput('Enter height between 100-250 cm'); return; }
    const inches = h / 2.54;
    const over60 = Math.max(0, inches - 60);
    const devine = gender === 'male' ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60;
    const robinson = gender === 'male' ? 52 + 1.9 * over60 : 49 + 1.7 * over60;
    const miller = gender === 'male' ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60;
    setOutput(`Devine Formula: ${devine.toFixed(1)} kg\nRobinson Formula: ${robinson.toFixed(1)} kg\nMiller Formula: ${miller.toFixed(1)} kg\nAverage: ${((devine + robinson + miller) / 3).toFixed(1)} kg\nHeight: ${h} cm | Gender: ${gender}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="input-field" aria-label={`Gender for ${toolName}`}><option value="male">Male</option><option value="female">Female</option></select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
        <input id={`${toolId}-height`} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="input-field" aria-label={`Height for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Ideal Weight</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
