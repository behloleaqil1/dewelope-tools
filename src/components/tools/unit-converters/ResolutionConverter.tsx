'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ResolutionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('dpi');
  const [result, setResult] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    let dpi: number;
    if (fromUnit === 'dpi' || fromUnit === 'ppi') dpi = num;
    else dpi = num * 2.54; // dpcm to dpi
    const ppi = dpi;
    const dpcm = dpi / 2.54;
    setResult(`DPI: ${ppi.toFixed(2)}\nPPI: ${ppi.toFixed(2)}\nDPCM: ${dpcm.toFixed(2)}\nDots per mm: ${(dpcm / 10).toFixed(4)}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-val`} className="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input id={`${toolId}-val`} type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 300" aria-label={`Value for ${toolName}`} className="input-field" />
      </InputArea>
      <InputArea>
        <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
        <select id={`${toolId}-unit`} value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} aria-label={`Unit for ${toolName}`} className="input-field">
          <option value="dpi">DPI (dots per inch)</option>
          <option value="ppi">PPI (pixels per inch)</option>
          <option value="dpcm">DPCM (dots per cm)</option>
        </select>
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert resolution">Convert</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
