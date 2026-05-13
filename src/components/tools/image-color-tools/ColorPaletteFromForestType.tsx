'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromForestType - Generate color palettes inspired by forest types.
 * Supports boreal, tropical, temperate, rainforest, mangrove, and bamboo forests.
 */
export default function ColorPaletteFromForestType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [forestType, setForestType] = useState('boreal');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    boreal: {
      name: 'Boreal (Taiga)',
      colors: [
        { hex: '#2D4A3E', name: 'Spruce Green' },
        { hex: '#5B7B6A', name: 'Lichen Sage' },
        { hex: '#8FB3A0', name: 'Frost Moss' },
        { hex: '#C4D9CE', name: 'Snow Mist' },
        { hex: '#3A2E1F', name: 'Pine Bark' },
      ],
    },
    tropical: {
      name: 'Tropical',
      colors: [
        { hex: '#1B5E20', name: 'Canopy Green' },
        { hex: '#4CAF50', name: 'Leaf Bright' },
        { hex: '#81C784', name: 'Fern Light' },
        { hex: '#FF6F00', name: 'Toucan Orange' },
        { hex: '#4E342E', name: 'Mahogany' },
      ],
    },
    temperate: {
      name: 'Temperate Deciduous',
      colors: [
        { hex: '#33691E', name: 'Oak Leaf' },
        { hex: '#689F38', name: 'Spring Canopy' },
        { hex: '#F9A825', name: 'Autumn Gold' },
        { hex: '#BF360C', name: 'Fall Maple' },
        { hex: '#5D4037', name: 'Bark Brown' },
      ],
    },
    rainforest: {
      name: 'Cloud Rainforest',
      colors: [
        { hex: '#004D40', name: 'Deep Canopy' },
        { hex: '#00796B', name: 'Moss Teal' },
        { hex: '#26A69A', name: 'Orchid Stem' },
        { hex: '#B2DFDB', name: 'Mist Veil' },
        { hex: '#6D4C41', name: 'Wet Bark' },
      ],
    },
    mangrove: {
      name: 'Mangrove',
      colors: [
        { hex: '#2E7D32', name: 'Mangrove Leaf' },
        { hex: '#66BB6A', name: 'Tidal Green' },
        { hex: '#A5D6A7', name: 'Brackish Foam' },
        { hex: '#3E2723', name: 'Root Brown' },
        { hex: '#0277BD', name: 'Estuary Blue' },
      ],
    },
    bamboo: {
      name: 'Bamboo Forest',
      colors: [
        { hex: '#558B2F', name: 'Bamboo Green' },
        { hex: '#9CCC65', name: 'Young Shoot' },
        { hex: '#DCEDC8', name: 'Pale Bamboo' },
        { hex: '#F0F4C3', name: 'Sunlit Stalk' },
        { hex: '#4E342E', name: 'Forest Floor' },
      ],
    },
  };

  const generate = () => {
    const palette = palettes[forestType];
    if (!palette) return;

    const cssVars = palette.colors.map((c, i) => `  --forest-${i + 1}: ${c.hex};`).join('\n');
    const tailwind = palette.colors.map((c, i) => `        '${forestType}-${i + 1}': '${c.hex}',`).join('\n');

    const lines = [
      `=== ${palette.name} Forest Palette ===`,
      ``,
      ...palette.colors.map(c => `  ${c.hex}  ${c.name}`),
      ``,
      `--- CSS Variables ---`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `--- Tailwind Config ---`,
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

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Forest Type
        </label>
        <select
          id={`${toolId}-type`}
          value={forestType}
          onChange={(e) => setForestType(e.target.value)}
          className="input-field"
          aria-label={`Forest type for ${toolName}`}
        >
          <option value="boreal">Boreal (Taiga)</option>
          <option value="tropical">Tropical</option>
          <option value="temperate">Temperate Deciduous</option>
          <option value="rainforest">Cloud Rainforest</option>
          <option value="mangrove">Mangrove</option>
          <option value="bamboo">Bamboo Forest</option>
        </select>
        <button onClick={generate} className="btn-primary mt-3">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex gap-2 mb-3">
              {palettes[forestType]?.colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded border" style={{ backgroundColor: c.hex }} title={c.name} />
                  <span className="text-xs mt-1 text-gray-600">{c.hex}</span>
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
