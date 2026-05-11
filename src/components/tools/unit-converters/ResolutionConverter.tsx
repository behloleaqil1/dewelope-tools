'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ResolutionConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('dpi');
  const [output, setOutput] = useState('');

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) { setOutput('Enter a valid positive number.'); return; }
    let dpi: number;
    switch (fromUnit) {
      case 'dpi': case 'ppi': dpi = num; break;
      case 'dpcm': dpi = num * 2.54; break;
      case 'dpmm': dpi = num * 25.4; break;
      default: dpi = num;
    }
    setOutput(`${num} ${fromUnit.toUpperCase()} =\n\nDPI: ${dpi.toFixed(4)}\nPPI: ${dpi.toFixed(4)}\nDPCM: ${(dpi / 2.54).toFixed(4)}\nDPMM: ${(dpi / 25.4).toFixed(4)}\n\nDot size: ${(25.4 / dpi).toFixed(4)} mm`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 300" aria-label={`Value for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
          <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-field" aria-label="From unit">
            <option value="dpi">DPI</option><option value="ppi">PPI</option><option value="dpcm">DPCM</option><option value="dpmm">DPMM</option>
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
