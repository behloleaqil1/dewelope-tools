'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssDividerGenerator - Generate CSS section dividers (waves, angles, curves, triangles).
 */
export default function CssDividerGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<'wave' | 'angle' | 'curve' | 'triangle' | 'zigzag'>('wave');
  const [color, setColor] = useState('#3b82f6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [height, setHeight] = useState('80');
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
  const [output, setOutput] = useState('');

  function generateDivider() {
    const h = parseInt(height) || 80;

    let svgPath = '';
    switch (shape) {
      case 'wave':
        svgPath = `M0,${h * 0.6} C${h * 2},${h * 0.2} ${h * 4},${h} ${h * 6},${h * 0.4} L${h * 6},${h} L0,${h} Z`;
        break;
      case 'angle':
        svgPath = position === 'bottom'
          ? `M0,0 L${h * 6},${h} L0,${h} Z`
          : `M0,${h} L${h * 6},0 L${h * 6},${h} Z`;
        break;
      case 'curve':
        svgPath = `M0,${h} C${h * 2},0 ${h * 4},0 ${h * 6},${h} Z`;
        break;
      case 'triangle':
        svgPath = `M0,${h} L${h * 3},0 L${h * 6},${h} Z`;
        break;
      case 'zigzag':
        svgPath = `M0,${h} L${h},0 L${h * 2},${h} L${h * 3},0 L${h * 4},${h} L${h * 5},0 L${h * 6},${h} Z`;
        break;
    }

    const viewBoxWidth = h * 6;
    const css = `.section-divider {
  position: relative;
  width: 100%;
  overflow: hidden;
  line-height: 0;
}

.section-divider svg {
  position: relative;
  display: block;
  width: calc(100% + 1.3px);
  height: ${h}px;
}

.section-divider .shape-fill {
  fill: ${color};
}`;

    const html = `<div class="section-divider">
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 ${viewBoxWidth} ${h}"
       preserveAspectRatio="none">
    <path d="${svgPath}" class="shape-fill"></path>
  </svg>
</div>`;

    setOutput(`/* CSS */\n${css}\n\n/* HTML */\n${html}`);
  }

  function handleGenerate() {
    generateDivider();
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
              Shape
            </label>
            <select
              id={`${toolId}-shape`}
              value={shape}
              onChange={(e) => setShape(e.target.value as typeof shape)}
              className="input-field"
              aria-label={`Shape for ${toolName}`}
            >
              <option value="wave">Wave</option>
              <option value="angle">Angle</option>
              <option value="curve">Curve</option>
              <option value="triangle">Triangle</option>
              <option value="zigzag">Zigzag</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-position`} className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id={`${toolId}-position`}
              value={position}
              onChange={(e) => setPosition(e.target.value as 'top' | 'bottom')}
              className="input-field"
              aria-label="Divider position"
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <label htmlFor={`${toolId}-color`} className="block text-sm font-medium text-gray-700 mb-1">
              Divider Color
            </label>
            <input
              id={`${toolId}-color`}
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
              aria-label="Divider color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bg`} className="block text-sm font-medium text-gray-700 mb-1">
              Background
            </label>
            <input
              id={`${toolId}-bg`}
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-10 rounded cursor-pointer"
              aria-label="Background color"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height (px)
            </label>
            <input
              id={`${toolId}-height`}
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-field"
              min="20"
              max="300"
              aria-label="Divider height"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="mb-3 rounded overflow-hidden border border-gray-200">
          <div style={{ backgroundColor: bgColor, height: '60px' }} />
          <div style={{ backgroundColor: color, height: `${parseInt(height) || 80}px`, opacity: 0.8 }} className="rounded-b" />
        </div>

        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Generate CSS Divider
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all max-h-96 overflow-y-auto">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
