'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ParallelogramCalculator - Calculate area, perimeter, and diagonals of a parallelogram.
 * Uses base, side, height, and angle between sides.
 */
export default function ParallelogramCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [base, setBase] = useState('');
  const [side, setSide] = useState('');
  const [height, setHeight] = useState('');
  const [angle, setAngle] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number; d1: number; d2: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const b = parseFloat(base);
    const a = parseFloat(side);
    const h = parseFloat(height);
    const deg = parseFloat(angle);

    if (!base.trim() || isNaN(b) || b <= 0) newErrors.base = 'Enter a valid positive number';
    if (!side.trim() || isNaN(a) || a <= 0) newErrors.side = 'Enter a valid positive number';
    if (!height.trim() || isNaN(h) || h <= 0) newErrors.height = 'Enter a valid positive number';
    if (!angle.trim() || isNaN(deg) || deg <= 0 || deg >= 180) newErrors.angle = 'Enter an angle between 0 and 180';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const rad = (deg * Math.PI) / 180;
    const area = b * h;
    const perimeter = 2 * (b + a);
    const d1 = Math.sqrt(b * b + a * a + 2 * b * a * Math.cos(rad));
    const d2 = Math.sqrt(b * b + a * a - 2 * b * a * Math.cos(rad));

    setResult({ area, perimeter, d1, d2 });
  };

  const copyText = result
    ? `Area: ${result.area.toFixed(4)}\nPerimeter: ${result.perimeter.toFixed(4)}\nDiagonal 1: ${result.d1.toFixed(4)}\nDiagonal 2: ${result.d2.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.base}>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">Base (b)</label>
          <input id={`${toolId}-base`} type="text" inputMode="decimal" value={base} onChange={(e) => { setBase(e.target.value); if (errors.base) setErrors((p) => ({ ...p, base: '' })); }} placeholder="e.g. 10" aria-label={`Base for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.side}>
          <label htmlFor={`${toolId}-side`} className="block text-sm font-medium text-gray-700 mb-1">Side (a)</label>
          <input id={`${toolId}-side`} type="text" inputMode="decimal" value={side} onChange={(e) => { setSide(e.target.value); if (errors.side) setErrors((p) => ({ ...p, side: '' })); }} placeholder="e.g. 6" aria-label={`Side for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.height}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">Height (h)</label>
          <input id={`${toolId}-height`} type="text" inputMode="decimal" value={height} onChange={(e) => { setHeight(e.target.value); if (errors.height) setErrors((p) => ({ ...p, height: '' })); }} placeholder="e.g. 5" aria-label={`Height for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.angle}>
          <label htmlFor={`${toolId}-angle`} className="block text-sm font-medium text-gray-700 mb-1">Angle (°)</label>
          <input id={`${toolId}-angle`} type="text" inputMode="decimal" value={angle} onChange={(e) => { setAngle(e.target.value); if (errors.angle) setErrors((p) => ({ ...p, angle: '' })); }} placeholder="e.g. 60" aria-label={`Angle for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate parallelogram" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.d1.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal 1</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.d2.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Diagonal 2</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              Area = base × height = {base} × {height} = {result.area.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
