'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function NeumorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [distance, setDistance] = useState('10');
  const [intensity, setIntensity] = useState('0.15');
  const [blur, setBlur] = useState('20');
  const [output, setOutput] = useState('');

  const adjustColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  };

  const generate = () => {
    const d = parseInt(distance);
    const b = parseInt(blur);
    const dark = adjustColor(bgColor, -Math.round(parseFloat(intensity) * 255));
    const light = adjustColor(bgColor, Math.round(parseFloat(intensity) * 255));
    const css = `.neumorphism {\n  background: ${bgColor};\n  border-radius: 16px;\n  box-shadow: ${d}px ${d}px ${b}px ${dark},\n             -${d}px -${d}px ${b}px ${light};\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <div className="flex gap-2">
          <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} aria-label="Background color" className="h-10 w-16 rounded border border-gray-300" />
          <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field flex-1 font-mono" aria-label={`Hex value for ${toolName}`} />
        </div>
      </InputArea>
      <div className="grid grid-cols-3 gap-4">
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distance: {distance}</label>
          <input type="range" min="2" max="30" value={distance} onChange={(e) => setDistance(e.target.value)} aria-label="Shadow distance" className="w-full" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blur: {blur}</label>
          <input type="range" min="5" max="60" value={blur} onChange={(e) => setBlur(e.target.value)} aria-label="Shadow blur" className="w-full" />
        </InputArea>
        <InputArea>
          <label className="block text-sm font-medium text-gray-700 mb-1">Intensity: {intensity}</label>
          <input type="range" min="0.05" max="0.4" step="0.05" value={intensity} onChange={(e) => setIntensity(e.target.value)} aria-label="Shadow intensity" className="w-full" />
        </InputArea>
      </div>
      <div className="p-12 rounded-lg flex items-center justify-center" style={{ background: bgColor }}>
        <div className="w-32 h-32 rounded-2xl" style={{ background: bgColor, boxShadow: `${distance}px ${distance}px ${blur}px ${adjustColor(bgColor, -Math.round(parseFloat(intensity) * 255))}, -${distance}px -${distance}px ${blur}px ${adjustColor(bgColor, Math.round(parseFloat(intensity) * 255))}` }} />
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
