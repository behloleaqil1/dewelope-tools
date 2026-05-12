'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BodyFatCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState('');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseFloat(waist), n = parseFloat(neck), h = parseFloat(height), hp = parseFloat(hip);
    if (isNaN(w) || isNaN(n) || isNaN(h)) { setOutput('Enter valid measurements in cm'); return; }
    let bf: number;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (isNaN(hp)) { setOutput('Hip measurement required for female'); return; }
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }
    const category = bf < 14 ? 'Athletic' : bf < 21 ? 'Fitness' : bf < 25 ? 'Average' : 'Above Average';
    setOutput(`Body Fat: ~${bf.toFixed(1)}%\nCategory: ${category}\nMethod: US Navy Formula`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-gender`} className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select id={`${toolId}-gender`} value={gender} onChange={(e) => setGender(e.target.value as 'male' | 'female')} className="input-field" aria-label={`Gender for ${toolName}`}><option value="male">Male</option><option value="female">Female</option></select>
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-waist`} className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
        <input id={`${toolId}-waist`} value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="85" className="input-field" aria-label={`Waist for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-neck`} className="block text-sm font-medium text-gray-700 mb-1">Neck (cm)</label>
        <input id={`${toolId}-neck`} value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" className="input-field" aria-label={`Neck for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
        <input id={`${toolId}-height`} value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="input-field" aria-label={`Height for ${toolName}`} />
      </InputArea>
      {gender === 'female' && <InputArea><label htmlFor={`${toolId}-hip`} className="block text-sm font-medium text-gray-700 mb-1">Hip (cm)</label><input id={`${toolId}-hip`} value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95" className="input-field" aria-label={`Hip for ${toolName}`} /></InputArea>}
      <button onClick={calculate} className="btn-primary">Calculate Body Fat</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
