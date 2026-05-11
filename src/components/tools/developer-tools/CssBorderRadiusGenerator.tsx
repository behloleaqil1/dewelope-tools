'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssBorderRadiusGenerator - Generate CSS border-radius with visual corner controls.
 */
export default function CssBorderRadiusGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [topLeft, setTopLeft] = useState(10);
  const [topRight, setTopRight] = useState(10);
  const [bottomRight, setBottomRight] = useState(10);
  const [bottomLeft, setBottomLeft] = useState(10);
  const [linked, setLinked] = useState(true);
  const [unit, setUnit] = useState('px');

  function handleChange(corner: string, val: number) {
    if (linked) {
      setTopLeft(val);
      setTopRight(val);
      setBottomRight(val);
      setBottomLeft(val);
    } else {
      switch (corner) {
        case 'tl': setTopLeft(val); break;
        case 'tr': setTopRight(val); break;
        case 'br': setBottomRight(val); break;
        case 'bl': setBottomLeft(val); break;
      }
    }
  }

  const allSame = topLeft === topRight && topRight === bottomRight && bottomRight === bottomLeft;
  const cssValue = allSame
    ? `${topLeft}${unit}`
    : `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`;
  const cssCode = `border-radius: ${cssValue};`;

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Corner Radius for {toolName}</label>
          <div className="flex items-center gap-2">
            <label htmlFor={`${toolId}-linked`} className="text-xs text-gray-500">Link corners</label>
            <input
              id={`${toolId}-linked`}
              type="checkbox"
              checked={linked}
              onChange={(e) => setLinked(e.target.checked)}
              aria-label="Link all corners"
              className="rounded"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              aria-label="Unit selection"
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="rem">rem</option>
              <option value="em">em</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-tl`} className="block text-xs text-gray-500 mb-1">Top Left</label>
            <input
              id={`${toolId}-tl`}
              type="range"
              min="0"
              max="100"
              value={topLeft}
              onChange={(e) => handleChange('tl', parseInt(e.target.value))}
              aria-label="Top left radius"
              className="w-full"
            />
            <span className="text-xs text-gray-600">{topLeft}{unit}</span>
          </div>
          <div>
            <label htmlFor={`${toolId}-tr`} className="block text-xs text-gray-500 mb-1">Top Right</label>
            <input
              id={`${toolId}-tr`}
              type="range"
              min="0"
              max="100"
              value={topRight}
              onChange={(e) => handleChange('tr', parseInt(e.target.value))}
              aria-label="Top right radius"
              className="w-full"
            />
            <span className="text-xs text-gray-600">{topRight}{unit}</span>
          </div>
          <div>
            <label htmlFor={`${toolId}-bl`} className="block text-xs text-gray-500 mb-1">Bottom Left</label>
            <input
              id={`${toolId}-bl`}
              type="range"
              min="0"
              max="100"
              value={bottomLeft}
              onChange={(e) => handleChange('bl', parseInt(e.target.value))}
              aria-label="Bottom left radius"
              className="w-full"
            />
            <span className="text-xs text-gray-600">{bottomLeft}{unit}</span>
          </div>
          <div>
            <label htmlFor={`${toolId}-br`} className="block text-xs text-gray-500 mb-1">Bottom Right</label>
            <input
              id={`${toolId}-br`}
              type="range"
              min="0"
              max="100"
              value={bottomRight}
              onChange={(e) => handleChange('br', parseInt(e.target.value))}
              aria-label="Bottom right radius"
              className="w-full"
            />
            <span className="text-xs text-gray-600">{bottomRight}{unit}</span>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className="w-48 h-48 bg-blue-500 border-2 border-blue-600 transition-all duration-200"
              style={{ borderRadius: cssValue }}
              aria-label="Border radius preview"
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <code className="text-sm font-mono text-gray-800">{cssCode}</code>
          </div>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
