'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextGradientAnimationGenerator - Generate animated gradient text CSS.
 * Creates CSS for text with animated gradient backgrounds.
 */
export default function CssTextGradientAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello World');
  const [color1, setColor1] = useState('#ff0080');
  const [color2, setColor2] = useState('#7928ca');
  const [color3, setColor3] = useState('#ff4ecd');
  const [duration, setDuration] = useState('3');
  const [angle, setAngle] = useState('90');
  const [output, setOutput] = useState('');

  const generate = () => {
    const dur = parseFloat(duration) || 3;
    const deg = parseInt(angle) || 90;

    const css = `.gradient-text {
  background: linear-gradient(${deg}deg, ${color1}, ${color2}, ${color3}, ${color1});
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift ${dur}s ease infinite;
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">
              Preview Text
            </label>
            <input
              id={`${toolId}-text`}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label={`Preview text for ${toolName}`}
              className="input-field"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-c1`} className="block text-sm font-medium text-gray-700 mb-1">Color 1</label>
              <input id={`${toolId}-c1`} type="color" value={color1} onChange={(e) => setColor1(e.target.value)} aria-label="Gradient color 1" className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label htmlFor={`${toolId}-c2`} className="block text-sm font-medium text-gray-700 mb-1">Color 2</label>
              <input id={`${toolId}-c2`} type="color" value={color2} onChange={(e) => setColor2(e.target.value)} aria-label="Gradient color 2" className="w-full h-10 rounded cursor-pointer" />
            </div>
            <div>
              <label htmlFor={`${toolId}-c3`} className="block text-sm font-medium text-gray-700 mb-1">Color 3</label>
              <input id={`${toolId}-c3`} type="color" value={color3} onChange={(e) => setColor3(e.target.value)} aria-label="Gradient color 3" className="w-full h-10 rounded cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (s)</label>
              <input id={`${toolId}-dur`} type="number" step="0.5" min="0.5" max="20" value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Animation duration" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (deg)</label>
              <input id={`${toolId}-angle`} type="number" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} aria-label="Gradient angle" className="input-field" />
            </div>
          </div>
          <button onClick={generate} className="btn-primary w-full">
            Generate CSS
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Preview</label>
            <div className="p-4 bg-gray-900 rounded-md flex items-center justify-center">
              <span
                className="text-3xl font-bold"
                style={{
                  background: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {text}
              </span>
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
