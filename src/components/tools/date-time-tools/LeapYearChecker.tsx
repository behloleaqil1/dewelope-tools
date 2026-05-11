'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * LeapYearChecker - Check if a year is a leap year with explanation of the rules.
 */
export default function LeapYearChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState('');
  const [result, setResult] = useState<{ isLeap: boolean; year: number; reasons: string[] } | null>(null);
  const [error, setError] = useState('');

  const check = () => {
    const y = parseInt(year);
    if (!year.trim() || isNaN(y) || y < 1) {
      setError('Please enter a valid year (positive integer)');
      setResult(null);
      return;
    }

    setError('');
    const reasons: string[] = [];
    let isLeap = false;

    if (y % 4 !== 0) {
      reasons.push(`${y} is NOT divisible by 4 → Not a leap year`);
      isLeap = false;
    } else if (y % 100 !== 0) {
      reasons.push(`${y} IS divisible by 4 → Candidate`);
      reasons.push(`${y} is NOT divisible by 100 → Leap year`);
      isLeap = true;
    } else if (y % 400 !== 0) {
      reasons.push(`${y} IS divisible by 4 → Candidate`);
      reasons.push(`${y} IS divisible by 100 → Century year, needs further check`);
      reasons.push(`${y} is NOT divisible by 400 → Not a leap year`);
      isLeap = false;
    } else {
      reasons.push(`${y} IS divisible by 4 → Candidate`);
      reasons.push(`${y} IS divisible by 100 → Century year, needs further check`);
      reasons.push(`${y} IS divisible by 400 → Leap year`);
      isLeap = true;
    }

    setResult({ isLeap, year: y, reasons });
  };

  const findNearby = (y: number): { prev: number; next: number } => {
    let prev = y - 1;
    while (prev > 0) {
      if ((prev % 4 === 0 && prev % 100 !== 0) || prev % 400 === 0) break;
      prev--;
    }
    let next = y + 1;
    while (next < y + 10) {
      if ((next % 4 === 0 && next % 100 !== 0) || next % 400 === 0) break;
      next++;
    }
    return { prev, next };
  };

  const copyText = result
    ? `Year: ${result.year}\nIs Leap Year: ${result.isLeap ? 'Yes' : 'No'}\n\nReasoning:\n${result.reasons.map(r => `• ${r}`).join('\n')}\n\nRules:\n• Divisible by 4 → leap year\n• Except: divisible by 100 → not a leap year\n• Except: divisible by 400 → leap year`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter a Year
        </label>
        <input
          id={`${toolId}-year`}
          type="text"
          inputMode="numeric"
          value={year}
          onChange={(e) => { setYear(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 2024"
          aria-label={`Year input for ${toolName}`}
          className="input-field"
        />
        <div className="flex gap-2 mt-2">
          {[2000, 2024, 2025, 1900, 2100].map(y => (
            <button key={y} onClick={() => setYear(y.toString())} className="px-3 py-1 text-xs rounded border bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
              {y}
            </button>
          ))}
        </div>
      </InputArea>

      <button onClick={check} aria-label="Check leap year" className="btn-primary">
        Check Year
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className={`text-center p-4 rounded-lg border ${result.isLeap ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${result.isLeap ? 'text-green-600' : 'text-red-600'}`}>
                {result.year} is {result.isLeap ? 'a Leap Year ✓' : 'NOT a Leap Year ✗'}
              </div>
              {result.isLeap && <div className="text-sm text-gray-600 mt-1">February has 29 days</div>}
              {!result.isLeap && <div className="text-sm text-gray-600 mt-1">February has 28 days</div>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Step-by-step reasoning:</div>
              {result.reasons.map((reason, i) => (
                <div key={i} className="text-sm text-gray-600 py-1 flex items-start gap-2">
                  <span className="text-gray-400">{i + 1}.</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-700 mb-1">Nearby leap years:</div>
              <div className="text-sm text-blue-600">
                Previous: {findNearby(result.year).prev} | Next: {findNearby(result.year).next}
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs text-gray-600">
              <div className="font-medium mb-1">Leap Year Rules:</div>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Divisible by 4 → leap year</li>
                <li>Except: divisible by 100 → not a leap year</li>
                <li>Except: divisible by 400 → leap year</li>
              </ul>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
