'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeDurationCalculator - Add or subtract hours/minutes/seconds from a start time.
 */
export default function TimeDurationCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [baseHours, setBaseHours] = useState(12);
  const [baseMinutes, setBaseMinutes] = useState(0);
  const [baseSeconds, setBaseSeconds] = useState(0);
  const [durHours, setDurHours] = useState(2);
  const [durMinutes, setDurMinutes] = useState(30);
  const [durSeconds, setDurSeconds] = useState(0);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [output, setOutput] = useState('');

  function handleCalculate() {
    let totalSeconds = baseHours * 3600 + baseMinutes * 60 + baseSeconds;
    const durationSeconds = durHours * 3600 + durMinutes * 60 + durSeconds;

    if (operation === 'add') {
      totalSeconds += durationSeconds;
    } else {
      totalSeconds -= durationSeconds;
    }

    // Wrap around 24 hours
    while (totalSeconds < 0) {
      totalSeconds += 86400;
    }
    totalSeconds = totalSeconds % 86400;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    setOutput(formatted);
  }

  return (
    <div className="space-y-4">
      <InputArea>
        <p className="text-sm font-medium text-gray-700 mb-2">Start Time</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label htmlFor={`${toolId}-bh`} className="block text-xs text-gray-500 mb-1">Hours</label>
            <input
              id={`${toolId}-bh`}
              type="number"
              min={0}
              max={23}
              value={baseHours}
              onChange={(e) => setBaseHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
              aria-label="Start time hours"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bm`} className="block text-xs text-gray-500 mb-1">Minutes</label>
            <input
              id={`${toolId}-bm`}
              type="number"
              min={0}
              max={59}
              value={baseMinutes}
              onChange={(e) => setBaseMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              aria-label="Start time minutes"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-bs`} className="block text-xs text-gray-500 mb-1">Seconds</label>
            <input
              id={`${toolId}-bs`}
              type="number"
              min={0}
              max={59}
              value={baseSeconds}
              onChange={(e) => setBaseSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              aria-label="Start time seconds"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOperation('add')}
            aria-label="Add duration"
            className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${operation === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            + Add
          </button>
          <button
            onClick={() => setOperation('subtract')}
            aria-label="Subtract duration"
            className={`px-4 py-2 text-sm font-medium rounded-md min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${operation === 'subtract' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            − Subtract
          </button>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-2">Duration to {operation === 'add' ? 'Add' : 'Subtract'}</p>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor={`${toolId}-dh`} className="block text-xs text-gray-500 mb-1">Hours</label>
            <input
              id={`${toolId}-dh`}
              type="number"
              min={0}
              max={99}
              value={durHours}
              onChange={(e) => setDurHours(Math.max(0, parseInt(e.target.value) || 0))}
              aria-label="Duration hours"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-dm`} className="block text-xs text-gray-500 mb-1">Minutes</label>
            <input
              id={`${toolId}-dm`}
              type="number"
              min={0}
              max={59}
              value={durMinutes}
              onChange={(e) => setDurMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              aria-label="Duration minutes"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-ds`} className="block text-xs text-gray-500 mb-1">Seconds</label>
            <input
              id={`${toolId}-ds`}
              type="number"
              min={0}
              max={59}
              value={durSeconds}
              onChange={(e) => setDurSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              aria-label="Duration seconds"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
            />
          </div>
        </div>
      </InputArea>

      <button
        onClick={handleCalculate}
        aria-label="Calculate time duration"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Resulting Time:</p>
            <code className="block text-2xl font-mono text-gray-800 select-all">{output}</code>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
