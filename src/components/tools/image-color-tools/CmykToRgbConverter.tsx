'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CmykToRgbConverter - Convert CMYK color values to RGB and HEX with live preview.
 */
export default function CmykToRgbConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [c, setC] = useState('0');
  const [m, setM] = useState('0');
  const [y, setY] = useState('0');
  const [k, setK] = useState('0');

  const cVal = Math.min(100, Math.max(0, parseInt(c) || 0));
  const mVal = Math.min(100, Math.max(0, parseInt(m) || 0));
  const yVal = Math.min(100, Math.max(0, parseInt(y) || 0));
  const kVal = Math.min(100, Math.max(0, parseInt(k) || 0));

  const r = Math.round(255 * (1 - cVal / 100) * (1 - kVal / 100));
  const g = Math.round(255 * (1 - mVal / 100) * (1 - kVal / 100));
  const b = Math.round(255 * (1 - yVal / 100) * (1 - kVal / 100));

  const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  const rgbStr = `rgb(${r}, ${g}, ${b})`;
  const cmykStr = `cmyk(${cVal}%, ${mVal}%, ${yVal}%, ${kVal}%)`;

  const copyText = `CMYK: ${cmykStr}\nRGB: ${rgbStr}\nHEX: ${hex}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">CMYK Values (0-100%)</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor={`${toolId}-c`} className="block text-xs text-gray-500 mb-1">C (Cyan)</label>
            <input id={`${toolId}-c`} type="number" min="0" max="100" value={c} onChange={(e) => setC(e.target.value)} aria-label={`Cyan value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-m`} className="block text-xs text-gray-500 mb-1">M (Magenta)</label>
            <input id={`${toolId}-m`} type="number" min="0" max="100" value={m} onChange={(e) => setM(e.target.value)} aria-label={`Magenta value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-y`} className="block text-xs text-gray-500 mb-1">Y (Yellow)</label>
            <input id={`${toolId}-y`} type="number" min="0" max="100" value={y} onChange={(e) => setY(e.target.value)} aria-label={`Yellow value for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-k`} className="block text-xs text-gray-500 mb-1">K (Key/Black)</label>
            <input id={`${toolId}-k`} type="number" min="0" max="100" value={k} onChange={(e) => setK(e.target.value)} aria-label={`Key/Black value for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div className="w-full h-24 rounded-lg border border-gray-200" style={{ backgroundColor: hex }} aria-label="Color preview" />
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{hex}</div>
              <div className="text-xs text-gray-500 mt-1">HEX</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{rgbStr}</div>
              <div className="text-xs text-gray-500 mt-1">RGB</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-gray-800 font-mono">{cmykStr}</div>
              <div className="text-xs text-gray-500 mt-1">CMYK</div>
            </div>
          </div>
          <CopyToClipboard text={copyText} />
        </div>
      </OutputArea>
    </div>
  );
}
