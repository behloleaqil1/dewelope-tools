'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorFormatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('#ff6600');
  const [result, setResult] = useState('');

  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
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
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const convert = () => {
    let r: number, g: number, b: number;
    const trimmed = input.trim();
    if (trimmed.startsWith('#')) {
      ({ r, g, b } = hexToRgb(trimmed));
    } else if (trimmed.startsWith('rgb')) {
      const match = trimmed.match(/(\d+)/g);
      if (!match || match.length < 3) return;
      [r, g, b] = match.map(Number);
    } else return;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const hsl = rgbToHsl(r, g, b);
    setResult(`HEX: ${hex}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\nHWB: hwb(${hsl.h} ${Math.round(Math.min(r, g, b) / 255 * 100)}% ${Math.round((1 - Math.max(r, g, b) / 255) * 100)}%)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Enter color (hex or rgb)</label>
        <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="#ff6600 or rgb(255, 102, 0)" aria-label={`Color input for ${toolName}`} className="input-field font-mono" />
      </InputArea>
      <button onClick={convert} className="btn-primary" aria-label="Convert color">Convert</button>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <div className="w-full h-12 rounded border border-gray-200" style={{ backgroundColor: input.trim() }} />
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
