'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorkdayCounter - Counts working days between dates or in a month.
 * Excludes weekends (Saturday and Sunday) from the count.
 */
export default function WorkdayCounter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'range' | 'month'>('range');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ workdays: number; weekends: number; totalDays: number } | null>(null);

  const countWorkdays = (start: Date, end: Date): { workdays: number; weekends: number; totalDays: number } => {
    let workdays = 0;
    let weekends = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day === 0 || day === 6) {
        weekends++;
      } else {
        workdays++;
      }
      current.setDate(current.getDate() + 1);
    }

    return { workdays, weekends, totalDays: workdays + weekends };
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'range') {
      if (!startDate) newErrors.startDate = 'Please select a start date';
      if (!endDate) newErrors.endDate = 'Please select an end date';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
        setErrors(newErrors);
        setResult(null);
        return;
      }

      setErrors({});
      setResult(countWorkdays(start, end));
    } else {
      if (!selectedMonth) {
        newErrors.selectedMonth = 'Please select a month';
        setErrors(newErrors);
        setResult(null);
        return;
      }

      setErrors({});
      const [year, month] = selectedMonth.split('-').map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0); // Last day of month
      setResult(countWorkdays(start, end));
    }
  };

  const copyText = result
    ? `Working Days: ${result.workdays}\nWeekend Days: ${result.weekends}\nTotal Days: ${result.totalDays}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-mode`} value="range" checked={mode === 'range'} onChange={() => setMode('range')} />
            <span className="text-sm">Date Range</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name={`${toolId}-mode`} value="month" checked={mode === 'month'} onChange={() => setMode('month')} />
            <span className="text-sm">Entire Month</span>
          </label>
        </div>
      </div>

      {mode === 'range' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea error={errors.startDate}>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id={`${toolId}-start`}
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' })); }}
              aria-label={`Start date for ${toolName}`}
              className="input-field"
            />
          </InputArea>

          <InputArea error={errors.endDate}>
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id={`${toolId}-end`}
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' })); }}
              aria-label={`End date for ${toolName}`}
              className="input-field"
            />
          </InputArea>
        </div>
      ) : (
        <InputArea error={errors.selectedMonth}>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Month
          </label>
          <input
            id={`${toolId}-month`}
            type="month"
            value={selectedMonth}
            onChange={(e) => { setSelectedMonth(e.target.value); if (errors.selectedMonth) setErrors((prev) => ({ ...prev, selectedMonth: '' })); }}
            aria-label={`Month selection for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      )}

      <button onClick={calculate} aria-label="Count workdays" className="btn-primary">
        Count Workdays
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.workdays}</div>
                <div className="text-xs text-gray-500 mt-1">Working Days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.weekends}</div>
                <div className="text-xs text-gray-500 mt-1">Weekend Days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-800">{result.totalDays}</div>
                <div className="text-xs text-gray-500 mt-1">Total Days</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Working hours (8h/day): <strong>{result.workdays * 8} hours</strong></p>
              <p>Work weeks: <strong>{(result.workdays / 5).toFixed(1)} weeks</strong></p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
