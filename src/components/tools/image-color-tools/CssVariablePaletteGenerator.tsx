'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssVariablePaletteGenerator - Generate CSS custom properties from a base color.
 */
export default function CssVariablePaletteGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [varPrefix, setVarPrefix] = useState('color');
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
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function generate() {
    const [h, s] = hexToHsl(baseColor);
    const shades = [
      { name: '50', l: 97 }, { name: '100', l: 93 }, { name: '200', l: 85 },
      { name: '300', l: 72 }, { name: '400', l: 60 }, { name: '500', l: 50 },
      { name: '600', l: 42 }, { name: '700', l: 35 }, { name: '800', l: 27 },
      { name: '900', l: 20 }, { name: '950', l: 12 },
    ];

    const lines = [':root {'];
    for (const shade of shades) {
      lines.push(`  --${varPrefix}-${shade.name}: hsl(${h}, ${s}%, ${shade.l}%);`);
    }
    lines.push('}');
    setOutput(lines.join('\n'));
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
            <label htmlFor={`${toolId}-prefix`} className="block text-sm font-medium text-gray-700 mb-1">Variable Prefix</label>
            <input id={`${toolId}-prefix`} type="text" value={varPrefix} onChange={(e) => setVarPrefix(e.target.value)} aria-label="CSS variable prefix" className="input-field w-32" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate CSS variables" className="btn-primary">Generate CSS Variables</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
