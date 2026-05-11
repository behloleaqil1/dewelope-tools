'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function ColorFormatConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('#3498db');
  const [output, setOutput] = useState('');

  const convert = () => {
    let r = 0, g = 0, b = 0;
    const hex = input.trim();
    const hexMatch = hex.match(/^#?([0-9a-f]{6})$/i);
    const rgbMatch = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (hexMatch) { r = parseInt(hexMatch[1].slice(0, 2), 16); g = parseInt(hexMatch[1].slice(2, 4), 16); b = parseInt(hexMatch[1].slice(4, 6), 16); }
    else if (rgbMatch) { r = parseInt(rgbMatch[1]); g = parseInt(rgbMatch[2]); b = parseInt(rgbMatch[3]); }
    else { setOutput('Enter a valid hex (#RRGGBB) or rgb(r,g,b) color.'); return; }
    const hexStr = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    const d = max - min;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (d !== 0) { if (max === r / 255) h = ((g / 255 - b / 255) / d) % 6; else if (max === g / 255) h = (b / 255 - r / 255) / d + 2; else h = (r / 255 - g / 255) / d + 4; h = Math.round(h * 60); if (h < 0) h += 360; }
    setOutput(`HEX: ${hexStr}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${h}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)\nRGBA: rgba(${r}, ${g}, ${b}, 1)\nCSS: ${hexStr}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Color (hex or rgb)</label>
        <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="#3498db or rgb(52,152,219)" aria-label={`Input for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><div className="w-full h-12 rounded" style={{ backgroundColor: input.startsWith('#') ? input : '' }} /><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
