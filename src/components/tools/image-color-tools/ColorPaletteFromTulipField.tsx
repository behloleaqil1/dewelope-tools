'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTulipField - Generate color palettes inspired by tulip fields.
 */
export default function ColorPaletteFromTulipField({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('dutch');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    dutch: ['#E31C25', '#FF6B35', '#FFD700', '#FF1493', '#8B0045', '#FF4500', '#DC143C', '#FF69B4'],
    spring: ['#FF85A2', '#FFC3D7', '#FFFACD', '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C', '#FFB6C1'],
    sunset: ['#8B0000', '#FF4500', '#FF6347', '#FF8C00', '#FFD700', '#800020', '#DC143C', '#B22222'],
    keukenhof: ['#9B59B6', '#E74C3C', '#F39C12', '#2ECC71', '#3498DB', '#E91E63', '#FF5722', '#8E44AD'],
    pastel: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8BAFF', '#FFC9BA', '#BAFFEE'],
  };

  const generate = () => {
    const numColors = Math.min(8, Math.max(2, parseInt(count) || 5));
    const palette = palettes[style] || palettes.dutch;
    const selected = palette.slice(0, numColors);
    setColors(selected);

    const lines = [
      `Tulip Field Palette: ${style.charAt(0).toUpperCase() + style.slice(1)}`,
      `Colors: ${numColors}`,
      ``,
      ...selected.map((c, i) => `${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      ...selected.map((c, i) => `--tulip-${i + 1}: ${c};`),
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label={`Palette style for ${toolName}`}>
              <option value="dutch">Dutch Classic</option>
              <option value="spring">Spring Morning</option>
              <option value="sunset">Sunset Fields</option>
              <option value="keukenhof">Keukenhof Garden</option>
              <option value="pastel">Pastel Tulips</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" aria-label="Number of colors" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tulip Field Palette</label>
            <div className="flex gap-2 mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs text-gray-600 mt-1">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
