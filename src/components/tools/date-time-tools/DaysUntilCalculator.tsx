'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DaysUntilCalculator - Calculate days, weeks, and hours remaining until a future date.
 */
export default function DaysUntilCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleCalculate() {
    if (!input) {
      setError('Please select a target date');
      setOutput('');
      return;
    }

    const targetDate = new Date(input + 'T00:00:00');
    if (isNaN(targetDate.getTime())) {
      setError('Invalid date');
      setOutput('');
      return;
    }

    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    setError(undefined);

    const prefix = isPast ? 'was' : 'is';
    const suffix = isPast ? 'ago' : 'from now';

    const lines = [
      `${targetDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} ${prefix} ${totalDays} day${totalDays !== 1 ? 's' : ''} ${suffix}`,
      '',
      `Days remaining: ${totalDays}`,
      `Weeks remaining: ${totalWeeks} week${totalWeeks !== 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`,
      `Hours remaining: ${totalHours.toLocaleString()}`,
    ];

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Target Date
        </label>
        <input
          id={`${toolId}-input`}
          type="date"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Target date to calculate days until"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <button
        onClick={handleCalculate}
        aria-label="Calculate days until target date"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
