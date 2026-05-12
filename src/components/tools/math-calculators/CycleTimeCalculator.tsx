'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CycleTimeCalculator - Calculate manufacturing cycle time from available time and units produced.
 */
export default function CycleTimeCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [availableTime, setAvailableTime] = useState('');
  const [unitsProduced, setUnitsProduced] = useState('');
  const [timeUnit, setTimeUnit] = useState<'minutes' | 'hours' | 'seconds'>('minutes');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    setOutput('');

    const time = parseFloat(availableTime);
    const units = parseFloat(unitsProduced);

    if (isNaN(time) || time <= 0) {
      setError('Please enter a valid positive available time.');
      return;
    }
    if (isNaN(units) || units <= 0) {
      setError('Please enter a valid positive number of units produced.');
      return;
    }

    const cycleTime = time / units;
    const timeInSeconds = timeUnit === 'hours' ? time * 3600 : timeUnit === 'minutes' ? time * 60 : time;
    const cycleTimeSeconds = timeInSeconds / units;

    const lines: string[] = [
      `=== Cycle Time Results ===`,
      ``,
      `Available Time: ${time} ${timeUnit}`,
      `Units Produced: ${units}`,
      ``,
      `Cycle Time: ${cycleTime.toFixed(4)} ${timeUnit}/unit`,
      `Cycle Time: ${cycleTimeSeconds.toFixed(4)} seconds/unit`,
      ``,
      `Units per Hour: ${(3600 / cycleTimeSeconds).toFixed(2)}`,
      `Units per Minute: ${(60 / cycleTimeSeconds).toFixed(4)}`,
      ``,
      `Formula: Cycle Time = Available Time / Units Produced`,
    ];

    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
          Available Production Time
        </label>
        <div className="flex gap-2 mb-3">
          <input
            id={`${toolId}-time`}
            type="number"
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            placeholder="e.g. 480"
            aria-label={`Available time for ${toolName}`}
            className="input-field flex-1"
            min="0"
            step="any"
          />
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value as 'minutes' | 'hours' | 'seconds')}
            className="input-field w-32"
            aria-label="Time unit"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
        <label htmlFor={`${toolId}-units`} className="block text-sm font-medium text-gray-700 mb-1">
          Units Produced
        </label>
        <input
          id={`${toolId}-units`}
          type="number"
          value={unitsProduced}
          onChange={(e) => setUnitsProduced(e.target.value)}
          placeholder="e.g. 100"
          aria-label={`Units produced for ${toolName}`}
          className="input-field mb-3"
          min="0"
          step="any"
        />
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Calculate Cycle Time
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
