'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromLavenderField - Generate color palettes inspired by lavender fields.
 * Offers multiple styles: Provence, Twilight, Morning Dew, and Dried Lavender.
 */
export default function ColorPaletteFromLavenderField({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('provence');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    provence: ['#7B2D8B', '#9B59B6', '#B388D9', '#D2B4DE', '#E8DAEF', '#F4ECF7', '#6C3483', '#A569BD'],
    twilight: ['#4A235A', '#6C3483', '#884EA0', '#A569BD', '#C39BD3', '#D7BDE2', '#512E5F', '#76448A'],
    'morning-dew': ['#D2B4DE', '#E8DAEF', '#F5EEF8', '#EBDEF0', '#D7BDE2', '#C39BD3', '#F9F3FC', '#EDE3F2'],
    'dried-lavender': ['#8E6B8A', '#A67FA3', '#BF94BC', '#C9A6C7', '#D4B8D2', '#7D5C79', '#9E7A9B', '#B08EAD'],
  };

  const generate = () => {
    const count = parseInt(colorCount);
    const palette = palettes[style];
    if (!palette) return;

    const selected = palette.slice(0, Math.min(count, palette.length));
    setColors(selected);
    setOutput(selected.map((c, i) => `Color ${i + 1}: ${c}`).join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Palette Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} aria-label="Palette style" className="input-field">
              <option value="provence">Provence Fields</option>
              <option value="twilight">Twilight Lavender</option>
              <option value="morning-dew">Morning Dew</option>
              <option value="dried-lavender">Dried Lavender</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
            <select id={`${toolId}-count`} value={colorCount} onChange={(e) => setColorCount(e.target.value)} aria-label="Number of colors" className="input-field">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-3" aria-label="Generate lavender field palette">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Lavender Field Palette</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded border border-gray-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono mt-1">{color}</span>
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
