'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const UNITS: Record<string, number> = { liter: 1, 'us-gallon': 3.78541, 'uk-gallon': 4.54609, barrel: 158.987, 'us-quart': 0.946353, 'us-pint': 0.473176 };

export default function FuelVolumeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('liter');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) { setOutput('Enter a valid number.'); return; }
    const liters = num * UNITS[fromUnit];
    const results = Object.entries(UNITS).map(([unit, factor]) => `${unit.replace('-', ' ')}: ${(liters / factor).toFixed(4)}`);
    setOutput(`${num} ${fromUnit.replace('-', ' ')}(s) =\n\n${results.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 100" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field" aria-label="From unit">
            {Object.keys(UNITS).map(u => <option key={u} value={u}>{u.replace('-', ' ')}</option>)}
          </select>
        </InputArea>
      </div>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
