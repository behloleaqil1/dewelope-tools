'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CenturyCalculator - Determines which century and millennium a given year belongs to.
 * Also shows the decade and era (BC/AD).
 */
export default function CenturyCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [yearInput, setYearInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    century: number;
    centuryLabel: string;
    millennium: number;
    millenniumLabel: string;
    decade: string;
    era: string;
    centuryRange: string;
    millenniumRange: string;
  } | null>(null);

  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const calculate = () => {
    setError('');
    const year = parseInt(yearInput);
    if (!yearInput.trim() || isNaN(year) || year === 0) {
      setError('Enter a valid year (there is no year 0)');
      setResult(null);
      return;
    }

    const absYear = Math.abs(year);
    const era = year > 0 ? 'AD (CE)' : 'BC (BCE)';
    const century = Math.ceil(absYear / 100);
    const millennium = Math.ceil(absYear / 1000);

    const centuryStart = (century - 1) * 100 + 1;
    const centuryEnd = century * 100;
    const millenniumStart = (millennium - 1) * 1000 + 1;
    const millenniumEnd = millennium * 1000;

    const decadeStart = Math.floor(absYear / 10) * 10;
    const decade = `${decadeStart}s`;

    const centuryLabel = `${getOrdinal(century)} century ${era}`;
    const millenniumLabel = `${getOrdinal(millennium)} millennium ${era}`;
    const centuryRange = year > 0 ? `${centuryStart}–${centuryEnd} AD` : `${centuryEnd}–${centuryStart} BC`;
    const millenniumRange = year > 0 ? `${millenniumStart}–${millenniumEnd} AD` : `${millenniumEnd}–${millenniumStart} BC`;

    setResult({ century, centuryLabel, millennium, millenniumLabel, decade, era, centuryRange, millenniumRange });
  };

  const copyText = result
    ? `Year: ${yearInput} ${result.era}\nCentury: ${result.centuryLabel} (${result.centuryRange})\nMillennium: ${result.millenniumLabel} (${result.millenniumRange})\nDecade: ${result.decade}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Year
        </label>
        <input
          id={`${toolId}-year`}
          type="text"
          inputMode="numeric"
          value={yearInput}
          onChange={(e) => { setYearInput(e.target.value); if (error) setError(''); }}
          placeholder="e.g. 2024 or -500 for BC"
          aria-label={`Year input for ${toolName}`}
          className="input-field"
        />
        <p className="text-xs text-gray-500 mt-1">Use negative numbers for BC years (e.g., -44 for 44 BC)</p>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate century" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.centuryLabel}</div>
              <div className="text-sm text-gray-500 mt-1">{result.centuryRange}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">{result.millenniumLabel}</div>
                <div className="text-xs text-gray-500">{result.millenniumRange}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">{result.decade}</div>
                <div className="text-xs text-gray-500">Decade</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              <span className="text-sm text-gray-600">Era: </span>
              <span className="font-bold text-gray-700">{result.era}</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
