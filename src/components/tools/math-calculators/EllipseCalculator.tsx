'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EllipseCalculator - Calculate area, perimeter (approximation), and eccentricity of an ellipse.
 */
export default function EllipseCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [semiMajor, setSemiMajor] = useState('');
  const [semiMinor, setSemiMinor] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: number; eccentricity: number; focalDistance: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const a = parseFloat(semiMajor);
    const b = parseFloat(semiMinor);

    if (!semiMajor.trim() || isNaN(a) || a <= 0) {
      newErrors.semiMajor = 'Please enter a positive number';
    }
    if (!semiMinor.trim() || isNaN(b) || b <= 0) {
      newErrors.semiMinor = 'Please enter a positive number';
    }
    if (!newErrors.semiMajor && !newErrors.semiMinor && b > a) {
      newErrors.semiMinor = 'Semi-minor axis must be ≤ semi-major axis';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Area = π × a × b
    const area = Math.PI * a * b;

    // Perimeter approximation (Ramanujan's formula)
    const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
    const perimeter = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));

    // Eccentricity = sqrt(1 - (b²/a²))
    const eccentricity = Math.sqrt(1 - (b * b) / (a * a));

    // Focal distance c = sqrt(a² - b²)
    const focalDistance = Math.sqrt(a * a - b * b);

    setResult({ area, perimeter, eccentricity, focalDistance });
  };

  const copyText = result
    ? `Ellipse (a=${semiMajor}, b=${semiMinor})\nArea: ${result.area.toFixed(6)}\nPerimeter (approx): ${result.perimeter.toFixed(6)}\nEccentricity: ${result.eccentricity.toFixed(6)}\nFocal Distance: ${result.focalDistance.toFixed(6)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.semiMajor}>
          <label htmlFor={`${toolId}-a`} className="block text-sm font-medium text-gray-700 mb-1">
            Semi-major axis (a)
          </label>
          <input
            id={`${toolId}-a`}
            type="text"
            inputMode="decimal"
            value={semiMajor}
            onChange={(e) => { setSemiMajor(e.target.value); if (errors.semiMajor) setErrors(prev => ({ ...prev, semiMajor: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Semi-major axis for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.semiMinor}>
          <label htmlFor={`${toolId}-b`} className="block text-sm font-medium text-gray-700 mb-1">
            Semi-minor axis (b)
          </label>
          <input
            id={`${toolId}-b`}
            type="text"
            inputMode="decimal"
            value={semiMinor}
            onChange={(e) => { setSemiMinor(e.target.value); if (errors.semiMinor) setErrors(prev => ({ ...prev, semiMinor: '' })); }}
            placeholder="e.g. 6"
            aria-label={`Semi-minor axis for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate ellipse properties" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Area (π × a × b)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.perimeter.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Perimeter (approx)</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.eccentricity.toFixed(6)}</div>
                <div className="text-xs text-gray-500 mt-1">Eccentricity</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.focalDistance.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Focal Distance (c)</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              <div>Area = π × {semiMajor} × {semiMinor} = {result.area.toFixed(4)}</div>
              <div>e = √(1 - b²/a²) = {result.eccentricity.toFixed(6)}</div>
              <div>Perimeter ≈ Ramanujan&apos;s approximation</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
