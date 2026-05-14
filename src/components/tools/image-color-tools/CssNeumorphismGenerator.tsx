'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function CssNeumorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState('10');
  const [intensity] = useState('0.15');
  const [shape, setShape] = useState('flat');
  const [output, setOutput] = useState('');

  const adjustColor = (hex: string, amount: number): string => {
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
    return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
  };

  const generate = () => {
    const d = parseInt(distance) || 10;
    const _i = parseFloat(intensity) || 0.15;
    const lightShadow = adjustColor(bgColor, 40);
    const darkShadow = adjustColor(bgColor, -40);

    let boxShadow: string;
    if (shape === 'flat') {
      boxShadow = `${d}px ${d}px ${d * 2}px ${darkShadow},\n    -${d}px -${d}px ${d * 2}px ${lightShadow}`;
    } else if (shape === 'concave') {
      boxShadow = `inset ${d}px ${d}px ${d * 2}px ${darkShadow},\n    inset -${d}px -${d}px ${d * 2}px ${lightShadow}`;
    } else {
      boxShadow = `${d}px ${d}px ${d * 2}px ${darkShadow},\n    -${d}px -${d}px ${d * 2}px ${lightShadow},\n    inset ${d}px ${d}px ${d * 2}px ${darkShadow},\n    inset -${d}px -${d}px ${d * 2}px ${lightShadow}`;
    }

    const css = `.neumorphism {\n  background: ${bgColor};\n  border-radius: ${d * 2}px;\n  box-shadow: ${boxShadow};\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <div className="flex gap-2">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label={`Background color for ${toolName}`} className="h-10 w-14 rounded border cursor-pointer" />
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field flex-1" />
          </div>
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
          <select id={`${toolId}-shape`} value={shape} onChange={(e) => setShape(e.target.value)} aria-label={`Shape for ${toolName}`} className="input-field">
            <option value="flat">Flat (Raised)</option>
            <option value="concave">Concave (Pressed)</option>
            <option value="both">Both</option>
          </select>
        </InputArea>
      </div>
      <InputArea>
        <label htmlFor={`${toolId}-dist`} className="block text-sm font-medium text-gray-700 mb-1">Distance: {distance}px</label>
        <input id={`${toolId}-dist`} type="range" min="2" max="30" value={distance} onChange={(e) => setDistance(e.target.value)} aria-label={`Distance for ${toolName}`} className="w-full" />
      </InputArea>
      <button onClick={generate} className="btn-primary">Generate CSS</button>
      <OutputArea hasContent={!!output}>
        {output && (<div className="space-y-2"><pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border">{output}</pre><CopyToClipboard text={output} /></div>)}
      </OutputArea>
    </div>
  );
}
