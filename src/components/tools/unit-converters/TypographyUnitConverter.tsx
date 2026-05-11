'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const UNITS: Record<string, number> = { point: 1, pica: 12, em: 12, en: 6, inch: 72, cm: 28.3465, mm: 2.83465, px: 0.75 };

export default function TypographyUnitConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('point');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) { setOutput('Enter a valid number.'); return; }
    const points = num * UNITS[fromUnit];
    const results = Object.entries(UNITS).map(([unit, factor]) => `${unit}: ${(points / factor).toFixed(4)}`);
    setOutput(`${num} ${fromUnit}(s) =\n\n${results.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 12" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field" aria-label="From unit">
            {Object.keys(UNITS).map(u => <option key={u} value={u}>{u}</option>)}
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
