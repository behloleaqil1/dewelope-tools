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
    const hex = input.trim().replace('#', '');
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
      r = parseInt(hex.slice(0, 2), 16); g = parseInt(hex.slice(2, 4), 16); b = parseInt(hex.slice(4, 6), 16);
    } else if (/^[0-9a-fA-F]{3}$/.test(hex)) {
      r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16);
    } else { setOutput('Enter a valid hex color (e.g. #3498db).'); return; }
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
      else if (max === gn) h = ((bn - rn) / d + 2) * 60;
      else h = ((rn - gn) / d + 4) * 60;
    }
    setOutput(`HEX: #${hex.toUpperCase()}\nRGB: rgb(${r}, ${g}, ${b})\nHSL: hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)\nRGBA: rgba(${r}, ${g}, ${b}, 1)`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Hex Color</label>
        <div className="flex gap-2">
          <input id={`${toolId}-input`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="#3498db" aria-label={`Input for ${toolName}`} className="input-field" />
          <input type="color" value={input.startsWith('#') ? input : `#${input}`} onChange={(e) => setInput(e.target.value)} className="h-10 w-14 rounded border" aria-label="Color picker" />
        </div>
      </InputArea>
      <button onClick={convert} className="btn-primary">Convert</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
