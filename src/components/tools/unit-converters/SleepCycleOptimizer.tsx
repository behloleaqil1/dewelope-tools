'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * SleepCycleOptimizer - Calculate optimal bedtimes based on wake-up time and sleep cycles.
 */
export default function SleepCycleOptimizer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [hours, setHours] = useState('7');
  const [minutes, setMinutes] = useState('00');

  const calculate = (): string => {
    const h = parseInt(hours);
    const m = parseInt(minutes);
    if (isNaN(h) || isNaN(m)) return '';

    const CYCLE_MINUTES = 90; // One sleep cycle
    const FALL_ASLEEP_MINUTES = 15; // Average time to fall asleep

    const formatTime = (totalMin: number) => {
      const mins = ((totalMin % 1440) + 1440) % 1440; // Normalize to 0-1439
      const hr = Math.floor(mins / 60);
      const min = mins % 60;
      const period = hr >= 12 ? 'PM' : 'AM';
      const displayHr = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;
      return `${displayHr}:${min.toString().padStart(2, '0')} ${period}`;
    };

    const targetMin = h * 60 + m;
    const results: string[] = [];

    if (mode === 'wake') {
      // Calculate bedtimes for waking at the given time
      results.push(`Wake-up time: ${formatTime(targetMin)}\n`);
      results.push('Optimal bedtimes (fall asleep by):');
      for (let cycles = 6; cycles >= 4; cycles--) {
        const sleepDuration = cycles * CYCLE_MINUTES;
        const bedtime = targetMin - sleepDuration - FALL_ASLEEP_MINUTES;
        const sleepHrs = (sleepDuration / 60).toFixed(1);
        results.push(`  ${formatTime(bedtime)} → ${sleepHrs}h sleep (${cycles} cycles)`);
      }
      results.push('\n💡 Aim for 5-6 complete cycles (7.5-9 hours)');
      results.push('   Waking between cycles feels more refreshing');
    } else {
      // Calculate wake times for sleeping at the given time
      results.push(`Bedtime: ${formatTime(targetMin)}\n`);
      results.push('Optimal wake-up times:');
      const fallAsleepAt = targetMin + FALL_ASLEEP_MINUTES;
      for (let cycles = 4; cycles <= 6; cycles++) {
        const sleepDuration = cycles * CYCLE_MINUTES;
        const wakeTime = fallAsleepAt + sleepDuration;
        const sleepHrs = (sleepDuration / 60).toFixed(1);
        results.push(`  ${formatTime(wakeTime)} → ${sleepHrs}h sleep (${cycles} cycles)`);
      }
      results.push(`\n⏰ You should fall asleep by: ${formatTime(fallAsleepAt)}`);
    }

    return results.join('\n');
  };

  const result = calculate();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">I want to calculate</label>
        <select id={`${toolId}-mode`} value={mode} onChange={(e) => setMode(e.target.value as 'wake' | 'sleep')} aria-label={`Mode for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="wake">Bedtime (I know when I need to wake up)</option>
          <option value="sleep">Wake time (I know when I want to sleep)</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${toolId}-hr`} className="block text-sm font-medium text-gray-700 mb-1">{mode === 'wake' ? 'Wake-up Hour' : 'Bedtime Hour'} (0-23)</label>
          <input id={`${toolId}-hr`} type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" max="23" aria-label={`Hour for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-min`} className="block text-sm font-medium text-gray-700 mb-1">Minutes</label>
          <input id={`${toolId}-min`} type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} min="0" max="59" aria-label={`Minutes for ${toolName}`} className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
