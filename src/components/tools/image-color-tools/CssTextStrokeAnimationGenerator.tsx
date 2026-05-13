'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTextStrokeAnimationGenerator - Generate CSS text stroke drawing animation.
 */
export default function CssTextStrokeAnimationGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [text, setText] = useState('Hello World');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState('2');
  const [duration, setDuration] = useState('3');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [output, setOutput] = useState('');

  const generate = () => {
    const css = `.text-stroke-animate {
  font-size: 4rem;
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: ${strokeWidth}px ${strokeColor};
  animation: strokeDraw ${duration}s ease forwards;
}

@keyframes strokeDraw {
  0% {
    -webkit-text-stroke-color: transparent;
    color: transparent;
    stroke-dashoffset: 100%;
  }
  50% {
    -webkit-text-stroke-color: ${strokeColor};
    color: transparent;
  }
  100% {
    -webkit-text-stroke-color: ${strokeColor};
    color: ${fillColor};
  }
}

/* SVG-based stroke animation (for more control) */
.svg-text-stroke {
  font-size: 4rem;
  font-weight: bold;
  fill: none;
  stroke: ${strokeColor};
  stroke-width: ${strokeWidth};
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: svgStrokeDraw ${duration}s ease forwards;
}

@keyframes svgStrokeDraw {
  0% {
    stroke-dashoffset: 1000;
    fill: transparent;
  }
  70% {
    stroke-dashoffset: 0;
    fill: transparent;
  }
  100% {
    stroke-dashoffset: 0;
    fill: ${fillColor};
  }
}`;

    const html = `<!-- CSS Text Stroke Animation -->
<h1 class="text-stroke-animate">${text}</h1>

<!-- SVG Alternative (better stroke control) -->
<svg viewBox="0 0 600 100" xmlns="http://www.w3.org/2000/svg">
  <text class="svg-text-stroke" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">${text}</text>
</svg>`;

    setOutput(`/* HTML */\n${html}\n\n/* CSS */\n${css}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-text`} className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
            <input id={`${toolId}-text`} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Hello World" aria-label={`Preview text for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
            <input id={`${toolId}-duration`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3" aria-label="Animation duration" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-stroke-color`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Color</label>
            <input id={`${toolId}-stroke-color`} type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} aria-label="Stroke color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-fill-color`} className="block text-sm font-medium text-gray-700 mb-1">Fill Color</label>
            <input id={`${toolId}-fill-color`} type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} aria-label="Fill color" className="input-field h-10" />
          </div>
          <div>
            <label htmlFor={`${toolId}-stroke-width`} className="block text-sm font-medium text-gray-700 mb-1">Stroke Width (px)</label>
            <input id={`${toolId}-stroke-width`} type="number" value={strokeWidth} onChange={(e) => setStrokeWidth(e.target.value)} placeholder="2" aria-label="Stroke width" className="input-field" />
          </div>
        </div>
        <button onClick={generate} className="mt-4 btn-primary">Generate CSS Animation</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
