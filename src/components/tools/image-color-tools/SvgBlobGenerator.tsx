'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SvgBlobGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [complexity, setComplexity] = useState('6');
  const [size, setSize] = useState('200');
  const [color, setColor] = useState('#8b5cf6');
  const [output, setOutput] = useState('');

  const generateBlob = () => {
    const s = parseInt(size) || 200;
    const points = parseInt(complexity) || 6;
    const center = s / 2;
    const radius = s * 0.35;

    const angleStep = (Math.PI * 2) / points;
    const blobPoints: { x: number; y: number }[] = [];

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep;
      const variation = radius * (0.7 + Math.random() * 0.6);
      blobPoints.push({
        x: center + variation * Math.cos(angle),
        y: center + variation * Math.sin(angle),
      });
    }

    // Create smooth path using cubic bezier
    let path = `M ${blobPoints[0].x.toFixed(1)} ${blobPoints[0].y.toFixed(1)}`;
    for (let i = 0; i < blobPoints.length; i++) {
      const curr = blobPoints[i];
      const next = blobPoints[(i + 1) % blobPoints.length];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      path += ` Q ${curr.x.toFixed(1)} ${curr.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
    }
    path += ' Z';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
  <path d="${path}" fill="${color}" />
</svg>`;

    setOutput(svg);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-complexity`} className="block text-sm font-medium text-gray-700 mb-1">Complexity: {complexity}</label>
          <input id={`${toolId}-complexity`} type="range" min="3" max="12" value={complexity} onChange={(e) => setComplexity(e.target.value)} aria-label={`Complexity for ${toolName}`} className="w-full" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={size} onChange={(e) => setSize(e.target.value)} aria-label={`Size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      <button onClick={generateBlob} className="btn-primary">Generate Blob</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><div className="flex justify-center p-4" dangerouslySetInnerHTML={{ __html: output }} /><pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border max-h-40 overflow-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
