'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCandyBar - Generate color palettes inspired by candy bar wrappers.
 */
export default function ColorPaletteFromCandyBar({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selected, setSelected] = useState('snickers');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    snickers: {
      name: 'Snickers',
      colors: [
        { hex: '#3B1E0E', name: 'Dark Chocolate' },
        { hex: '#6B3A2A', name: 'Caramel Brown' },
        { hex: '#C4883E', name: 'Peanut Gold' },
        { hex: '#1E3A6E', name: 'Wrapper Blue' },
        { hex: '#FFFFFF', name: 'Logo White' },
      ],
    },
    kitkat: {
      name: 'KitKat',
      colors: [
        { hex: '#D4001A', name: 'KitKat Red' },
        { hex: '#FFFFFF', name: 'Clean White' },
        { hex: '#5C2D0E', name: 'Wafer Brown' },
        { hex: '#8B4513', name: 'Chocolate' },
        { hex: '#F5E6D3', name: 'Cream' },
      ],
    },
    twix: {
      name: 'Twix',
      colors: [
        { hex: '#C8860A', name: 'Gold Wrapper' },
        { hex: '#5C2D0E', name: 'Chocolate Coat' },
        { hex: '#D4A843', name: 'Caramel' },
        { hex: '#F5DEB3', name: 'Cookie Base' },
        { hex: '#2C1810', name: 'Dark Accent' },
      ],
    },
    skittles: {
      name: 'Skittles',
      colors: [
        { hex: '#E31837', name: 'Strawberry Red' },
        { hex: '#FF6600', name: 'Orange' },
        { hex: '#FFD700', name: 'Lemon Yellow' },
        { hex: '#00A550', name: 'Green Apple' },
        { hex: '#6B3FA0', name: 'Grape Purple' },
      ],
    },
    milkyway: {
      name: 'Milky Way',
      colors: [
        { hex: '#1B1464', name: 'Deep Space Blue' },
        { hex: '#6B3A2A', name: 'Nougat Brown' },
        { hex: '#C4883E', name: 'Caramel Gold' },
        { hex: '#4A2C17', name: 'Milk Chocolate' },
        { hex: '#F0E68C', name: 'Star Yellow' },
      ],
    },
    reeses: {
      name: "Reese's",
      colors: [
        { hex: '#FF6600', name: "Reese's Orange" },
        { hex: '#FFD700', name: 'Peanut Butter Gold' },
        { hex: '#5C2D0E', name: 'Chocolate Cup' },
        { hex: '#2C1810', name: 'Dark Chocolate' },
        { hex: '#FFFFFF', name: 'Logo White' },
      ],
    },
  };

  const generate = () => {
    const palette = palettes[selected];
    if (!palette) return;

    const lines = [
      `/* ${palette.name} Inspired Palette */`,
      ``,
      ...palette.colors.map((c, i) => `--candy-${i + 1}: ${c.hex};  /* ${c.name} */`),
      ``,
      `/* CSS Custom Properties */`,
      `:root {`,
      ...palette.colors.map((c, i) => `  --candy-${i + 1}: ${c.hex};`),
      `}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-candy`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Candy Bar Inspiration
        </label>
        <select
          id={`${toolId}-candy`}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          aria-label={`Candy bar selection for ${toolName}`}
          className="input-field"
        >
          {Object.entries(palettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2 flex-wrap">
              {palettes[selected]?.colors.map((c, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: c.hex }} />
                  <p className="text-xs mt-1 text-gray-600">{c.hex}</p>
                  <p className="text-xs text-gray-500">{c.name}</p>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
