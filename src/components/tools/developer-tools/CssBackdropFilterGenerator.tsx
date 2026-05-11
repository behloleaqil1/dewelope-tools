'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBackdropFilterGenerator - Generate CSS backdrop-filter (glassmorphism) with live preview.
 * Supports blur, brightness, contrast, saturation, and opacity controls.
 */
export default function CssBackdropFilterGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [blur, setBlur] = useState(10);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [opacity, setOpacity] = useState(80);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(12);
  const [border, setBorder] = useState(true);

  const bgRgba = (() => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
  })();

  const filters: string[] = [];
  if (blur !== 0) filters.push(`blur(${blur}px)`);
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (saturate !== 100) filters.push(`saturate(${saturate}%)`);

  const backdropFilter = filters.length > 0 ? filters.join(' ') : 'none';

  const cssCode = `.glass {
  background: ${bgRgba};
  backdrop-filter: ${backdropFilter};
  -webkit-backdrop-filter: ${backdropFilter};
  border-radius: ${borderRadius}px;${border ? `\n  border: 1px solid rgba(255, 255, 255, 0.18);` : ''}
}`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">
              Blur: {blur}px
            </label>
            <input id={`${toolId}-blur`} type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" aria-label={`Blur for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-brightness`} className="block text-sm font-medium text-gray-700 mb-1">
              Brightness: {brightness}%
            </label>
            <input id={`${toolId}-brightness`} type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" aria-label="Brightness" />
          </div>
          <div>
            <label htmlFor={`${toolId}-contrast`} className="block text-sm font-medium text-gray-700 mb-1">
              Contrast: {contrast}%
            </label>
            <input id={`${toolId}-contrast`} type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full" aria-label="Contrast" />
          </div>
          <div>
            <label htmlFor={`${toolId}-saturate`} className="block text-sm font-medium text-gray-700 mb-1">
              Saturate: {saturate}%
            </label>
            <input id={`${toolId}-saturate`} type="range" min="0" max="200" value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} className="w-full" aria-label="Saturate" />
          </div>
          <div>
            <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">
              Background Opacity: {opacity}%
            </label>
            <input id={`${toolId}-opacity`} type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" aria-label="Background opacity" />
          </div>
          <div>
            <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
              Border Radius: {borderRadius}px
            </label>
            <input id={`${toolId}-radius`} type="range" min="0" max="50" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full" aria-label="Border radius" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input id={`${toolId}-color`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-8 rounded cursor-pointer" aria-label="Background color" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mt-4">
              <input type="checkbox" checked={border} onChange={(e) => setBorder(e.target.checked)} className="rounded border-gray-300" />
              Show border
            </label>
          </div>
        </div>

        <div className="relative rounded-lg overflow-hidden min-h-[250px]" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full max-w-xs text-center" style={{ background: bgRgba, backdropFilter, WebkitBackdropFilter: backdropFilter, borderRadius: `${borderRadius}px`, border: border ? '1px solid rgba(255, 255, 255, 0.18)' : 'none', padding: '24px' }}>
              <p className="text-white font-semibold text-lg">Glassmorphism</p>
              <p className="text-white/80 text-sm mt-1">Live Preview</p>
            </div>
          </div>
        </div>
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{cssCode}</pre>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
