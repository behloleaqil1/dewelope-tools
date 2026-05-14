'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SvgWaveGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [amplitude, setAmplitude] = useState('40');
  const [frequency, setFrequency] = useState('2');
  const [color, setColor] = useState('#3b82f6');
  const [width, setWidth] = useState('800');
  const [height, setHeight] = useState('200');
  const [output, setOutput] = useState('');

  const generate = () => {
    const w = parseInt(width) || 800;
    const h = parseInt(height) || 200;
    const amp = parseInt(amplitude) || 40;
    const freq = parseFloat(frequency) || 2;
    const midY = h / 2;

    const points: string[] = [];
    const step = 2;
    for (let x = 0; x <= w; x += step) {
      const y = midY + amp * Math.sin((x / w) * freq * Math.PI * 2);
      points.push(`${x === 0 ? 'M' : 'L'} ${x} ${y.toFixed(1)}`);
    }
    points.push(`L ${w} ${h} L 0 ${h} Z`);

    const path = points.join(' ');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
  <path d="${path}" fill="${color}" />
</svg>`;

    setOutput(svg);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-amp`} className="block text-sm font-medium text-gray-700 mb-1">Amplitude: {amplitude}px</label>
          <input id={`${toolId}-amp`} type="range" min="10" max="80" value={amplitude} onChange={(e) => setAmplitude(e.target.value)} aria-label={`Amplitude for ${toolName}`} className="w-full" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">Frequency: {frequency}</label>
          <input id={`${toolId}-freq`} type="range" min="0.5" max="5" step="0.5" value={frequency} onChange={(e) => setFrequency(e.target.value)} aria-label={`Frequency for ${toolName}`} className="w-full" />
        </InputArea>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width</label>
          <input id={`${toolId}-w`} type="number" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <input id={`${toolId}-h`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} aria-label={`Height for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Wave</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><div className="border rounded overflow-hidden" dangerouslySetInnerHTML={{ __html: output }} /><pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border max-h-40 overflow-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
