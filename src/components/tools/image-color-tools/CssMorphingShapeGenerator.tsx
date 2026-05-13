'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssMorphingShapeGenerator - Generate CSS shape morphing animations.
 * Creates keyframe animations that morph between different CSS clip-path shapes.
 */
export default function CssMorphingShapeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [fromShape, setFromShape] = useState('circle');
  const [toShape, setToShape] = useState('square');
  const [duration, setDuration] = useState('2');
  const [color, setColor] = useState('#6366f1');
  const [size, setSize] = useState('200');
  const [output, setOutput] = useState('');

  const shapes: Record<string, string> = {
    circle: 'circle(50% at 50% 50%)',
    square: 'polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%)',
    triangle: 'polygon(50% 10%, 90% 90%, 10% 90%)',
    diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
    hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    cross: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)',
    arrow: 'polygon(40% 0%, 100% 50%, 40% 100%, 40% 70%, 0% 70%, 0% 30%, 40% 30%)',
  };

  const generate = () => {
    const from = shapes[fromShape] || shapes.circle;
    const to = shapes[toShape] || shapes.square;
    const dur = parseFloat(duration) || 2;
    const sz = parseInt(size) || 200;

    const css = `.morph-shape {
  width: ${sz}px;
  height: ${sz}px;
  background-color: ${color};
  clip-path: ${from};
  animation: morph ${dur}s ease-in-out infinite alternate;
}

@keyframes morph {
  0% {
    clip-path: ${from};
  }
  100% {
    clip-path: ${to};
  }
}`;

    const html = `<div class="morph-shape"></div>`;

    setOutput(`/* CSS Shape Morphing Animation */\n/* From: ${fromShape} → To: ${toShape} */\n\n${css}\n\n<!-- HTML -->\n${html}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-from`} className="block text-sm font-medium text-gray-700 mb-1">From Shape</label>
              <select id={`${toolId}-from`} value={fromShape} onChange={e => setFromShape(e.target.value)} className="input-field" aria-label={`From shape for ${toolName}`}>
                {Object.keys(shapes).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={`${toolId}-to`} className="block text-sm font-medium text-gray-700 mb-1">To Shape</label>
              <select id={`${toolId}-to`} value={toShape} onChange={e => setToShape(e.target.value)} className="input-field" aria-label="To shape">
                {Object.keys(shapes).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input id={`${toolId}-dur`} type="number" step="0.1" value={duration} onChange={e => setDuration(e.target.value)} className="input-field" aria-label="Animation duration" />
            </div>
            <div>
              <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input id={`${toolId}-color`} type="color" value={color} onChange={e => setColor(e.target.value)} className="input-field h-10" aria-label="Shape color" />
            </div>
            <div>
              <label htmlFor={`${toolId}-size`} className="block text-sm font-medium text-gray-700 mb-1">Size (px)</label>
              <input id={`${toolId}-size`} type="number" value={size} onChange={e => setSize(e.target.value)} className="input-field" aria-label="Shape size" />
            </div>
          </div>
          <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors min-h-[44px]">Generate Animation</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">CSS Morphing Animation Code</label>
            <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
              <div
                style={{
                  width: `${Math.min(parseInt(size) || 200, 200)}px`,
                  height: `${Math.min(parseInt(size) || 200, 200)}px`,
                  backgroundColor: color,
                  clipPath: shapes[fromShape],
                  animation: `morph ${duration}s ease-in-out infinite alternate`,
                }}
              />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
