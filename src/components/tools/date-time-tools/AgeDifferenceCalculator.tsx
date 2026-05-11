'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AgeDifferenceCalculator - Calculates the age difference between two people.
 * Shows difference in years, months, days, and total days.
 */
export default function AgeDifferenceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ years: number; months: number; days: number; totalDays: number; older: string } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!date1) newErrors.date1 = 'Please select the first birth date';
    if (!date2) newErrors.date2 = 'Please select the second birth date';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const earlier = d1 <= d2 ? d1 : d2;
    const later = d1 <= d2 ? d2 : d1;
    const older = d1 <= d2 ? 'Person 1' : 'Person 2';

    // Calculate total days difference
    const totalDays = Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days, totalDays, older });
  };

  const copyText = result
    ? `Age Difference: ${result.years} years, ${result.months} months, ${result.days} days\nTotal Days: ${result.totalDays.toLocaleString()}\n${result.older} is older`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.date1}>
          <label htmlFor={`${toolId}-date1`} className="block text-sm font-medium text-gray-700 mb-1">
            Person 1 Birth Date
          </label>
          <input
            id={`${toolId}-date1`}
            type="date"
            value={date1}
            onChange={(e) => { setDate1(e.target.value); if (errors.date1) setErrors((prev) => ({ ...prev, date1: '' })); }}
            aria-label={`First birth date for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.date2}>
          <label htmlFor={`${toolId}-date2`} className="block text-sm font-medium text-gray-700 mb-1">
            Person 2 Birth Date
          </label>
          <input
            id={`${toolId}-date2`}
            type="date"
            value={date2}
            onChange={(e) => { setDate2(e.target.value); if (errors.date2) setErrors((prev) => ({ ...prev, date2: '' })); }}
            aria-label={`Second birth date for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate age difference" className="btn-primary">
        Calculate Difference
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.years}</div>
                <div className="text-xs text-gray-500 mt-1">Years</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.months}</div>
                <div className="text-xs text-gray-500 mt-1">Months</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.days}</div>
                <div className="text-xs text-gray-500 mt-1">Days</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Total days apart: <strong>{result.totalDays.toLocaleString()} days</strong></p>
              <p>Total weeks apart: <strong>{(result.totalDays / 7).toFixed(1)} weeks</strong></p>
              <p><strong>{result.older}</strong> is older</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
