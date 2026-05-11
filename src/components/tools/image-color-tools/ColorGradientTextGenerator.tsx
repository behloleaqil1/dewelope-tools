'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorGradientTextGenerator - Generate CSS for gradient-colored text.
 * Creates background-clip text gradient effects with customizable colors and direction.
 */
export default function ColorGradientTextGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Gradient Text');
  const [color1, setColor1] = useState('#3b82f6');
  const [color2, setColor2] = useState('#8b5cf6');
  const [direction, setDirection] = useState('to right');
  const [fontSize, setFontSize] = useState('48');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.gradient-text {
  background: linear-gradient(${direction}, ${color1}, ${color2});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${fontSize}px;
  font-weight: bold;
  display: inline-block;
}`;
    setOutput(css);
  };

  const gradientStyle = {
    background: `linear-gradient(${direction}, ${color1}, ${color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: `${fontSize}px`,
    fontWeight: 'bold',
    display: 'inline-block',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input
              id={`${toolId}-text`}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter preview text"
              aria-label={`Preview text for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-color1`} className="block text-sm font-medium text-gray-700 mb-1">Start Color</label>
              <div className="flex gap-2">
                <input id={`${toolId}-color1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" aria-label="Start color" />
                <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="input-field text-sm font-mono flex-1" aria-label="Start color hex" />
              </div>
            </div>
            <div>
              <label htmlFor={`${toolId}-color2`} className="block text-sm font-medium text-gray-700 mb-1">End Color</label>
              <div className="flex gap-2">
                <input id={`${toolId}-color2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-12 h-10 rounded border border-gray-300 cursor-pointer" aria-label="End color" />
                <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="input-field text-sm font-mono flex-1" aria-label="End color hex" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value)} className="input-field text-sm" aria-label="Gradient direction">
                <option value="to right">Left to Right</option>
                <option value="to left">Right to Left</option>
                <option value="to bottom">Top to Bottom</option>
                <option value="to top">Bottom to Top</option>
                <option value="to bottom right">Diagonal ↘</option>
                <option value="to top right">Diagonal ↗</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Font Size (px)</label>
              <input id={`${toolId}-size`} type="text" inputMode="numeric" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="input-field text-sm" aria-label="Font size" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate gradient CSS" className="btn-primary">
        Generate CSS
      </button>

      {text && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center overflow-hidden">
          <span style={gradientStyle}>{text}</span>
        </div>
      )}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
