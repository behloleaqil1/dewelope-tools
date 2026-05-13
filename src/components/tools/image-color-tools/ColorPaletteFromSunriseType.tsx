'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromSunriseType - Generate color palettes inspired by different sunrise types.
 * Includes tropical, desert, ocean, mountain, arctic, and urban sunrise palettes.
 */
export default function ColorPaletteFromSunriseType({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sunriseType, setSunriseType] = useState('tropical');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[]; description: string }> = {
    tropical: { name: 'Tropical Sunrise', colors: ['#FF6B35', '#FF9F1C', '#FFBF69', '#CBF3F0', '#2EC4B6'], description: 'Warm oranges and cool teals of a tropical dawn' },
    desert: { name: 'Desert Sunrise', colors: ['#D4380D', '#FA8C16', '#FFC53D', '#F5E6CC', '#8B4513'], description: 'Deep reds and golden sands of a desert morning' },
    ocean: { name: 'Ocean Sunrise', colors: ['#FF7875', '#FFA39E', '#FFD6E7', '#91D5FF', '#1890FF'], description: 'Soft pinks reflecting off calm ocean waters' },
    mountain: { name: 'Mountain Sunrise', colors: ['#722ED1', '#B37FEB', '#FFB8D1', '#FF7A45', '#FFC069'], description: 'Purple peaks catching the first golden rays' },
    arctic: { name: 'Arctic Sunrise', colors: ['#E8D5B7', '#F0C27B', '#B8E6F0', '#7EC8E3', '#4A90D9'], description: 'Pale golds and icy blues of a polar dawn' },
    urban: { name: 'Urban Sunrise', colors: ['#434343', '#FF6B6B', '#FFA07A', '#FFD700', '#87CEEB'], description: 'City skyline silhouettes against a warming sky' },
    savanna: { name: 'Savanna Sunrise', colors: ['#8B4513', '#CD853F', '#F4A460', '#FFD700', '#FF8C00'], description: 'Golden grasslands under an amber African sky' },
    misty: { name: 'Misty Sunrise', colors: ['#D3D3D3', '#E8C4A0', '#F5DEB3', '#FFDAB9', '#FFE4E1'], description: 'Soft pastels emerging through morning fog' },
  };

  const generate = () => {
    const palette = palettes[sunriseType];
    if (!palette) return;

    setColors(palette.colors);
    const result = [
      `=== ${palette.name} ===`,
      `${palette.description}`,
      ``,
      ...palette.colors.map((c, i) => `Color ${i + 1}: ${c}`),
      ``,
      `CSS Variables:`,
      ...palette.colors.map((c, i) => `--sunrise-${i + 1}: ${c};`),
    ].join('\n');
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
          Sunrise Type
        </label>
        <select
          id={`${toolId}-type`}
          value={sunriseType}
          onChange={(e) => setSunriseType(e.target.value)}
          className="input-field"
          aria-label={`Sunrise type selection for ${toolName}`}
        >
          {Object.entries(palettes).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
        <button onClick={generate} className="btn-primary mt-4">
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Palette</label>
            <div className="flex gap-2 mb-3">
              {colors.map((c, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: c }} />
                  <span className="text-xs mt-1 font-mono">{c}</span>
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
