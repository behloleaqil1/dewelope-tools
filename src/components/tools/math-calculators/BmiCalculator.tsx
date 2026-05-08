'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { validateNumeric, validateRange } from '@/lib/validation';
import { calculateBMI } from '@/lib/calculators';

/**
 * BmiCalculator - Calculates Body Mass Index from weight and height.
 * Displays the formula and BMI category alongside the result.
 * Validates numeric inputs with range checking and shows field-specific errors.
 */
export default function BmiCalculator({ toolId, toolName }: ToolEngineProps) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ bmi: number; category: string; formula: string } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    const weightValidation = validateNumeric(weight, 'weight');
    if (!weightValidation.valid) {
      newErrors.weight = weightValidation.error!;
    }

    const heightValidation = validateNumeric(height, 'height');
    if (!heightValidation.valid) {
      newErrors.height = heightValidation.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const numWeight = Number(weight.trim());
    const numHeight = Number(height.trim());

    const rangeWeight = validateRange(numWeight, 1, 500, 'weight');
    if (!rangeWeight.valid) {
      newErrors.weight = rangeWeight.error!;
    }

    const rangeHeight = validateRange(numHeight, 30, 300, 'height');
    if (!rangeHeight.valid) {
      newErrors.height = rangeHeight.error!;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult(calculateBMI(numWeight, numHeight));
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
    if (errors.weight) {
      setErrors((prev) => ({ ...prev, weight: '' }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
    if (errors.height) {
      setErrors((prev) => ({ ...prev, height: '' }));
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.weight}>
          <label htmlFor="bmi-weight" className="block text-sm font-medium text-gray-700">
            Weight (kg)
          </label>
          <input
            id="bmi-weight"
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={handleWeightChange}
            placeholder="Enter weight in kilograms"
            aria-label={`Weight in kilograms for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <InputArea error={errors.height}>
          <label htmlFor="bmi-height" className="block text-sm font-medium text-gray-700">
            Height (cm)
          </label>
          <input
            id="bmi-height"
            type="text"
            inputMode="decimal"
            value={height}
            onChange={handleHeightChange}
            placeholder="Enter height in centimeters"
            aria-label={`Height in centimeters for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate BMI
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">
              BMI: {result.bmi}
            </div>
            <div className="text-md font-medium text-gray-700">
              Category: <span className="text-blue-600">{result.category}</span>
            </div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">
              {result.formula}
            </div>
            <CopyToClipboard text={`BMI: ${result.bmi} (${result.category})`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
