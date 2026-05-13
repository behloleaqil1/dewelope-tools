'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTundra - Generate color palettes inspired by arctic tundra landscapes.
 */
export default function ColorPaletteFromTundra({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('frozen-lake');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const themes: Record<string, string[]> = {
    'frozen-lake': ['#A8D8EA', '#C4E0F9', '#E8F4FD', '#6BB7D9', '#4A90A4', '#2C6E8A', '#1B4F6B', '#D6EFF8'],
    'northern-lights': ['#1B2735', '#2E4057', '#4ECDC4', '#45B7A0', '#96E6A1', '#7B68EE', '#9B59B6', '#2ECC71'],
    'snow-field': ['#FFFFFF', '#F0F4F8', '#D9E2EC', '#BCCCDC', '#9FB3C8', '#829AB1', '#627D98', '#486581'],
    'lichen-moss': ['#4A6741', '#5B7B4F', '#7D9B6B', '#A3B88C', '#C5D4A8', '#8B9D77', '#6B8E5A', '#3D5A34'],
    'arctic-sunset': ['#FF6B6B', '#FFA07A', '#FFD93D', '#C9B1FF', '#6C5CE7', '#A29BFE', '#FD79A8', '#E17055'],
    'permafrost': ['#2C3E50', '#34495E', '#5D6D7E', '#85929E', '#ABB2B9', '#D5D8DC', '#F2F3F4', '#1C2833'],
  };

  const generate = () => {
    const count = parseInt(colorCount);
    const palette = themes[theme] || themes['frozen-lake'];

    // Select random colors from the theme
    const shuffled = [...palette].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, palette.length));
    setColors(selected);

    const lines: string[] = [];
    lines.push('/* CSS Custom Properties */');
    lines.push(':root {');
    selected.forEach((color, i) => {
      lines.push(`  --tundra-${i + 1}: ${color};`);
    });
    lines.push('}');
    lines.push('');
    lines.push('/* Tailwind Config */');
    lines.push('colors: {');
    lines.push('  tundra: {');
    selected.forEach((color, i) => {
      lines.push(`    ${(i + 1) * 100}: '${color}',`);
    });
    lines.push('  }');
    lines.push('}');
    lines.push('');
    lines.push('/* SCSS Variables */');
    selected.forEach((color, i) => {
      lines.push(`$tundra-${i + 1}: ${color};`);
    });

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Tundra Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              <option value="frozen-lake">Frozen Lake</option>
              <option value="northern-lights">Northern Lights</option>
              <option value="snow-field">Snow Field</option>
              <option value="lichen-moss">Lichen & Moss</option>
              <option value="arctic-sunset">Arctic Sunset</option>
              <option value="permafrost">Permafrost</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors</label>
            <select id={`${toolId}-count`} value={colorCount} onChange={(e) => setColorCount(e.target.value)} className="input-field" aria-label="Number of colors">
              {[3, 4, 5, 6, 7, 8].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2 flex-wrap mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono mt-1 text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
