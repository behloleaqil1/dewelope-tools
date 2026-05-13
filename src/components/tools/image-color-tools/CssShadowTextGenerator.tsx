'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssShadowTextGenerator - Generate CSS long shadow text effects.
 * Creates multi-layered text-shadow for a long shadow / material design look.
 */
export default function CssShadowTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('SHADOW');
  const [shadowLength, setShadowLength] = useState('20');
  const [shadowColor, setShadowColor] = useState('#333333');
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#e74c3c');
  const [direction, setDirection] = useState<'bottom-right' | 'bottom-left' | 'right' | 'bottom'>('bottom-right');
  const [fontSize, setFontSize] = useState('72');
  const [output, setOutput] = useState('');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const generate = () => {
    const length = Math.max(1, Math.min(100, parseInt(shadowLength) || 20));
    const rgb = hexToRgb(shadowColor);

    const shadows: string[] = [];
    for (let i = 1; i <= length; i++) {
      let x = 0, y = 0;
      switch (direction) {
        case 'bottom-right': x = i; y = i; break;
        case 'bottom-left': x = -i; y = i; break;
        case 'right': x = i; y = 0; break;
        case 'bottom': x = 0; y = i; break;
      }
      const opacity = 1 - (i / length) * 0.5;
      shadows.push(`${x}px ${y}px 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`);
    }

    const css = `.long-shadow-text {\n  font-size: ${fontSize}px;\n  font-weight: bold;\n  color: ${textColor};\n  background-color: ${bgColor};\n  text-shadow:\n    ${shadows.join(',\n    ')};\n  padding: 40px;\n  text-align: center;\n  font-family: 'Arial Black', sans-serif;\n}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} className="input-field" aria-label={`Preview text for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Length (1-100px)</label>
            <input id={`${toolId}-length`} type="number" min="1" max="100" value={shadowLength} onChange={(e) => setShadowLength(e.target.value)} className="input-field" aria-label="Shadow length" />
          </div>
          <div>
            <label htmlFor={`${toolId}-shadowcolor`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-shadowcolor`} type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer" aria-label="Shadow color" />
              <input type="text" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-textcolor`} className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-textcolor`} type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer" aria-label="Text color" />
              <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-bgcolor`} className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <div className="flex gap-2">
              <input id={`${toolId}-bgcolor`} type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-14 rounded cursor-pointer" aria-label="Background color" />
              <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-field flex-1" />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Shadow Direction</label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as typeof direction)} className="input-field" aria-label="Shadow direction">
              <option value="bottom-right">Bottom Right ↘</option>
              <option value="bottom-left">Bottom Left ↙</option>
              <option value="right">Right →</option>
              <option value="bottom">Bottom ↓</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-fontsize`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
            <input id={`${toolId}-fontsize`} type="number" min="12" max="200" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field" aria-label="Font size" />
          </div>
        </div>
        <button onClick={generate} className="btn-primary mt-4">Generate Shadow CSS</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="rounded-lg overflow-hidden" style={{ backgroundColor: bgColor, padding: '40px', textAlign: 'center' }}>
              <span style={{ fontSize: `${Math.min(parseInt(fontSize) || 72, 120)}px`, fontWeight: 'bold', color: textColor, fontFamily: 'Arial Black, sans-serif' }}>{text}</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
