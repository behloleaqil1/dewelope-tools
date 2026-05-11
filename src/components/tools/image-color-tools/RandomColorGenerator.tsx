'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RandomColorGenerator - Generates random colors with hex, RGB, and HSL values.
 * Can generate single colors or palettes of multiple random colors.
 */
export default function RandomColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [colors, setColors] = useState<{ hex: string; rgb: string; hsl: string }[]>([]);
  const [count, setCount] = useState(5);

  function generateColors() {
    const newColors: { hex: string; rgb: string; hsl: string }[] = [];

    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);

      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      const rgb = `rgb(${r}, ${g}, ${b})`;

      // Convert to HSL
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      let h = 0, s = 0;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
          case gn: h = ((bn - rn) / d + 2) / 6; break;
          case bn: h = ((rn - gn) / d + 4) / 6; break;
        }
      }
      const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

      newColors.push({ hex, rgb, hsl });
    }

    setColors(newColors);
  }

  const copyText = colors.map((c) => `${c.hex} | ${c.rgb} | ${c.hsl}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex items-center gap-3">
        <label htmlFor={`${toolId}-count`} className="text-sm font-medium text-gray-700">
          Colors to generate for {toolName}:
        </label>
        <input
          id={`${toolId}-count`}
          type="number"
          min="1"
          max="20"
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
          aria-label="Number of colors"
          className="input-field w-20 text-sm"
        />
        <button onClick={generateColors} aria-label="Generate random colors" className="btn-primary">
          Generate
        </button>
      </div>

      <OutputArea hasContent={colors.length > 0}>
        {colors.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div
                    className="w-12 h-12 rounded-lg border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Color swatch: ${color.hex}`}
                  />
                  <div className="text-xs font-mono space-y-0.5">
                    <div className="font-bold text-gray-800">{color.hex}</div>
                    <div className="text-gray-600">{color.rgb}</div>
                    <div className="text-gray-500">{color.hsl}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Color bar preview */}
            <div className="flex h-12 rounded-lg overflow-hidden border border-gray-200">
              {colors.map((color, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: color.hex }} aria-label={color.hex} />
              ))}
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
