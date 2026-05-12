'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function BorderStyleGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [width, setWidth] = useState('2');
  const [style, setStyle] = useState('solid');
  const [color, setColor] = useState('#3b82f6');
  const [radius, setRadius] = useState('8');

  const css = `border: ${width}px ${style} ${color};\nborder-radius: ${radius}px;`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Width (px)</label>
        <input value={width} onChange={(e) => setWidth(e.target.value)} className="input-field" aria-label={`Width for ${toolName}`} />
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
        <select value={style} onChange={(e) => setStyle(e.target.value)} className="input-field" aria-label={`Style for ${toolName}`}>
          <option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="double">Double</option><option value="groove">Groove</option><option value="ridge">Ridge</option>
        </select>
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <div className="flex gap-2 items-center">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 rounded border" aria-label="Border color" />
          <input value={color} onChange={(e) => setColor(e.target.value)} className="input-field flex-1" />
        </div>
      </InputArea>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Border Radius (px)</label>
        <input value={radius} onChange={(e) => setRadius(e.target.value)} className="input-field" aria-label={`Radius for ${toolName}`} />
      </InputArea>
      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="p-6 flex justify-center"><div className="w-40 h-24 bg-gray-50" style={{ border: `${width}px ${style} ${color}`, borderRadius: `${radius}px` }} /></div>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{css}</pre>
          <CopyToClipboard text={css} />
        </div>
      </OutputArea>
    </div>
  );
}
