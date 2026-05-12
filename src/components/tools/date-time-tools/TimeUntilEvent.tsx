'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeUntilEvent - Calculate exact time remaining until a specific date/time.
 */
export default function TimeUntilEvent({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('00:00');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setOutput('');
    if (!dateInput) { setError('Please select a date'); return; }

    const target = new Date(`${dateInput}T${timeInput}:00`);
    if (isNaN(target.getTime())) { setError('Invalid date/time'); return; }

    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const abs = Math.abs(diffMs);

    const seconds = Math.floor(abs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365.25);

    const remDays = days % 365;
    const remHours = hours % 24;
    const remMinutes = minutes % 60;
    const remSeconds = seconds % 60;

    const label = isPast ? 'ago' : 'remaining';
    const lines = [
      `Target: ${target.toLocaleString()}`,
      `Status: ${isPast ? 'Past' : 'Future'}`,
      '',
      `${years} years, ${Math.floor((remDays % 365) / 30)} months, ${remDays % 30} days, ${remHours}h ${remMinutes}m ${remSeconds}s ${label}`,
      '',
      `Total days: ${days.toLocaleString()}`,
      `Total hours: ${hours.toLocaleString()}`,
      `Total minutes: ${minutes.toLocaleString()}`,
      `Total seconds: ${seconds.toLocaleString()}`,
      months > 0 ? `Approx months: ${months}` : '',
    ].filter(Boolean);
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Event Date/Time for {toolName}</label>
        <div className="flex gap-2">
          <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label="Event date" className="input-field flex-1" />
          <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} aria-label="Event time" className="input-field w-32" />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate time until event" className="btn-primary">Calculate</button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
