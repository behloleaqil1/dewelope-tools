'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DuotoneColorGenerator - Generate duotone color combinations.
 * Creates harmonious two-color combinations for duotone design effects.
 */
export default function DuotoneColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [darkColor, setDarkColor] = useState('#1a1a2e');
  const [lightColor, setLightColor] = useState('#e94560');
  const [output, setOutput] = useState('');

  const presets = [
    { name: 'Midnight Rose', dark: '#1a1a2e', light: '#e94560' },
    { name: 'Ocean Sunset', dark: '#0f3460', light: '#e94560' },
    { name: 'Forest Gold', dark: '#1b4332', light: '#f4a261' },
    { name: 'Purple Haze', dark: '#2d1b69', light: '#b8a9c9' },
    { name: 'Teal Coral', dark: '#004d4d', light: '#ff6b6b' },
    { name: 'Navy Peach', dark: '#1d3557', light: '#f4a261' },
    { name: 'Charcoal Mint', dark: '#2d3436', light: '#00b894' },
    { name: 'Deep Blue Gold', dark: '#0c2461', light: '#f6b93b' },
  ];

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const dark = hexToRgb(darkColor);
    const light = hexToRgb(lightColor);

    const midpoints: string[] = [];
    for (let i = 0; i <= 4; i++) {
      const t = i / 4;
      const r = Math.round(dark.r + (light.r - dark.r) * t);
      const g = Math.round(dark.g + (light.g - dark.g) * t);
      const b = Math.round(dark.b + (light.b - dark.b) * t);
      midpoints.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    }

    const cssFilter = `/* CSS Duotone Filter */
.duotone {
  position: relative;
  filter: grayscale(100%) contrast(1.2);
}
.duotone::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, ${darkColor}, ${lightColor});
  mix-blend-mode: color;
}`;

    const result = [
      `Duotone Pair:`,
      `  Dark: ${darkColor} (RGB: ${dark.r}, ${dark.g}, ${dark.b})`,
      `  Light: ${lightColor} (RGB: ${light.r}, ${light.g}, ${light.b})`,
      '',
      `Gradient Steps:`,
      ...midpoints.map((c, i) => `  ${i * 25}%: ${c}`),
      '',
      cssFilter,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => { setDarkColor(p.dark); setLightColor(p.light); }}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-100"
              aria-label={`Apply ${p.name} preset`}
            >
              <span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: `linear-gradient(135deg, ${p.dark}, ${p.light})` }}></span>
              {p.name}
            </button>
          ))}
        </div>
      </InputArea>

      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-dark`} className="block text-sm font-medium text-gray-700 mb-1">
            Dark Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              aria-label={`Dark color for ${toolName}`}
            />
            <input
              id={`${toolId}-dark`}
              type="text"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-light`} className="block text-sm font-medium text-gray-700 mb-1">
            Light Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
              aria-label={`Light color for ${toolName}`}
            />
            <input
              id={`${toolId}-light`}
              type="text"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="input-field flex-1"
            />
          </div>
        </InputArea>
      </div>

      <div className="h-16 rounded-lg border border-gray-200" style={{ background: `linear-gradient(135deg, ${darkColor}, ${lightColor})` }}></div>

      <button onClick={generate} aria-label="Generate duotone combination" className="btn-primary">
        Generate Duotone
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Duotone Details</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
