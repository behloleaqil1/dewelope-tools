'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CssFilterGenerator - Generate CSS filter effects with live preview.
 * Supports blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia.
 */
export default function CssFilterGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [filters, setFilters] = useState({
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
  });

  const updateFilter = (key: keyof typeof filters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      blur: 0,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      hueRotate: 0,
      invert: 0,
      opacity: 100,
      saturate: 100,
      sepia: 0,
    });
  };

  const generateCss = (): string => {
    const parts: string[] = [];
    if (filters.blur !== 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.grayscale !== 0) parts.push(`grayscale(${filters.grayscale}%)`);
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.invert !== 0) parts.push(`invert(${filters.invert}%)`);
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
    if (filters.sepia !== 0) parts.push(`sepia(${filters.sepia}%)`);
    if (parts.length === 0) return 'filter: none;';
    return `filter: ${parts.join(' ')};`;
  };

  const filterStyle = (): string => {
    const parts: string[] = [];
    if (filters.blur !== 0) parts.push(`blur(${filters.blur}px)`);
    if (filters.brightness !== 100) parts.push(`brightness(${filters.brightness}%)`);
    if (filters.contrast !== 100) parts.push(`contrast(${filters.contrast}%)`);
    if (filters.grayscale !== 0) parts.push(`grayscale(${filters.grayscale}%)`);
    if (filters.hueRotate !== 0) parts.push(`hue-rotate(${filters.hueRotate}deg)`);
    if (filters.invert !== 0) parts.push(`invert(${filters.invert}%)`);
    if (filters.opacity !== 100) parts.push(`opacity(${filters.opacity}%)`);
    if (filters.saturate !== 100) parts.push(`saturate(${filters.saturate}%)`);
    if (filters.sepia !== 0) parts.push(`sepia(${filters.sepia}%)`);
    return parts.join(' ') || 'none';
  };

  const sliders: { key: keyof typeof filters; label: string; min: number; max: number; unit: string }[] = [
    { key: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
    { key: 'brightness', label: 'Brightness', min: 0, max: 300, unit: '%' },
    { key: 'contrast', label: 'Contrast', min: 0, max: 300, unit: '%' },
    { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
    { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: 'deg' },
    { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
    { key: 'opacity', label: 'Opacity', min: 0, max: 100, unit: '%' },
    { key: 'saturate', label: 'Saturate', min: 0, max: 300, unit: '%' },
    { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
  ];

  const cssOutput = generateCss();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">Live Preview</div>
        <div className="flex justify-center">
          <div
            className="w-64 h-40 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg"
            style={{ filter: filterStyle() }}
            aria-label={`Preview with ${toolName} applied`}
          >
            Preview
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {sliders.map(({ key, label, min, max, unit }) => (
          <div key={key} className="flex items-center gap-3">
            <label htmlFor={`${toolId}-${key}`} className="text-sm font-medium text-gray-700 w-28 flex-shrink-0">
              {label}
            </label>
            <input
              id={`${toolId}-${key}`}
              type="range"
              min={min}
              max={max}
              value={filters[key]}
              onChange={(e) => updateFilter(key, parseInt(e.target.value))}
              aria-label={`${label} filter value`}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-16 text-right">{filters[key]}{unit}</span>
          </div>
        ))}
      </div>

      <button onClick={resetFilters} aria-label="Reset all filters" className="btn-primary">
        Reset All
      </button>

      <OutputArea hasContent={cssOutput !== 'filter: none;'}>
        {cssOutput !== 'filter: none;' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CSS Code</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{cssOutput}</pre>
            <CopyToClipboard text={cssOutput} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
