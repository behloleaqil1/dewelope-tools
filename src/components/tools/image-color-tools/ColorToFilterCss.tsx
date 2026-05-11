'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorToFilterCss({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [hex, setHex] = useState('#ff6600');
  const [output, setOutput] = useState('');

  const hexToRgb = (h: string) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const { r, g, b } = hexToRgb(hex);
    // Approximate CSS filter (simplified approach)
    const brightness = Math.max(r, g, b) / 255;
    const hue = Math.atan2(Math.sqrt(3) * (g - b), 2 * r - g - b) * (180 / Math.PI);
    const saturate = 1 + (Math.max(r, g, b) - Math.min(r, g, b)) / 255 * 10;
    const filter = `brightness(0) saturate(100%) invert(${Math.round(brightness * 60)}%) sepia(${Math.round(saturate * 10)}%) saturate(${Math.round(saturate * 1000)}%) hue-rotate(${Math.round(hue)}deg)`;
    setOutput(`filter: ${filter};`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-hex`} className="block text-sm font-medium text-gray-700 mb-1">Target Color (Hex)</label>
        <div className="flex gap-2">
          <input id={`${toolId}-hex`} type="color" value={hex} onChange={(e) => setHex(e.target.value)} aria-label={`Color picker for ${toolName}`} className="h-10 w-16 rounded border border-gray-300" />
          <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className="input-field flex-1 font-mono" aria-label={`Hex value for ${toolName}`} />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary" aria-label="Generate CSS filter">Generate Filter</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
