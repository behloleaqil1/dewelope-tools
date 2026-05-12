'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * FiscalYearCalculator - Determine fiscal quarter/year for any date with configurable start month.
 */
export default function FiscalYearCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState('');
  const [startMonth, setStartMonth] = useState('1');
  const [result, setResult] = useState<{ fiscalYear: number; fiscalQuarter: number; quarterStart: string; quarterEnd: string; daysIntoFY: number; daysRemaining: number } | null>(null);
  const [error, setError] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const calculate = () => {
    setError('');
    setResult(null);

    if (!date) {
      setError('Please select a date.');
      return;
    }

    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setError('Invalid date.');
      return;
    }

    const fyStart = parseInt(startMonth);
    const month = d.getMonth() + 1; // 1-based
    const year = d.getFullYear();

    // Determine fiscal year
    let fiscalYear: number;
    if (fyStart === 1) {
      fiscalYear = year;
    } else if (month >= fyStart) {
      fiscalYear = year + 1;
    } else {
      fiscalYear = year;
    }

    // Determine fiscal quarter (each quarter is 3 months from FY start)
    let monthsIntoFY: number;
    if (month >= fyStart) {
      monthsIntoFY = month - fyStart;
    } else {
      monthsIntoFY = (12 - fyStart) + month;
    }
    const fiscalQuarter = Math.floor(monthsIntoFY / 3) + 1;

    // Quarter start and end dates
    const quarterStartMonth = ((fyStart - 1 + (fiscalQuarter - 1) * 3) % 12);
    const quarterEndMonth = ((fyStart - 1 + fiscalQuarter * 3 - 1) % 12);

    const qStart = new Date(month >= fyStart ? year : year - (fyStart > 1 ? 1 : 0), quarterStartMonth, 1);
    const qEndDate = new Date(month >= fyStart ? year : year - (fyStart > 1 ? 1 : 0), quarterEndMonth + 1, 0);

    // Days into fiscal year
    const fyStartDate = new Date(fyStart === 1 ? year : (month >= fyStart ? year : year - 1), fyStart - 1, 1);
    const fyEndDate = new Date(fyStartDate.getFullYear() + 1, fyStart - 1, 0);
    const daysIntoFY = Math.floor((d.getTime() - fyStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDaysInFY = Math.floor((fyEndDate.getTime() - fyStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDaysInFY - daysIntoFY;

    const formatDate = (dt: Date) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    setResult({
      fiscalYear,
      fiscalQuarter,
      quarterStart: formatDate(qStart),
      quarterEnd: formatDate(qEndDate),
      daysIntoFY,
      daysRemaining: Math.max(0, daysRemaining),
    });
  };

  const copyText = result
    ? `Date: ${date}\nFiscal Year: FY${result.fiscalYear}\nFiscal Quarter: Q${result.fiscalQuarter}\nQuarter: ${result.quarterStart} - ${result.quarterEnd}\nDays into FY: ${result.daysIntoFY}\nDays remaining: ${result.daysRemaining}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Starts In</label>
            <select id={`${toolId}-start`} value={startMonth} onChange={(e) => setStartMonth(e.target.value)} aria-label="Fiscal year start month" className="input-field">
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate fiscal year">Calculate Fiscal Year</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Fiscal Year Details</label>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">FY{result.fiscalYear}</div>
                <div className="text-xs text-gray-500 mt-1">Fiscal Year</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">Q{result.fiscalQuarter}</div>
                <div className="text-xs text-gray-500 mt-1">Fiscal Quarter</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Quarter Period:</span> {result.quarterStart} – {result.quarterEnd}</div>
              <div><span className="font-medium">Days into FY:</span> {result.daysIntoFY}</div>
              <div><span className="font-medium">Days remaining in FY:</span> {result.daysRemaining}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
