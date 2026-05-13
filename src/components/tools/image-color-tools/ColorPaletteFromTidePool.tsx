'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorPaletteFromTidePool - Generate color palettes inspired by tide pools.
 * Creates harmonious palettes based on ocean, coral, seaweed, and marine life colors.
 */
export default function ColorPaletteFromTidePool({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [theme, setTheme] = useState('coral-reef');
  const [count, setCount] = useState('5');
  const [output, setOutput] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  const tidePoolPalettes: Record<string, { name: string; colors: string[] }> = {
    'coral-reef': {
      name: 'Coral Reef',
      colors: ['#FF6B6B', '#FF8E72', '#FFA07A', '#FFB347', '#FF7F50', '#E74C3C', '#F39C12', '#FF4500'],
    },
    'deep-pool': {
      name: 'Deep Tide Pool',
      colors: ['#1A237E', '#283593', '#1565C0', '#0D47A1', '#01579B', '#006064', '#004D40', '#0B3D91'],
    },
    'sea-anemone': {
      name: 'Sea Anemone',
      colors: ['#9B59B6', '#8E44AD', '#E91E63', '#FF69B4', '#DA70D6', '#BA55D3', '#C71585', '#FF1493'],
    },
    'kelp-forest': {
      name: 'Kelp Forest',
      colors: ['#1B5E20', '#2E7D32', '#388E3C', '#4CAF50', '#66BB6A', '#81C784', '#556B2F', '#6B8E23'],
    },
    'starfish': {
      name: 'Starfish & Sand',
      colors: ['#FF8C00', '#FFA500', '#FFD700', '#F4A460', '#DEB887', '#D2691E', '#CD853F', '#B8860B'],
    },
    'abalone-shell': {
      name: 'Abalone Shell',
      colors: ['#48D1CC', '#7FFFD4', '#66CDAA', '#20B2AA', '#5F9EA0', '#008B8B', '#2F4F4F', '#708090'],
    },
    'sea-urchin': {
      name: 'Sea Urchin',
      colors: ['#2C1654', '#4A0E4E', '#800080', '#4B0082', '#191970', '#2E0854', '#3C1361', '#1C0522'],
    },
    'tidal-sunset': {
      name: 'Tidal Sunset',
      colors: ['#FF6347', '#FF4500', '#FF8C00', '#FFA07A', '#FFB6C1', '#FF69B4', '#DB7093', '#C71585'],
    },
  };

  const generate = () => {
    const numColors = Math.min(Math.max(parseInt(count) || 5, 3), 8);
    const palette = tidePoolPalettes[theme];
    if (!palette) return;

    const shuffled = [...palette.colors].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, numColors);
    setColors(selected);

    let result = `/* ${palette.name} Tide Pool Palette */\n\n`;
    result += `:root {\n`;
    selected.forEach((color, i) => {
      result += `  --tide-pool-${i + 1}: ${color};\n`;
    });
    result += `}\n\n`;
    result += `/* Tailwind Config */\n`;
    result += `colors: {\n`;
    result += `  'tide-pool': {\n`;
    selected.forEach((color, i) => {
      result += `    '${(i + 1) * 100}': '${color}',\n`;
    });
    result += `  }\n}\n\n`;
    result += `/* SCSS Variables */\n`;
    selected.forEach((color, i) => {
      result += `$tide-pool-${i + 1}: ${color};\n`;
    });

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-theme`} className="block text-sm font-medium text-gray-700 mb-1">Tide Pool Theme</label>
            <select id={`${toolId}-theme`} value={theme} onChange={(e) => setTheme(e.target.value)} className="input-field" aria-label={`Theme for ${toolName}`}>
              <option value="coral-reef">Coral Reef</option>
              <option value="deep-pool">Deep Tide Pool</option>
              <option value="sea-anemone">Sea Anemone</option>
              <option value="kelp-forest">Kelp Forest</option>
              <option value="starfish">Starfish & Sand</option>
              <option value="abalone-shell">Abalone Shell</option>
              <option value="sea-urchin">Sea Urchin</option>
              <option value="tidal-sunset">Tidal Sunset</option>
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
            <label className="block text-sm font-medium text-gray-700">Tide Pool Palette</label>
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
