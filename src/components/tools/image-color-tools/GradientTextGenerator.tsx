'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GradientTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Gradient Text');
  const [color1, setColor1] = useState('#ff0080');
  const [color2, setColor2] = useState('#7928ca');
  const [direction, setDirection] = useState('to right');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.gradient-text {\n  background: linear-gradient(${direction}, ${color1}, ${color2});\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
        <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} aria-label={`Preview text for ${toolName}`} className="input-field" />
      </InputArea>
      <div className="flex gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="Start color" className="h-10 w-full rounded border border-gray-300" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="End color" className="h-10 w-full rounded border border-gray-300" />
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
        <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} aria-label={`Direction for ${toolName}`} className="input-field">
          <option value="to right">Left to Right</option>
          <option value="to left">Right to Left</option>
          <option value="to bottom">Top to Bottom</option>
          <option value="45deg">45 Degrees</option>
        </select>
      </InputArea>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-3xl font-bold" style={{ background: `linear-gradient(${direction}, ${color1}, ${color2})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{text}</span>
      </div>
      <button onClick={generate} className="btn-primary" aria-label="Generate CSS">Generate CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
