'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromBazaar - Palettes inspired by Middle Eastern bazaars.
 */
export default function ColorPaletteFromBazaar({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('istanbul');
  const [colorCount, setColorCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, string[]> = {
    istanbul: ['#C41E3A', '#D4A017', '#1B4F72', '#F39C12', '#8E44AD', '#E74C3C', '#2E86AB', '#F4D03F'],
    marrakech: ['#C0392B', '#E67E22', '#F1C40F', '#27AE60', '#2980B9', '#8E44AD', '#D35400', '#16A085'],
    dubai: ['#C9A961', '#1A1A2E', '#16213E', '#0F3460', '#E94560', '#533483', '#F5E6CA', '#D4AC0D'],
    tehran: ['#1F4E79', '#C0392B', '#2ECC71', '#F39C12', '#8E44AD', '#E74C3C', '#3498DB', '#1ABC9C'],
    cairo: ['#DAA520', '#8B4513', '#CD853F', '#DEB887', '#B8860B', '#D2691E', '#F4A460', '#FFDEAD'],
    jerusalem: ['#C9B037', '#D4AF37', '#CFB53B', '#E6BE8A', '#996515', '#B8860B', '#DAA520', '#FFD700'],
  };

  const generate = () => {
    const count = parseInt(colorCount);
    const palette = palettes[theme] || palettes.istanbul;
    const selected = palette.slice(0, Math.min(count, palette.length));
    setColors(selected);

    const lines: string[] = [
      `=== Bazaar Color Palette: ${theme.charAt(0).toUpperCase() + theme.slice(1)} ===`,
      ``,
      `Colors (${selected.length}):`,
      ...selected.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      ...selected.map((c, i) => `  --bazaar-${i + 1}: ${c};`),
      ``,
      `Tailwind Config:`,
      `  colors: {`,
      `    bazaar: {`,
      ...selected.map((c, i) => `      '${(i + 1) * 100}': '${c}',`),
      `    }`,
      `  }`,
    ];
    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Bazaar Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} aria-label={`Bazaar theme for ${toolName}`} className="input-field">
              <option value="istanbul">Istanbul Grand Bazaar</option>
              <option value="marrakech">Marrakech Souk</option>
              <option value="dubai">Dubai Gold Souk</option>
              <option value="tehran">Tehran Bazaar</option>
              <option value="cairo">Cairo Khan el-Khalili</option>
              <option value="jerusalem">Jerusalem Old City</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (2-8)</label>
            <input id={`${toolId}-count`} type="number" min="2" max="8" value={colorCount} onChange={(e) => setColorCount(e.target.value)} aria-label="Number of colors" className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-2 mb-3">
                {colors.map((color, i) => (
                  <div key={i} className="w-12 h-12 rounded-lg shadow-sm border" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
