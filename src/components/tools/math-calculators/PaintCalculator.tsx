'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PaintCalculator - Calculates paint needed for walls based on room dimensions.
 * Returns gallons and liters needed, accounting for doors/windows and coats.
 */
export default function PaintCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [coats, setCoats] = useState('2');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');
  const [result, setResult] = useState<{ sqft: number; gallons: number; liters: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseInt(doors) || 0;
    const win = parseInt(windows) || 0;
    const c = parseInt(coats) || 1;

    if (!length.trim() || isNaN(l) || l <= 0) newErrors.length = 'Enter a valid length';
    if (!width.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter a valid width';
    if (!height.trim() || isNaN(h) || h <= 0) newErrors.height = 'Enter a valid height';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Calculate wall area (perimeter × height)
    const perimeter = 2 * (l + w);
    let wallArea = perimeter * h;

    // Subtract doors (~21 sqft / 1.95 sqm each) and windows (~15 sqft / 1.4 sqm each)
    const doorArea = unit === 'feet' ? 21 : 1.95;
    const windowArea = unit === 'feet' ? 15 : 1.4;
    wallArea -= (d * doorArea) + (win * windowArea);
    if (wallArea < 0) wallArea = 0;

    // Convert to sqft if in meters
    const sqft = unit === 'meters' ? wallArea * 10.764 : wallArea;

    // 1 gallon covers ~350 sqft
    const gallons = (sqft / 350) * c;
    const liters = gallons * 3.785;

    setResult({ sqft: Math.round(sqft), gallons: Math.ceil(gallons * 10) / 10, liters: Math.ceil(liters * 10) / 10 });
  };

  const copyText = result
    ? `Paint Calculator Results:\nWall Area: ${result.sqft} sq ft\nPaint Needed: ${result.gallons} gallons (${result.liters} liters)\nCoats: ${coats}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="flex gap-3 mb-2">
          {(['feet', 'meters'] as const).map((u) => (
            <label key={u} className="flex items-center gap-1.5 text-sm text-gray-700">
              <input type="radio" name={`${toolId}-unit`} value={u} checked={unit === u} onChange={() => setUnit(u)} className="text-blue-600" />
              {u === 'feet' ? 'Feet' : 'Meters'}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InputArea error={errors.length}>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">Room Length</label>
            <input id={`${toolId}-length`} type="text" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} placeholder={unit === 'feet' ? 'e.g. 12' : 'e.g. 3.6'} aria-label={`Room length for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.width}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">Room Width</label>
            <input id={`${toolId}-width`} type="text" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} placeholder={unit === 'feet' ? 'e.g. 10' : 'e.g. 3'} aria-label={`Room width for ${toolName}`} className="input-field" />
          </InputArea>
          <InputArea error={errors.height}>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Wall Height</label>
            <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={unit === 'feet' ? 'e.g. 8' : 'e.g. 2.4'} aria-label={`Wall height for ${toolName}`} className="input-field" />
          </InputArea>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-doors`} className="block text-sm font-medium text-gray-700 mb-1">Doors</label>
            <input id={`${toolId}-doors`} type="number" min="0" value={doors} onChange={(e) => setDoors(e.target.value)} className="input-field" aria-label="Number of doors" />
          </div>
          <div>
            <label htmlFor={`${toolId}-windows`} className="block text-sm font-medium text-gray-700 mb-1">Windows</label>
            <input id={`${toolId}-windows`} type="number" min="0" value={windows} onChange={(e) => setWindows(e.target.value)} className="input-field" aria-label="Number of windows" />
          </div>
          <div>
            <label htmlFor={`${toolId}-coats`} className="block text-sm font-medium text-gray-700 mb-1">Coats</label>
            <input id={`${toolId}-coats`} type="number" min="1" max="5" value={coats} onChange={(e) => setCoats(e.target.value)} className="input-field" aria-label="Number of coats" />
          </div>
        </div>
      </div>

      <button onClick={calculate} aria-label="Calculate paint needed" className="btn-primary">
        Calculate Paint
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.sqft}</div>
                <div className="text-xs text-gray-500 mt-1">sq ft</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.gallons}</div>
                <div className="text-xs text-gray-500 mt-1">gallons</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.liters}</div>
                <div className="text-xs text-gray-500 mt-1">liters</div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Based on ~350 sq ft coverage per gallon with {coats} coat(s).</p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
