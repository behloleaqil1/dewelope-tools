'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AcademicYearCalculator - Calculate academic year/semester for a given date.
 */
export default function AcademicYearCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [date, setDate] = useState('');
  const [system, setSystem] = useState<'semester' | 'trimester' | 'quarter'>('semester');
  const [startMonth, setStartMonth] = useState('9');
  const [result, setResult] = useState<{ academicYear: string; period: string; periodNumber: number; weeksIntoPeriod: number; weeksRemaining: number } | null>(null);
  const [error, setError] = useState('');

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

    const month = d.getMonth() + 1; // 1-based
    const year = d.getFullYear();
    const fyStart = parseInt(startMonth);

    // Determine academic year
    let academicYearStart: number;
    if (month >= fyStart) {
      academicYearStart = year;
    } else {
      academicYearStart = year - 1;
    }
    const academicYear = `${academicYearStart}-${academicYearStart + 1}`;

    // Calculate months into academic year
    let monthsIntoYear: number;
    if (month >= fyStart) {
      monthsIntoYear = month - fyStart;
    } else {
      monthsIntoYear = (12 - fyStart) + month;
    }

    // Determine period based on system
    let periodNumber: number;
    let period: string;
    let monthsPerPeriod: number;

    if (system === 'semester') {
      monthsPerPeriod = 6;
      periodNumber = Math.floor(monthsIntoYear / monthsPerPeriod) + 1;
      period = periodNumber === 1 ? 'Fall Semester' : 'Spring Semester';
    } else if (system === 'trimester') {
      monthsPerPeriod = 4;
      periodNumber = Math.floor(monthsIntoYear / monthsPerPeriod) + 1;
      const names = ['Fall Trimester', 'Winter Trimester', 'Spring Trimester'];
      period = names[Math.min(periodNumber - 1, 2)];
    } else {
      monthsPerPeriod = 3;
      periodNumber = Math.floor(monthsIntoYear / monthsPerPeriod) + 1;
      const names = ['Fall Quarter', 'Winter Quarter', 'Spring Quarter', 'Summer Quarter'];
      period = names[Math.min(periodNumber - 1, 3)];
    }

    // Weeks into current period
    const periodStartMonth = (fyStart - 1 + (periodNumber - 1) * monthsPerPeriod) % 12;
    const periodStartYear = periodStartMonth >= (fyStart - 1) ? academicYearStart : academicYearStart + 1;
    const periodStart = new Date(periodStartYear, periodStartMonth, 1);
    const periodEnd = new Date(periodStartYear, periodStartMonth + monthsPerPeriod, 0);

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeksIntoPeriod = Math.max(1, Math.ceil((d.getTime() - periodStart.getTime()) / msPerWeek));
    const totalWeeksInPeriod = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / msPerWeek);
    const weeksRemaining = Math.max(0, totalWeeksInPeriod - weeksIntoPeriod);

    setResult({ academicYear, period, periodNumber, weeksIntoPeriod, weeksRemaining });
  };

  const copyText = result
    ? `Date: ${date}\nAcademic Year: ${result.academicYear}\nPeriod: ${result.period}\nWeek ${result.weeksIntoPeriod} of period\nWeeks remaining: ${result.weeksRemaining}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-system`} className="block text-sm font-medium text-gray-700 mb-1">System</label>
            <select id={`${toolId}-system`} value={system} onChange={(e) => setSystem(e.target.value as 'semester' | 'trimester' | 'quarter')} aria-label="Academic system" className="input-field">
              <option value="semester">Semester (2/year)</option>
              <option value="trimester">Trimester (3/year)</option>
              <option value="quarter">Quarter (4/year)</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Year Starts In</label>
            <select id={`${toolId}-start`} value={startMonth} onChange={(e) => setStartMonth(e.target.value)} aria-label="Academic year start month" className="input-field">
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="1">January</option>
              <option value="2">February</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} className="btn-primary" aria-label="Calculate academic year">Calculate Academic Year</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-xl font-bold text-blue-600">{result.academicYear}</div>
                <div className="text-xs text-gray-500 mt-1">Academic Year</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.period}</div>
                <div className="text-xs text-gray-500 mt-1">Current Period</div>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1 text-sm text-gray-700">
              <div><span className="font-medium">Week in period:</span> {result.weeksIntoPeriod}</div>
              <div><span className="font-medium">Weeks remaining:</span> {result.weeksRemaining}</div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
