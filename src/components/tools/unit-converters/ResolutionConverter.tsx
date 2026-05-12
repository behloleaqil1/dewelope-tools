'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ResolutionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('dpi');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) { setOutput('Enter a valid positive number.'); return; }
    let dpi: number;
    if (from === 'dpi' || from === 'ppi') dpi = num;
    else dpi = num * 2.54; // dpcm to dpi
    const ppi = dpi;
    const dpcm = dpi / 2.54;
    const dpmm = dpcm / 10;
    setOutput(`DPI: ${ppi.toFixed(2)}\nPPI: ${ppi.toFixed(2)}\nDPCM: ${dpcm.toFixed(2)}\nDPMM: ${dpmm.toFixed(4)}\nPixel size: ${(25.4 / ppi).toFixed(4)} mm`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-2">
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" aria-label={`Value for ${toolName}`} className="input-field" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-32" aria-label="From unit">
            <option value="dpi">DPI</option>
            <option value="ppi">PPI</option>
            <option value="dpcm">DPCM</option>
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
