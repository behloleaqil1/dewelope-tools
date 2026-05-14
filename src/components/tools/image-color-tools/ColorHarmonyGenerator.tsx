'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorHarmonyGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [output, setOutput] = useState('');

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = ((h % 360) + 360) % 360;
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generate = () => {
    const [h, s, l] = hexToHsl(baseColor);

    const harmonies = {
      'Complementary': [baseColor, hslToHex(h + 180, s, l)],
      'Analogous': [hslToHex(h - 30, s, l), baseColor, hslToHex(h + 30, s, l)],
      'Triadic': [baseColor, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      'Split-Complementary': [baseColor, hslToHex(h + 150, s, l), hslToHex(h + 210, s, l)],
      'Tetradic': [baseColor, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
    };

    const result = Object.entries(harmonies)
      .map(([name, colors]) => `${name}: ${colors.join(', ')}`)
      .join('\n\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
        <div className="flex gap-2">
          <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label={`Base color for ${toolName}`} className="h-10 w-14 rounded border cursor-pointer" />
          <input id={`${toolId}-color`} type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="input-field flex-1" />
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Harmonies</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
