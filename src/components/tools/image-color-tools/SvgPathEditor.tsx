'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SvgPathEditor({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pathData, setPathData] = useState('M 10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80');
  const [scale, setScale] = useState('1');
  const [translateX, setTranslateX] = useState('0');
  const [translateY, setTranslateY] = useState('0');
  const [output, setOutput] = useState('');

  const transform = () => {
    if (!pathData.trim()) { setOutput(''); return; }
    const s = parseFloat(scale) || 1;
    const tx = parseFloat(translateX) || 0;
    const ty = parseFloat(translateY) || 0;

    const transformed = pathData.replace(/-?\d+\.?\d*/g, (match, offset) => {
      const num = parseFloat(match);
      // Determine if x or y coordinate based on position context
      const before = pathData.slice(0, offset);
      const numsBefore = before.match(/-?\d+\.?\d*/g) || [];
      const isY = numsBefore.length % 2 === 1;
      const translated = isY ? num * s + ty : num * s + tx;
      return translated.toFixed(2).replace(/\.?0+$/, '');
    });

    setOutput(transformed);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-path`} className="block text-sm font-medium text-gray-700 mb-1">SVG Path Data</label>
        <textarea id={`${toolId}-path`} value={pathData} onChange={(e) => setPathData(e.target.value)} placeholder="M 10 80 C 40 10, 65 10, 95 80" aria-label={`SVG path data for ${toolName}`} className="input-field h-24 resize-y font-mono" />
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-scale`} className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
          <input id={`${toolId}-scale`} type="number" step="0.1" value={scale} onChange={(e) => setScale(e.target.value)} aria-label={`Scale for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-tx`} className="block text-sm font-medium text-gray-700 mb-1">Translate X</label>
          <input id={`${toolId}-tx`} type="number" value={translateX} onChange={(e) => setTranslateX(e.target.value)} aria-label={`Translate X for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-ty`} className="block text-sm font-medium text-gray-700 mb-1">Translate Y</label>
          <input id={`${toolId}-ty`} type="number" value={translateY} onChange={(e) => setTranslateY(e.target.value)} aria-label={`Translate Y for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      {/* Preview */}
      <div className="border rounded-lg p-4 bg-white">
        <svg viewBox="0 0 200 200" className="w-full h-40 border border-gray-200 rounded">
          <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="2" />
        </svg>
      </div>
      <button onClick={transform} className="btn-primary">Transform Path</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
