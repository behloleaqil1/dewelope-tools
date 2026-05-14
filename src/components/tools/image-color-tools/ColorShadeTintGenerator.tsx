'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorShadeTintGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [steps, setSteps] = useState('10');
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');

  const generate = () => {
    const n = parseInt(steps) || 10;
    const rgb = hexToRgb(baseColor);

    const tints: string[] = [];
    const shades: string[] = [];

    for (let i = 1; i <= n; i++) {
      const factor = i / (n + 1);
      tints.push(rgbToHex(
        rgb.r + (255 - rgb.r) * factor,
        rgb.g + (255 - rgb.g) * factor,
        rgb.b + (255 - rgb.b) * factor
      ));
      shades.push(rgbToHex(
        rgb.r * (1 - factor),
        rgb.g * (1 - factor),
        rgb.b * (1 - factor)
      ));
    }

    const reversedShades = [...shades].reverse();
    const result = `Base: ${baseColor}\n\nShades (darker):\n${reversedShades.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}\n\nTints (lighter):\n${tints.map((c, i) => `  ${i + 1}. ${c}`).join('\n')}`;
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
          <div className="flex gap-2">
            <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label={`Base color for ${toolName}`} className="h-10 w-14 rounded border cursor-pointer" />
            <input id={`${toolId}-color`} type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="input-field flex-1" />
          </div>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Steps</label>
          <input id={`${toolId}-steps`} type="number" min="3" max="20" value={steps} onChange={(e) => setSteps(e.target.value)} aria-label={`Number of steps for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Shades & Tints</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
