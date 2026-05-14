'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function FaviconGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [letter, setLetter] = useState('F');
  const [bgColor, setBgColor] = useState('#6366f1');
  const [textColor, setTextColor] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const generate = () => {
    const char = letter.slice(0, 1) || 'F';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="${bgColor}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" font-size="18" font-family="Arial, sans-serif" fill="${textColor}" font-weight="bold">${char}</text>
</svg>`;

    const htmlLink = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(svg)}" />`;
    setOutput(`SVG Favicon:\n${svg}\n\nHTML Link Tag:\n${htmlLink}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-letter`} className="block text-sm font-medium text-gray-700 mb-1">Letter</label>
          <input id={`${toolId}-letter`} type="text" maxLength={1} value={letter} onChange={(e) => setLetter(e.target.value)} aria-label={`Letter for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} aria-label={`Text color for ${toolName}`} className="h-10 w-full rounded border cursor-pointer" />
        </InputArea>
      </div>
      {/* Preview */}
      <div className="flex items-center gap-4 p-4 border rounded-lg">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="6" fill={bgColor} />
          <text x="50%" y="50%" textAnchor="middle" dy=".35em" fontSize="18" fontFamily="Arial, sans-serif" fill={textColor} fontWeight="bold">{letter.slice(0, 1) || 'F'}</text>
        </svg>
        <span className="text-sm text-gray-500">32×32 preview</span>
      </div>
      <button onClick={generate} className="btn-primary">Generate Favicon</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
