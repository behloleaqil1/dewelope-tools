'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssPatternBackgroundGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [pattern, setPattern] = useState('dots');
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#ffffff');
  const [size, setSize] = useState('20');
  const [output, setOutput] = useState('');

  const patterns: Record<string, (c1: string, c2: string, s: number) => string> = {
    dots: (c1, c2, s) => `background-color: ${c2};\nbackground-image: radial-gradient(${c1} 1px, transparent 1px);\nbackground-size: ${s}px ${s}px;`,
    stripes: (c1, c2, s) => `background: repeating-linear-gradient(\n  45deg,\n  ${c1},\n  ${c1} ${s / 4}px,\n  ${c2} ${s / 4}px,\n  ${c2} ${s / 2}px\n);`,
    checkerboard: (c1, c2, s) => `background-color: ${c2};\nbackground-image:\n  linear-gradient(45deg, ${c1} 25%, transparent 25%),\n  linear-gradient(-45deg, ${c1} 25%, transparent 25%),\n  linear-gradient(45deg, transparent 75%, ${c1} 75%),\n  linear-gradient(-45deg, transparent 75%, ${c1} 75%);\nbackground-size: ${s}px ${s}px;\nbackground-position: 0 0, 0 ${s / 2}px, ${s / 2}px -${s / 2}px, -${s / 2}px 0px;`,
    grid: (c1, c2, s) => `background-color: ${c2};\nbackground-image:\n  linear-gradient(${c1} 1px, transparent 1px),\n  linear-gradient(90deg, ${c1} 1px, transparent 1px);\nbackground-size: ${s}px ${s}px;`,
    zigzag: (c1, c2, s) => `background-color: ${c2};\nbackground-image:\n  linear-gradient(135deg, ${c1} 25%, transparent 25%),\n  linear-gradient(225deg, ${c1} 25%, transparent 25%),\n  linear-gradient(315deg, ${c1} 25%, transparent 25%),\n  linear-gradient(45deg, ${c1} 25%, transparent 25%);\nbackground-size: ${s}px ${s}px;\nbackground-position: 0 0, ${s / 2}px 0, ${s / 2}px -${s / 2}px, 0px ${s / 2}px;`,
  };

  const generate = () => {
    const s = parseInt(size) || 20;
    const css = `.pattern {\n  ${patterns[pattern](color1, color2, s)}\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-pattern`} className="block text-sm font-medium text-gray-700 mb-1">Pattern Type</label>
        <select id={`${toolId}-pattern`} value={pattern} onChange={(e) => setPattern(e.target.value)} aria-label={`Pattern type for ${toolName}`} className="input-field">
          <option value="dots">Dots</option>
          <option value="stripes">Diagonal Stripes</option>
          <option value="checkerboard">Checkerboard</option>
          <option value="grid">Grid</option>
          <option value="zigzag">Zigzag</option>
        </select>
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label={`Color 1 for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label={`Color 2 for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
          <input id={`${toolId}-size`} type="number" min="5" max="100" value={size} onChange={(e) => setSize(e.target.value)} aria-label={`Pattern size for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Pattern CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
