'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PregnancyDueDateCalculator - Calculate estimated due date from last menstrual period.
 * Uses Naegele's rule: LMP + 280 days (40 weeks).
 */
export default function PregnancyDueDateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [lmpDate, setLmpDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    dueDate: string;
    currentWeeks: number;
    currentDays: number;
    trimester: string;
    daysRemaining: number;
    conceptionDate: string;
  } | null>(null);

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!lmpDate) {
      setError('Please select the date of your last menstrual period');
      return;
    }

    const lmp = new Date(lmpDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (lmp > today) {
      setError('LMP date cannot be in the future');
      return;
    }

    const cycle = parseInt(cycleLength) || 28;
    const adjustment = cycle - 28;

    // Naegele's rule: LMP + 280 days, adjusted for cycle length
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280 + adjustment);

    // Conception date (approximately 14 days after LMP, adjusted)
    const conceptionDate = new Date(lmp);
    conceptionDate.setDate(conceptionDate.getDate() + 14 + adjustment);

    // Current gestational age
    const diffMs = today.getTime() - lmp.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const currentWeeks = Math.floor(totalDays / 7);
    const currentDays = totalDays % 7;

    // Days remaining
    const remainingMs = dueDate.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

    // Trimester
    let trimester: string;
    if (currentWeeks < 13) {
      trimester = 'First Trimester (Weeks 1-12)';
    } else if (currentWeeks < 27) {
      trimester = 'Second Trimester (Weeks 13-26)';
    } else {
      trimester = 'Third Trimester (Weeks 27-40)';
    }

    setResult({
      dueDate: dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      currentWeeks,
      currentDays,
      trimester,
      daysRemaining,
      conceptionDate: conceptionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    });
  }

  const copyText = result
    ? `Estimated Due Date: ${result.dueDate}\nGestational Age: ${result.currentWeeks} weeks, ${result.currentDays} days\nTrimester: ${result.trimester}\nDays Remaining: ${result.daysRemaining}\nEstimated Conception: ${result.conceptionDate}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-lmp`} className="block text-sm font-medium text-gray-700 mb-1">
          First Day of Last Menstrual Period (LMP)
        </label>
        <input
          id={`${toolId}-lmp`}
          type="date"
          value={lmpDate}
          onChange={(e) => setLmpDate(e.target.value)}
          aria-label={`Last menstrual period date for ${toolName}`}
          className="input-field"
        />
        <div className="mt-3">
          <label htmlFor={`${toolId}-cycle`} className="block text-xs text-gray-500 mb-1">
            Average Cycle Length (days)
          </label>
          <input
            id={`${toolId}-cycle`}
            type="text"
            inputMode="numeric"
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            placeholder="28"
            aria-label="Average cycle length"
            className="input-field text-sm w-24"
          />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate due date" className="btn-primary">
        Calculate Due Date
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-blue-600">{result.dueDate}</div>
              <div className="text-xs text-gray-500 mt-1">Estimated Due Date</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.currentWeeks}w {result.currentDays}d</div>
                <div className="text-xs text-gray-500 mt-1">Gestational Age</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.daysRemaining}</div>
                <div className="text-xs text-gray-500 mt-1">Days Remaining</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
              <div><span className="font-medium">Trimester:</span> {result.trimester}</div>
              <div><span className="font-medium">Est. Conception:</span> {result.conceptionDate}</div>
            </div>
            <p className="text-xs text-gray-400 italic">
              This is an estimate based on Naegele&apos;s rule. Consult your healthcare provider for medical advice.
            </p>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
