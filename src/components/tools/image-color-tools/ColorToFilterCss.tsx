'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorToFilterCss({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#ff6600');
  const [output, setOutput] = useState('');

  const generate = () => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const brightness = Math.round(((r + g + b) / 3) * 100);
    const saturate = Math.round((Math.max(r, g, b) - Math.min(r, g, b)) * 500 + 100);
    const hueRotate = Math.round(Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * (180 / Math.PI));
    const filter = `brightness(${brightness}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;
    setOutput(`/* Approximate CSS filter for ${color} */\nfilter: invert(50%) sepia(100%) ${filter};\n\n/* Note: This is an approximation. Fine-tune values as needed. */`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Target Color</label>
        <div className="flex gap-2 items-center">
          <input type="color" id={`${toolId}-color`} value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 rounded border" aria-label={`Color for ${toolName}`} />
          <input value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1" aria-label="Hex value" />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Filter</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
