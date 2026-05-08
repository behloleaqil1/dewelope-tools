'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { calculateAge } from '@/lib/calculators';

/**
 * AgeCalculator - Calculates age from a birth date.
 * Displays years, months, days, and total days since birth.
 * Validates that a date is provided and is not in the future.
 */
export default function AgeCalculator({ toolId, toolName }: ToolEngineProps) {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
  } | null>(null);

  const calculate = () => {
    if (!birthDate.trim()) {
      setError('Please enter a valid date');
      setResult(null);
      return;
    }

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
      setError('Please enter a valid date');
      setResult(null);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date > today) {
      setError('Birth date cannot be in the future');
      setResult(null);
      return;
    }

    setError('');
    setResult(calculateAge(date));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor="age-birthdate" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            id="age-birthdate"
            type="date"
            value={birthDate}
            onChange={handleDateChange}
            aria-label={`Date of birth for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <button
          onClick={calculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Calculate Age
        </button>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">
              {result.years} years, {result.months} months, {result.days} days
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.years}</div>
                <div className="text-sm text-gray-500">Years</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.months}</div>
                <div className="text-sm text-gray-500">Months</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.days}</div>
                <div className="text-sm text-gray-500">Days</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalDays.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total Days</div>
              </div>
            </div>
            <CopyToClipboard
              text={`${result.years} years, ${result.months} months, ${result.days} days (${result.totalDays} total days)`}
            />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
