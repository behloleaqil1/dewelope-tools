'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function PlaceholderImageGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('300');
  const [bgColor, setBgColor] = useState('#e2e8f0');
  const [textColor, setTextColor] = useState('#64748b');
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const w = parseInt(width) || 400;
    const h = parseInt(height) || 300;
    const displayText = text || `${w}×${h}`;
    const fontSize = Math.min(w, h) * 0.12;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bgColor}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="${fontSize}" font-family="Arial, sans-serif" fill="${textColor}">${displayText}</text>
</svg>`;

    const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    const imgTag = `<img src="${dataUri}" width="${w}" height="${h}" alt="Placeholder ${w}x${h}" />`;

    setOutput(`SVG:\n${svg}\n\nData URI (for img src):\n${dataUri}\n\nHTML:\n${imgTag}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
          <input id={`${toolId}-w`} type="number" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-h`} className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input id={`${toolId}-h`} type="number" value={height} onChange={(e) => setHeight(e.target.value)} aria-label={`Height for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label={`Text color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Custom Text (optional)</label>
        <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Leave empty for WxH" aria-label={`Custom text for ${toolName}`} className="input-field" />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate Placeholder</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-xs font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border max-h-60 overflow-auto">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
