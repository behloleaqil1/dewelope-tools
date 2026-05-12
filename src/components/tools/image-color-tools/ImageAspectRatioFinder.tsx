'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ImageAspectRatioFinder - Find aspect ratio from width and height dimensions.
 */
export default function ImageAspectRatioFinder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

  function calculate() {
    setError(undefined);
    setOutput('');
    const w = parseInt(width);
    const h = parseInt(height);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) { setError('Enter valid positive dimensions'); return; }

    const divisor = gcd(w, h);
    const ratioW = w / divisor;
    const ratioH = h / divisor;
    const decimal = (w / h).toFixed(4);

    setOutput(`Dimensions: ${w} × ${h}\nAspect Ratio: ${ratioW}:${ratioH}\nDecimal: ${decimal}\nOrientation: ${w > h ? 'Landscape' : w < h ? 'Portrait' : 'Square'}`);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions for {toolName}</label>
        <div className="flex gap-2 items-center">
          <input type="text" inputMode="numeric" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="Width (px)" aria-label="Image width" className="input-field flex-1" />
          <span className="text-lg font-bold text-gray-400">×</span>
          <input type="text" inputMode="numeric" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (px)" aria-label="Image height" className="input-field flex-1" />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Find aspect ratio" className="btn-primary">Find Ratio</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
