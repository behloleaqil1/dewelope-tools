'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorToneGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3498db');
  const [output, setOutput] = useState('');

  const generate = () => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    const tones = Array.from({ length: 10 }, (_, i) => {
      const factor = (i + 1) / 11;
      const tr = Math.round(r + (128 - r) * factor);
      const tg = Math.round(g + (128 - g) * factor);
      const tb = Math.round(b + (128 - b) * factor);
      return `${(factor * 100).toFixed(0)}% gray: #${[tr, tg, tb].map(c => c.toString(16).padStart(2, '0')).join('')}`;
    });
    setOutput(tones.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
        <div className="flex gap-2">
          <input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#3498db" aria-label={`Input for ${toolName}`} className="input-field" />
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 rounded border" aria-label="Color picker" />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Tones</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
