'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DateToDayOfWeek - Finds what day of the week any date falls on.
 * Supports any valid date and shows additional info like day of year and week number.
 */
export default function DateToDayOfWeek({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    dayName: string;
    dayShort: string;
    dayOfYear: number;
    weekNumber: number;
    isLeapYear: boolean;
    daysInMonth: number;
    formattedDate: string;
  } | null>(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayShorts = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / 86400000);
  };

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const calculate = () => {
    if (!dateInput.trim()) {
      setError('Please enter a date');
      setResult(null);
      return;
    }

    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      setError('Invalid date. Use YYYY-MM-DD format.');
      setResult(null);
      return;
    }

    setError('');
    const dayIndex = date.getDay();

    setResult({
      dayName: dayNames[dayIndex],
      dayShort: dayShorts[dayIndex],
      dayOfYear: getDayOfYear(date),
      weekNumber: getWeekNumber(date),
      isLeapYear: isLeapYear(date.getFullYear()),
      daysInMonth: getDaysInMonth(date.getFullYear(), date.getMonth()),
      formattedDate: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    });
  };

  const copyText = result
    ? `${result.formattedDate}\nDay of week: ${result.dayName}\nDay of year: ${result.dayOfYear}\nWeek number: ${result.weekNumber}\nLeap year: ${result.isLeapYear ? 'Yes' : 'No'}\nDays in month: ${result.daysInMonth}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => {
            setDateInput(e.target.value);
            if (error) setError('');
          }}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Find day of week" className="btn-primary">
        Find Day of Week
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.dayName}</div>
              <div className="text-sm text-gray-500 mt-1">{result.formattedDate}</div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.dayOfYear}</div>
                <div className="text-xs text-gray-500">Day of Year</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.weekNumber}</div>
                <div className="text-xs text-gray-500">Week Number</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.isLeapYear ? 'Yes' : 'No'}</div>
                <div className="text-xs text-gray-500">Leap Year</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.daysInMonth}</div>
                <div className="text-xs text-gray-500">Days in Month</div>
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
