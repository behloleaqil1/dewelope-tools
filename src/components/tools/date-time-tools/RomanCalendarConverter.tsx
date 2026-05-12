'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RomanCalendarConverter - Convert between Gregorian calendar years and Roman AUC (Ab Urbe Condita) dating.
 * AUC counts from the traditional founding of Rome in 753 BC.
 */
export default function RomanCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'gregorian-to-auc' | 'auc-to-gregorian'>('gregorian-to-auc');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const FOUNDING_YEAR = 753; // Rome founded 753 BC

  function toRomanNumerals(num: number): string {
    if (num <= 0) return num.toString();
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    let remaining = num;
    for (let i = 0; i < values.length; i++) {
      while (remaining >= values[i]) {
        result += symbols[i];
        remaining -= values[i];
      }
    }
    return result;
  }

  function gregorianToAuc(year: number): number {
    // If year is positive (AD/CE), AUC = year + 753
    // If year is negative (BC/BCE), AUC = 754 + year (since there's no year 0)
    if (year > 0) {
      return year + FOUNDING_YEAR;
    } else {
      return FOUNDING_YEAR + year; // year is negative
    }
  }

  function aucToGregorian(auc: number): { year: number; era: string } {
    if (auc > FOUNDING_YEAR) {
      return { year: auc - FOUNDING_YEAR, era: 'AD/CE' };
    } else if (auc === FOUNDING_YEAR) {
      return { year: 1, era: 'BC/BCE' };
    } else {
      return { year: FOUNDING_YEAR - auc + 1, era: 'BC/BCE' };
    }
  }

  function handleConvert() {
    setError('');
    setOutput('');

    const num = parseInt(input, 10);
    if (isNaN(num)) {
      setError('Please enter a valid year number.');
      return;
    }

    if (mode === 'gregorian-to-auc') {
      if (num === 0) {
        setError('There is no year 0 in the Gregorian calendar. Use negative for BC.');
        return;
      }
      const auc = gregorianToAuc(num);
      if (auc <= 0) {
        setError('This date is before the founding of Rome (753 BC).');
        return;
      }
      const era = num > 0 ? 'AD/CE' : 'BC/BCE';
      const displayYear = num > 0 ? num : Math.abs(num);
      const lines = [
        `=== Gregorian to Roman AUC ===`,
        ``,
        `Gregorian Year: ${displayYear} ${era}`,
        `Roman AUC Year: ${auc}`,
        `Roman Numerals: ${toRomanNumerals(auc)} AUC`,
        ``,
        `Note: AUC (Ab Urbe Condita) counts from`,
        `the founding of Rome in 753 BC.`,
      ];
      setOutput(lines.join('\n'));
    } else {
      if (num <= 0) {
        setError('AUC year must be positive (starts from year 1).');
        return;
      }
      const { year, era } = aucToGregorian(num);
      const lines = [
        `=== Roman AUC to Gregorian ===`,
        ``,
        `Roman AUC Year: ${num}`,
        `Roman Numerals: ${toRomanNumerals(num)} AUC`,
        `Gregorian Year: ${year} ${era}`,
        ``,
        `Note: AUC (Ab Urbe Condita) counts from`,
        `the founding of Rome in 753 BC.`,
      ];
      setOutput(lines.join('\n'));
    }
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'gregorian-to-auc'}
              onChange={() => setMode('gregorian-to-auc')}
            />
            <span className="text-sm">Gregorian → AUC</span>
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'auc-to-gregorian'}
              onChange={() => setMode('auc-to-gregorian')}
            />
            <span className="text-sm">AUC → Gregorian</span>
          </label>
        </div>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'gregorian-to-auc'
            ? 'Gregorian Year (negative for BC, e.g. -44 for 44 BC)'
            : 'AUC Year'}
        </label>
        <input
          id={`${toolId}-input`}
          type="number"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'gregorian-to-auc' ? 'e.g. 2024 or -44' : 'e.g. 710'}
          aria-label={`Year input for ${toolName}`}
          className="input-field mb-3"
        />
        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Convert
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
