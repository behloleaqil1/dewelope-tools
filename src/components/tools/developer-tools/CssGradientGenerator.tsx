'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssGradientGenerator - Generates CSS gradient code with customizable colors, direction, and type.
 */
export default function CssGradientGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [color3, setColor3] = useState('');
  const [direction, setDirection] = useState('to right');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  function getGradientCss(): string {
    const colors = [color1, color2, color3].filter(Boolean).join(', ');
    if (gradientType === 'radial') {
      return `radial-gradient(circle, ${colors})`;
    }
    return `linear-gradient(${direction}, ${colors})`;
  }

  const gradientCss = getGradientCss();
  const fullCss = `background: ${gradientCss};`;

  const directions = [
    { value: 'to right', label: '→ Right' },
    { value: 'to left', label: '← Left' },
    { value: 'to bottom', label: '↓ Down' },
    { value: 'to top', label: '↑ Up' },
    { value: 'to bottom right', label: '↘ Bottom Right' },
    { value: 'to bottom left', label: '↙ Bottom Left' },
    { value: 'to top right', label: '↗ Top Right' },
    { value: 'to top left', label: '↖ Top Left' },
    { value: '45deg', label: '45°' },
    { value: '90deg', label: '90°' },
    { value: '135deg', label: '135°' },
    { value: '180deg', label: '180°' },
  ];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-3" id={`${toolId}-label`}>
          Configure gradient for {toolName}
        </label>
        <div className="space-y-3" aria-labelledby={`${toolId}-label`}>
          <div className="flex gap-2">
            <button
              onClick={() => setGradientType('linear')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${gradientType === 'linear' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              aria-label="Linear gradient"
            >Linear</button>
            <button
              onClick={() => setGradientType('radial')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${gradientType === 'radial' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              aria-label="Radial gradient"
            >Radial</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color 1</label>
              <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="First color" className="w-full h-10 rounded cursor-pointer border border-gray-200" />
              <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field text-xs font-mono mt-1" aria-label="Color 1 hex" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color 2</label>
              <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="Second color" className="w-full h-10 rounded cursor-pointer border border-gray-200" />
              <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field text-xs font-mono mt-1" aria-label="Color 2 hex" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Color 3 (optional)</label>
              <input type="color" value={color3 || '#ffffff'} onChange={(e) => setColor3(e.target.value)} aria-label="Third color" className="w-full h-10 rounded cursor-pointer border border-gray-200" />
              <input type="text" value={color3} onChange={(e) => setColor3(e.target.value)} placeholder="Optional" className="input-field text-xs font-mono mt-1" aria-label="Color 3 hex" />
            </div>
          </div>

          {gradientType === 'linear' && (
            <div>
              <label htmlFor={`${toolId}-dir`} className="block text-xs text-gray-500 mb-1">Direction</label>
              <select id={`${toolId}-dir`} value={direction} onChange={(e) => setDirection(e.target.value)} aria-label="Gradient direction" className="input-field text-sm">
                {directions.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
              </select>
            </div>
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="w-full h-24 rounded-lg border border-gray-200" style={{ background: gradientCss }} aria-label="Gradient preview" />
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <code className="text-sm font-mono text-gray-800 break-all">{fullCss}</code>
          </div>
          <CopyToClipboard text={fullCss} />
        </div>
      </OutputArea>
    </div>
  );
}
