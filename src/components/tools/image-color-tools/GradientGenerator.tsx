'use client';

import { useState, useEffect, useRef } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { generateGradientCSS, GradientStop } from '@/lib/image-color-tools';

type GradientType = 'linear' | 'radial';

const LINEAR_DIRECTIONS = [
  { value: 'to right', label: 'To Right' },
  { value: 'to left', label: 'To Left' },
  { value: 'to bottom', label: 'To Bottom' },
  { value: 'to top', label: 'To Top' },
  { value: 'to bottom right', label: 'To Bottom Right' },
  { value: 'to bottom left', label: 'To Bottom Left' },
  { value: 'to top right', label: 'To Top Right' },
  { value: 'to top left', label: 'To Top Left' },
];

const RADIAL_SHAPES = [
  { value: 'circle', label: 'Circle' },
  { value: 'ellipse', label: 'Ellipse' },
];

/**
 * GradientGenerator - Live preview gradient builder with CSS code output.
 * Supports linear/radial gradients with 2-10 color stops.
 * Updates preview with 200ms debounce.
 * Requirements: 7.3, 7.7
 */
export default function GradientGenerator({ toolId }: ToolEngineProps) {
  const [type, setType] = useState<GradientType>('linear');
  const [direction, setDirection] = useState('to right');
  const [stops, setStops] = useState<GradientStop[]>([
    { color: '#3B82F6', position: 0 },
    { color: '#8B5CF6', position: 100 },
  ]);
  const [cssOutput, setCssOutput] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const css = generateGradientCSS({ type, direction, stops });
      setCssOutput(css);
    }, 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [type, direction, stops]);

  const addStop = () => {
    if (stops.length >= 10) return;
    const lastPos = stops[stops.length - 1]?.position ?? 100;
    const newPos = Math.min(100, lastPos);
    setStops([...stops, { color: '#10B981', position: newPos }]);
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStopColor = (index: number, color: string) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], color };
    setStops(updated);
  };

  const updateStopPosition = (index: number, position: number) => {
    const updated = [...stops];
    updated[index] = { ...updated[index], position: Math.max(0, Math.min(100, position)) };
    setStops(updated);
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-type`} className="block text-sm font-medium text-gray-700 mb-1">
                Gradient Type
              </label>
              <select
                id={`${toolId}-type`}
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as GradientType;
                  setType(newType);
                  setDirection(newType === 'linear' ? 'to right' : 'circle');
                }}
                aria-label="Gradient type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${toolId}-direction`} className="block text-sm font-medium text-gray-700 mb-1">
                {type === 'linear' ? 'Direction' : 'Shape'}
              </label>
              <select
                id={`${toolId}-direction`}
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                aria-label={type === 'linear' ? 'Gradient direction' : 'Gradient shape'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                {(type === 'linear' ? LINEAR_DIRECTIONS : RADIAL_SHAPES).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Color Stops ({stops.length}/10)
              </span>
              <button
                onClick={addStop}
                disabled={stops.length >= 10}
                aria-label="Add color stop"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
              >
                + Add Stop
              </button>
            </div>

            {stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateStopColor(index, e.target.value)}
                  aria-label={`Color stop ${index + 1} color`}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer min-w-[44px] min-h-[44px]"
                />
                <input
                  type="number"
                  value={stop.position ?? 0}
                  onChange={(e) => updateStopPosition(index, Number(e.target.value))}
                  min={0}
                  max={100}
                  aria-label={`Color stop ${index + 1} position percentage`}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
                <span className="text-xs text-gray-500">%</span>
                {stops.length > 2 && (
                  <button
                    onClick={() => removeStop(index)}
                    aria-label={`Remove color stop ${index + 1}`}
                    className="px-2 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[44px] min-w-[44px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={!!cssOutput}>
        {cssOutput && (
          <div className="space-y-4">
            <div
              className="w-full h-32 rounded-lg border border-gray-200"
              style={{ background: cssOutput }}
              aria-label="Gradient preview"
            />
            <div className="space-y-2">
              <div className="text-xs text-gray-500 uppercase font-medium">CSS Code</div>
              <pre className="bg-white p-3 rounded-md border border-gray-200 text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">
                background: {cssOutput};
              </pre>
              <CopyToClipboard text={`background: ${cssOutput};`} />
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
