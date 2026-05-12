'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromBird - Generate color palettes inspired by bird plumage.
 * Includes palettes for popular birds like peacock, cardinal, kingfisher, etc.
 */

interface BirdPalette {
  name: string;
  colors: { hex: string; name: string }[];
}

const BIRD_PALETTES: BirdPalette[] = [
  { name: 'Peacock', colors: [{ hex: '#1B4D3E', name: 'Deep Teal' }, { hex: '#2E8B57', name: 'Emerald' }, { hex: '#00CED1', name: 'Turquoise' }, { hex: '#4169E1', name: 'Royal Blue' }, { hex: '#FFD700', name: 'Gold Eye' }] },
  { name: 'Cardinal', colors: [{ hex: '#C41E3A', name: 'Cardinal Red' }, { hex: '#8B0000', name: 'Dark Red' }, { hex: '#FF4500', name: 'Bright Crest' }, { hex: '#2F2F2F', name: 'Mask Black' }, { hex: '#F4A460', name: 'Beak Orange' }] },
  { name: 'Kingfisher', colors: [{ hex: '#FF6B35', name: 'Breast Orange' }, { hex: '#004E89', name: 'Deep Blue' }, { hex: '#00B4D8', name: 'Sky Blue' }, { hex: '#1A1A2E', name: 'Dark Wing' }, { hex: '#FFFFFF', name: 'White Throat' }] },
  { name: 'Flamingo', colors: [{ hex: '#FF69B4', name: 'Hot Pink' }, { hex: '#FFB6C1', name: 'Light Pink' }, { hex: '#FF1493', name: 'Deep Pink' }, { hex: '#FFF0F5', name: 'Lavender Blush' }, { hex: '#2F2F2F', name: 'Beak Tip' }] },
  { name: 'Blue Jay', colors: [{ hex: '#4169E1', name: 'Royal Blue' }, { hex: '#87CEEB', name: 'Sky Blue' }, { hex: '#FFFFFF', name: 'White Bar' }, { hex: '#1C1C1C', name: 'Necklace Black' }, { hex: '#B0C4DE', name: 'Light Steel' }] },
  { name: 'Toucan', colors: [{ hex: '#FF8C00', name: 'Beak Orange' }, { hex: '#FFD700', name: 'Beak Yellow' }, { hex: '#FF0000', name: 'Beak Tip Red' }, { hex: '#1A1A1A', name: 'Body Black' }, { hex: '#FFFFFF', name: 'Throat White' }] },
  { name: 'Hummingbird', colors: [{ hex: '#50C878', name: 'Emerald Green' }, { hex: '#FF1493', name: 'Magenta Throat' }, { hex: '#7B68EE', name: 'Violet' }, { hex: '#228B22', name: 'Forest Green' }, { hex: '#C0C0C0', name: 'Silver Wing' }] },
  { name: 'Macaw (Scarlet)', colors: [{ hex: '#FF0000', name: 'Scarlet Red' }, { hex: '#FFD700', name: 'Gold Wing' }, { hex: '#0000CD', name: 'Blue Flight' }, { hex: '#006400', name: 'Green Tip' }, { hex: '#FFFFFF', name: 'Face White' }] },
  { name: 'Robin', colors: [{ hex: '#CD5C5C', name: 'Red Breast' }, { hex: '#8B4513', name: 'Brown Back' }, { hex: '#F5F5DC', name: 'Cream Belly' }, { hex: '#696969', name: 'Slate Wing' }, { hex: '#2F4F4F', name: 'Dark Head' }] },
  { name: 'Goldfinch', colors: [{ hex: '#FFD700', name: 'Bright Yellow' }, { hex: '#000000', name: 'Cap Black' }, { hex: '#FFFFFF', name: 'Wing Bar' }, { hex: '#FF0000', name: 'Face Red' }, { hex: '#8B7355', name: 'Tan Wing' }] },
  { name: 'Owl (Barn)', colors: [{ hex: '#F5DEB3', name: 'Wheat' }, { hex: '#D2691E', name: 'Chocolate Back' }, { hex: '#FFFFF0', name: 'Ivory Face' }, { hex: '#8B7355', name: 'Tawny' }, { hex: '#2F2F2F', name: 'Dark Eye' }] },
  { name: 'Parrot (Eclectus)', colors: [{ hex: '#228B22', name: 'Forest Green' }, { hex: '#FF0000', name: 'Crimson Red' }, { hex: '#4B0082', name: 'Indigo' }, { hex: '#FFD700', name: 'Gold Beak' }, { hex: '#00008B', name: 'Navy Wing' }] },
];

export default function ColorPaletteFromBird({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedBird, setSelectedBird] = useState<string>(BIRD_PALETTES[0].name);
  const [output, setOutput] = useState<BirdPalette | null>(null);

  const generate = () => {
    const palette = BIRD_PALETTES.find(b => b.name === selectedBird);
    if (palette) setOutput(palette);
  };

  const cssVars = output
    ? output.colors.map((c, i) => `  --bird-${output.name.toLowerCase().replace(/[^a-z]/g, '-')}-${i + 1}: ${c.hex};`).join('\n')
    : '';

  const copyText = output
    ? `/* ${output.name} Palette */\n:root {\n${cssVars}\n}\n\n${output.colors.map(c => `${c.name}: ${c.hex}`).join('\n')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-bird`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a bird
        </label>
        <select
          id={`${toolId}-bird`}
          value={selectedBird}
          onChange={(e) => setSelectedBird(e.target.value)}
          aria-label={`Bird selection for ${toolName}`}
          className="input-field"
        >
          {BIRD_PALETTES.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">{output.name} Palette</h3>
            <div className="flex flex-wrap gap-3">
              {output.colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div
                    className="w-20 h-20 rounded-lg border shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="text-xs font-mono mt-1 text-gray-600">{color.hex}</p>
                  <p className="text-xs text-gray-500">{color.name}</p>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CSS Variables</label>
              <pre className="text-xs font-mono bg-gray-50 p-3 rounded border overflow-x-auto">
                {`:root {\n${cssVars}\n}`}
              </pre>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
