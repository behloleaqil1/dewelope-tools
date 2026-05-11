'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LogarithmCalculator - Calculates log base 2, 10, e (natural), and custom base.
 */
export default function LogarithmCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [value, setValue] = useState('');
  const [customBase, setCustomBase] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ log2: number; log10: number; ln: number; custom: number | null; customBase: number | null } | null>(null);

  const calculate = () => {
    setError(undefined);
    setResult(null);

    const num = parseFloat(value);
    if (!value.trim() || isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }
    if (num <= 0) {
      setError('Value must be greater than 0');
      return;
    }

    const log2 = Math.log2(num);
    const log10 = Math.log10(num);
    const ln = Math.log(num);

    let custom: number | null = null;
    let base: number | null = null;
    if (customBase.trim()) {
      base = parseFloat(customBase);
      if (isNaN(base) || base <= 0 || base === 1) {
        setError('Custom base must be a positive number other than 1');
        return;
      }
      custom = Math.log(num) / Math.log(base);
    }

    setResult({ log2, log10, ln, custom, customBase: base });
  };

  const copyText = result
    ? `log₂(${value}) = ${result.log2.toFixed(8)}\nlog₁₀(${value}) = ${result.log10.toFixed(8)}\nln(${value}) = ${result.ln.toFixed(8)}${result.custom !== null ? `\nlog_${result.customBase}(${value}) = ${result.custom.toFixed(8)}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-value`} className="block text-sm font-medium text-gray-700 mb-1">
            Value (x)
          </label>
          <input
            id={`${toolId}-value`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 100"
            aria-label={`Value for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
            Custom Base (optional)
          </label>
          <input
            id={`${toolId}-base`}
            type="text"
            inputMode="decimal"
            value={customBase}
            onChange={(e) => setCustomBase(e.target.value)}
            placeholder="e.g. 5"
            aria-label="Custom logarithm base"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate logarithm" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.log2.toFixed(8)}</div>
                <div className="text-xs text-gray-500 mt-1">log₂({value})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.log10.toFixed(8)}</div>
                <div className="text-xs text-gray-500 mt-1">log₁₀({value})</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.ln.toFixed(8)}</div>
                <div className="text-xs text-gray-500 mt-1">ln({value})</div>
              </div>
              {result.custom !== null && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600 font-mono">{result.custom.toFixed(8)}</div>
                  <div className="text-xs text-gray-500 mt-1">log_{result.customBase}({value})</div>
                </div>
              )}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
