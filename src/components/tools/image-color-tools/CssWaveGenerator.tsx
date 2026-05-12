'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssWaveGenerator - Generate CSS wave/wavy border shapes.
 * Creates SVG-based wave patterns with customizable amplitude, frequency, and color.
 */
export default function CssWaveGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [amplitude, setAmplitude] = useState('20');
  const [frequency, setFrequency] = useState('2');
  const [height, setHeight] = useState('100');
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [output, setOutput] = useState('');

  const generate = () => {
    const amp = Math.max(5, Math.min(100, parseInt(amplitude) || 20));
    const freq = Math.max(1, Math.min(10, parseInt(frequency) || 2));
    const h = Math.max(50, Math.min(300, parseInt(height) || 100));

    // Generate SVG wave path
    const width = 1200;
    const points: string[] = [];
    const segmentWidth = width / freq;

    points.push(`M0,${h}`);
    for (let i = 0; i < freq; i++) {
      const x1 = segmentWidth * i + segmentWidth * 0.25;
      const x2 = segmentWidth * i + segmentWidth * 0.75;
      const x3 = segmentWidth * (i + 1);
      const y1 = h - amp;
      const y2 = h + amp;
      points.push(`C${x1},${y1} ${x2},${y2} ${x3},${h}`);
    }
    points.push(`L${width},${h * 2} L0,${h * 2} Z`);

    const svgPath = points.join(' ');
    const encodedSvg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${h * 2}" preserveAspectRatio="none"><path d="${svgPath}" fill="${color}"/></svg>`
    );

    const css = `.wave-container {
  position: relative;
  background: ${bgColor};
}

.wave-container::${position === 'bottom' ? 'after' : 'before'} {
  content: '';
  position: absolute;
  ${position}: 0;
  left: 0;
  width: 100%;
  height: ${h}px;
  background-image: url("data:image/svg+xml,${encodedSvg}");
  background-size: cover;
  background-repeat: no-repeat;
  ${position === 'top' ? 'transform: rotate(180deg);' : ''}
}`;

    setOutput(css);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Wave Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                aria-label="Wave color picker"
              />
              <input
                id={`${toolId}-color`}
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="input-field flex-1"
                aria-label={`Wave color for ${toolName}`}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                aria-label="Background color picker"
              />
              <input
                id={`${toolId}-bg`}
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="input-field flex-1"
                aria-label={`Background color for ${toolName}`}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div>
            <label htmlFor={`${toolId}-amp`} className="block text-sm font-medium text-gray-700 mb-1">
              Amplitude (5-100)
            </label>
            <input
              id={`${toolId}-amp`}
              type="text"
              inputMode="numeric"
              value={amplitude}
              onChange={(e) => setAmplitude(e.target.value)}
              placeholder="20"
              aria-label={`Amplitude for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
              Waves (1-10)
            </label>
            <input
              id={`${toolId}-freq`}
              type="text"
              inputMode="numeric"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="2"
              aria-label={`Frequency for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              id={`${toolId}-height`}
              type="text"
              inputMode="numeric"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="100"
              aria-label={`Height for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-pos`} className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <select
            id={`${toolId}-pos`}
            value={position}
            onChange={(e) => setPosition(e.target.value as 'top' | 'bottom')}
            className="input-field"
            aria-label={`Position for ${toolName}`}
          >
            <option value="bottom">Bottom</option>
            <option value="top">Top</option>
          </select>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate CSS wave" className="btn-primary">
        Generate Wave CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-3">
            <div
              className="relative h-32 rounded-lg border border-gray-200 overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="absolute bottom-0 left-0 w-full h-16"
                style={{ backgroundColor: color, borderRadius: '100% 100% 0 0 / 50% 50% 0 0' }}
              />
            </div>
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
