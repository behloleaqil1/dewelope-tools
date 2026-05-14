'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssGlassmorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [blur, setBlur] = useState('12');
  const [opacity, setOpacity] = useState('0.2');
  const [color, setColor] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const b = parseInt(blur) || 12;
    const o = parseFloat(opacity) || 0.2;
    const rgb = hexToRgb(color);

    const css = `.glass {
  background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${o});
  backdrop-filter: blur(${b}px);
  -webkit-backdrop-filter: blur(${b}px);
  border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(o + 0.1).toFixed(2)});
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">Blur (px)</label>
          <input id={`${toolId}-blur`} type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} aria-label={`Blur for ${toolName}`} className="w-full" />
          <span className="text-xs text-gray-500">{blur}px</span>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
          <input id={`${toolId}-opacity`} type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(e.target.value)} aria-label={`Opacity for ${toolName}`} className="w-full" />
          <span className="text-xs text-gray-500">{opacity}</span>
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      <div className="relative h-32 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
        <div className="absolute inset-4 flex items-center justify-center rounded-2xl" style={{ background: `rgba(${hexToRgb(color).r},${hexToRgb(color).g},${hexToRgb(color).b},${opacity})`, backdropFilter: `blur(${blur}px)`, border: `1px solid rgba(${hexToRgb(color).r},${hexToRgb(color).g},${hexToRgb(color).b},0.3)` }}>
          <span className="text-white font-medium">Glass Preview</span>
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
