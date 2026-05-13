'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromKelpForest - Generate color palettes inspired by kelp forests.
 * Creates harmonious palettes based on underwater kelp, ocean, and marine colors.
 */
export default function ColorPaletteFromKelpForest({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('giant-kelp');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const kelpPalettes: Record<string, { name: string; colors: string[] }> = {
    'giant-kelp': {
      name: 'Giant Kelp',
      colors: ['#2E4600', '#486B00', '#6B8F00', '#8B6914', '#A67B5B', '#3D5C1E', '#556B2F', '#6B8E23'],
    },
    'bull-kelp': {
      name: 'Bull Kelp',
      colors: ['#4A3728', '#5C4033', '#6B4423', '#8B5E3C', '#704214', '#3B2F2F', '#654321', '#8B4513'],
    },
    'sunlit-canopy': {
      name: 'Sunlit Canopy',
      colors: ['#9ACD32', '#7CFC00', '#ADFF2F', '#32CD32', '#00FF00', '#7FFF00', '#B8D430', '#A2C523'],
    },
    'deep-forest': {
      name: 'Deep Forest Floor',
      colors: ['#013220', '#004225', '#1B4D3E', '#2F4F4F', '#1C3A2E', '#0B3B24', '#254117', '#1E3B2F'],
    },
    'sea-otter': {
      name: 'Sea Otter Haven',
      colors: ['#5C4033', '#8B6914', '#D2B48C', '#C4A882', '#87CEEB', '#4682B4', '#2E8B57', '#3CB371'],
    },
    'bioluminescent': {
      name: 'Bioluminescent Kelp',
      colors: ['#00FF7F', '#00FA9A', '#7FFFD4', '#40E0D0', '#48D1CC', '#00CED1', '#20B2AA', '#5F9EA0'],
    },
    'kelp-sunset': {
      name: 'Kelp at Sunset',
      colors: ['#FF6347', '#FF4500', '#2E4600', '#556B2F', '#8B4513', '#DAA520', '#B8860B', '#CD853F'],
    },
    'pacific-kelp': {
      name: 'Pacific Kelp Bed',
      colors: ['#006994', '#0077B6', '#2E4600', '#3D5C1E', '#556B2F', '#4682B4', '#5F9EA0', '#2F4F4F'],
    },
  };

  const generate = () => {
    const numColors = Math.min(Math.max(parseInt(count) || 5, 3), 8);
    const palette = kelpPalettes[theme];
    if (!palette) return;

    const shuffled = [...palette.colors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numColors);
    setColors(selected);

    let result = `/* ${palette.name} Kelp Forest Palette */\n\n`;
    result += `:root {\n`;
    selected.forEach((color, i) => {
      result += `  --kelp-forest-${i + 1}: ${color};\n`;
    });
    result += `}\n\n`;
    result += `/* Tailwind Config */\n`;
    result += `colors: {\n`;
    result += `  'kelp-forest': {\n`;
    selected.forEach((color, i) => {
      result += `    '${(i + 1) * 100}': '${color}',\n`;
    });
    result += `  }\n}\n\n`;
    result += `/* SCSS Variables */\n`;
    selected.forEach((color, i) => {
      result += `$kelp-forest-${i + 1}: ${color};\n`;
    });

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Kelp Forest Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              <option value="giant-kelp">Giant Kelp</option>
              <option value="bull-kelp">Bull Kelp</option>
              <option value="sunlit-canopy">Sunlit Canopy</option>
              <option value="deep-forest">Deep Forest Floor</option>
              <option value="sea-otter">Sea Otter Haven</option>
              <option value="bioluminescent">Bioluminescent Kelp</option>
              <option value="kelp-sunset">Kelp at Sunset</option>
              <option value="pacific-kelp">Pacific Kelp Bed</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">Number of Colors (3-8)</label>
            <input id={`${toolId}-count`} type="number" min="3" max="8" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" />
          </div>
          <button onClick={generate} className="btn-primary">Generate Palette</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Kelp Forest Palette</label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-lg shadow-md border" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-gray-600 mt-1 block">{color}</span>
                </div>
              ))}
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
