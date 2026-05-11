'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AreaUnderCurveCalculator - Approximate area under a curve using the trapezoidal rule.
 * Users enter x,y data points and the tool calculates the approximate integral.
 */
export default function AreaUnderCurveCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ area: number; points: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter data points (x,y pairs, one per line)';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const lines = input.trim().split('\n').filter((l) => l.trim());
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split(/[,\s\t]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.length < 2) {
        newErrors.input = `Line ${i + 1}: Expected x,y pair but got "${lines[i]}"`;
        setErrors(newErrors);
        setResult(null);
        return;
      }
      const x = parseFloat(parts[0]);
      const y = parseFloat(parts[1]);
      if (isNaN(x) || isNaN(y)) {
        newErrors.input = `Line ${i + 1}: Invalid number in "${lines[i]}"`;
        setErrors(newErrors);
        setResult(null);
        return;
      }
      points.push({ x, y });
    }

    if (points.length < 2) {
      newErrors.input = 'At least 2 data points are required';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    // Sort by x
    points.sort((a, b) => a.x - b.x);

    // Trapezoidal rule: sum of (x[i+1] - x[i]) * (y[i] + y[i+1]) / 2
    let area = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1].x - points[i].x;
      const avgY = (points[i].y + points[i + 1].y) / 2;
      area += dx * avgY;
    }

    setErrors({});
    setResult({ area, points: points.length });
  };

  const copyText = result
    ? `Area under curve ≈ ${result.area.toFixed(6)}\nMethod: Trapezoidal Rule\nData points: ${result.points}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter data points (x, y pairs — one per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (errors.input) setErrors({});
          }}
          placeholder={'0, 0\n1, 1\n2, 4\n3, 9\n4, 16'}
          aria-label={`Data points input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Format: x,y or x y (space/tab/comma separated)</p>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate area under curve" className="btn-primary">
        Calculate Area
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.area.toFixed(6)}</div>
              <div className="text-xs text-gray-500 mt-1">Approximate Area (Trapezoidal Rule)</div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p><strong>Method:</strong> Trapezoidal Rule</p>
              <p><strong>Data Points:</strong> {result.points}</p>
              <p><strong>Formula:</strong> Σ (x[i+1] - x[i]) × (y[i] + y[i+1]) / 2</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
