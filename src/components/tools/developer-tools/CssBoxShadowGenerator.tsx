'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBoxShadowGenerator - Generate CSS box-shadow with visual controls and live preview.
 */
export default function CssBoxShadowGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${(alpha / 100).toFixed(2)})`;
  }

  const rgba = hexToRgba(color, opacity);
  const shadow = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`;
  const cssCode = `box-shadow: ${shadow};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shadow Controls</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-x`} className="block text-xs text-gray-500 mb-1">Offset X: {offsetX}px</label>
            <input id={`${toolId}-x`} type="range" min="-50" max="50" value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full" aria-label={`Horizontal offset for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-y`} className="block text-xs text-gray-500 mb-1">Offset Y: {offsetY}px</label>
            <input id={`${toolId}-y`} type="range" min="-50" max="50" value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full" aria-label={`Vertical offset for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-xs text-gray-500 mb-1">Blur: {blur}px</label>
            <input id={`${toolId}-blur`} type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" aria-label="Blur radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-spread`} className="block text-xs text-gray-500 mb-1">Spread: {spread}px</label>
            <input id={`${toolId}-spread`} type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full" aria-label="Spread radius" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-xs text-gray-500 mb-1">Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-9 rounded cursor-pointer" aria-label="Shadow color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-xs text-gray-500 mb-1">Opacity: {opacity}%</label>
            <input id={`${toolId}-opacity`} type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" aria-label="Shadow opacity" />
          </div>
        </div>
        <div className="mt-3">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded" aria-label="Inset shadow" />
            Inset shadow
          </label>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg border border-gray-200">
            <div
              className="w-48 h-32 bg-white rounded-lg"
              style={{ boxShadow: shadow }}
              aria-label="Shadow preview"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{cssCode}</pre>
          </div>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
