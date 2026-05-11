'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorMixer - Mixes two colors together with adjustable ratio and shows the result.
 */
export default function ColorMixer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#ff0000');
  const [color2, setColor2] = useState('#0000ff');
  const [ratio, setRatio] = useState(50);

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  }

  const [r1, g1, b1] = hexToRgb(color1);
  const [r2, g2, b2] = hexToRgb(color2);
  const t = ratio / 100;
  const mixed = rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);

  const copyText = `Color 1: ${color1}\nColor 2: ${color2}\nRatio: ${ratio}%\nMixed: ${mixed}\nRGB: rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3">Mix two colors for {toolName}</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="First color" className="w-full h-16 rounded cursor-pointer border border-gray-200" />
            <input type="text" value={color1} onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor1(e.target.value); }} className="input-field text-xs font-mono mt-1 text-center" aria-label="Color 1 hex" />
          </div>
          <div className="text-center">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="Second color" className="w-full h-16 rounded cursor-pointer border border-gray-200" />
            <input type="text" value={color2} onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setColor2(e.target.value); }} className="input-field text-xs font-mono mt-1 text-center" aria-label="Color 2 hex" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Mix Ratio: {ratio}% (Color 2)</label>
          <input type="range" min="0" max="100" value={ratio} onChange={(e) => setRatio(parseInt(e.target.value))} aria-label="Mix ratio" className="w-full" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>100% Color 1</span>
            <span>100% Color 2</span>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="flex h-20 rounded-lg overflow-hidden border border-gray-200">
            <div className="w-1/3" style={{ backgroundColor: color1 }} />
            <div className="w-1/3" style={{ backgroundColor: mixed }} />
            <div className="w-1/3" style={{ backgroundColor: color2 }} />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
            <div className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-lg" style={{ backgroundColor: mixed }} />
            <div className="text-lg font-bold font-mono text-gray-800 mt-2">{mixed}</div>
            <div className="text-xs text-gray-500">Mixed Color</div>
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
