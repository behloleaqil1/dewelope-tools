'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function WaistToHipRatio({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(waist), h = parseFloat(hip);
    if (isNaN(w) || isNaN(h) || h === 0) { setOutput('Enter valid waist and hip measurements'); return; }
    const ratio = w / h;
    const risk = gender === 'male' ? (ratio > 0.9 ? 'High' : ratio > 0.85 ? 'Moderate' : 'Low') : (ratio > 0.85 ? 'High' : ratio > 0.8 ? 'Moderate' : 'Low');
    setOutput(`Waist-to-Hip Ratio: ${ratio.toFixed(3)}\nHealth Risk: ${risk}\nWaist: ${w} cm | Hip: ${h} cm\nGender: ${gender}\n\nWHO Guidelines:\n• Male: <0.90 (low risk)\n• Female: <0.85 (low risk)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="input-field" aria-label={`Gender for ${toolName}`}><option value="male">Male</option><option value="female">Female</option></select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
        <input id={`${toolId}-waist`} value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="80" className="input-field" aria-label={`Waist for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-hip`} className="block text-sm font-medium text-gray-700 mb-1">Hip (cm)</label>
        <input id={`${toolId}-hip`} value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95" className="input-field" aria-label={`Hip for ${toolName}`} />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Ratio</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
