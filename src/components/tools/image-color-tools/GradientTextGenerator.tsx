'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GradientTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Gradient Text');
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [direction, setDirection] = useState('to right');

  const css = `background: linear-gradient(${direction}, ${color1}, ${color2});\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nbackground-clip: text;`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
        <input id={`${toolId}-text`} value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
        <div className="flex gap-2 items-center">
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 rounded border" aria-label="Color 1" />
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 rounded border" aria-label="Color 2" />
          <select value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field flex-1" aria-label="Direction">
            <option value="to right">→ Right</option><option value="to left">← Left</option><option value="to bottom">↓ Down</option><option value="45deg">↗ 45°</option>
          </select>
        </div>
      </InputArea>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <h3 className="text-3xl font-bold" style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text || 'Preview'}</h3>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{css}</pre>
          <CopyToClipboard text={css} />
        </div>
      </OutputArea>
    </div>
  );
}
