'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

type Mode = 'wake-time' | 'sleep-time';

/**
 * SleepCycleCalculator - Calculate optimal wake/sleep times based on 90-minute sleep cycles.
 * Each cycle is 90 minutes. Falling asleep takes ~14 minutes on average.
 */
export default function SleepCycleCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<Mode>('wake-time');
  const [time, setTime] = useState('07:00');
  const [results, setResults] = useState<{ cycles: number; time: string; duration: string }[]>([]);

  const CYCLE_MINUTES = 90;
  const FALL_ASLEEP_MINUTES = 14;

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const calculate = () => {
    const [hours, minutes] = time.split(':').map(Number);
    const baseDate = new Date();
    baseDate.setHours(hours, minutes, 0, 0);

    const newResults: { cycles: number; time: string; duration: string }[] = [];

    if (mode === 'wake-time') {
      // Given wake time, calculate when to go to sleep
      for (let cycles = 6; cycles >= 3; cycles--) {
        const sleepMinutes = cycles * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
        const sleepTime = new Date(baseDate.getTime() - sleepMinutes * 60 * 1000);
        newResults.push({
          cycles,
          time: formatTime(sleepTime),
          duration: formatDuration(cycles * CYCLE_MINUTES),
        });
      }
    } else {
      // Given sleep time, calculate when to wake up
      const fallAsleepTime = new Date(baseDate.getTime() + FALL_ASLEEP_MINUTES * 60 * 1000);
      for (let cycles = 3; cycles <= 6; cycles++) {
        const wakeTime = new Date(fallAsleepTime.getTime() + cycles * CYCLE_MINUTES * 60 * 1000);
        newResults.push({
          cycles,
          time: formatTime(wakeTime),
          duration: formatDuration(cycles * CYCLE_MINUTES),
        });
      }
    }

    setResults(newResults);
  };

  const copyText = results.length > 0
    ? results.map((r) => `${r.cycles} cycles (${r.duration}): ${r.time}`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
          I want to calculate...
        </label>
        <select
          id={`${toolId}-mode`}
          value={mode}
          onChange={(e) => { setMode(e.target.value as Mode); setResults([]); }}
          aria-label={`Calculation mode for ${toolName}`}
          className="input-field"
        >
          <option value="wake-time">When to go to sleep (I know my wake time)</option>
          <option value="sleep-time">When to wake up (I know my bedtime)</option>
        </select>
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
          {mode === 'wake-time' ? 'Wake-up Time' : 'Bedtime'}
        </label>
        <input
          id={`${toolId}-time`}
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label={mode === 'wake-time' ? 'Wake-up time' : 'Bedtime'}
          className="input-field w-40"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate sleep cycles" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              {mode === 'wake-time'
                ? 'To wake up feeling refreshed, try going to sleep at one of these times:'
                : 'If you go to sleep now, try waking up at one of these times:'}
            </p>
            <p className="text-xs text-gray-500">
              (Includes ~14 minutes to fall asleep. Each cycle is 90 minutes.)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r) => (
                <div
                  key={r.cycles}
                  className={`p-4 rounded-lg border text-center ${
                    r.cycles >= 5 ? 'bg-green-50 border-green-200' : r.cycles === 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-800">{r.time}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {r.cycles} cycles &middot; {r.duration} of sleep
                  </div>
                  <div className={`text-xs mt-1 font-medium ${
                    r.cycles >= 5 ? 'text-green-600' : r.cycles === 4 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {r.cycles >= 5 ? 'Recommended' : r.cycles === 4 ? 'Minimum' : 'Not ideal'}
                  </div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
