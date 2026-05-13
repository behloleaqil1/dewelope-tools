'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextShadow3dGenerator - Generate CSS 3D text shadow layers
 * with configurable depth, angle, and color.
 */
export default function CssTextShadow3dGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('3D Text');
  const [layers, setLayers] = useState('10');
  const [color, setColor] = useState('#e74c3c');
  const [angle, setAngle] = useState('135');
  const [fontSize, setFontSize] = useState('48');
  const [output, setOutput] = useState('');

  const generate = () => {
    const numLayers = Math.min(50, Math.max(1, parseInt(layers) || 10));
    const angleDeg = parseFloat(angle) || 135;
    const angleRad = (angleDeg * Math.PI) / 180;

    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(color);
    const shadows: string[] = [];

    for (let i = 1; i <= numLayers; i++) {
      const x = Math.round(Math.cos(angleRad) * i);
      const y = Math.round(Math.sin(angleRad) * i);
      const darken = Math.max(0, 1 - (i / numLayers) * 0.6);
      const r = Math.round(rgb.r * darken);
      const g = Math.round(rgb.g * darken);
      const b = Math.round(rgb.b * darken);
      shadows.push(`${x}px ${y}px 0 rgb(${r}, ${g}, ${b})`);
    }

    const shadowCSS = shadows.join(',\n    ');
    const css = `.text-3d {\n  font-size: ${fontSize}px;\n  font-weight: bold;\n  color: ${color};\n  text-shadow:\n    ${shadowCSS};\n}`;

    const html = `<span class="text-3d">${text}</span>`;

    const result = `/* CSS 3D Text Shadow */\n${css}\n\n/* HTML */\n${html}`;
    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">{toolName}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-xs text-gray-600 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label="Text to style" />
          </div>
          <div>
            <label htmlFor={`${toolId}-layers`} className="block text-xs text-gray-600 mb-1">Depth Layers (1-50)</label>
            <input id={`${toolId}-layers`} type="number" min="1" max="50" value={layers} onChange={(e) => setLayers(e.target.value)} className="input-field" aria-label="Number of shadow layers" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-xs text-gray-600 mb-1">Base Color</label>
            <input id={`${toolId}-color`} type="color" value={color} onChange={(e) => setColor(e.target.value)} className="input-field h-10" aria-label="Base shadow color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-xs text-gray-600 mb-1">Angle (°)</label>
            <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} className="input-field" aria-label="Shadow angle in degrees" />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-xs text-gray-600 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size in pixels" />
          </div>
        </div>
        <button onClick={generate} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" aria-label="Generate 3D text shadow CSS">
          Generate 3D Shadow
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="p-4 bg-gray-900 rounded flex items-center justify-center overflow-hidden">
              <span style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: color }} aria-hidden="true">{text}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded border overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
