'use client';

import { useState, useCallback } from 'react';
import { UnitCategory, Unit, convert, formatResult, swap, ConverterState } from '@/lib/converters/units';
import { validateNumeric } from '@/lib/validation';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface UnitConverterProps {
  unitCategory: UnitCategory;
}

/**
 * UnitConverter - A reusable client component for unit conversion tools.
 * Accepts a UnitCategory and renders numeric input, source/target unit dropdowns,
 * a swap button, and the converted result with formula display.
 *
 * Requirements: 3.2, 3.3, 3.4, 3.5, 3.6
 */
export default function UnitConverter({ unitCategory }: UnitConverterProps) {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>(unitCategory.units[0]);
  const [toUnit, setToUnit] = useState<Unit>(
    unitCategory.units.length > 1 ? unitCategory.units[1] : unitCategory.units[0]
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.trim() === '') {
        setError(undefined);
        return;
      }

      const validation = validateNumeric(value, 'value');
      if (!validation.valid) {
        setError(validation.error);
      } else {
        setError(undefined);
      }
    },
    []
  );

  const handleFromUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const unit = unitCategory.units.find((u) => u.id === e.target.value);
      if (unit) setFromUnit(unit);
    },
    [unitCategory.units]
  );

  const handleToUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const unit = unitCategory.units.find((u) => u.id === e.target.value);
      if (unit) setToUnit(unit);
    },
    [unitCategory.units]
  );

  const handleSwap = useCallback(() => {
    const state: ConverterState = { value: 0, fromUnit, toUnit };
    const swapped = swap(state);
    setFromUnit(swapped.fromUnit);
    setToUnit(swapped.toUnit);
  }, [fromUnit, toUnit]);

  // Compute result
  const isValidInput =
    inputValue.trim() !== '' && validateNumeric(inputValue, 'value').valid;
  const numericValue = isValidInput ? Number(inputValue.trim()) : null;
  const result =
    numericValue !== null ? convert(numericValue, fromUnit, toUnit) : null;
  const formattedResult = result !== null ? formatResult(result) : '';

  // Build formula string
  const formula =
    numericValue !== null && result !== null
      ? `${numericValue} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`
      : '';

  return (
    <div className="space-y-6">
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor={`${unitCategory.id}-value`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Value
            </label>
            <input
              id={`${unitCategory.id}-value`}
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter a number"
              aria-label={`Numeric value to convert in ${unitCategory.name}`}
              aria-invalid={!!error}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label
                htmlFor={`${unitCategory.id}-from`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                From
              </label>
              <select
                id={`${unitCategory.id}-from`}
                value={fromUnit.id}
                onChange={handleFromUnitChange}
                aria-label={`Source unit for ${unitCategory.name} conversion`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                {unitCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap source and target units"
              className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-w-[44px] min-h-[44px]"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>

            <div className="flex-1">
              <label
                htmlFor={`${unitCategory.id}-to`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                To
              </label>
              <select
                id={`${unitCategory.id}-to`}
                value={toUnit.id}
                onChange={handleToUnitChange}
                aria-label={`Target unit for ${unitCategory.name} conversion`}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              >
                {unitCategory.units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result !== null && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">
                {formattedResult} {toUnit.symbol}
              </p>
              <CopyToClipboard text={formattedResult} />
            </div>
            {formula && (
              <p className="text-sm text-gray-500 font-mono">{formula}</p>
            )}
          </div>
        )}
      </OutputArea>
    </div>
  );
}
