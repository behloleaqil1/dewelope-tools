'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextMaskGenerator - Generate CSS background-clip text mask effect.
 */
export default function CssTextMaskGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello World');
  const [fontSize, setFontSize] = useState('72');
  const [fontWeight, setFontWeight] = useState('bold');
  const [gradientType, setGradientType] = useState('linear');
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [angle, setAngle] = useState('135');
  const [output, setOutput] = useState('');

  const generate = () => {
    const gradient = gradientType === 'linear'
      ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
      : `radial-gradient(circle, ${color1}, ${color2})`;

    const css = `.text-mask {
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  display: inline-block;
}`;

    const html = `<h1 class="text-mask">${text}</h1>`;

    setOutput(`CSS:\n${css}\n\nHTML:\n${html}`);
  };

  const gradient = gradientType === 'linear'
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Display Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Display text for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-size`} type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
          <div>
            <label htmlFor={`${toolId}-weight`} className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
            <select id={`${toolId}-weight`} value={fontWeight} onChange={(e) => setFontWeight(e.target.value)} className="input-field" aria-label="Font weight">
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="900">Black (900)</option>
              <option value="100">Thin (100)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-gradient`} className="block text-sm font-medium text-gray-700 mb-1">Gradient Type</label>
            <select id={`${toolId}-gradient`} value={gradientType} onChange={(e) => setGradientType(e.target.value)} className="input-field" aria-label="Gradient type">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
            <input id={`${toolId}-color1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field h-10" aria-label="First gradient color" />
          </div>
          <div>
            <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
            <input id={`${toolId}-color2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field h-10" aria-label="Second gradient color" />
          </div>
          {gradientType === 'linear' && (
            <div>
              <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (deg)</label>
              <input id={`${toolId}-angle`} type="number" value={angle} onChange={(e) => setAngle(e.target.value)} className="input-field" aria-label="Gradient angle" />
            </div>
          )}
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate CSS Text Mask</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-6 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
              <span style={{
                fontSize: `${Math.min(parseInt(fontSize), 96)}px`,
                fontWeight: fontWeight,
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}>{text}</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
