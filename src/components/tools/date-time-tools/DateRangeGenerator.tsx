'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DateRangeGenerator - Generate a list of dates between start and end with configurable step.
 */
export default function DateRangeGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [step, setStep] = useState('1');
  const [stepUnit, setStepUnit] = useState<'days' | 'weeks' | 'months'>('days');
  const [format, setFormat] = useState<'iso' | 'us' | 'eu' | 'long'>('iso');
  const [output, setOutput] = useState('');
  const [dateCount, setDateCount] = useState(0);
  const [error, setError] = useState<string | undefined>();

  function formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    switch (format) {
      case 'iso': return `${y}-${m}-${d}`;
      case 'us': return `${m}/${d}/${y}`;
      case 'eu': return `${d}/${m}/${y}`;
      case 'long': return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      default: return `${y}-${m}-${d}`;
    }
  }

  function addStep(date: Date, stepVal: number, unit: string): Date {
    const newDate = new Date(date);
    switch (unit) {
      case 'days': newDate.setDate(newDate.getDate() + stepVal); break;
      case 'weeks': newDate.setDate(newDate.getDate() + stepVal * 7); break;
      case 'months': newDate.setMonth(newDate.getMonth() + stepVal); break;
    }
    return newDate;
  }

  function handleGenerate() {
    if (!startDate || !endDate) { setError('Please select both start and end dates'); setOutput(''); return; }

    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    const stepVal = parseInt(step);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) { setError('Invalid date'); setOutput(''); return; }
    if (isNaN(stepVal) || stepVal <= 0) { setError('Step must be a positive number'); setOutput(''); return; }
    if (start > end) { setError('Start date must be before end date'); setOutput(''); return; }

    setError(undefined);

    const dates: string[] = [];
    let current = new Date(start);
    const maxDates = 1000;

    while (current <= end && dates.length < maxDates) {
      dates.push(formatDate(current));
      current = addStep(current, stepVal, stepUnit);
    }

    setDateCount(dates.length);
    setOutput(dates.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input id={`${toolId}-end`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label="End date" className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-step`} className="block text-sm font-medium text-gray-700 mb-1">Step</label>
            <div className="flex gap-2">
              <input id={`${toolId}-step`} type="text" inputMode="numeric" value={step} onChange={(e) => setStep(e.target.value)} className="input-field text-sm w-20" aria-label="Step value" />
              <select value={stepUnit} onChange={(e) => setStepUnit(e.target.value as typeof stepUnit)} className="input-field text-sm flex-1" aria-label="Step unit">
                <option value="days">Day(s)</option>
                <option value="weeks">Week(s)</option>
                <option value="months">Month(s)</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value as typeof format)} className="input-field text-sm" aria-label="Date format">
              <option value="iso">ISO (YYYY-MM-DD)</option>
              <option value="us">US (MM/DD/YYYY)</option>
              <option value="eu">EU (DD/MM/YYYY)</option>
              <option value="long">Long (Monday, January 1, 2024)</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={handleGenerate} aria-label="Generate date range" className="btn-primary">
        Generate Dates
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Generated Dates ({dateCount} date{dateCount !== 1 ? 's' : ''})
              </label>
              <CopyToClipboard text={output} />
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 p-4 bg-gray-50 rounded-lg border border-gray-100 max-h-64 overflow-y-auto">
              {output}
            </pre>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
