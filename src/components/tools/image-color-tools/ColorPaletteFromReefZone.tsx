'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromReefZone - Generate palettes from reef zones (shallow, mid, deep).
 * Creates color palettes inspired by coral reef depth zones.
 */
export default function ColorPaletteFromReefZone({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [zone, setZone] = useState('shallow');
  const [output, setOutput] = useState('');

  const palettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    shallow: {
      name: 'Shallow Reef (0-10m)',
      colors: [
        { hex: '#00CED1', name: 'Turquoise Lagoon' },
        { hex: '#FFD700', name: 'Sunlit Sand' },
        { hex: '#FF6B6B', name: 'Fire Coral' },
        { hex: '#98FB98', name: 'Sea Lettuce' },
        { hex: '#FF8C42', name: 'Clownfish Orange' },
      ],
    },
    'mid-reef': {
      name: 'Mid Reef (10-30m)',
      colors: [
        { hex: '#1E90FF', name: 'Open Water Blue' },
        { hex: '#9B59B6', name: 'Purple Sea Fan' },
        { hex: '#2ECC71', name: 'Green Chromis' },
        { hex: '#F39C12', name: 'Butterflyfish Gold' },
        { hex: '#E74C3C', name: 'Red Gorgonian' },
      ],
    },
    deep: {
      name: 'Deep Reef (30-60m)',
      colors: [
        { hex: '#191970', name: 'Midnight Depth' },
        { hex: '#4B0082', name: 'Deep Violet Sponge' },
        { hex: '#006400', name: 'Deep Kelp' },
        { hex: '#2F4F4F', name: 'Dark Slate Coral' },
        { hex: '#483D8B', name: 'Twilight Zone' },
      ],
    },
    'coral-garden': {
      name: 'Coral Garden',
      colors: [
        { hex: '#FF69B4', name: 'Pink Staghorn' },
        { hex: '#FF4500', name: 'Orange Cup Coral' },
        { hex: '#FFDAB9', name: 'Peach Anemone' },
        { hex: '#DA70D6', name: 'Orchid Coral' },
        { hex: '#FFE4B5', name: 'Brain Coral Tan' },
      ],
    },
    'tropical-fish': {
      name: 'Tropical Fish',
      colors: [
        { hex: '#FFFF00', name: 'Yellow Tang' },
        { hex: '#0000CD', name: 'Royal Blue Tang' },
        { hex: '#FF1493', name: 'Anthias Pink' },
        { hex: '#00FF7F', name: 'Green Wrasse' },
        { hex: '#FF6347', name: 'Flame Angelfish' },
      ],
    },
    'bioluminescent': {
      name: 'Bioluminescent Deep',
      colors: [
        { hex: '#00FFFF', name: 'Bioluminescent Cyan' },
        { hex: '#7FFF00', name: 'Glowing Plankton' },
        { hex: '#0D0D2B', name: 'Abyss Black' },
        { hex: '#4169E1', name: 'Deep Glow Blue' },
        { hex: '#00FA9A', name: 'Jellyfish Green' },
      ],
    },
  };

  const generate = () => {
    const palette = palettes[zone];
    if (!palette) return;

    const lines: string[] = [
      `=== ${palette.name} ===`,
      '',
      'Colors:',
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c.name}: ${c.hex}`),
      '',
      'CSS Variables:',
      ':root {',
      ...palette.colors.map((c, i) => `  --reef-${zone}-${i + 1}: ${c.hex};`),
      '}',
      '',
      'Tailwind Config:',
      ...palette.colors.map((c, i) => `  '${zone}-${i + 1}': '${c.hex}',`),
    ];

    setOutput(lines.join('\n'));
  };

  const currentPalette = palettes[zone];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-zone`} className="block text-sm font-medium text-gray-700 mb-1">
          Reef Zone
        </label>
        <select
          id={`${toolId}-zone`}
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="input-field"
          aria-label={`Reef zone for ${toolName}`}
        >
          <option value="shallow">Shallow Reef (0-10m)</option>
          <option value="mid-reef">Mid Reef (10-30m)</option>
          <option value="deep">Deep Reef (30-60m)</option>
          <option value="coral-garden">Coral Garden</option>
          <option value="tropical-fish">Tropical Fish</option>
          <option value="bioluminescent">Bioluminescent Deep</option>
        </select>

        {currentPalette && (
          <div className="mt-3 flex gap-2">
            {currentPalette.colors.map((c) => (
              <div key={c.hex} className="w-10 h-10 rounded border" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
        )}

        <button onClick={generate} className="btn-primary mt-3">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Reef Zone Palette</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
