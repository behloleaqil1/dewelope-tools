'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromFlower - Palettes inspired by flowers (rose, lavender, sunflower, etc.).
 * Generates harmonious color palettes based on the natural colors of popular flowers.
 */
export default function ColorPaletteFromFlower({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [flower, setFlower] = useState('rose');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const flowerPalettes: Record<string, { name: string; colors: string[]; description: string }> = {
    rose: { name: 'Rose', colors: ['#E8284B', '#C41E3A', '#FF6B6B', '#2D5016', '#F8E8E8'], description: 'Deep reds and soft pinks with green foliage' },
    lavender: { name: 'Lavender', colors: ['#9B59B6', '#7D3C98', '#D2B4DE', '#5D6D7E', '#E8DAEF'], description: 'Purple hues with grey-green stems' },
    sunflower: { name: 'Sunflower', colors: ['#F4D03F', '#D4AC0D', '#784212', '#196F3D', '#FEF9E7'], description: 'Bright yellows with brown center and green' },
    cherry_blossom: { name: 'Cherry Blossom', colors: ['#FFB7C5', '#FF69B4', '#FFFFFF', '#8B4513', '#FFF0F5'], description: 'Soft pinks and whites with brown bark' },
    iris: { name: 'Iris', colors: ['#4A148C', '#7B1FA2', '#CE93D8', '#1B5E20', '#F3E5F5'], description: 'Deep purples with bright green leaves' },
    tulip: { name: 'Tulip', colors: ['#FF5722', '#E64A19', '#FFCCBC', '#33691E', '#FBE9E7'], description: 'Vibrant orange-red with fresh greens' },
    daisy: { name: 'Daisy', colors: ['#FFFFFF', '#FDD835', '#4CAF50', '#81C784', '#FFFDE7'], description: 'White petals with yellow center and green' },
    orchid: { name: 'Orchid', colors: ['#DA70D6', '#9C27B0', '#F8BBD0', '#4A148C', '#FCE4EC'], description: 'Exotic purples and magentas' },
    lotus: { name: 'Lotus', colors: ['#F48FB1', '#EC407A', '#FFFFFF', '#00695C', '#FCE4EC'], description: 'Soft pinks emerging from deep green water' },
    bluebell: { name: 'Bluebell', colors: ['#3F51B5', '#1A237E', '#9FA8DA', '#2E7D32', '#E8EAF6'], description: 'Deep blues with woodland greens' },
    marigold: { name: 'Marigold', colors: ['#FF8F00', '#F57F17', '#FFE082', '#33691E', '#FFF8E1'], description: 'Warm oranges and golds with green' },
    peony: { name: 'Peony', colors: ['#F06292', '#EC407A', '#F8BBD0', '#C62828', '#FCE4EC'], description: 'Lush pinks from blush to deep rose' },
  };

  const generate = () => {
    const palette = flowerPalettes[flower];
    if (!palette) {
      setOutput('Please select a flower.');
      return;
    }

    setColors(palette.colors);

    const lines: string[] = [];
    lines.push(`=== ${palette.name} Palette ===`);
    lines.push('');
    lines.push(`Inspiration: ${palette.description}`);
    lines.push('');
    lines.push('Colors:');
    palette.colors.forEach((c, i) => {
      lines.push(`  ${i + 1}. ${c}`);
    });
    lines.push('');
    lines.push('CSS Variables:');
    palette.colors.forEach((c, i) => {
      lines.push(`  --${flower}-${i + 1}: ${c};`);
    });

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-flower`} className="block text-sm font-medium text-gray-700 mb-1">
              Select Flower
            </label>
            <select
              id={`${toolId}-flower`}
              value={flower}
              onChange={(e) => setFlower(e.target.value)}
              className="input-field"
              aria-label={`Flower selection for ${toolName}`}
            >
              {Object.entries(flowerPalettes).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Palette
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            {colors.length > 0 && (
              <div className="flex gap-2 mb-3">
                {colors.map((c, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg border border-gray-200" style={{ backgroundColor: c }} />
                    <span className="text-xs font-mono mt-1">{c}</span>
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
