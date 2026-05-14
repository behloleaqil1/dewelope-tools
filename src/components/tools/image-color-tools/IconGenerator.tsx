'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function IconGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [letter, setLetter] = useState('A');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [shape, setShape] = useState('circle');
  const [size, setSize] = useState('64');
  const [output, setOutput] = useState('');

  const generate = () => {
    const s = parseInt(size) || 64;
    const char = letter.slice(0, 2) || 'A';
    let svg: string;

    if (shape === 'circle') {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">\n  <circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}" fill="${bgColor}"/>\n  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="${s * 0.45}" font-family="Arial, sans-serif" fill="${textColor}" font-weight="bold">${char}</text>\n</svg>`;
    } else if (shape === 'rounded') {
      const r = s * 0.15;
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">\n  <rect width="${s}" height="${s}" rx="${r}" fill="${bgColor}"/>\n  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="${s * 0.45}" font-family="Arial, sans-serif" fill="${textColor}" font-weight="bold">${char}</text>\n</svg>`;
    } else {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">\n  <rect width="${s}" height="${s}" fill="${bgColor}"/>\n  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="${s * 0.45}" font-family="Arial, sans-serif" fill="${textColor}" font-weight="bold">${char}</text>\n</svg>`;
    }

    setOutput(svg);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-letter`} className="block text-sm font-medium text-gray-700 mb-1">Letter/Emoji</label>
          <input id={`${toolId}-letter`} type="text" maxLength={2} value={letter} onChange={(e) => setLetter(e.target.value)} aria-label={`Letter for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
          <select id={`${toolId}-shape`} value={shape} onChange={(e) => setShape(e.target.value)} aria-label={`Shape for ${toolName}`} className="input-field">
            <option value="circle">Circle</option>
            <option value="rounded">Rounded Square</option>
            <option value="square">Square</option>
          </select>
        </InputArea>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label={`Text color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
          <input id={`${toolId}-size`} type="number" value={size} onChange={(e) => setSize(e.target.value)} aria-label={`Size for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={generate} className="btn-primary">Generate Icon</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><div className="flex justify-center p-4" dangerouslySetInnerHTML={{ __html: output }} /><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
