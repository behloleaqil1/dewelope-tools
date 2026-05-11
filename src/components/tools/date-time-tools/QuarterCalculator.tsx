'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * QuarterCalculator - Determines which fiscal/calendar quarter a date falls in.
 * Calendar quarters: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
 * Fiscal year start can be customized.
 */
export default function QuarterCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [fiscalStart, setFiscalStart] = useState('1'); // Month number (1=Jan)
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    calendarQuarter: number;
    fiscalQuarter: number;
    calendarYear: number;
    fiscalYear: number;
    quarterStart: string;
    quarterEnd: string;
  } | null>(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const calculate = () => {
    setError('');
    if (!dateInput) {
      setError('Please select a date');
      setResult(null);
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      setResult(null);
      return;
    }

    const month = date.getMonth(); // 0-indexed
    const year = date.getFullYear();

    // Calendar quarter (0-indexed month)
    const calendarQuarter = Math.floor(month / 3) + 1;

    // Fiscal quarter calculation
    const fiscalStartMonth = parseInt(fiscalStart) - 1; // Convert to 0-indexed
    const adjustedMonth = (month - fiscalStartMonth + 12) % 12;
    const fiscalQuarter = Math.floor(adjustedMonth / 3) + 1;

    // Fiscal year: if fiscal start > Jan and current month is before fiscal start, fiscal year = previous year
    let fiscalYear = year;
    if (fiscalStartMonth > 0 && month < fiscalStartMonth) {
      fiscalYear = year - 1;
    } else if (fiscalStartMonth > 0 && month >= fiscalStartMonth) {
      fiscalYear = year;
    }

    // Quarter start and end dates (calendar)
    const qStartMonth = (calendarQuarter - 1) * 3;
    const qEndMonth = qStartMonth + 2;
    const quarterStart = `${monthNames[qStartMonth]} 1, ${year}`;
    const lastDay = new Date(year, qEndMonth + 1, 0).getDate();
    const quarterEnd = `${monthNames[qEndMonth]} ${lastDay}, ${year}`;

    setResult({
      calendarQuarter,
      fiscalQuarter,
      calendarYear: year,
      fiscalYear,
      quarterStart,
      quarterEnd,
    });
  };

  const copyText = result
    ? `Date: ${dateInput}\nCalendar Quarter: Q${result.calendarQuarter} ${result.calendarYear}\nFiscal Quarter: Q${result.fiscalQuarter} FY${result.fiscalYear}\nQuarter Period: ${result.quarterStart} - ${result.quarterEnd}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            id={`${toolId}-date`}
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            aria-label={`Date input for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <div>
          <label htmlFor={`${toolId}-fiscal`} className="block text-sm font-medium text-gray-700 mb-1">
            Fiscal Year Starts
          </label>
          <select
            id={`${toolId}-fiscal`}
            value={fiscalStart}
            onChange={(e) => setFiscalStart(e.target.value)}
            aria-label="Fiscal year start month"
            className="input-field"
          >
            {monthNames.map((name, i) => (
              <option key={i} value={String(i + 1)}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={calculate} aria-label="Calculate quarter" className="btn-primary">
        Find Quarter
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">Q{result.calendarQuarter}</div>
                <div className="text-xs text-gray-500 mt-1">Calendar Quarter {result.calendarYear}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">Q{result.fiscalQuarter}</div>
                <div className="text-xs text-gray-500 mt-1">Fiscal Quarter FY{result.fiscalYear}</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">Quarter Start</span>
                <span className="text-sm font-mono font-bold text-gray-800">{result.quarterStart}</span>
              </div>
              <div className="flex justify-between bg-gray-50 p-2 rounded border border-gray-200">
                <span className="text-sm text-gray-600">Quarter End</span>
                <span className="text-sm font-mono font-bold text-gray-800">{result.quarterEnd}</span>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
