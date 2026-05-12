'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GradientDirectionPicker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [angle, setAngle] = useState('90');
  const [color1, setColor1] = useState('#3498db');
  const [color2, setColor2] = useState('#e74c3c');

  const css = `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Angle: {angle}°</label>
        <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} aria-label={`Angle for ${toolName}`} className="w-full" />
        <div className="flex gap-2 mt-2">
          <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="Color 1" className="h-10 w-14 rounded border" />
          <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="Color 2" className="h-10 w-14 rounded border" />
        </div>
      </InputArea>
      <div className="h-24 rounded-lg border" style={{ background: `linear-gradient(${angle}deg, ${color1}, ${color2})` }} />
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{css}</pre>
          <CopyToClipboard text={css} />
        </div>
      </OutputArea>
    </div>
  );
}
