'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromLandscape - Generate color palettes inspired by landscapes.
 */
export default function ColorPaletteFromLandscape({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [landscape, setLandscape] = useState('mountain-snow');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const palettes: Record<string, { name: string; colors: string[]; description: string }> = {
    'mountain-snow': { name: 'Snow-Capped Mountains', colors: ['#F8F9FA', '#ADB5BD', '#6C757D', '#2B4162', '#1B2838'], description: 'Crisp whites and cool grays of alpine peaks' },
    'mountain-sunset': { name: 'Mountain Sunset', colors: ['#FF6B35', '#F7C59F', '#8B5E3C', '#4A2C2A', '#1A1423'], description: 'Warm oranges and deep shadows at golden hour' },
    'green-valley': { name: 'Green Valley', colors: ['#2D6A4F', '#40916C', '#74C69D', '#B7E4C7', '#D8F3DC'], description: 'Lush greens of a fertile valley' },
    'autumn-valley': { name: 'Autumn Valley', colors: ['#9B2226', '#BB3E03', '#CA6702', '#EE9B00', '#E9D8A6'], description: 'Rich reds and golds of fall foliage' },
    'prairie-golden': { name: 'Golden Prairie', colors: ['#DDA15E', '#BC6C25', '#606C38', '#283618', '#FEFAE0'], description: 'Wheat fields and earth tones of open plains' },
    'prairie-wildflower': { name: 'Wildflower Prairie', colors: ['#7B2CBF', '#C77DFF', '#E0AAFF', '#90BE6D', '#43AA8B'], description: 'Purple wildflowers dotting green grasslands' },
    'desert-canyon': { name: 'Desert Canyon', colors: ['#D4A373', '#E76F51', '#F4A261', '#264653', '#2A9D8F'], description: 'Terracotta and teal of arid canyons' },
    'tropical-coast': { name: 'Tropical Coast', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#FFD166'], description: 'Azure waters and sandy shores' },
    'arctic-tundra': { name: 'Arctic Tundra', colors: ['#CAD2C5', '#84A98C', '#52796F', '#354F52', '#2F3E46'], description: 'Muted greens and deep teals of frozen landscapes' },
    'volcanic-landscape': { name: 'Volcanic Landscape', colors: ['#1B1B1B', '#3D0000', '#8B0000', '#FF4500', '#FFD700'], description: 'Dark basalt, molten lava, and fiery glow' },
    'rolling-hills': { name: 'Rolling Hills', colors: ['#588157', '#3A5A40', '#A3B18A', '#DAD7CD', '#344E41'], description: 'Gentle greens of pastoral countryside' },
    'fjord-waters': { name: 'Fjord Waters', colors: ['#003049', '#005F73', '#0A9396', '#94D2BD', '#E9D8A6'], description: 'Deep blues and teals of Nordic fjords' },
  };

  const generate = () => {
    const palette = palettes[landscape];
    if (!palette) return;

    setColors(palette.colors);
    const cssVars = palette.colors.map((c, i) => `  --landscape-${i + 1}: ${c};`).join('\n');
    const result = [
      `Palette: ${palette.name}`,
      `Description: ${palette.description}`,
      ``,
      `Colors:`,
      ...palette.colors.map((c, i) => `  ${i + 1}. ${c}`),
      ``,
      `CSS Variables:`,
      `:root {`,
      cssVars,
      `}`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div>
          <label htmlFor={`${toolId}-landscape`} className="block text-sm font-medium text-gray-700 mb-1">Select Landscape</label>
          <select id={`${toolId}-landscape`} value={landscape} onChange={(e) => setLandscape(e.target.value)} className="input-field" aria-label={`Landscape selection for ${toolName}`}>
            {Object.entries(palettes).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Palette</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <div className="flex gap-2">
              {colors.map((color, i) => (
                <div key={i} className="flex-1 text-center">
                  <div className="h-20 rounded-lg border" style={{ backgroundColor: color }}></div>
                  <span className="text-xs font-mono mt-1 block">{color}</span>
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
