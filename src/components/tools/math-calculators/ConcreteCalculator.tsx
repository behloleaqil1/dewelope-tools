'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ConcreteCalculator - Calculate concrete volume needed for slabs, columns, and footings.
 * Shows volume in cubic meters, cubic feet, cubic yards, and number of bags needed.
 */
export default function ConcreteCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [shape, setShape] = useState<'slab' | 'column' | 'footing'>('slab');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [depth, setDepth] = useState('');
  const [diameter, setDiameter] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'meters' | 'feet'>('meters');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    cubicMeters: number;
    cubicFeet: number;
    cubicYards: number;
    bags40kg: number;
    bags60kg: number;
    bags80kg: number;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    let volumeM3 = 0;

    if (shape === 'slab' || shape === 'footing') {
      const l = parseFloat(length);
      const w = parseFloat(width);
      const d = parseFloat(depth);

      if (!length.trim() || isNaN(l) || l <= 0) newErrors.length = 'Enter valid length';
      if (!width.trim() || isNaN(w) || w <= 0) newErrors.width = 'Enter valid width';
      if (!depth.trim() || isNaN(d) || d <= 0) newErrors.depth = 'Enter valid depth/thickness';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      let lm = l, wm = w, dm = d;
      if (unit === 'feet') {
        lm = l * 0.3048;
        wm = w * 0.3048;
        dm = d * 0.3048;
      }

      volumeM3 = lm * wm * dm;
    } else {
      const d = parseFloat(diameter);
      const h = parseFloat(height);

      if (!diameter.trim() || isNaN(d) || d <= 0) newErrors.diameter = 'Enter valid diameter';
      if (!height.trim() || isNaN(h) || h <= 0) newErrors.height = 'Enter valid height';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      let dm = d, hm = h;
      if (unit === 'feet') {
        dm = d * 0.3048;
        hm = h * 0.3048;
      }

      const radius = dm / 2;
      volumeM3 = Math.PI * radius * radius * hm;
    }

    setErrors({});

    const cubicFeet = volumeM3 * 35.3147;
    const cubicYards = volumeM3 / 0.764555;
    // Approximate: 1 cubic meter of concrete ≈ 2400 kg
    const totalKg = volumeM3 * 2400;

    setResult({
      cubicMeters: volumeM3,
      cubicFeet,
      cubicYards,
      bags40kg: Math.ceil(totalKg / 40),
      bags60kg: Math.ceil(totalKg / 60),
      bags80kg: Math.ceil(totalKg / 80),
    });
  };

  const copyText = result
    ? `Concrete Volume:\n${result.cubicMeters.toFixed(3)} m³\n${result.cubicFeet.toFixed(2)} ft³\n${result.cubicYards.toFixed(3)} yd³\n\nBags needed:\n~${result.bags40kg} × 40kg bags\n~${result.bags60kg} × 60kg bags\n~${result.bags80kg} × 80kg bags`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-shape`} className="block text-sm font-medium text-gray-700 mb-1">
            Shape
          </label>
          <select
            id={`${toolId}-shape`}
            value={shape}
            onChange={(e) => setShape(e.target.value as 'slab' | 'column' | 'footing')}
            aria-label={`Shape for ${toolName}`}
            className="input-field"
          >
            <option value="slab">Slab / Rectangular</option>
            <option value="column">Column / Cylinder</option>
            <option value="footing">Footing / Rectangular</option>
          </select>
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <select
            id={`${toolId}-unit`}
            value={unit}
            onChange={(e) => setUnit(e.target.value as 'meters' | 'feet')}
            aria-label={`Unit for ${toolName}`}
            className="input-field"
          >
            <option value="meters">Meters</option>
            <option value="feet">Feet</option>
          </select>
        </InputArea>
      </div>

      {(shape === 'slab' || shape === 'footing') && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputArea error={errors.length}>
            <label htmlFor={`${toolId}-length`} className="block text-sm font-medium text-gray-700 mb-1">
              Length ({unit})
            </label>
            <input
              id={`${toolId}-length`}
              type="text"
              inputMode="decimal"
              value={length}
              onChange={(e) => { setLength(e.target.value); if (errors.length) setErrors((prev) => ({ ...prev, length: '' })); }}
              placeholder="e.g. 10"
              aria-label={`Length for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea error={errors.width}>
            <label htmlFor={`${toolId}-width`} className="block text-sm font-medium text-gray-700 mb-1">
              Width ({unit})
            </label>
            <input
              id={`${toolId}-width`}
              type="text"
              inputMode="decimal"
              value={width}
              onChange={(e) => { setWidth(e.target.value); if (errors.width) setErrors((prev) => ({ ...prev, width: '' })); }}
              placeholder="e.g. 5"
              aria-label={`Width for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea error={errors.depth}>
            <label htmlFor={`${toolId}-depth`} className="block text-sm font-medium text-gray-700 mb-1">
              Depth/Thickness ({unit})
            </label>
            <input
              id={`${toolId}-depth`}
              type="text"
              inputMode="decimal"
              value={depth}
              onChange={(e) => { setDepth(e.target.value); if (errors.depth) setErrors((prev) => ({ ...prev, depth: '' })); }}
              placeholder="e.g. 0.15"
              aria-label={`Depth for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      )}

      {shape === 'column' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea error={errors.diameter}>
            <label htmlFor={`${toolId}-diameter`} className="block text-sm font-medium text-gray-700 mb-1">
              Diameter ({unit})
            </label>
            <input
              id={`${toolId}-diameter`}
              type="text"
              inputMode="decimal"
              value={diameter}
              onChange={(e) => { setDiameter(e.target.value); if (errors.diameter) setErrors((prev) => ({ ...prev, diameter: '' })); }}
              placeholder="e.g. 0.5"
              aria-label={`Diameter for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea error={errors.height}>
            <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
              Height ({unit})
            </label>
            <input
              id={`${toolId}-height`}
              type="text"
              inputMode="decimal"
              value={height}
              onChange={(e) => { setHeight(e.target.value); if (errors.height) setErrors((prev) => ({ ...prev, height: '' })); }}
              placeholder="e.g. 3"
              aria-label={`Height for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      )}

      <button onClick={calculate} aria-label="Calculate concrete" className="btn-primary">
        Calculate Concrete
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.cubicMeters.toFixed(3)}</div>
                <div className="text-xs text-gray-500 mt-1">m³</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.cubicFeet.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">ft³</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.cubicYards.toFixed(3)}</div>
                <div className="text-xs text-gray-500 mt-1">yd³</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="font-medium mb-1">Estimated bags of pre-mixed concrete:</p>
              <p>~{result.bags40kg} × 40 kg bags</p>
              <p>~{result.bags60kg} × 60 kg bags</p>
              <p>~{result.bags80kg} × 80 kg bags</p>
              <p className="text-xs text-gray-400 mt-2">Based on ~2400 kg/m³ density. Actual needs may vary by 5-10%.</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
