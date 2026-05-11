'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ColorGradientCssStops - Generates multi-stop CSS gradient with percentage positions.
 */
export default function ColorGradientCssStops({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [stops, setStops] = useState([
    { color: '#ff0000', position: 0 },
    { color: '#00ff00', position: 50 },
    { color: '#0000ff', position: 100 },
  ]);
  const [direction, setDirection] = useState('to right');
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');

  function addStop() {
    if (stops.length >= 10) return;
    const lastPos = stops[stops.length - 1]?.position || 0;
    const newPos = Math.min(lastPos + 10, 100);
    setStops([...stops, { color: '#ffffff', position: newPos }]);
  }

  function removeStop(index: number) {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, i) => i !== index));
  }

  function updateStop(index: number, field: 'color' | 'position', value: string) {
    const updated = [...stops];
    if (field === 'color') {
      updated[index] = { ...updated[index], color: value };
    } else {
      updated[index] = { ...updated[index], position: Math.max(0, Math.min(100, parseInt(value) || 0)) };
    }
    setStops(updated);
  }

  const stopsStr = stops
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.color} ${s.position}%`)
    .join(', ');

  const cssCode = gradientType === 'linear'
    ? `background: linear-gradient(${direction}, ${stopsStr});`
    : `background: radial-gradient(circle, ${stopsStr});`;

  const previewStyle = gradientType === 'linear'
    ? { background: `linear-gradient(${direction}, ${stopsStr})` }
    : { background: `radial-gradient(circle, ${stopsStr})` };

  const DIRECTIONS = [
    { value: 'to right', label: 'To Right →' },
    { value: 'to left', label: 'To Left ←' },
    { value: 'to bottom', label: 'To Bottom ↓' },
    { value: 'to top', label: 'To Top ↑' },
    { value: 'to bottom right', label: 'To Bottom Right ↘' },
    { value: 'to top right', label: 'To Top Right ↗' },
    { value: '45deg', label: '45°' },
    { value: '90deg', label: '90°' },
    { value: '135deg', label: '135°' },
    { value: '180deg', label: '180°' },
  ];

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gradient Settings for {toolName}
        </label>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <select
              value={gradientType}
              onChange={(e) => setGradientType(e.target.value as 'linear' | 'radial')}
              aria-label="Gradient type"
              className="input-field text-sm"
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {gradientType === 'linear' && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                aria-label="Gradient direction"
                className="input-field text-sm"
              >
                {DIRECTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-xs text-gray-500">Color Stops</label>
          {stops.map((stop, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={stop.color}
                onChange={(e) => updateStop(index, 'color', e.target.value)}
                aria-label={`Stop ${index + 1} color`}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={stop.color}
                onChange={(e) => updateStop(index, 'color', e.target.value)}
                aria-label={`Stop ${index + 1} hex value`}
                className="input-field text-sm font-mono flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={stop.position}
                onChange={(e) => updateStop(index, 'position', e.target.value)}
                aria-label={`Stop ${index + 1} position`}
                className="input-field text-sm w-20"
              />
              <span className="text-xs text-gray-500">%</span>
              {stops.length > 2 && (
                <button
                  onClick={() => removeStop(index)}
                  aria-label={`Remove stop ${index + 1}`}
                  className="text-red-500 hover:text-red-700 text-sm px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {stops.length < 10 && (
            <button onClick={addStop} className="text-sm text-blue-600 hover:text-blue-800">
              + Add Color Stop
            </button>
          )}
        </div>
      </InputArea>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div
            className="w-full h-24 rounded-lg border border-gray-200"
            style={previewStyle}
            aria-label="Gradient preview"
          />
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-all">{cssCode}</pre>
          </div>
          <CopyToClipboard text={cssCode} />
        </div>
      </OutputArea>
    </div>
  );
}
