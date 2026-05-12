'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SemesterCountdown - Countdown to end of current semester/term.
 * Supports configurable semester end dates for different academic systems.
 */
export default function SemesterCountdown({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [endDate, setEndDate] = useState('');
  const [semesterName, setSemesterName] = useState('');
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    hours: number;
    minutes: number;
    percentage: number;
    startDate: string;
  } | null>(null);
  const [error, setError] = useState('');

  const presets = [
    { label: 'Fall Semester (Dec 15)', month: 11, day: 15 },
    { label: 'Spring Semester (May 15)', month: 4, day: 15 },
    { label: 'Summer Term (Aug 15)', month: 7, day: 15 },
    { label: 'Winter Quarter (Mar 15)', month: 2, day: 15 },
  ];

  const applyPreset = (month: number, day: number, label: string) => {
    const now = new Date();
    let year = now.getFullYear();
    const target = new Date(year, month, day);
    if (target < now) {
      year++;
    }
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setEndDate(dateStr);
    setSemesterName(label);
  };

  const calculate = () => {
    if (!endDate) {
      setError('Please select or enter a semester end date');
      setResult(null);
      return;
    }

    const end = new Date(endDate + 'T23:59:59');
    const now = new Date();

    if (end <= now) {
      setError('The end date must be in the future');
      setResult(null);
      return;
    }

    setError('');

    const diffMs = end.getTime() - now.getTime();
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const _remainingDays = totalDays % 7;

    // Estimate semester start (assume ~16 weeks / 120 days semester)
    const semesterLength = 120;
    const elapsed = semesterLength - totalDays;
    const percentage = Math.max(0, Math.min(100, (elapsed / semesterLength) * 100));

    const startDate = new Date(end.getTime() - semesterLength * 24 * 60 * 60 * 1000);
    const startStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    setResult({
      days: totalDays,
      weeks,
      hours: totalHours,
      minutes: totalMinutes,
      percentage,
      startDate: startStr,
    });
  };

  const copyText = result
    ? `Semester: ${semesterName || 'Custom'}\nEnd Date: ${endDate}\nDays Remaining: ${result.days}\nWeeks Remaining: ${result.weeks} weeks ${result.days % 7} days\nHours Remaining: ${result.hours}\nSemester Progress: ${result.percentage.toFixed(1)}%`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.month, preset.day, preset.label)}
              className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </InputArea>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
            Semester End Date
          </label>
          <input
            id={`${toolId}-date`}
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); if (error) setError(''); }}
            aria-label={`End date for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
            Semester Name (optional)
          </label>
          <input
            id={`${toolId}-name`}
            type="text"
            value={semesterName}
            onChange={(e) => setSemesterName(e.target.value)}
            placeholder="e.g. Fall 2024"
            aria-label={`Semester name for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate countdown" className="btn-primary">
        Calculate Countdown
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {semesterName && (
              <div className="text-center text-sm font-medium text-gray-600">{semesterName}</div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.days}</div>
                <div className="text-xs text-gray-500">Days Left</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.weeks}</div>
                <div className="text-xs text-gray-500">Weeks Left</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.hours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Hours Left</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.percentage.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Complete</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Semester Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Start (~{result.startDate})</span>
                <span>End ({endDate})</span>
              </div>
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
