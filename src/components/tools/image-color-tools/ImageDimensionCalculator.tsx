'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ImageDimensionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [origW, setOrigW] = useState('');
  const [origH, setOrigH] = useState('');
  const [targetW, setTargetW] = useState('');
  const [targetH, setTargetH] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    const ow = parseFloat(origW);
    const oh = parseFloat(origH);
    if (isNaN(ow) || isNaN(oh) || ow === 0 || oh === 0) return;
    const ratio = ow / oh;
    let nw: number, nh: number;
    if (targetW && !targetH) {
      nw = parseFloat(targetW);
      nh = nw / ratio;
    } else if (targetH && !targetW) {
      nh = parseFloat(targetH);
      nw = nh * ratio;
    } else if (targetW && targetH) {
      nw = parseFloat(targetW);
      nh = parseFloat(targetH);
    } else return;
    if (isNaN(nw!) || isNaN(nh!)) return;
    const scale = (nw! / ow * 100).toFixed(1);
    setResult(`Original: ${ow} × ${oh}\nNew: ${Math.round(nw!)} × ${Math.round(nh!)}\nAspect Ratio: ${ratio.toFixed(4)} (${Math.round(ow / gcd(ow, oh))}:${Math.round(oh / gcd(ow, oh))})\nScale: ${scale}%`);
  };

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

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
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-tw`} className="block text-sm font-medium text-gray-700 mb-1">New Width (or leave empty)</label>
          <input id={`${toolId}-tw`} type="text" inputMode="decimal" value={targetW} onChange={(e) => setTargetW(e.target.value)} placeholder="800" aria-label={`Target width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-th`} className="block text-sm font-medium text-gray-700 mb-1">New Height (or leave empty)</label>
          <input id={`${toolId}-th`} type="text" inputMode="decimal" value={targetH} onChange={(e) => setTargetH(e.target.value)} placeholder="" aria-label={`Target height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate dimensions">Calculate</button>
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
