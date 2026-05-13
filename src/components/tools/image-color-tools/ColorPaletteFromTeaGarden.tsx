'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTeaGarden - Generate color palettes inspired by tea gardens.
 * Offers multiple tea garden styles with configurable color count.
 */
export default function ColorPaletteFromTeaGarden({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [style, setStyle] = useState('japanese');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    japanese: ['#4A7C59', '#8FBC8F', '#C8E6C9', '#F5F5DC', '#8B4513', '#D2691E', '#556B2F', '#2E8B57'],
    chinese: ['#228B22', '#6B8E23', '#BDB76B', '#DAA520', '#8B0000', '#CD853F', '#2F4F4F', '#708090'],
    english: ['#9ACD32', '#90EE90', '#FFF8DC', '#FFE4B5', '#DEB887', '#BC8F8F', '#778899', '#F0E68C'],
    matcha: ['#3CB371', '#66CDAA', '#98FB98', '#F0FFF0', '#ADFF2F', '#7CFC00', '#006400', '#2E8B57'],
    autumn: ['#8B4513', '#D2691E', '#CD853F', '#DAA520', '#B8860B', '#556B2F', '#6B8E23', '#808000'],
    misty: ['#708090', '#778899', '#B0C4DE', '#C0D9D9', '#A8C8A8', '#8FBC8F', '#5F9EA0', '#4682B4'],
  };

  const generate = () => {
    const count = parseInt(colorCount);
    if (isNaN(count) || count < 2 || count > 8) {
      setOutput('Please select between 2 and 8 colors.');
      return;
    }

    const palette = palettes[style] || palettes.japanese;
    const selected = palette.slice(0, count);
    setColors(selected);

    const lines: string[] = [];
    lines.push(`=== Tea Garden Color Palette (${style.charAt(0).toUpperCase() + style.slice(1)}) ===`);
    lines.push('');
    lines.push('Colors:');
    selected.forEach((color, i) => {
      lines.push(`  ${i + 1}. ${color}`);
    });
    lines.push('');
    lines.push('CSS Variables:');
    lines.push(':root {');
    selected.forEach((color, i) => {
      lines.push(`  --tea-garden-${i + 1}: ${color};`);
    });
    lines.push('}');
    lines.push('');
    lines.push('Tailwind Config:');
    lines.push('colors: {');
    lines.push("  'tea-garden': {");
    selected.forEach((color, i) => {
      lines.push(`    ${(i + 1) * 100}: '${color}',`);
    });
    lines.push('  }');
    lines.push('}');

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-style`} className="block text-sm font-medium text-gray-700 mb-1">
              Tea Garden Style
            </label>
            <select
              id={`${toolId}-style`}
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="input-field"
              aria-label={`Palette style for ${toolName}`}
            >
              <option value="japanese">Japanese Tea Garden</option>
              <option value="chinese">Chinese Tea Plantation</option>
              <option value="english">English Tea Garden</option>
              <option value="matcha">Matcha Green</option>
              <option value="autumn">Autumn Harvest</option>
              <option value="misty">Misty Morning</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
              Number of Colors (2-8)
            </label>
            <input
              id={`${toolId}-count`}
              type="number"
              min="2"
              max="8"
              value={colorCount}
              onChange={(e) => setColorCount(e.target.value)}
              className="input-field"
              aria-label="Number of colors"
            />
          </div>
        </div>
        <button
          onClick={generate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-2 mb-3">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-md border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
