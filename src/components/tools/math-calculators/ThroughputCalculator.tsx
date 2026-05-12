'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ThroughputCalculator - Calculate process throughput (units per time period).
 */
export default function ThroughputCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [unitsProduced, setUnitsProduced] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days'>('hours');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setOutput('');

    const units = parseFloat(unitsProduced);
    const time = parseFloat(timePeriod);

    if (isNaN(units) || units < 0) {
      setError('Please enter a valid non-negative number of units.');
      return;
    }
    if (isNaN(time) || time <= 0) {
      setError('Please enter a valid positive time period.');
      return;
    }

    const throughput = units / time;

    // Convert to different time scales
    const multipliers: Record<string, number> = {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
    };

    const basePerSecond = units / (time * multipliers[timeUnit]);

    const lines: string[] = [
      `=== Throughput Results ===`,
      ``,
      `Units Produced: ${units}`,
      `Time Period: ${time} ${timeUnit}`,
      ``,
      `Throughput: ${throughput.toFixed(4)} units/${timeUnit}`,
      ``,
      `--- Converted Rates ---`,
      `Per Second: ${basePerSecond.toFixed(6)} units/sec`,
      `Per Minute: ${(basePerSecond * 60).toFixed(4)} units/min`,
      `Per Hour: ${(basePerSecond * 3600).toFixed(2)} units/hr`,
      `Per Day: ${(basePerSecond * 86400).toFixed(2)} units/day`,
      ``,
      `Time per Unit: ${(1 / throughput).toFixed(4)} ${timeUnit}/unit`,
      ``,
      `Formula: Throughput = Units Produced / Time Period`,
    ];

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-units`} className="block text-sm font-medium text-gray-700 mb-1">
          Units Produced / Processed
        </label>
        <input
          id={`${toolId}-units`}
          type="number"
          value={unitsProduced}
          onChange={(e) => setUnitsProduced(e.target.value)}
          placeholder="e.g. 500"
          aria-label={`Units produced for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
          Time Period
        </label>
        <div className="flex gap-2 mb-3">
          <input
            id={`${toolId}-time`}
            type="number"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            placeholder="e.g. 8"
            aria-label={`Time period for ${toolName}`}
            className="input-field flex-1"
            min="0"
            step="any"
          />
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as 'seconds' | 'minutes' | 'hours' | 'days')}
            className="input-field w-32"
            aria-label="Time unit"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Calculate Throughput
        </button>
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
