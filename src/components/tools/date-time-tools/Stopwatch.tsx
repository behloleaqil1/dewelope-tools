'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ToolEngineProps } from '@/types';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { formatElapsedTime } from '@/lib/date-time-tools';

/**
 * Stopwatch - Provides start, stop, and reset controls with millisecond precision display.
 * Requirements: 8.1, 8.7
 */
export default function Stopwatch({ toolId, toolName }: ToolEngineProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
      pausedElapsedRef.current = elapsedMs;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setElapsedMs(pausedElapsedRef.current + (now - startTimeRef.current));
      }, 10); // Update every 10ms for millisecond precision
    }
  };

  const handleStop = () => {
    if (isRunning) {
      clearTimer();
      setIsRunning(false);
      pausedElapsedRef.current = elapsedMs;
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setElapsedMs(0);
    pausedElapsedRef.current = 0;
    startTimeRef.current = 0;
  };

  const elapsed = formatElapsedTime(elapsedMs);
  const displayText = `${elapsed.hours}:${elapsed.minutes}:${elapsed.seconds}.${elapsed.milliseconds}`;

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="text-center py-8">
        <div
          className="text-5xl sm:text-6xl font-mono font-bold text-gray-800 tracking-tight"
          aria-label={`Elapsed time: ${elapsed.hours} hours, ${elapsed.minutes} minutes, ${elapsed.seconds} seconds, ${elapsed.milliseconds} milliseconds`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span>{elapsed.hours}</span>
          <span className="text-gray-400">:</span>
          <span>{elapsed.minutes}</span>
          <span className="text-gray-400">:</span>
          <span>{elapsed.seconds}</span>
          <span className="text-gray-400">.</span>
          <span className="text-3xl sm:text-4xl">{elapsed.milliseconds}</span>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          {isRunning ? 'Running' : elapsedMs > 0 ? 'Paused' : 'Ready'}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            aria-label={`Start ${toolName}`}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] font-medium"
          >
            {elapsedMs > 0 ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button
            onClick={handleStop}
            aria-label={`Stop ${toolName}`}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] font-medium"
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          aria-label={`Reset ${toolName}`}
          className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] min-w-[44px] font-medium"
        >
          Reset
        </button>
      </div>

      <OutputArea hasContent={elapsedMs > 0}>
        {elapsedMs > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{elapsed.hours}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{elapsed.minutes}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{elapsed.seconds}</div>
                <div className="text-xs text-gray-500">Seconds</div>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <div className="text-xl font-bold text-blue-600">{elapsed.milliseconds}</div>
                <div className="text-xs text-gray-500">ms</div>
              </div>
            </div>
            <CopyToClipboard text={displayText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
