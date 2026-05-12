'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ControlChartCalculator - Calculate control chart limits (UCL, LCL, CL).
 * Computes Upper Control Limit, Lower Control Limit, and Center Line
 * using standard deviation method (±3σ) for process monitoring.
 */
export default function ControlChartCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [sigmaMultiplier, setSigmaMultiplier] = useState('3');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    mean: number;
    stdDev: number;
    ucl: number;
    lcl: number;
    outOfControl: number[];
    dataPoints: number[];
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter data values (comma or newline separated)';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const sigma = parseFloat(sigmaMultiplier);
    if (isNaN(sigma) || sigma <= 0) {
      newErrors.sigma = 'Sigma multiplier must be a positive number';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const values = input
      .split(/[,\n\s]+/)
      .map((v) => v.trim())
      .filter((v) => v !== '')
      .map((v) => parseFloat(v));

    if (values.some((v) => isNaN(v))) {
      newErrors.input = 'All values must be valid numbers';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    if (values.length < 3) {
      newErrors.input = 'Please enter at least 3 data points';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const n = values.length;
    const mean = values.reduce((sum, v) => sum + v, 0) / n;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const ucl = mean + sigma * stdDev;
    const lcl = mean - sigma * stdDev;

    const outOfControl = values
      .map((v, i) => (v > ucl || v < lcl ? i + 1 : -1))
      .filter((i) => i !== -1);

    setResult({ mean, stdDev, ucl, lcl, outOfControl, dataPoints: values });
  };

  const copyText = result
    ? `Control Chart Analysis\nCenter Line (CL): ${result.mean.toFixed(4)}\nUpper Control Limit (UCL): ${result.ucl.toFixed(4)}\nLower Control Limit (LCL): ${result.lcl.toFixed(4)}\nStandard Deviation: ${result.stdDev.toFixed(4)}\nData Points: ${result.dataPoints.length}\nOut of Control: ${result.outOfControl.length} point(s)${result.outOfControl.length > 0 ? ` at position(s): ${result.outOfControl.join(', ')}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Values (comma, space, or newline separated)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => { setInput(e.target.value); if (errors.input) setErrors((prev) => ({ ...prev, input: '' })); }}
          placeholder={"25.1, 24.8, 25.3, 25.0, 24.9, 25.2, 25.1, 24.7, 25.4, 25.0"}
          aria-label={`Data input for ${toolName}`}
          className="input-field h-32 resize-y font-mono"
        />
      </InputArea>

      <InputArea error={errors.sigma}>
        <label htmlFor={`${toolId}-sigma`} className="block text-sm font-medium text-gray-700 mb-1">
          Sigma Multiplier (default: 3 for ±3σ)
        </label>
        <input
          id={`${toolId}-sigma`}
          type="number"
          step="0.5"
          min="0.5"
          value={sigmaMultiplier}
          onChange={(e) => { setSigmaMultiplier(e.target.value); if (errors.sigma) setErrors((prev) => ({ ...prev, sigma: '' })); }}
          aria-label={`Sigma multiplier for ${toolName}`}
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate control limits" className="btn-primary">
        Calculate Control Limits
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-center">
                <div className="text-lg font-bold text-red-600">{result.ucl.toFixed(4)}</div>
                <div className="text-xs text-gray-500">UCL (Upper)</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.mean.toFixed(4)}</div>
                <div className="text-xs text-gray-500">CL (Center)</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.lcl.toFixed(4)}</div>
                <div className="text-xs text-gray-500">LCL (Lower)</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.stdDev.toFixed(4)}</div>
                <div className="text-xs text-gray-500">Std Deviation (σ)</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.outOfControl.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.outOfControl.length}
                </div>
                <div className="text-xs text-gray-500">Out of Control Points</div>
              </div>
            </div>

            {result.outOfControl.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm">
                <span className="font-medium text-yellow-800">Out of control at position(s): </span>
                <span className="text-yellow-700">{result.outOfControl.join(', ')}</span>
              </div>
            )}

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Data Points Visualization</div>
              <div className="flex items-end gap-1 h-24">
                {result.dataPoints.map((point, i) => {
                  const range = result.ucl - result.lcl;
                  const normalized = Math.max(0, Math.min(100, ((point - result.lcl) / range) * 100));
                  const isOutOfControl = result.outOfControl.includes(i + 1);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full max-w-[12px] rounded-t ${isOutOfControl ? 'bg-red-500' : 'bg-blue-400'}`}
                        style={{ height: `${Math.max(4, normalized)}%` }}
                        title={`Point ${i + 1}: ${point}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
