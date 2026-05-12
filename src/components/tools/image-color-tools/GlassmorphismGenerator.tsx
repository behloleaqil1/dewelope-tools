'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GlassmorphismGenerator - Generate CSS glassmorphism effect code.
 * Creates frosted glass UI effects with customizable blur, opacity, and border.
 */
export default function GlassmorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.25);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderOpacity, setBorderOpacity] = useState(0.18);
  const [borderRadius, setBorderRadius] = useState(16);
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const rgb = hexToRgb(bgColor);

    const css = `.glass {
  /* Glassmorphism Effect */
  background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${borderRadius}px;
  border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity});
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}`;

    setOutput(css);
  };

  const previewStyle = {
    background: `rgba(${hexToRgb(bgColor).r}, ${hexToRgb(bgColor).g}, ${hexToRgb(bgColor).b}, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    borderRadius: `${borderRadius}px`,
    border: `1px solid rgba(${hexToRgb(bgColor).r}, ${hexToRgb(bgColor).g}, ${hexToRgb(bgColor).b}, ${borderOpacity})`,
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-blur`} className="block text-sm font-medium text-gray-700 mb-1">
            Blur: {blur}px
          </label>
          <input
            id={`${toolId}-blur`}
            type="range"
            min="0"
            max="30"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            aria-label={`Blur amount for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-opacity`} className="block text-sm font-medium text-gray-700 mb-1">
            Background Opacity: {opacity.toFixed(2)}
          </label>
          <input
            id={`${toolId}-opacity`}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            aria-label={`Opacity for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-border-opacity`} className="block text-sm font-medium text-gray-700 mb-1">
            Border Opacity: {borderOpacity.toFixed(2)}
          </label>
          <input
            id={`${toolId}-border-opacity`}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={borderOpacity}
            onChange={(e) => setBorderOpacity(Number(e.target.value))}
            aria-label={`Border opacity for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius: {borderRadius}px
          </label>
          <input
            id={`${toolId}-radius`}
            type="range"
            min="0"
            max="50"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            aria-label={`Border radius for ${toolName}`}
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
      <div className="relative h-40 rounded-lg overflow-hidden" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="absolute inset-4 flex items-center justify-center" style={previewStyle}>
          <span className="text-white font-medium text-lg">Glass Effect Preview</span>
        </div>
      </div>

      <button onClick={generate} aria-label="Generate glassmorphism CSS" className="btn-primary">
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
