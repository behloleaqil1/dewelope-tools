'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorStepsGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#0000ff');
  const [steps, setSteps] = useState('5');
  const [colors, setColors] = useState<string[]>([]);

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  };

  const generate = () => {
    const n = parseInt(steps);
    if (isNaN(n) || n < 2) return;
    const [r1, g1, b1] = hexToRgb(color1);
    const [r2, g2, b2] = hexToRgb(color2);
    const result: string[] = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const r = Math.round(r1 + (r2 - r1) * t);
      const g = Math.round(g1 + (g2 - g1) * t);
      const b = Math.round(b1 + (b2 - b1) * t);
      result.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }
    setColors(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Color</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="Start color" className="h-10 w-full rounded border border-gray-300" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Color</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="End color" className="h-10 w-full rounded border border-gray-300" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
          <input id={`${toolId}-steps`} type="text" inputMode="numeric" value={steps} onChange={(e) => setSteps(e.target.value)} aria-label={`Steps for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary" aria-label="Generate color steps">Generate</button>
      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-2">
            <div className="flex rounded overflow-hidden h-12">
              {colors.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c }} />)}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {colors.map((c, i) => <span key={i} className="text-xs font-mono text-center">{c}</span>)}
            </div>
            <CopyToClipboard text={colors.join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
