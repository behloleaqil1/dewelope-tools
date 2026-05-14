'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GregorianToJulianConverter - Convert Gregorian date to Julian Day Number
 */
export default function GregorianToJulianConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ julianDay: number; modifiedJD: number; formula: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function convert() {
    setError(undefined);
    setResult(null);

    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) { setError('Invalid date'); return; }

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();

    // Julian Day Number calculation
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj + Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;
    const mjd = jdn - 2400000.5;

    setResult({
      julianDay: jdn,
      modifiedJD: mjd,
      formula: `JDN = ${jdn}`,
    });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Gregorian Date</label>
        <input id={`${toolId}-date`} type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Date input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={convert} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Julian Day Number: {result.julianDay}</div>
            <div className="text-md text-gray-700">Modified Julian Date: {result.modifiedJD.toFixed(1)}</div>
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 font-mono">{result.formula}</div>
            <CopyToClipboard text={`JDN: ${result.julianDay}, MJD: ${result.modifiedJD.toFixed(1)}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
