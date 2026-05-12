'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromInsect - Palettes inspired by insects (butterfly, beetle, dragonfly).
 */

const INSECT_PALETTES: Record<string, { name: string; colors: string[]; description: string }> = {
  'monarch-butterfly': { name: 'Monarch Butterfly', colors: ['#E8590C', '#F76707', '#FD7E14', '#1A1A1A', '#FFFFFF'], description: 'Vibrant orange and black of the Monarch butterfly' },
  'blue-morpho': { name: 'Blue Morpho Butterfly', colors: ['#1864AB', '#228BE6', '#4DABF7', '#0B3D6B', '#74C0FC'], description: 'Iridescent blue of the Morpho butterfly' },
  'ladybug': { name: 'Ladybug', colors: ['#E03131', '#C92A2A', '#1A1A1A', '#FFFFFF', '#FA5252'], description: 'Classic red and black of the ladybug' },
  'emerald-beetle': { name: 'Emerald Beetle', colors: ['#087F5B', '#0CA678', '#20C997', '#2B8A3E', '#12B886'], description: 'Metallic green of jewel beetles' },
  'dragonfly': { name: 'Dragonfly', colors: ['#1098AD', '#0C8599', '#3BC9DB', '#99E9F2', '#15AABF'], description: 'Shimmering teal of dragonfly wings' },
  'golden-beetle': { name: 'Golden Beetle', colors: ['#E67700', '#F59F00', '#FCC419', '#FFD43B', '#845A00'], description: 'Metallic gold of golden tortoise beetles' },
  'praying-mantis': { name: 'Praying Mantis', colors: ['#2B8A3E', '#40C057', '#69DB7C', '#8CE99A', '#1B5E20'], description: 'Natural greens of the praying mantis' },
  'firefly': { name: 'Firefly', colors: ['#1A1A1A', '#2C2C2C', '#F59F00', '#FFD43B', '#FFF3BF'], description: 'Dark night with bioluminescent glow' },
  'peacock-spider': { name: 'Peacock Spider', colors: ['#1864AB', '#E03131', '#F59F00', '#1A1A1A', '#FFFFFF'], description: 'Vivid display colors of the peacock spider' },
  'luna-moth': { name: 'Luna Moth', colors: ['#94D82D', '#A9E34B', '#C0EB75', '#D8F5A2', '#5C940D'], description: 'Pale green of the luna moth wings' },
};

export default function ColorPaletteFromInsect({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedInsect, setSelectedInsect] = useState('monarch-butterfly');
  const [output, setOutput] = useState('');

  const generate = () => {
    const palette = INSECT_PALETTES[selectedInsect];
    if (!palette) return;

    const lines: string[] = [];
    lines.push(`═══ ${palette.name} Palette ═══`);
    lines.push(palette.description);
    lines.push('');
    lines.push('Colors:');
    palette.colors.forEach((color, i) => {
      lines.push(`  ${i + 1}. ${color}`);
    });
    lines.push('');
    lines.push('CSS Variables:');
    lines.push(':root {');
    palette.colors.forEach((color, i) => {
      lines.push(`  --insect-${i + 1}: ${color};`);
    });
    lines.push('}');

    setOutput(lines.join('\n'));
  };

  const palette = INSECT_PALETTES[selectedInsect];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-insect`} className="block text-sm font-medium text-gray-700 mb-1">
          Select an Insect
        </label>
        <select
          id={`${toolId}-insect`}
          value={selectedInsect}
          onChange={(e) => setSelectedInsect(e.target.value)}
          className="input-field"
          aria-label={`Insect selection for ${toolName}`}
        >
          {Object.entries(INSECT_PALETTES).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      {palette && (
        <div className="flex gap-2 mt-2">
          {palette.colors.map((color, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded border border-gray-300" style={{ backgroundColor: color }} />
              <span className="text-xs font-mono mt-1">{color}</span>
            </div>
          ))}
        </div>
      )}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Palette Output</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
