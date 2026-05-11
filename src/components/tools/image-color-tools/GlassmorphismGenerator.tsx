'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function GlassmorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [blur, setBlur] = useState('10');
  const [opacity, setOpacity] = useState('0.25');
  const [color, setColor] = useState('#ffffff');
  const [border, setBorder] = useState('1');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.glass {\n  background: ${color}${Math.round(parseFloat(opacity) * 255).toString(16).padStart(2, '0')};\n  backdrop-filter: blur(${blur}px);\n  -webkit-backdrop-filter: blur(${blur}px);\n  border: ${border}px solid rgba(255, 255, 255, 0.18);\n  border-radius: 16px;\n}`;
    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">Blur (px): {blur}</label>
          <input id={`${toolId}-blur`} type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} aria-label={`Blur for ${toolName}`} className="w-full" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">Opacity: {opacity}</label>
          <input id={`${toolId}-opacity`} type="range" min="0" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(e.target.value)} aria-label={`Opacity for ${toolName}`} className="w-full" />
        </InputArea>
      </div>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Background color" className="h-10 w-20 rounded border border-gray-300" />
      </InputArea>
      <div className="p-8 rounded-2xl relative" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="p-6 rounded-2xl" style={{ background: `${color}${Math.round(parseFloat(opacity) * 255).toString(16).padStart(2, '0')}`, backdropFilter: `blur(${blur}px)`, border: `${border}px solid rgba(255,255,255,0.18)` }}>
          <p className="text-white text-center font-medium">Glass Effect Preview</p>
        </div>
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
