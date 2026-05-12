'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSunsetType - Generate color palettes from different sunset types.
 */
export default function ColorPaletteFromSunsetType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sunsetType, setSunsetType] = useState<'golden' | 'pink' | 'purple' | 'red'>('golden');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[]; description: string }> = {
    golden: {
      name: 'Golden Sunset',
      colors: ['#FFD700', '#FFA500', '#FF8C00', '#E8740C', '#CD6600', '#8B4513'],
      description: 'Warm golden hues reminiscent of a classic sunset with amber and honey tones.',
    },
    pink: {
      name: 'Pink Sunset',
      colors: ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#8B0045'],
      description: 'Soft to vibrant pink tones seen in romantic cotton-candy sunsets.',
    },
    purple: {
      name: 'Purple Sunset',
      colors: ['#DDA0DD', '#BA55D3', '#9932CC', '#8B008B', '#4B0082', '#2E0854'],
      description: 'Deep purple and violet hues from dramatic twilight sunsets.',
    },
    red: {
      name: 'Red Sunset',
      colors: ['#FF6347', '#FF4500', '#DC143C', '#B22222', '#8B0000', '#4A0000'],
      description: 'Intense red and crimson tones from fiery dramatic sunsets.',
    },
  };

  const generate = () => {
    const palette = palettes[sunsetType];
    setColors(palette.colors);

    const lines = [
      `=== ${palette.name} Palette ===`,
      ``,
      palette.description,
      ``,
      ...palette.colors.map((c, i) => `Color ${i + 1}: ${c}`),
      ``,
      `CSS Variables:`,
      ...palette.colors.map((c, i) => `--sunset-${sunsetType}-${i + 1}: ${c};`),
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Sunset Type</label>
            <select id={`${toolId}-type`} value={sunsetType} onChange={(e) => setSunsetType(e.target.value as 'golden' | 'pink' | 'purple' | 'red')} aria-label={`Sunset type for ${toolName}`} className="input-field">
              <option value="golden">Golden Sunset</option>
              <option value="pink">Pink Sunset</option>
              <option value="purple">Purple Sunset</option>
              <option value="red">Red Sunset</option>
            </select>
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Sunset Palette</label>
            <div className="flex gap-1 mb-3">
              {colors.map((color, i) => (
                <div key={i} className="flex-1 h-16 rounded" style={{ backgroundColor: color }} title={color} />
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
