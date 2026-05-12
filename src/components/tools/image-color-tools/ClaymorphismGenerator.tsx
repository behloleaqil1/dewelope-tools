'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ClaymorphismGenerator - Generate CSS claymorphism effect code.
 * Creates clay-like 3D UI elements with rounded shapes, inner shadows, and outer shadows.
 */
export default function ClaymorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#f0e6ff');
  const [borderRadius, setBorderRadius] = useState(30);
  const [outerShadowSize, setOuterShadowSize] = useState(12);
  const [innerShadowSize, setInnerShadowSize] = useState(4);
  const [inflate, setInflate] = useState(0.3);
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const adjustColor = (hex: string, amount: number): string => {
    const rgb = hexToRgb(hex);
    const r = Math.max(0, Math.min(255, rgb.r + amount));
    const g = Math.max(0, Math.min(255, rgb.g + amount));
    const b = Math.max(0, Math.min(255, rgb.b + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const generate = () => {
    const rgb = hexToRgb(bgColor);
    const lighterColor = adjustColor(bgColor, Math.round(inflate * 80));
    const darkerColor = adjustColor(bgColor, -Math.round(inflate * 60));

    const css = `.claymorphism {
  /* Claymorphism Effect */
  background: ${bgColor};
  border-radius: ${borderRadius}px;
  box-shadow: ${outerShadowSize}px ${outerShadowSize}px ${outerShadowSize * 2}px rgba(${rgb.r * 0.6 | 0}, ${rgb.g * 0.6 | 0}, ${rgb.b * 0.6 | 0}, 0.25),
              inset -${innerShadowSize}px -${innerShadowSize}px ${innerShadowSize * 2}px ${darkerColor},
              inset ${innerShadowSize}px ${innerShadowSize}px ${innerShadowSize * 2}px ${lighterColor};
  border: 2px solid rgba(255, 255, 255, ${inflate.toFixed(2)});
}`;

    setOutput(css);
  };

  const rgb = hexToRgb(bgColor);
  const lighterColor = adjustColor(bgColor, Math.round(inflate * 80));
  const darkerColor = adjustColor(bgColor, -Math.round(inflate * 60));

  const previewStyle: React.CSSProperties = {
    background: bgColor,
    borderRadius: `${borderRadius}px`,
    boxShadow: `${outerShadowSize}px ${outerShadowSize}px ${outerShadowSize * 2}px rgba(${rgb.r * 0.6 | 0}, ${rgb.g * 0.6 | 0}, ${rgb.b * 0.6 | 0}, 0.25), inset -${innerShadowSize}px -${innerShadowSize}px ${innerShadowSize * 2}px ${darkerColor}, inset ${innerShadowSize}px ${innerShadowSize}px ${innerShadowSize * 2}px ${lighterColor}`,
    border: `2px solid rgba(255, 255, 255, ${inflate})`,
    width: '150px',
    height: '150px',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius: {borderRadius}px
          </label>
          <input
            id={`${toolId}-radius`}
            type="range"
            min="0"
            max="80"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            aria-label={`Border radius for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-outer`} className="block text-sm font-medium text-gray-700 mb-1">
            Outer Shadow: {outerShadowSize}px
          </label>
          <input
            id={`${toolId}-outer`}
            type="range"
            min="2"
            max="30"
            value={outerShadowSize}
            onChange={(e) => setOuterShadowSize(Number(e.target.value))}
            aria-label={`Outer shadow size for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-inner`} className="block text-sm font-medium text-gray-700 mb-1">
            Inner Shadow: {innerShadowSize}px
          </label>
          <input
            id={`${toolId}-inner`}
            type="range"
            min="1"
            max="15"
            value={innerShadowSize}
            onChange={(e) => setInnerShadowSize(Number(e.target.value))}
            aria-label={`Inner shadow size for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-inflate`} className="block text-sm font-medium text-gray-700 mb-1">
            Inflate: {inflate.toFixed(2)}
          </label>
          <input
            id={`${toolId}-inflate`}
            type="range"
            min="0.1"
            max="0.8"
            step="0.05"
            value={inflate}
            onChange={(e) => setInflate(Number(e.target.value))}
            aria-label={`Inflate amount for ${toolName}`}
            className="w-full"
          />
        </InputArea>
      </div>

      <InputArea>
        <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-10 w-14 rounded border border-gray-300 cursor-pointer"
            aria-label={`Background color for ${toolName}`}
          />
          <input
            id={`${toolId}-color`}
            type="text"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="input-field flex-1"
          />
        </div>
      </InputArea>

      {/* Preview */}
      <div className="flex justify-center p-10 rounded-lg bg-gray-100">
        <div style={previewStyle} className="flex items-center justify-center">
          <span className="text-gray-600 font-medium text-sm">Clay UI</span>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate claymorphism CSS" className="btn-primary">
        Generate CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
