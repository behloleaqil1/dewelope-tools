'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssGradientGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [direction, setDirection] = useState('to right');
  const [type, setType] = useState('linear');
  const [output, setOutput] = useState('');

  const generate = () => {
    let gradient: string;
    if (type === 'linear') {
      gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
    } else {
      gradient = `radial-gradient(circle, ${color1}, ${color2})`;
    }
    const css = `.gradient {\n  background: ${gradient};\n}`;
    setOutput(css);
  };

  const previewGradient = type === 'linear'
    ? `linear-gradient(${direction}, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">Gradient Type</label>
        <select id={`${toolId}-type`} value={type} onChange={(e) => setType(e.target.value)} aria-label={`Gradient type for ${toolName}`} className="input-field">
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </InputArea>
      {type === 'linear' && (
        <InputArea>
          <label htmlFor={`${toolId}-dir`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
          <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} aria-label={`Direction for ${toolName}`} className="input-field">
            <option value="to right">To Right</option>
            <option value="to left">To Left</option>
            <option value="to bottom">To Bottom</option>
            <option value="to top">To Top</option>
            <option value="135deg">135°</option>
            <option value="45deg">45°</option>
          </select>
        </InputArea>
      )}
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-c1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
          <div className="flex gap-2">
            <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label={`Color 1 for ${toolName}`} className="h-10 w-14 rounded border cursor-pointer" />
            <input id={`${toolId}-c1`} type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field flex-1" />
          </div>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-c2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
          <div className="flex gap-2">
            <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label={`Color 2 for ${toolName}`} className="h-10 w-14 rounded border cursor-pointer" />
            <input id={`${toolId}-c2`} type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field flex-1" />
          </div>
        </InputArea>
      </div>
      <div className="h-24 rounded-lg border" style={{ background: previewGradient }} />
      <button onClick={generate} className="btn-primary">Generate CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
