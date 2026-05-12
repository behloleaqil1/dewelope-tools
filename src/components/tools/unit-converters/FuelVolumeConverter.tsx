'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const UNITS: Record<string, number> = { liter: 1, 'us-gallon': 3.78541, 'uk-gallon': 4.54609, barrel: 158.987, quart: 0.946353, pint: 0.473176 };

export default function FuelVolumeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('liter');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) { setOutput('Enter a valid number.'); return; }
    const inLiters = num * UNITS[from];
    const results = Object.entries(UNITS).map(([unit, factor]) => `${unit}: ${(inLiters / factor).toFixed(4)}`);
    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2">
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" aria-label={`Value for ${toolName}`} className="input-field" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-36" aria-label="From unit">
            {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
