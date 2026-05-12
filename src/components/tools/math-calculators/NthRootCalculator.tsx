'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * NthRootCalculator - Calculate the nth root of any number.
 * Formula: ⁿ√x = x^(1/n)
 */
export default function NthRootCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [number, setNumber] = useState('');
  const [root, setRoot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ value: number; isPerfect: boolean } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const x = parseFloat(number);
    const n = parseFloat(root);

    if (!number.trim() || isNaN(x)) {
      newErrors.number = 'Please enter a valid number';
    }
    if (!root.trim() || isNaN(n)) {
      newErrors.root = 'Please enter a valid root index';
    } else if (n === 0) {
      newErrors.root = 'Root index cannot be zero';
    } else if (x < 0 && n % 2 === 0) {
      newErrors.number = 'Cannot calculate even root of a negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    let value: number;
    if (x < 0) {
      value = -Math.pow(Math.abs(x), 1 / n);
    } else {
      value = Math.pow(x, 1 / n);
    }

    const rounded = Math.round(value);
    const isPerfect = Math.abs(Math.pow(rounded, n) - x) < 1e-9;

    setResult({ value, isPerfect });
  };

  const copyText = result
    ? `${root}√${number} = ${result.value}${result.isPerfect ? ' (perfect)' : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.number}>
          <label htmlFor={`${toolId}-number`} className="block text-sm font-medium text-gray-700 mb-1">Number (x)</label>
          <input id={`${toolId}-number`} type="text" inputMode="decimal" value={number} onChange={(e) => { setNumber(e.target.value); if (errors.number) setErrors((prev) => ({ ...prev, number: '' })); }} placeholder="e.g. 27" aria-label={`Number for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea error={errors.root}>
          <label htmlFor={`${toolId}-root`} className="block text-sm font-medium text-gray-700 mb-1">Root Index (n)</label>
          <input id={`${toolId}-root`} type="text" inputMode="decimal" value={root} onChange={(e) => { setRoot(e.target.value); if (errors.root) setErrors((prev) => ({ ...prev, root: '' })); }} placeholder="e.g. 3" aria-label={`Root index for ${toolName}`} className="input-field" />
        </InputArea>
      </div>
      <button onClick={calculate} className="btn-primary">Calculate Nth Root</button>
      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900">{result.value.toPrecision(10).replace(/\.?0+$/, '')}</div>
              <div className="text-xs text-gray-500 mt-1">{root}√{number}</div>
            </div>
            {result.isPerfect && (
              <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200 text-center">✓ Perfect {root}{root === '2' ? 'nd' : root === '3' ? 'rd' : 'th'} root</div>
            )}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {root}√{number} = {number}^(1/{root}) = {result.value.toPrecision(10).replace(/\.?0+$/, '')}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
