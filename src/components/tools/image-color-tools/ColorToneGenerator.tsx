'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorToneGenerator - Generate muted tones of a color by mixing with gray.
 * Produces a range of tones from the original color to neutral gray.
 */
export default function ColorToneGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3b82f6');
  const [steps, setSteps] = useState('8');
  const [tones, setTones] = useState<string[]>([]);

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16),
    };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  };

  const generate = () => {
    const numSteps = parseInt(steps) || 8;
    const rgb = hexToRgb(color);
    const gray = 128;
    const result: string[] = [];

    for (let i = 0; i < numSteps; i++) {
      const ratio = i / (numSteps - 1);
      const r = rgb.r + (gray - rgb.r) * ratio;
      const g = rgb.g + (gray - rgb.g) * ratio;
      const b = rgb.b + (gray - rgb.b) * ratio;
      result.push(rgbToHex(r, g, b));
    }

    setTones(result);
  };

  const copyText = tones.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 items-end flex-wrap">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
            <div className="flex gap-2 items-center">
              <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color picker for ${toolName}`} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="input-field w-28 font-mono" aria-label="Hex color value" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-steps`} className="block text-sm font-medium text-gray-700 mb-1">Number of Tones</label>
            <input id={`${toolId}-steps`} type="number" min="3" max="20" value={steps} onChange={(e) => setSteps(e.target.value)} className="input-field w-20" aria-label="Number of tones" />
          </div>
        </div>
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Tones</button>
      <OutputArea hasContent={tones.length > 0}>
        {tones.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {tones.map((tone, i) => (
                <div key={i} className="text-center">
                  <div className="w-full aspect-square rounded-lg border border-gray-200" style={{ backgroundColor: tone }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{tone}</span>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
