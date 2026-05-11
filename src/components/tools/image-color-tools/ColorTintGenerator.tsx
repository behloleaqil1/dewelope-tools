'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorTintGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3498db');
  const [output, setOutput] = useState('');

  const generate = () => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const tints = [10, 20, 30, 40, 50, 60, 70, 80, 90].map(pct => {
      const tr = Math.round(r + (255 - r) * (pct / 100));
      const tg = Math.round(g + (255 - g) * (pct / 100));
      const tb = Math.round(b + (255 - b) * (pct / 100));
      return { pct, hex: `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}` };
    });
    setOutput(JSON.stringify(tints));
  };

  const tints = output ? JSON.parse(output) as { pct: number; hex: string }[] : [];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
        <div className="flex gap-2">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-16 cursor-pointer" aria-label={`Color for ${toolName}`} />
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1 font-mono" aria-label="Hex color" />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Tints</button>
      <OutputArea hasContent={tints.length > 0}>
        {tints.length > 0 && (
          <div className="space-y-2">
            {tints.map(t => (
              <div key={t.pct} className="flex items-center gap-2">
                <div className="w-10 h-8 rounded" style={{ backgroundColor: t.hex }} />
                <span className="text-sm font-mono">{t.hex}</span>
                <span className="text-xs text-gray-500">+{t.pct}%</span>
              </div>
            ))}
            <CopyToClipboard text={tints.map(t => t.hex).join('\n')} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
