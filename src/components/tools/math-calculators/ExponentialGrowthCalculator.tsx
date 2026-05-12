'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ExponentialGrowthCalculator - Calculate exponential growth or decay.
 * Formula: A = P × e^(rt) or A = P × (1 + r)^t
 */
export default function ExponentialGrowthCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [initialValue, setInitialValue] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'continuous' | 'discrete'>('continuous');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    finalValue: number;
    change: number;
    changePercent: number;
    doublingTime: number | null;
    halfLife: number | null;
  } | null>(null);

  function calculate() {
    const newErrors: Record<string, string> = {};
    const P = parseFloat(initialValue);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (!initialValue.trim() || isNaN(P)) newErrors.initial = 'Enter a valid number';
    if (!rate.trim() || isNaN(parseFloat(rate))) newErrors.rate = 'Enter a valid rate';
    if (!time.trim() || isNaN(t) || t < 0) newErrors.time = 'Enter a non-negative time';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    let finalValue: number;
    if (mode === 'continuous') {
      finalValue = P * Math.exp(r * t);
    } else {
      finalValue = P * Math.pow(1 + r, t);
    }

    const change = finalValue - P;
    const changePercent = P !== 0 ? ((finalValue - P) / Math.abs(P)) * 100 : 0;

    let doublingTime: number | null = null;
    let halfLife: number | null = null;

    if (r > 0) {
      doublingTime = mode === 'continuous' ? Math.log(2) / r : Math.log(2) / Math.log(1 + r);
    } else if (r < 0) {
      halfLife = mode === 'continuous' ? Math.log(2) / Math.abs(r) : Math.log(2) / Math.log(1 / (1 + r));
    }

    setResult({ finalValue, change, changePercent, doublingTime, halfLife });
  }

  const copyText = result
    ? `Initial: ${initialValue}\nRate: ${rate}%\nTime: ${time}\nMode: ${mode}\nFinal Value: ${result.finalValue.toFixed(6)}\nChange: ${result.change.toFixed(6)} (${result.changePercent.toFixed(2)}%)${result.doublingTime ? `\nDoubling Time: ${result.doublingTime.toFixed(4)}` : ''}${result.halfLife ? `\nHalf-Life: ${result.halfLife.toFixed(4)}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.initial}>
          <label htmlFor={`${toolId}-initial`} className="block text-sm font-medium text-gray-700 mb-1">
            Initial Value (P)
          </label>
          <input
            id={`${toolId}-initial`}
            type="text"
            inputMode="decimal"
            value={initialValue}
            onChange={(e) => { setInitialValue(e.target.value); if (errors.initial) setErrors(prev => ({ ...prev, initial: '' })); }}
            placeholder="e.g. 1000"
            aria-label={`Initial value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.rate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Growth Rate (% per period)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(e) => { setRate(e.target.value); if (errors.rate) setErrors(prev => ({ ...prev, rate: '' })); }}
            placeholder="e.g. 5 (for 5%)"
            aria-label={`Growth rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.time}>
          <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
            Time (periods)
          </label>
          <input
            id={`${toolId}-time`}
            type="text"
            inputMode="decimal"
            value={time}
            onChange={(e) => { setTime(e.target.value); if (errors.time) setErrors(prev => ({ ...prev, time: '' })); }}
            placeholder="e.g. 10"
            aria-label={`Time periods for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
            Growth Model
          </label>
          <select
            id={`${toolId}-mode`}
            value={mode}
            onChange={(e) => setMode(e.target.value as 'continuous' | 'discrete')}
            aria-label={`Growth model for ${toolName}`}
            className="input-field"
          >
            <option value="continuous">Continuous (A = Pe^rt)</option>
            <option value="discrete">Discrete (A = P(1+r)^t)</option>
          </select>
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate exponential growth" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.finalValue.toFixed(4)}</div>
                <div className="text-xs text-gray-500 mt-1">Final Value</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.change >= 0 ? '+' : ''}{result.change.toFixed(4)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Absolute Change</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-lg font-bold ${result.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.changePercent >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Change %</div>
              </div>
            </div>
            {(result.doublingTime || result.halfLife) && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-purple-600">
                  {result.doublingTime ? result.doublingTime.toFixed(4) : result.halfLife?.toFixed(4)} periods
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {result.doublingTime ? 'Doubling Time' : 'Half-Life'}
                </div>
              </div>
            )}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {mode === 'continuous'
                ? `A = P × e^(rt) = ${initialValue} × e^(${(parseFloat(rate) / 100).toFixed(4)} × ${time})`
                : `A = P × (1 + r)^t = ${initialValue} × (1 + ${(parseFloat(rate) / 100).toFixed(4)})^${time}`}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
