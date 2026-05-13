'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Css3dTextGenerator - Generate CSS 3D extruded text effect.
 * Creates multi-layered text-shadow for a 3D depth effect.
 */
export default function Css3dTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('3D Text');
  const [fontSize, setFontSize] = useState('72');
  const [textColor, setTextColor] = useState('#FF6B6B');
  const [shadowColor, setShadowColor] = useState('#C0392B');
  const [depth, setDepth] = useState('8');
  const [angle, setAngle] = useState('45');
  const [output, setOutput] = useState('');

  const generate = () => {
    const depthNum = parseInt(depth);
    const angleRad = (parseInt(angle) * Math.PI) / 180;
    const dx = Math.cos(angleRad);
    const dy = Math.sin(angleRad);

    // Parse shadow color to darken progressively
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const rgb = hexToRgb(shadowColor);
    const shadows: string[] = [];

    for (let i = 1; i <= depthNum; i++) {
      const factor = 1 - (i / depthNum) * 0.4;
      const r = Math.round(rgb.r * factor);
      const g = Math.round(rgb.g * factor);
      const b = Math.round(rgb.b * factor);
      const x = Math.round(dx * i);
      const y = Math.round(dy * i);
      shadows.push(`${x}px ${y}px 0 rgb(${r}, ${g}, ${b})`);
    }

    const textShadow = shadows.join(',\n    ');

    const css = `.text-3d {
  font-size: ${fontSize}px;
  font-weight: bold;
  color: ${textColor};
  text-shadow:
    ${textShadow};
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 2px;
}`;

    const html = `<h1 class="text-3d">${text}</h1>`;

    setOutput(`/* CSS */\n${css}\n\n<!-- HTML -->\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Text for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">3D Depth (layers)</label>
            <input id={`${toolId}-depth`} type="number" min="1" max="20" value={depth} onChange={(e) => setDepth(e.target.value)} className="input-field" aria-label="3D depth" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <input id={`${toolId}-color`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field h-10" aria-label="Text color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-shadow`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Color</label>
            <input id={`${toolId}-shadow`} type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="input-field h-10" aria-label="Shadow color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (degrees)</label>
            <input id={`${toolId}-angle`} type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} className="w-full" aria-label="Shadow angle" />
            <span className="text-xs text-gray-500">{angle}°</span>
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate 3D Text CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="bg-gray-900 p-6 rounded-lg overflow-hidden">
              <span
                style={{
                  fontSize: `${Math.min(parseInt(fontSize), 80)}px`,
                  fontWeight: 'bold',
                  color: textColor,
                  textShadow: Array.from({ length: parseInt(depth) }, (_, i) => {
                    const angleRad = (parseInt(angle) * Math.PI) / 180;
                    const hexToRgb = (hex: string) => ({ r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) });
                    const rgb = hexToRgb(shadowColor);
                    const factor = 1 - ((i + 1) / parseInt(depth)) * 0.4;
                    return `${Math.round(Math.cos(angleRad) * (i + 1))}px ${Math.round(Math.sin(angleRad) * (i + 1))}px 0 rgb(${Math.round(rgb.r * factor)}, ${Math.round(rgb.g * factor)}, ${Math.round(rgb.b * factor)})`;
                  }).join(', '),
                  fontFamily: 'Arial Black, sans-serif',
                }}
              >
                {text}
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto mt-3">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
