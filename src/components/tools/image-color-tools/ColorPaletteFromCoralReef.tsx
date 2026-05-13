'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromCoralReef - Generate color palettes inspired by coral reefs.
 * Provides curated palettes based on various coral reef ecosystems.
 */
export default function ColorPaletteFromCoralReef({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedReef, setSelectedReef] = useState('great-barrier');
  const [output, setOutput] = useState('');

  const reefPalettes: Record<string, { name: string; colors: { hex: string; name: string }[] }> = {
    'great-barrier': {
      name: 'Great Barrier Reef',
      colors: [
        { hex: '#FF6B6B', name: 'Fire Coral' },
        { hex: '#4ECDC4', name: 'Turquoise Lagoon' },
        { hex: '#45B7D1', name: 'Reef Blue' },
        { hex: '#FFA07A', name: 'Soft Coral' },
        { hex: '#98D8C8', name: 'Sea Foam' },
      ],
    },
    'caribbean': {
      name: 'Caribbean Reef',
      colors: [
        { hex: '#00CED1', name: 'Caribbean Teal' },
        { hex: '#FF7F50', name: 'Brain Coral' },
        { hex: '#20B2AA', name: 'Light Sea Green' },
        { hex: '#FFD700', name: 'Golden Anemone' },
        { hex: '#7B68EE', name: 'Purple Sea Fan' },
      ],
    },
    'red-sea': {
      name: 'Red Sea Reef',
      colors: [
        { hex: '#E74C3C', name: 'Red Sea Coral' },
        { hex: '#1ABC9C', name: 'Emerald Reef' },
        { hex: '#F39C12', name: 'Clownfish Orange' },
        { hex: '#3498DB', name: 'Deep Blue' },
        { hex: '#9B59B6', name: 'Violet Urchin' },
      ],
    },
    'maldives': {
      name: 'Maldives Reef',
      colors: [
        { hex: '#00B4D8', name: 'Maldives Blue' },
        { hex: '#90E0EF', name: 'Shallow Lagoon' },
        { hex: '#CAF0F8', name: 'Crystal Water' },
        { hex: '#FF9F1C', name: 'Starfish Gold' },
        { hex: '#2EC4B6', name: 'Reef Teal' },
      ],
    },
    'deep-reef': {
      name: 'Deep Reef',
      colors: [
        { hex: '#1A1A2E', name: 'Abyss Blue' },
        { hex: '#16213E', name: 'Deep Ocean' },
        { hex: '#0F3460', name: 'Midnight Reef' },
        { hex: '#E94560', name: 'Bioluminescent Pink' },
        { hex: '#533483', name: 'Deep Purple Coral' },
      ],
    },
  };

  const generate = () => {
    const palette = reefPalettes[selectedReef];
    if (!palette) return;

    const lines = [
      `═══ ${palette.name} Color Palette ═══`,
      '',
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c.name}: ${c.hex}`),
      '',
      '── CSS Variables ──',
      ':root {',
      ...palette.colors.map((c, i) => `  --reef-${i + 1}: ${c.hex};`),
      '}',
      '',
      '── Tailwind Config ──',
      'colors: {',
      ...palette.colors.map((c, i) => `  'reef-${i + 1}': '${c.hex}',`),
      '}',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-reef`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Coral Reef Inspiration
            </label>
            <select
              id={`${toolId}-reef`}
              value={selectedReef}
              onChange={(e) => setSelectedReef(e.target.value)}
              className="input-field"
              aria-label={`Reef selection for ${toolName}`}
            >
              <option value="great-barrier">Great Barrier Reef</option>
              <option value="caribbean">Caribbean Reef</option>
              <option value="red-sea">Red Sea Reef</option>
              <option value="maldives">Maldives Reef</option>
              <option value="deep-reef">Deep Reef</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary" aria-label="Generate coral reef palette">
            Generate Palette
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Coral Reef Palette</label>
            <div className="flex gap-2">
              {reefPalettes[selectedReef]?.colors.map((c, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-16 rounded-lg shadow-sm border" style={{ backgroundColor: c.hex }} />
                  <p className="text-xs mt-1 text-gray-600">{c.name}</p>
                  <p className="text-xs font-mono text-gray-500">{c.hex}</p>
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
