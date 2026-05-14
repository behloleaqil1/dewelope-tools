'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TailwindColorGenerator - Generate Tailwind CSS color config from a base color.
 */
export default function TailwindColorGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [colorName, setColorName] = useState('brand');
  const [output, setOutput] = useState('');

  function hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function generate() {
    const [h, s] = hexToHsl(baseColor);
    const shades: Record<string, string> = {};
    const levels = [
      { key: '50', l: 97 }, { key: '100', l: 93 }, { key: '200', l: 85 },
      { key: '300', l: 72 }, { key: '400', l: 60 }, { key: '500', l: 50 },
      { key: '600', l: 42 }, { key: '700', l: 35 }, { key: '800', l: 27 },
      { key: '900', l: 20 }, { key: '950', l: 12 },
    ];
    for (const level of levels) {
      shades[level.key] = hslToHex(h, s, level.l);
    }

    const config = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${colorName}': ${JSON.stringify(shades, null, 10).replace(/"/g, "'").replace(/ {10}/g, '          ')}\n      }\n    }\n  }\n}`;
    setOutput(config);
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Base Color</label>
            <input id={`${toolId}-color`} type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} aria-label={`Base color for ${toolName}`} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" />
          </div>
          <div>
            <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Color Name</label>
            <input id={`${toolId}-name`} type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} aria-label="Tailwind color name" className="input-field w-32" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate Tailwind color config" className="btn-primary">Generate Config</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
