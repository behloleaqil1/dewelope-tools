'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function SvgIconCustomizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [icon, setIcon] = useState('heart');
  const [color, setColor] = useState('#ef4444');
  const [size, setSize] = useState('48');
  const [strokeWidth, setStrokeWidth] = useState('2');
  const [output, setOutput] = useState('');

  const icons: Record<string, string> = {
    heart: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    home: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    arrow: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z',
    bell: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  };

  const generate = () => {
    const s = parseInt(size) || 48;
    const sw = parseFloat(strokeWidth) || 2;
    const path = icons[icon] || icons.heart;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
  <path d="${path}"/>
</svg>`;

    setOutput(svg);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-icon`} className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
          <select id={`${toolId}-icon`} value={icon} onChange={(e) => setIcon(e.target.value)} aria-label={`Icon selection for ${toolName}`} className="input-field">
            <option value="heart">Heart</option>
            <option value="star">Star</option>
            <option value="home">Home</option>
            <option value="check">Checkmark</option>
            <option value="arrow">Arrow</option>
            <option value="bell">Bell</option>
          </select>
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label={`Icon color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={size} onChange={(e) => setSize(e.target.value)} aria-label={`Size for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-stroke`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Width</label>
          <input id={`${toolId}-stroke`} type="number" step="0.5" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} aria-label={`Stroke width for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Icon</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><div className="flex justify-center p-4" dangerouslySetInnerHTML={{ __html: output }} /><pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
