'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const RATIOS = [
  { name: '16:9', w: 16, h: 9 }, { name: '4:3', w: 4, h: 3 }, { name: '1:1', w: 1, h: 1 },
  { name: '21:9', w: 21, h: 9 }, { name: '3:2', w: 3, h: 2 }, { name: '9:16', w: 9, h: 16 },
];

export default function ImageDimensionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('1920');
  const [output, setOutput] = useState('');

  const calculate = () => {
    const w = parseInt(width);
    if (isNaN(w) || w <= 0) { setOutput('Enter a valid width.'); return; }
    const results = RATIOS.map(r => {
      const h = Math.round(w * r.h / r.w);
      return `${r.name}: ${w} × ${h}px`;
    });
    setOutput(`Width: ${w}px\n\n${results.join('\n')}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
        <input id={`${toolId}-input`} type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={calculate} className="btn-primary">Calculate Dimensions</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
