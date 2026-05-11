'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssClipPathGenerator - Generates CSS clip-path shapes (circle, ellipse, polygon, inset).
 */
export default function CssClipPathGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<'circle' | 'ellipse' | 'polygon' | 'inset'>('circle');
  const [circleRadius, setCircleRadius] = useState('50');
  const [circleX, setCircleX] = useState('50');
  const [circleY, setCircleY] = useState('50');
  const [ellipseRx, setEllipseRx] = useState('50');
  const [ellipseRy, setEllipseRy] = useState('30');
  const [ellipseX, setEllipseX] = useState('50');
  const [ellipseY, setEllipseY] = useState('50');
  const [insetTop, setInsetTop] = useState('10');
  const [insetRight, setInsetRight] = useState('10');
  const [insetBottom, setInsetBottom] = useState('10');
  const [insetLeft, setInsetLeft] = useState('10');
  const [insetRound, setInsetRound] = useState('0');
  const [polygonPreset, setPolygonPreset] = useState('triangle');

  const POLYGON_PRESETS: Record<string, string> = {
    triangle: '50% 0%, 0% 100%, 100% 100%',
    diamond: '50% 0%, 100% 50%, 50% 100%, 0% 50%',
    pentagon: '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%',
    hexagon: '25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%',
    star: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%',
    arrow: '0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%',
    cross: '10% 25%, 35% 25%, 35% 10%, 65% 10%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 65% 75%, 35% 75%, 35% 50%, 10% 50%',
  };

  function generateClipPath(): string {
    switch (shape) {
      case 'circle':
        return `clip-path: circle(${circleRadius}% at ${circleX}% ${circleY}%);`;
      case 'ellipse':
        return `clip-path: ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseX}% ${ellipseY}%);`;
      case 'inset': {
        const round = parseInt(insetRound) > 0 ? ` round ${insetRound}px` : '';
        return `clip-path: inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}%${round});`;
      }
      case 'polygon':
        return `clip-path: polygon(${POLYGON_PRESETS[polygonPreset]});`;
      default:
        return '';
    }
  }

  const clipPathValue = generateClipPath();
  const clipPathProp = clipPathValue.replace('clip-path: ', '').replace(';', '');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
          Shape Type for {toolName}
        </label>
        <select
          id={`${toolId}-shape`}
          value={shape}
          onChange={(e) => setShape(e.target.value as typeof shape)}
          aria-label="Clip path shape type"
          className="input-field text-sm"
        >
          <option value="circle">Circle</option>
          <option value="ellipse">Ellipse</option>
          <option value="polygon">Polygon</option>
          <option value="inset">Inset</option>
        </select>

        <div className="mt-3 space-y-3">
          {shape === 'circle' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Radius (%)</label>
                <input type="range" min="0" max="100" value={circleRadius} onChange={(e) => setCircleRadius(e.target.value)} className="w-full" aria-label="Circle radius" />
                <span className="text-xs text-gray-500">{circleRadius}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Center X (%)</label>
                <input type="range" min="0" max="100" value={circleX} onChange={(e) => setCircleX(e.target.value)} className="w-full" aria-label="Circle center X" />
                <span className="text-xs text-gray-500">{circleX}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Center Y (%)</label>
                <input type="range" min="0" max="100" value={circleY} onChange={(e) => setCircleY(e.target.value)} className="w-full" aria-label="Circle center Y" />
                <span className="text-xs text-gray-500">{circleY}%</span>
              </div>
            </div>
          )}

          {shape === 'ellipse' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Radius X (%)</label>
                <input type="range" min="0" max="100" value={ellipseRx} onChange={(e) => setEllipseRx(e.target.value)} className="w-full" aria-label="Ellipse radius X" />
                <span className="text-xs text-gray-500">{ellipseRx}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Radius Y (%)</label>
                <input type="range" min="0" max="100" value={ellipseRy} onChange={(e) => setEllipseRy(e.target.value)} className="w-full" aria-label="Ellipse radius Y" />
                <span className="text-xs text-gray-500">{ellipseRy}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Center X (%)</label>
                <input type="range" min="0" max="100" value={ellipseX} onChange={(e) => setEllipseX(e.target.value)} className="w-full" aria-label="Ellipse center X" />
                <span className="text-xs text-gray-500">{ellipseX}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Center Y (%)</label>
                <input type="range" min="0" max="100" value={ellipseY} onChange={(e) => setEllipseY(e.target.value)} className="w-full" aria-label="Ellipse center Y" />
                <span className="text-xs text-gray-500">{ellipseY}%</span>
              </div>
            </div>
          )}

          {shape === 'inset' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Top (%)</label>
                <input type="range" min="0" max="50" value={insetTop} onChange={(e) => setInsetTop(e.target.value)} className="w-full" aria-label="Inset top" />
                <span className="text-xs text-gray-500">{insetTop}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Right (%)</label>
                <input type="range" min="0" max="50" value={insetRight} onChange={(e) => setInsetRight(e.target.value)} className="w-full" aria-label="Inset right" />
                <span className="text-xs text-gray-500">{insetRight}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bottom (%)</label>
                <input type="range" min="0" max="50" value={insetBottom} onChange={(e) => setInsetBottom(e.target.value)} className="w-full" aria-label="Inset bottom" />
                <span className="text-xs text-gray-500">{insetBottom}%</span>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Left (%)</label>
                <input type="range" min="0" max="50" value={insetLeft} onChange={(e) => setInsetLeft(e.target.value)} className="w-full" aria-label="Inset left" />
                <span className="text-xs text-gray-500">{insetLeft}%</span>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Border Radius (px)</label>
                <input type="range" min="0" max="50" value={insetRound} onChange={(e) => setInsetRound(e.target.value)} className="w-full" aria-label="Inset border radius" />
                <span className="text-xs text-gray-500">{insetRound}px</span>
              </div>
            </div>
          )}

          {shape === 'polygon' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Preset Shape</label>
              <select
                value={polygonPreset}
                onChange={(e) => setPolygonPreset(e.target.value)}
                aria-label="Polygon preset"
                className="input-field text-sm"
              >
                <option value="triangle">Triangle</option>
                <option value="diamond">Diamond</option>
                <option value="pentagon">Pentagon</option>
                <option value="hexagon">Hexagon</option>
                <option value="star">Star</option>
                <option value="arrow">Arrow</option>
                <option value="cross">Cross</option>
              </select>
            </div>
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={!!clipPathValue}>
        <div className="space-y-3">
          <div className="flex justify-center">
            <div
              className="w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600"
              style={{ clipPath: clipPathProp }}
              aria-label="Clip path preview"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{clipPathValue}</pre>
          </div>
          <CopyToClipboard text={clipPathValue} />
        </div>
      </OutputArea>
    </div>
  );
}
