'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromHerbGarden - Generate color palettes inspired by herb gardens.
 * Supports multiple herb garden styles with configurable color count.
 */
export default function ColorPaletteFromHerbGarden({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('mediterranean');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const styles: Record<string, { name: string; colors: string[] }> = {
    mediterranean: {
      name: 'Mediterranean Herb Garden',
      colors: ['#4A7C59', '#8FBC8F', '#C4A35A', '#7B6B3A', '#E8DCC8', '#556B2F', '#9CAF88', '#D4A574'],
    },
    english: {
      name: 'English Cottage Garden',
      colors: ['#6B8E6B', '#A8C5A0', '#D4B8D4', '#8B6B8B', '#F0E6D3', '#7BA37B', '#C9A0C9', '#E8D5B7'],
    },
    kitchen: {
      name: 'Kitchen Herb Window',
      colors: ['#3D7A3D', '#6DB56D', '#8B4513', '#D2691E', '#F5F5DC', '#228B22', '#90EE90', '#DEB887'],
    },
    lavender: {
      name: 'Lavender Fields',
      colors: ['#7B68AE', '#9B8EC4', '#E6E0F3', '#4A3D6B', '#C8A2C8', '#967BB6', '#D8BFD8', '#483D8B'],
    },
    rosemary: {
      name: 'Rosemary & Sage',
      colors: ['#4F6F52', '#739072', '#86A789', '#B2C8B2', '#D6E5D6', '#3A5A40', '#588157', '#A3B18A'],
    },
    tropical: {
      name: 'Tropical Herb Garden',
      colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#1B4332', '#B7E4C7', '#D8F3DC'],
    },
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

    const cssVars = palette.map((c, i) => `  --herb-${i + 1}: ${c};`).join('\n');
    const tailwind = palette.map((c, i) => `        'herb-${i + 1}': '${c}',`).join('\n');

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
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">Garden Style</label>
            <select id={`${toolId}-style`} value={style} onChange={(e) => setStyle(e.target.value)} aria-label={`Garden style for ${toolName}`} className="input-field">
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
                {colors.map((color, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: color }} />
                    <span className="text-xs text-gray-600 mt-1">{color}</span>
                  </div>
                ))}
              </div>
            )}
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
