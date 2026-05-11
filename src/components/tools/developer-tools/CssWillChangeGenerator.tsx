'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssWillChangeGenerator - Generates CSS will-change property with performance tips.
 * Helps developers optimize animations by hinting the browser about upcoming changes.
 */
export default function CssWillChangeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [customProperty, setCustomProperty] = useState('');

  const commonProperties = [
    { value: 'transform', label: 'transform', tip: 'Best for animations involving movement, rotation, or scaling' },
    { value: 'opacity', label: 'opacity', tip: 'Ideal for fade-in/fade-out animations' },
    { value: 'scroll-position', label: 'scroll-position', tip: 'For elements with scroll-triggered changes' },
    { value: 'contents', label: 'contents', tip: 'When element content will change significantly' },
    { value: 'top', label: 'top', tip: 'For position-based animations (prefer transform instead)' },
    { value: 'left', label: 'left', tip: 'For position-based animations (prefer transform instead)' },
    { value: 'width', label: 'width', tip: 'Triggers layout recalculation — use sparingly' },
    { value: 'height', label: 'height', tip: 'Triggers layout recalculation — use sparingly' },
    { value: 'background-color', label: 'background-color', tip: 'For color transition animations' },
    { value: 'filter', label: 'filter', tip: 'For blur, brightness, or other filter animations' },
  ];

  const toggleProperty = (prop: string) => {
    setSelectedProperties((prev) =>
      prev.includes(prop) ? prev.filter((p) => p !== prop) : [...prev, prop]
    );
  };

  const addCustom = () => {
    const trimmed = customProperty.trim();
    if (trimmed && !selectedProperties.includes(trimmed)) {
      setSelectedProperties((prev) => [...prev, trimmed]);
      setCustomProperty('');
    }
  };

  const allProps = selectedProperties.length > 0 ? selectedProperties : [];
  const cssOutput = allProps.length > 0 ? `.element {\n  will-change: ${allProps.join(', ')};\n}` : '';

  const tips = [
    'Apply will-change shortly before the animation starts, not permanently.',
    'Remove will-change after the animation completes to free GPU memory.',
    'Avoid using will-change on too many elements simultaneously.',
    'Prefer transform and opacity — they run on the compositor thread.',
    selectedProperties.includes('width') || selectedProperties.includes('height')
      ? '⚠️ width/height changes trigger layout — consider using transform: scale() instead.'
      : '',
    selectedProperties.includes('top') || selectedProperties.includes('left')
      ? '⚠️ top/left trigger layout — consider using transform: translate() instead.'
      : '',
  ].filter(Boolean);

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select properties to optimize
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {commonProperties.map((prop) => (
            <button
              key={prop.value}
              onClick={() => toggleProperty(prop.value)}
              title={prop.tip}
              aria-label={`Toggle ${prop.label} for ${toolName}`}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                selectedProperties.includes(prop.value)
                  ? 'bg-blue-100 border-blue-400 text-blue-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {prop.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customProperty}
            onChange={(e) => setCustomProperty(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustom()}
            placeholder="Custom property..."
            aria-label={`Custom CSS property for ${toolName}`}
            className="input-field flex-1"
          />
          <button onClick={addCustom} className="btn-primary whitespace-nowrap">Add</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!cssOutput}>
        {cssOutput && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Generated CSS</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">{cssOutput}</pre>
            <CopyToClipboard text={cssOutput} />

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Tips</h4>
              <ul className="space-y-1">
                {tips.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
