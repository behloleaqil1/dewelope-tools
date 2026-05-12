'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MovingAverageCalculator - Calculate simple (SMA) and exponential (EMA) moving averages.
 * Accepts a series of numbers and a window period.
 */
export default function MovingAverageCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dataInput, setDataInput] = useState('');
  const [period, setPeriod] = useState('3');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ sma: number[]; ema: number[] } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};

    const values = dataInput
      .split(/[,\n\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    const p = parseInt(period);

    if (values.length < 2 || values.some(isNaN)) {
      newErrors.data = 'Enter at least 2 valid numbers separated by commas or newlines';
    }
    if (!period.trim() || isNaN(p) || p < 1) {
      newErrors.period = 'Enter a positive integer';
    } else if (values.length > 0 && p > values.length) {
      newErrors.period = `Period cannot exceed data length (${values.length})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Simple Moving Average
    const sma: number[] = [];
    for (let i = p - 1; i < values.length; i++) {
      let sum = 0;
      for (let j = i - p + 1; j <= i; j++) {
        sum += values[j];
      }
      sma.push(sum / p);
    }

    // Exponential Moving Average
    const multiplier = 2 / (p + 1);
    const ema: number[] = [];
    // First EMA is the SMA of the first period
    let firstSum = 0;
    for (let i = 0; i < p; i++) {
      firstSum += values[i];
    }
    ema.push(firstSum / p);

    for (let i = p; i < values.length; i++) {
      const prev = ema[ema.length - 1];
      ema.push((values[i] - prev) * multiplier + prev);
    }

    setResult({ sma, ema });
  }

  const copyText = result
    ? `Simple Moving Average (SMA-${period}):\n${result.sma.map((v) => v.toFixed(4)).join(', ')}\n\nExponential Moving Average (EMA-${period}):\n${result.ema.map((v) => v.toFixed(4)).join(', ')}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.data}>
        <label htmlFor={`${toolId}-data`} className="block text-sm font-medium text-gray-700 mb-1">
          Data Series (comma or newline separated)
        </label>
        <textarea
          id={`${toolId}-data`}
          value={dataInput}
          onChange={(e) => { setDataInput(e.target.value); if (errors.data) setErrors((p) => ({ ...p, data: '' })); }}
          placeholder="e.g. 10, 11, 12, 13, 14, 15, 16, 17"
          aria-label={`Data series for ${toolName}`}
          className="input-field h-28 resize-y font-mono"
        />
      </InputArea>

      <InputArea error={errors.period}>
        <label htmlFor={`${toolId}-period`} className="block text-sm font-medium text-gray-700 mb-1">
          Period (window size)
        </label>
        <input
          id={`${toolId}-period`}
          type="text"
          inputMode="numeric"
          value={period}
          onChange={(e) => { setPeriod(e.target.value); if (errors.period) setErrors((p) => ({ ...p, period: '' })); }}
          placeholder="e.g. 3"
          aria-label={`Period for ${toolName}`}
          className="input-field w-32"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate moving averages" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Simple Moving Average (SMA-{period})</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm text-gray-800 break-all">
                {result.sma.map((v) => v.toFixed(4)).join(', ')}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Exponential Moving Average (EMA-{period})</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono text-sm text-gray-800 break-all">
                {result.ema.map((v) => v.toFixed(4)).join(', ')}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.sma.length}</div>
                <div className="text-xs text-gray-500">SMA Data Points</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-green-600">{result.ema.length}</div>
                <div className="text-xs text-gray-500">EMA Data Points</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
