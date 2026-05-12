'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NeumorphismGenerator - Generate CSS neumorphism/soft UI effect code.
 * Creates soft, extruded UI elements with customizable shadows, radius, and colors.
 */
export default function NeumorphismGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [size, setSize] = useState(10);
  const [radius, setRadius] = useState(16);
  const [intensity, setIntensity] = useState(0.15);
  const [shape, setShape] = useState<'flat' | 'concave' | 'convex' | 'pressed'>('flat');
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
    const darkShadow = adjustColor(bgColor, -Math.round(intensity * 255));
    const lightShadow = adjustColor(bgColor, Math.round(intensity * 255));

    let boxShadow: string;
    let background: string;

    switch (shape) {
      case 'concave':
        boxShadow = `${size}px ${size}px ${size * 2}px ${darkShadow},\n             -${size}px -${size}px ${size * 2}px ${lightShadow}`;
        background = `linear-gradient(145deg, ${adjustColor(bgColor, -10)}, ${adjustColor(bgColor, 10)})`;
        break;
      case 'convex':
        boxShadow = `${size}px ${size}px ${size * 2}px ${darkShadow},\n             -${size}px -${size}px ${size * 2}px ${lightShadow}`;
        background = `linear-gradient(145deg, ${adjustColor(bgColor, 10)}, ${adjustColor(bgColor, -10)})`;
        break;
      case 'pressed':
        boxShadow = `inset ${size}px ${size}px ${size * 2}px ${darkShadow},\n             inset -${size}px -${size}px ${size * 2}px ${lightShadow}`;
        background = bgColor;
        break;
      default:
        boxShadow = `${size}px ${size}px ${size * 2}px ${darkShadow},\n             -${size}px -${size}px ${size * 2}px ${lightShadow}`;
        background = bgColor;
    }

    const css = `.neumorphic {
  /* Neumorphism / Soft UI Effect */
  background: ${background};
  border-radius: ${radius}px;
  box-shadow: ${boxShadow};
}

/* Container background should match */
.container {
  background: ${bgColor};
}`;

    setOutput(css);
  };

  const darkShadow = adjustColor(bgColor, -Math.round(intensity * 255));
  const lightShadow = adjustColor(bgColor, Math.round(intensity * 255));

  const getPreviewStyle = () => {
    const base: React.CSSProperties = { borderRadius: `${radius}px`, width: '150px', height: '150px' };
    switch (shape) {
      case 'concave':
        return { ...base, background: `linear-gradient(145deg, ${adjustColor(bgColor, -10)}, ${adjustColor(bgColor, 10)})`, boxShadow: `${size}px ${size}px ${size * 2}px ${darkShadow}, -${size}px -${size}px ${size * 2}px ${lightShadow}` };
      case 'convex':
        return { ...base, background: `linear-gradient(145deg, ${adjustColor(bgColor, 10)}, ${adjustColor(bgColor, -10)})`, boxShadow: `${size}px ${size}px ${size * 2}px ${darkShadow}, -${size}px -${size}px ${size * 2}px ${lightShadow}` };
      case 'pressed':
        return { ...base, background: bgColor, boxShadow: `inset ${size}px ${size}px ${size * 2}px ${darkShadow}, inset -${size}px -${size}px ${size * 2}px ${lightShadow}` };
      default:
        return { ...base, background: bgColor, boxShadow: `${size}px ${size}px ${size * 2}px ${darkShadow}, -${size}px -${size}px ${size * 2}px ${lightShadow}` };
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">
            Shadow Size: {size}px
          </label>
          <input
            id={`${toolId}-size`}
            type="range"
            min="2"
            max="30"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            aria-label={`Shadow size for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-radius`} className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius: {radius}px
          </label>
          <input
            id={`${toolId}-radius`}
            type="range"
            min="0"
            max="100"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            aria-label={`Border radius for ${toolName}`}
            className="w-full"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-intensity`} className="block text-sm font-medium text-gray-700 mb-1">
            Intensity: {intensity.toFixed(2)}
          </label>
          <input
            id={`${toolId}-intensity`}
            type="range"
            min="0.05"
            max="0.4"
            step="0.01"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            aria-label={`Intensity for ${toolName}`}
            className="w-full"
          />
        </InputArea>

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
      </div>

      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shape</label>
        <div className="flex flex-wrap gap-4">
          {(['flat', 'concave', 'convex', 'pressed'] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" checked={shape === s} onChange={() => setShape(s)} className="text-blue-600" />
              <span className="text-sm capitalize">{s}</span>
            </label>
          ))}
        </div>
      </InputArea>

      {/* Preview */}
      <div className="flex justify-center p-10 rounded-lg" style={{ background: bgColor }}>
        <div style={getPreviewStyle()} />
      </div>

      <button onClick={generate} aria-label="Generate neumorphism CSS" className="btn-primary">
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
