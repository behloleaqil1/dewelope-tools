'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { validateNumeric, validateRange } from '@/lib/validation';
import { calculatePercentage } from '@/lib/calculators';

/**
 * PercentageCalculator - Calculates a percentage of a given value.
 * Displays the formula alongside the result.
 * Validates numeric inputs with range checking and shows field-specific errors.
 */
export default function PercentageCalculator({ toolId, toolName }: ToolEngineProps) {
  const [value, setValue] = useState('');
  const [percentage, setPercentage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ result: number; formula: string } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const valueValidation = validateNumeric(value, 'value');
    if (!valueValidation.valid) {
      newErrors.value = valueValidation.error!;
    }

    const percentValidation = validateNumeric(percentage, 'percentage');
    if (!percentValidation.valid) {
      newErrors.percentage = percentValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numValue = Number(value.trim());
    const numPercentage = Number(percentage.trim());

    const rangeValue = validateRange(numValue, -999999999, 999999999, 'value');
    if (!rangeValue.valid) {
      newErrors.value = rangeValue.error!;
    }

    const rangePercent = validateRange(numPercentage, -999999999, 999999999, 'percentage');
    if (!rangePercent.valid) {
      newErrors.percentage = rangePercent.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculatePercentage(numValue, numPercentage));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (errors.value) {
      setErrors((prev) => ({ ...prev, value: '' }));
    }
  };

  const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPercentage(e.target.value);
    if (errors.percentage) {
      setErrors((prev) => ({ ...prev, percentage: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.value}>
          <label htmlFor="percent-value" className="block text-sm font-medium text-gray-700">
            Value
          </label>
          <input
            id="percent-value"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleValueChange}
            placeholder="Enter a number"
            aria-label={`Value for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.percentage}>
          <label htmlFor="percent-percentage" className="block text-sm font-medium text-gray-700">
            Percentage (%)
          </label>
          <input
            id="percent-percentage"
            type="text"
            inputMode="decimal"
            value={percentage}
            onChange={handlePercentageChange}
            placeholder="Enter percentage"
            aria-label={`Percentage for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">
              Result: {result.result}
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={String(result.result)} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
