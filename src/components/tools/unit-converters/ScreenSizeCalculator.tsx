'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ScreenSizeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [diagonal, setDiagonal] = useState('');
  const [ratioW, setRatioW] = useState('16');
  const [ratioH, setRatioH] = useState('9');
  const [result, setResult] = useState('');

  const calculate = () => {
    const d = parseFloat(diagonal);
    const rw = parseFloat(ratioW);
    const rh = parseFloat(ratioH);
    if (isNaN(d) || isNaN(rw) || isNaN(rh)) return;
    const width = d * rw / Math.sqrt(rw * rw + rh * rh);
    const height = d * rh / Math.sqrt(rw * rw + rh * rh);
    const area = width * height;
    setResult(`Diagonal: ${d}"\nWidth: ${width.toFixed(2)}" (${(width * 2.54).toFixed(2)} cm)\nHeight: ${height.toFixed(2)}" (${(height * 2.54).toFixed(2)} cm)\nArea: ${area.toFixed(2)} sq in\nAspect Ratio: ${rw}:${rh}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-diag`} className="block text-sm font-medium text-gray-700 mb-1">Diagonal Size (inches)</label>
        <input id={`${toolId}-diag`} type="text" inputMode="decimal" value={diagonal} onChange={(e) => setDiagonal(e.target.value)} placeholder="e.g. 27" aria-label={`Diagonal for ${toolName}`} className="input-field" />
      </InputArea>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-rw`} className="block text-sm font-medium text-gray-700 mb-1">Ratio Width</label>
          <input id={`${toolId}-rw`} type="text" inputMode="decimal" value={ratioW} onChange={(e) => setRatioW(e.target.value)} aria-label={`Ratio width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-rh`} className="block text-sm font-medium text-gray-700 mb-1">Ratio Height</label>
          <input id={`${toolId}-rh`} type="text" inputMode="decimal" value={ratioH} onChange={(e) => setRatioH(e.target.value)} aria-label={`Ratio height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary" aria-label="Calculate screen size">Calculate</button>
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
