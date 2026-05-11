'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GradientPaletteGenerator - Generate a palette of N colors between two endpoints.
 */
export default function GradientPaletteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startColor, setStartColor] = useState('#3b82f6');
  const [endColor, setEndColor] = useState('#ef4444');
  const [steps, setSteps] = useState('8');
  const [palette, setPalette] = useState<string[]>([]);

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '');
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16),
    ];
  }

  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  }

  function generate() {
    const count = parseInt(steps);
    if (isNaN(count) || count < 2) {
      setPalette([]);
      return;
    }

    const [r1, g1, b1] = hexToRgb(startColor);
    const [r2, g2, b2] = hexToRgb(endColor);

    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0 : i / (count - 1);
      const r = r1 + (r2 - r1) * t;
      const g = g1 + (g2 - g1) * t;
      const b = b1 + (b2 - b1) * t;
      colors.push(rgbToHex(r, g, b));
    }

    setPalette(colors);
  }

  const copyText = palette.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
              Start Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                id={`${toolId}-start`}
                type="color"
                value={startColor}
                onChange={(e) => setStartColor(e.target.value)}
                aria-label={`Start color for ${toolName}`}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={startColor}
                onChange={(e) => setStartColor(e.target.value)}
                aria-label="Start color hex"
                className="input-field text-sm font-mono flex-1"
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">
              End Color
            </label>
            <div className="flex gap-2 items-center">
              <input
                id={`${toolId}-end`}
                type="color"
                value={endColor}
                onChange={(e) => setEndColor(e.target.value)}
                aria-label={`End color for ${toolName}`}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={endColor}
                onChange={(e) => setEndColor(e.target.value)}
                aria-label="End color hex"
                className="input-field text-sm font-mono flex-1"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-steps`} className="block text-xs text-gray-500 mb-1">Number of Colors</label>
          <input
            id={`${toolId}-steps`}
            type="text"
            inputMode="numeric"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder="8"
            aria-label="Number of colors"
            className="input-field text-sm w-24"
          />
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate palette" className="btn-primary">
        Generate Palette
      </button>

      <OutputArea hasContent={palette.length > 0}>
        {palette.length > 0 && (
          <div className="space-y-3">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 h-16">
              {palette.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {palette.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-full h-8 rounded border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
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
