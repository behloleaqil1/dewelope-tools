'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssTransitionGenerator - Generates CSS transition properties with timing function preview.
 * Supports property, duration, timing function, and delay configuration.
 */
export default function CssTransitionGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [property, setProperty] = useState('all');
  const [duration, setDuration] = useState(300);
  const [timingFunction, setTimingFunction] = useState('ease');
  const [delay, setDelay] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const properties = ['all', 'opacity', 'transform', 'background-color', 'color', 'border-color', 'box-shadow', 'width', 'height', 'margin', 'padding'];
  const timingFunctions = ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear', 'step-start', 'step-end'];

  const cssCode = `transition: ${property} ${duration}ms ${timingFunction}${delay > 0 ? ` ${delay}ms` : ''};`;
  const fullCss = `.element {\n  ${cssCode}\n}\n\n.element:hover {\n  /* Add your hover styles here */\n  transform: scale(1.05);\n  opacity: 0.8;\n}`;

  const transitionStyle = {
    transition: `${property} ${duration}ms ${timingFunction} ${delay}ms`,
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    opacity: isHovered ? 0.8 : 1,
    backgroundColor: isHovered ? '#3b82f6' : '#6366f1',
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-property`} className="block text-sm font-medium text-gray-700 mb-1">
            Property
          </label>
          <select
            id={`${toolId}-property`}
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            aria-label={`Transition property for ${toolName}`}
            className="input-field"
          >
            {properties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-duration`} className="block text-sm font-medium text-gray-700 mb-1">
            Duration: {duration}ms
          </label>
          <input
            id={`${toolId}-duration`}
            type="range"
            min="0"
            max="3000"
            step="50"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            aria-label={`Transition duration for ${toolName}`}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor={`${toolId}-timing`} className="block text-sm font-medium text-gray-700 mb-1">
            Timing Function
          </label>
          <select
            id={`${toolId}-timing`}
            value={timingFunction}
            onChange={(e) => setTimingFunction(e.target.value)}
            aria-label={`Timing function for ${toolName}`}
            className="input-field"
          >
            {timingFunctions.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${toolId}-delay`} className="block text-sm font-medium text-gray-700 mb-1">
            Delay: {delay}ms
          </label>
          <input
            id={`${toolId}-delay`}
            type="range"
            min="0"
            max="2000"
            step="50"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            aria-label={`Transition delay for ${toolName}`}
            className="w-full"
          />
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Hover the box to preview the transition:</p>
        <div className="flex justify-center">
          <div
            style={transitionStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-medium cursor-pointer select-none"
          >
            Hover me
          </div>
        </div>
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{fullCss}</pre>
          <CopyToClipboard text={fullCss} />
        </div>
      </OutputArea>
    </div>
  );
}
