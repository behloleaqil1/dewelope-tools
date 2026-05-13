'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromVolcano - Generate color palettes inspired by volcanoes (lava, ash, obsidian).
 */
export default function ColorPaletteFromVolcano({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [volcanoType, setVolcanoType] = useState('lava');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[]; description: string }> = {
    lava: { name: 'Molten Lava', colors: ['#FF4500', '#FF6B35', '#FF8C00', '#CC3700', '#8B0000'], description: 'Fiery oranges and deep reds of flowing lava' },
    ash: { name: 'Volcanic Ash', colors: ['#696969', '#808080', '#A9A9A9', '#4A4A4A', '#2F2F2F'], description: 'Muted grays of volcanic ash clouds' },
    obsidian: { name: 'Obsidian Glass', colors: ['#0D0D0D', '#1A1A2E', '#16213E', '#0F3460', '#2C2C54'], description: 'Deep blacks and dark blues of volcanic glass' },
    eruption: { name: 'Eruption', colors: ['#FF0000', '#FF4500', '#FFD700', '#8B0000', '#2F0000'], description: 'Explosive reds, golds, and deep crimsons' },
    basalt: { name: 'Basalt Rock', colors: ['#36454F', '#2F4F4F', '#3B3B3B', '#4A5568', '#1A202C'], description: 'Dark charcoals and slate tones of cooled basalt' },
    sulfur: { name: 'Sulfur Vents', colors: ['#FFFF00', '#E6D800', '#BFBF00', '#808000', '#4D4D00'], description: 'Bright yellows and olive greens of sulfur deposits' },
    magma: { name: 'Deep Magma', colors: ['#B22222', '#DC143C', '#FF4500', '#800000', '#4B0000'], description: 'Underground reds and crimsons of magma chambers' },
    pumice: { name: 'Pumice Stone', colors: ['#D3C6AA', '#C4B89E', '#B5AA92', '#A69C86', '#978E7A'], description: 'Light sandy tones of porous pumice' },
  };

  const generate = () => {
    const palette = palettes[volcanoType];
    setColors(palette.colors);

    const cssVars = palette.colors.map((c, i) => `  --volcano-${volcanoType}-${i + 1}: ${c};`).join('\n');
    const tailwind = palette.colors.map((c, i) => `  '${volcanoType}-${i + 1}': '${c}',`).join('\n');

    const lines = [
      `🌋 ${palette.name}`,
      `${palette.description}`,
      ``,
      `Colors:`,
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `Tailwind Config:`,
      `colors: {`,
      tailwind,
      `}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Volcano Inspiration</label>
        <select id={`${toolId}-type`} value={volcanoType} onChange={(e) => setVolcanoType(e.target.value)} className="input-field" aria-label={`Volcano type for ${toolName}`}>
          {Object.entries(palettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name} - {val.description}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
