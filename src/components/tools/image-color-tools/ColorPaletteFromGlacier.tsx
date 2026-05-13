'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromGlacier - Generate color palettes inspired by glaciers.
 * Includes palettes from famous glaciers like Perito Moreno, Vatnajökull, etc.
 */
export default function ColorPaletteFromGlacier({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedGlacier, setSelectedGlacier] = useState('perito-moreno');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const glaciers: Record<string, { name: string; colors: string[]; description: string }> = {
    'perito-moreno': { name: 'Perito Moreno', colors: ['#A8D8EA', '#4FA8C4', '#2E6B8A', '#1B3A4B', '#E8F4F8'], description: 'Patagonian blue ice and meltwater' },
    'vatnajokull': { name: 'Vatnajökull', colors: ['#B8D4E3', '#6B9DB8', '#3D6B82', '#1C3D4F', '#D4E8F0'], description: 'Icelandic ice cap with volcanic ash' },
    'fox-glacier': { name: 'Fox Glacier', colors: ['#C5E1EC', '#7FBCD4', '#4A8FA8', '#2D5F73', '#E0F0F5'], description: 'New Zealand temperate rainforest ice' },
    'jostedalsbreen': { name: 'Jostedalsbreen', colors: ['#D0E6F0', '#8CC4D8', '#5A9BB2', '#345E6F', '#EAF5FA'], description: 'Norwegian glacier with deep crevasses' },
    'mendenhall': { name: 'Mendenhall', colors: ['#B0D4E8', '#5EA3C4', '#3578A0', '#1A4D6B', '#D8EDF5'], description: 'Alaskan glacier with ice caves' },
    'aletsch': { name: 'Aletsch', colors: ['#C8DDE8', '#7AAFC8', '#4D849E', '#2B5468', '#E2EFF5'], description: 'Swiss Alps longest glacier' },
    'grey-glacier': { name: 'Grey Glacier', colors: ['#BCD8E5', '#6BABC5', '#4080A0', '#1E4F65', '#DCF0F8'], description: 'Chilean Patagonia blue-grey ice' },
    'svalbard': { name: 'Svalbard', colors: ['#D5E8F0', '#95C8DC', '#5E9AB5', '#3A6A80', '#ECF6FA'], description: 'Arctic archipelago polar ice' },
  };

  const generate = () => {
    const glacier = glaciers[selectedGlacier];
    if (!glacier) return;

    setColors(glacier.colors);

    const cssVars = glacier.colors.map((c, i) => `  --glacier-${i + 1}: ${c};`).join('\n');
    const result = [
      `/* ${glacier.name} Glacier Palette */`,
      `/* ${glacier.description} */`,
      `:root {`,
      cssVars,
      `}`,
      ``,
      `/* Colors: ${glacier.colors.join(', ')} */`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <label htmlFor={`${toolId}-glacier`} className="block text-sm font-medium text-gray-700 mb-1">Select Glacier</label>
          <select id={`${toolId}-glacier`} value={selectedGlacier} onChange={(e) => setSelectedGlacier(e.target.value)} className="input-field" aria-label={`Glacier selection for ${toolName}`}>
            {Object.entries(glaciers).map(([key, val]) => (
              <option key={key} value={key}>{val.name} - {val.description}</option>
            ))}
          </select>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Color Palette</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
