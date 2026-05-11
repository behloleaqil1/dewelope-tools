'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ProportionalScaleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [origW, setOrigW] = useState('');
  const [origH, setOrigH] = useState('');
  const [newW, setNewW] = useState('');
  const [newH, setNewH] = useState('');
  const [lockTo, setLockTo] = useState<'width' | 'height'>('width');
  const [result, setResult] = useState('');

  const calculate = () => {
    const ow = parseFloat(origW);
    const oh = parseFloat(origH);
    if (isNaN(ow) || isNaN(oh) || ow === 0 || oh === 0) return;
    const ratio = ow / oh;
    if (lockTo === 'width' && newW) {
      const nw = parseFloat(newW);
      if (isNaN(nw)) return;
      const nh = nw / ratio;
      setResult(`New dimensions: ${nw} × ${nh.toFixed(2)}\nScale: ${((nw / ow) * 100).toFixed(1)}%\nAspect ratio: ${ratio.toFixed(4)}`);
    } else if (lockTo === 'height' && newH) {
      const nh = parseFloat(newH);
      if (isNaN(nh)) return;
      const nw = nh * ratio;
      setResult(`New dimensions: ${nw.toFixed(2)} × ${nh}\nScale: ${((nh / oh) * 100).toFixed(1)}%\nAspect ratio: ${ratio.toFixed(4)}`);
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-ow`} className="block text-sm font-medium text-gray-700 mb-1">Original Width</label>
          <input id={`${toolId}-ow`} type="text" inputMode="decimal" value={origW} onChange={(e) => setOrigW(e.target.value)} placeholder="1920" aria-label={`Original width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-oh`} className="block text-sm font-medium text-gray-700 mb-1">Original Height</label>
          <input id={`${toolId}-oh`} type="text" inputMode="decimal" value={origH} onChange={(e) => setOrigH(e.target.value)} placeholder="1080" aria-label={`Original height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <div className="flex gap-4 items-end">
        <InputArea>
          <label htmlFor={`${toolId}-new`} className="block text-sm font-medium text-gray-700 mb-1">New {lockTo === 'width' ? 'Width' : 'Height'}</label>
          <input id={`${toolId}-new`} type="text" inputMode="decimal" value={lockTo === 'width' ? newW : newH} onChange={(e) => lockTo === 'width' ? setNewW(e.target.value) : setNewH(e.target.value)} placeholder="800" aria-label={`New dimension for ${toolName}`} className="input-field" />
        </InputArea>
        <select value={lockTo} onChange={(e) => setLockTo(e.target.value as 'width' | 'height')} className="input-field mb-0" aria-label="Scale by">
          <option value="width">Scale by Width</option>
          <option value="height">Scale by Height</option>
        </select>
      </div>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate proportional size">Calculate</button>
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
