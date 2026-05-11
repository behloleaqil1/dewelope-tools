'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BorderGradientGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#ff0080');
  const [color2, setColor2] = useState('#7928ca');
  const [width, setWidth] = useState('3');
  const [radius, setRadius] = useState('8');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.border-gradient {\n  border: ${width}px solid transparent;\n  border-radius: ${radius}px;\n  background: linear-gradient(white, white) padding-box,\n              linear-gradient(to right, ${color1}, ${color2}) border-box;\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
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
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-w`} className="block text-sm font-medium text-gray-700 mb-1">Border Width (px)</label>
          <input id={`${toolId}-w`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} aria-label={`Border width for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-r`} className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
          <input id={`${toolId}-r`} type="text" inputMode="decimal" value={radius} onChange={(e) => setRadius(e.target.value)} aria-label={`Border radius for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <div className="p-8 rounded-lg" style={{ border: `${width}px solid transparent`, borderRadius: `${radius}px`, background: `linear-gradient(white, white) padding-box, linear-gradient(to right, ${color1}, ${color2}) border-box` }}>
        <p className="text-center text-gray-600 text-sm">Preview</p>
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
