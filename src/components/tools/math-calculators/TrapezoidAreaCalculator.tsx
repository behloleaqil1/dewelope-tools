'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TrapezoidAreaCalculator - Calculates area of a trapezoid from parallel sides and height.
 * Formula: A = (a + b) / 2 × h
 */
export default function TrapezoidAreaCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [height, setHeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; perimeter: string } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    const h = parseFloat(height);

    if (!sideA.trim() || isNaN(a) || a <= 0) {
      newErrors.sideA = 'Please enter a valid positive number';
    }
    if (!sideB.trim() || isNaN(b) || b <= 0) {
      newErrors.sideB = 'Please enter a valid positive number';
    }
    if (!height.trim() || isNaN(h) || h <= 0) {
      newErrors.height = 'Please enter a valid positive number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const area = ((a + b) / 2) * h;
    setResult({ area, perimeter: `${a} + ${b} + 2 sides` });
  };

  const copyText = result
    ? `Trapezoid Area: ${result.area.toFixed(4)}\nSide a: ${sideA}\nSide b: ${sideB}\nHeight: ${height}\nFormula: A = (a + b) / 2 × h = (${sideA} + ${sideB}) / 2 × ${height} = ${result.area.toFixed(4)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.sideA}>
          <label htmlFor={`${toolId}-sideA`} className="block text-sm font-medium text-gray-700 mb-1">
            Parallel Side a (top)
          </label>
          <input
            id={`${toolId}-sideA`}
            type="text"
            inputMode="decimal"
            value={sideA}
            onChange={(e) => {
              setSideA(e.target.value);
              if (errors.sideA) setErrors((prev) => ({ ...prev, sideA: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Parallel side a for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.sideB}>
          <label htmlFor={`${toolId}-sideB`} className="block text-sm font-medium text-gray-700 mb-1">
            Parallel Side b (bottom)
          </label>
          <input
            id={`${toolId}-sideB`}
            type="text"
            inputMode="decimal"
            value={sideB}
            onChange={(e) => {
              setSideB(e.target.value);
              if (errors.sideB) setErrors((prev) => ({ ...prev, sideB: '' }));
            }}
            placeholder="e.g. 8"
            aria-label={`Parallel side b for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.height}>
          <label htmlFor={`${toolId}-height`} className="block text-sm font-medium text-gray-700 mb-1">
            Height (h)
          </label>
          <input
            id={`${toolId}-height`}
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              if (errors.height) setErrors((prev) => ({ ...prev, height: '' }));
            }}
            placeholder="e.g. 4"
            aria-label={`Height for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate trapezoid area" className="btn-primary">
        Calculate Area
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
              <div className="text-xs text-gray-500 mt-1">square units</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              A = (a + b) / 2 × h = ({sideA} + {sideB}) / 2 × {height} = {result.area.toFixed(4)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
