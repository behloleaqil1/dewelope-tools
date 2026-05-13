'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromAuroraType - Generate color palettes inspired by aurora types.
 * Supports green, red, blue, and purple aurora palettes with hex codes and CSS variables.
 */
export default function ColorPaletteFromAuroraType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [auroraType, setAuroraType] = useState('green');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[]; description: string }> = {
    green: {
      name: 'Green Aurora (Aurora Borealis)',
      description: 'The most common aurora color, caused by oxygen atoms at 100-300km altitude.',
      colors: ['#0B3D0B', '#1A6B1A', '#2ECC40', '#7FDBCA', '#B8F4D0', '#E0FFF0'],
    },
    red: {
      name: 'Red Aurora',
      description: 'Rare red aurora caused by high-altitude oxygen atoms above 300km.',
      colors: ['#3D0B0B', '#8B1A1A', '#DC3545', '#FF6B6B', '#FF9999', '#FFE0E0'],
    },
    blue: {
      name: 'Blue Aurora',
      description: 'Blue and violet aurora caused by nitrogen molecules below 100km altitude.',
      colors: ['#0B0B3D', '#1A1A6B', '#3D5AFE', '#6B8CFF', '#99B3FF', '#E0E8FF'],
    },
    purple: {
      name: 'Purple Aurora',
      description: 'Purple aurora from a mix of nitrogen and oxygen emissions at varying altitudes.',
      colors: ['#2D0B3D', '#5B1A6B', '#9C27B0', '#CE93D8', '#E1BEE7', '#F3E5F5'],
    },
  };

  const generate = () => {
    const palette = palettes[auroraType];
    setColors(palette.colors);

    const cssVars = palette.colors
      .map((color, i) => `  --aurora-${auroraType}-${(i + 1) * 100}: ${color};`)
      .join('\n');

    const result = [
      `${palette.name}`,
      `${palette.description}`,
      ``,
      `Colors:`,
      ...palette.colors.map((color, i) => `  ${i + 1}. ${color}`),
      ``,
      `CSS Variables:`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `Tailwind Config:`,
      `aurora: {`,
      ...palette.colors.map((color, i) => `  '${(i + 1) * 100}': '${color}',`),
      `}`,
    ];

    setOutput(result.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Aurora Type
            </label>
            <select
              id={`${toolId}-type`}
              value={auroraType}
              onChange={(e) => setAuroraType(e.target.value)}
              aria-label={`Aurora type for ${toolName}`}
              className="input-field"
            >
              <option value="green">Green Aurora (most common)</option>
              <option value="red">Red Aurora (rare, high altitude)</option>
              <option value="blue">Blue Aurora (nitrogen, low altitude)</option>
              <option value="purple">Purple Aurora (mixed emissions)</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            {colors.length > 0 && (
              <div className="flex gap-1 rounded-lg overflow-hidden">
                {colors.map((color, i) => (
                  <div
                    key={i}
                    className="h-16 flex-1 flex items-end justify-center pb-1"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-xs font-mono px-1 py-0.5 bg-white/80 rounded text-gray-800">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <label className="block text-sm font-medium text-gray-700">Palette Details</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
