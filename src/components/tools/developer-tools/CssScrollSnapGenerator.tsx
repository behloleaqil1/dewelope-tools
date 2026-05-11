'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssScrollSnapGenerator - Generate CSS scroll-snap properties for carousel/slider layouts.
 * Produces container and child CSS for scroll-snap configurations.
 */
export default function CssScrollSnapGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'x' | 'y'>('x');
  const [snapType, setSnapType] = useState<'mandatory' | 'proximity'>('mandatory');
  const [snapAlign, setSnapAlign] = useState<'start' | 'center' | 'end'>('start');
  const [stopBehavior, setStopBehavior] = useState<'normal' | 'always'>('normal');
  const [gap, setGap] = useState('16');
  const [itemWidth, setItemWidth] = useState('300');
  const [output, setOutput] = useState('');

  const generate = () => {
    const containerCSS = `.scroll-container {
  display: flex;
  flex-direction: ${direction === 'x' ? 'row' : 'column'};
  overflow-${direction}: auto;
  scroll-snap-type: ${direction} ${snapType};
  gap: ${gap}px;
  scroll-padding: ${gap}px;
  -webkit-overflow-scrolling: touch;
}`;

    const childCSS = `.scroll-item {
  scroll-snap-align: ${snapAlign};${stopBehavior === 'always' ? '\n  scroll-snap-stop: always;' : ''}
  flex-shrink: 0;
  width: ${direction === 'x' ? `${itemWidth}px` : '100%'};${direction === 'y' ? `\n  height: ${itemWidth}px;` : ''}
}`;

    const hideScrollbar = `/* Hide scrollbar */
.scroll-container::-webkit-scrollbar {
  display: none;
}
.scroll-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}`;

    setOutput(`${containerCSS}\n\n${childCSS}\n\n${hideScrollbar}`);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">
              Scroll Direction
            </label>
            <select id={`${toolId}-direction`} value={direction} onChange={(e) => setDirection(e.target.value as 'x' | 'y')} aria-label={`Scroll direction for ${toolName}`} className="input-field">
              <option value="x">Horizontal (x)</option>
              <option value="y">Vertical (y)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
              Snap Type
            </label>
            <select id={`${toolId}-type`} value={snapType} onChange={(e) => setSnapType(e.target.value as 'mandatory' | 'proximity')} aria-label={`Snap type for ${toolName}`} className="input-field">
              <option value="mandatory">Mandatory</option>
              <option value="proximity">Proximity</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-align`} className="block text-sm font-medium text-gray-700 mb-1">
              Snap Align
            </label>
            <select id={`${toolId}-align`} value={snapAlign} onChange={(e) => setSnapAlign(e.target.value as 'start' | 'center' | 'end')} aria-label={`Snap alignment for ${toolName}`} className="input-field">
              <option value="start">Start</option>
              <option value="center">Center</option>
              <option value="end">End</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-stop`} className="block text-sm font-medium text-gray-700 mb-1">
              Snap Stop
            </label>
            <select id={`${toolId}-stop`} value={stopBehavior} onChange={(e) => setStopBehavior(e.target.value as 'normal' | 'always')} aria-label={`Snap stop for ${toolName}`} className="input-field">
              <option value="normal">Normal</option>
              <option value="always">Always</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-gap`} className="block text-sm font-medium text-gray-700 mb-1">
              Gap (px)
            </label>
            <input id={`${toolId}-gap`} type="text" inputMode="numeric" value={gap} onChange={(e) => setGap(e.target.value)} aria-label={`Gap in pixels for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Item Width/Height (px)
            </label>
            <input id={`${toolId}-width`} type="text" inputMode="numeric" value={itemWidth} onChange={(e) => setItemWidth(e.target.value)} aria-label={`Item size for ${toolName}`} className="input-field" />
          </div>
        </div>
      </InputArea>

      <button onClick={generate} aria-label="Generate CSS" className="btn-primary">
        Generate CSS
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
