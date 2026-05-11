'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RoiCalculator - Calculates Return on Investment (ROI) percentage and net profit.
 * Formula: ROI = (Gain - Cost) / Cost × 100
 */
export default function RoiCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ roi: number; netProfit: number } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const cost = parseFloat(initialInvestment);
    const gain = parseFloat(finalValue);

    if (!initialInvestment.trim() || isNaN(cost)) {
      newErrors.initialInvestment = 'Please enter a valid number';
    } else if (cost === 0) {
      newErrors.initialInvestment = 'Initial investment cannot be zero';
    }

    if (!finalValue.trim() || isNaN(gain)) {
      newErrors.finalValue = 'Please enter a valid number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    const netProfit = gain - cost;
    const roi = (netProfit / cost) * 100;
    setResult({ roi, netProfit });
  };

  const copyText = result
    ? `ROI: ${result.roi.toFixed(2)}%\nNet Profit: $${result.netProfit.toFixed(2)}\nFormula: ROI = (Gain - Cost) / Cost × 100`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.initialInvestment}>
          <label htmlFor={`${toolId}-cost`} className="block text-sm font-medium text-gray-700 mb-1">
            Initial Investment (Cost)
          </label>
          <input
            id={`${toolId}-cost`}
            type="text"
            inputMode="decimal"
            value={initialInvestment}
            onChange={(e) => {
              setInitialInvestment(e.target.value);
              if (errors.initialInvestment) setErrors((prev) => ({ ...prev, initialInvestment: '' }));
            }}
            placeholder="e.g. 10000"
            aria-label={`Initial investment for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.finalValue}>
          <label htmlFor={`${toolId}-gain`} className="block text-sm font-medium text-gray-700 mb-1">
            Final Value (or Total Return)
          </label>
          <input
            id={`${toolId}-gain`}
            type="text"
            inputMode="decimal"
            value={finalValue}
            onChange={(e) => {
              setFinalValue(e.target.value);
              if (errors.finalValue) setErrors((prev) => ({ ...prev, finalValue: '' }));
            }}
            placeholder="e.g. 15000"
            aria-label={`Final value for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate ROI" className="btn-primary">
        Calculate ROI
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.roi.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">ROI</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className={`text-2xl font-bold ${result.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${result.netProfit.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">Net Profit</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 font-mono">
              ROI = (Gain - Cost) / Cost × 100 = ({parseFloat(finalValue).toFixed(2)} - {parseFloat(initialInvestment).toFixed(2)}) / {parseFloat(initialInvestment).toFixed(2)} × 100 = {result.roi.toFixed(2)}%
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
