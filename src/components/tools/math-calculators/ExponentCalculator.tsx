'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ExponentCalculator - Calculates x^n (power/exponent) with large number support.
 * Handles integer and decimal bases and exponents, including negative values.
 */
export default function ExponentCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [base, setBase] = useState('');
  const [exponent, setExponent] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ value: string; scientific: string; isLarge: boolean } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const b = parseFloat(base);
    const e = parseFloat(exponent);

    if (!base.trim() || isNaN(b)) {
      newErrors.base = 'Please enter a valid number';
    }
    if (!exponent.trim() || isNaN(e)) {
      newErrors.exponent = 'Please enter a valid number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    // Handle special cases
    if (b === 0 && e < 0) {
      setErrors({ base: 'Cannot raise 0 to a negative power (division by zero)' });
      setResult(null);
      return;
    }

    // Use BigInt for integer bases and positive integer exponents for large number support
    if (Number.isInteger(b) && Number.isInteger(e) && e >= 0 && Math.abs(b) <= Number.MAX_SAFE_INTEGER) {
      try {
        const bigBase = BigInt(Math.round(b));
        const bigExp = BigInt(Math.round(e));
        let bigResult = BigInt(1);
        const absExp = bigExp < BigInt(0) ? -bigExp : bigExp;
        for (let i = BigInt(0); i < absExp; i = i + BigInt(1)) {
          bigResult *= bigBase;
        }
        const strResult = bigResult.toString();
        const isLarge = strResult.length > 20;
        const scientific = isLarge
          ? `${strResult[0]}.${strResult.slice(1, 7)}e+${strResult.length - 1}`
          : '';
        setResult({ value: strResult, scientific, isLarge });
        return;
      } catch {
        // Fall through to regular calculation
      }
    }

    // Regular floating point calculation
    const value = Math.pow(b, e);
    if (!isFinite(value)) {
      setResult({ value: value > 0 ? 'Infinity' : '-Infinity', scientific: '', isLarge: false });
      return;
    }

    const strValue = value.toString();
    const isLarge = Math.abs(value) >= 1e15;
    const scientific = isLarge ? value.toExponential(6) : '';
    setResult({ value: isLarge ? value.toExponential(6) : strValue, scientific, isLarge });
  };

  const copyText = result
    ? `${base}^${exponent} = ${result.value}${result.scientific ? `\nScientific notation: ${result.scientific}` : ''}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={errors.base}>
          <label htmlFor={`${toolId}-base`} className="block text-sm font-medium text-gray-700 mb-1">
            Base (x)
          </label>
          <input
            id={`${toolId}-base`}
            type="text"
            inputMode="decimal"
            value={base}
            onChange={(e) => {
              setBase(e.target.value);
              if (errors.base) setErrors((prev) => ({ ...prev, base: '' }));
            }}
            placeholder="e.g. 2"
            aria-label={`Base value for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.exponent}>
          <label htmlFor={`${toolId}-exp`} className="block text-sm font-medium text-gray-700 mb-1">
            Exponent (n)
          </label>
          <input
            id={`${toolId}-exp`}
            type="text"
            inputMode="decimal"
            value={exponent}
            onChange={(e) => {
              setExponent(e.target.value);
              if (errors.exponent) setErrors((prev) => ({ ...prev, exponent: '' }));
            }}
            placeholder="e.g. 10"
            aria-label={`Exponent value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate exponent" className="btn-primary">
        Calculate x^n
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-sm text-gray-500 mb-1">{base}<sup>{exponent}</sup> =</div>
              <div className="text-xl font-bold text-blue-600 font-mono break-all">{result.value}</div>
              {result.scientific && result.isLarge && (
                <div className="text-sm text-gray-500 mt-2">Scientific: {result.scientific}</div>
              )}
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              {base}^{exponent} = {result.value}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
