'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SimpleInterestCalculator - Calculates simple interest using the formula P × R × T / 100.
 * Also shows total amount (Principal + Interest).
 */
export default function SimpleInterestCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ interest: number; total: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (!principal.trim() || isNaN(p) || p < 0) {
      newErrors.principal = 'Please enter a valid positive number';
    }
    if (!rate.trim() || isNaN(r) || r < 0) {
      newErrors.rate = 'Please enter a valid rate';
    }
    if (!time.trim() || isNaN(t) || t < 0) {
      newErrors.time = 'Please enter a valid time period';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const interest = (p * r * t) / 100;
    const total = p + interest;
    setResult({ interest, total });
  };

  const copyText = result
    ? `Principal: $${parseFloat(principal).toFixed(2)}\nRate: ${rate}%\nTime: ${time} years\nSimple Interest: $${result.interest.toFixed(2)}\nTotal Amount: $${result.total.toFixed(2)}\nFormula: SI = P × R × T / 100`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.principal}>
          <label htmlFor={`${toolId}-principal`} className="block text-sm font-medium text-gray-700 mb-1">
            Principal Amount ($)
          </label>
          <input
            id={`${toolId}-principal`}
            type="text"
            inputMode="decimal"
            value={principal}
            onChange={(e) => {
              setPrincipal(e.target.value);
              if (errors.principal) setErrors((prev) => ({ ...prev, principal: '' }));
            }}
            placeholder="e.g. 10000"
            aria-label={`Principal amount for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.rate}>
          <label htmlFor={`${toolId}-rate`} className="block text-sm font-medium text-gray-700 mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            id={`${toolId}-rate`}
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(e) => {
              setRate(e.target.value);
              if (errors.rate) setErrors((prev) => ({ ...prev, rate: '' }));
            }}
            placeholder="e.g. 5"
            aria-label={`Interest rate for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.time}>
          <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
            Time Period (years)
          </label>
          <input
            id={`${toolId}-time`}
            type="text"
            inputMode="decimal"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              if (errors.time) setErrors((prev) => ({ ...prev, time: '' }));
            }}
            placeholder="e.g. 3"
            aria-label={`Time period for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate simple interest" className="btn-primary">
        Calculate Interest
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">${result.interest.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Simple Interest</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">${result.total.toFixed(2)}</div>
                <div className="text-xs text-gray-500 mt-1">Total Amount</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              SI = P × R × T / 100 = {principal} × {rate} × {time} / 100 = ${result.interest.toFixed(2)}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
