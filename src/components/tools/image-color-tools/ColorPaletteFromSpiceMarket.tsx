'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSpiceMarket - Generate color palettes inspired by spice markets.
 * Offers various spice-themed styles with configurable color count.
 */
export default function ColorPaletteFromSpiceMarket({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('moroccan');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const styles: Record<string, { name: string; colors: string[] }> = {
    moroccan: { name: 'Moroccan Souk', colors: ['#C1440E', '#E77F24', '#F4A940', '#8B4513', '#D2691E', '#FF6347', '#CD853F', '#B8860B'] },
    indian: { name: 'Indian Bazaar', colors: ['#FF9933', '#E23D28', '#FFD700', '#8B0000', '#DC143C', '#FF4500', '#DAA520', '#B22222'] },
    turkish: { name: 'Turkish Market', colors: ['#C41E3A', '#8B0000', '#DAA520', '#556B2F', '#CD853F', '#A0522D', '#D2691E', '#BC8F8F'] },
    persian: { name: 'Persian Spice Route', colors: ['#800020', '#C19A6B', '#E6BE8A', '#704214', '#CC7722', '#B87333', '#996515', '#8B4513'] },
    ethiopian: { name: 'Ethiopian Berbere', colors: ['#8B0000', '#CC5500', '#E25822', '#A52A2A', '#D2691E', '#CD853F', '#B8860B', '#FF4500'] },
    southeast_asian: { name: 'Southeast Asian', colors: ['#228B22', '#FFD700', '#FF6347', '#8B4513', '#32CD32', '#DAA520', '#FF4500', '#556B2F'] },
  };

  const generate = () => {
    const count = parseInt(colorCount);
    if (isNaN(count) || count < 2 || count > 8) {
      setOutput('Please select between 2 and 8 colors.');
      return;
    }

    const selectedStyle = styles[style];
    if (!selectedStyle) return;

    const palette = selectedStyle.colors.slice(0, count);
    setColors(palette);

    const cssVars = palette.map((c, i) => `  --spice-${i + 1}: ${c};`).join('\n');
    const tailwind = palette.map((c, i) => `        'spice-${i + 1}': '${c}',`).join('\n');

    const result = [
      `=== ${selectedStyle.name} Palette ===`,
      ``,
      `Colors (${count}):`,
      ...palette.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `Tailwind Config:`,
      `module.exports = {`,
      `  theme: {`,
      `    extend: {`,
      `      colors: {`,
      tailwind,
      `      }`,
      `    }`,
      `  }`,
      `}`,
    ];

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Spice Market Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} aria-label={`Palette style for ${toolName}`} className="input-field">
              {Object.entries(styles).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={colorCount} onChange={(e) => setColorCount(e.target.value)} aria-label="Number of colors" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary w-full">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-2 mb-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex-1 h-12 rounded-md shadow-sm" style={{ backgroundColor: c }} title={c} />
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
