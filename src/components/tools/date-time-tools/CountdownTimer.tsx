'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import { calculateCountdown } from '@/lib/date-time-tools';

/**
 * CountdownTimer - Allows users to set a target duration (hours, minutes, seconds),
 * start/pause/reset the countdown, and displays a visual indication when complete.
 * Requirements: 8.1, 8.6
 */
export default function CountdownTimer({ toolId, toolName }: ToolEngineProps) {
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [targetDurationMs, setTargetDurationMs] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | undefined>();

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
    if (!isRunning && !isComplete) {
      // Calculate target duration from inputs if starting fresh
      if (elapsedMs === 0) {
        const h = parseInt(hours, 10) || 0;
        const m = parseInt(minutes, 10) || 0;
        const s = parseInt(seconds, 10) || 0;

        if (h < 0 || m < 0 || s < 0) {
          setError('Values must be non-negative');
          return;
        }

        if (h === 0 && m === 0 && s === 0) {
          setError('Please set a duration greater than zero');
          return;
        }

        if (m > 59 || s > 59) {
          setError('Minutes and seconds must be between 0 and 59');
          return;
        }

        const durationMs = (h * 3600 + m * 60 + s) * 1000;
        setTargetDurationMs(durationMs);
      }

      setError(undefined);
      setIsRunning(true);
      startTimeRef.current = Date.now();
      pausedElapsedRef.current = elapsedMs;

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const currentElapsed = pausedElapsedRef.current + (now - startTimeRef.current);
        setElapsedMs(currentElapsed);

        // Check if countdown is complete
        const duration = targetDurationMs || ((parseInt(hours, 10) || 0) * 3600 + (parseInt(minutes, 10) || 0) * 60 + (parseInt(seconds, 10) || 0)) * 1000;
        if (currentElapsed >= duration) {
          setElapsedMs(duration);
          setIsComplete(true);
          setIsRunning(false);
          clearTimer();
        }
      }, 50);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      clearTimer();
      setIsRunning(false);
      pausedElapsedRef.current = elapsedMs;
    }
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setIsComplete(false);
    setElapsedMs(0);
    setTargetDurationMs(0);
    pausedElapsedRef.current = 0;
    startTimeRef.current = 0;
  };

  const countdown = targetDurationMs > 0
    ? calculateCountdown(targetDurationMs, elapsedMs)
    : null;

  const progressPercent = targetDurationMs > 0
    ? Math.min(100, (elapsedMs / targetDurationMs) * 100)
    : 0;

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700 mb-2">
              Set Duration
            </legend>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor={`${toolId}-hours`} className="block text-xs text-gray-500 mb-1">
                  Hours
                </label>
                <input
                  id={`${toolId}-hours`}
                  type="number"
                  min="0"
                  max="99"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  disabled={isRunning || isComplete}
                  aria-label={`Hours for ${toolName}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor={`${toolId}-minutes`} className="block text-xs text-gray-500 mb-1">
                  Minutes
                </label>
                <input
                  id={`${toolId}-minutes`}
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  disabled={isRunning || isComplete}
                  aria-label={`Minutes for ${toolName}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              <div>
                <label htmlFor={`${toolId}-seconds`} className="block text-xs text-gray-500 mb-1">
                  Seconds
                </label>
                <input
                  id={`${toolId}-seconds`}
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                  disabled={isRunning || isComplete}
                  aria-label={`Seconds for ${toolName}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>
          </fieldset>
        </InputArea>

        <div className="flex gap-3">
          {!isRunning && !isComplete && (
            <button
              onClick={handleStart}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
            >
              {elapsedMs > 0 ? 'Resume' : 'Start'}
            </button>
          )}
          {isRunning && (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
          >
            Reset
          </button>
        </div>
      </div>

      <OutputArea hasContent={countdown !== null}>
        {countdown && (
          <div className="space-y-4">
            {isComplete ? (
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                <div className="text-2xl font-bold text-red-600">
                  Time&apos;s Up!
                </div>
                <div className="text-sm text-red-500 mt-1">
                  Countdown complete
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-gray-800">
                  {String(countdown.hours).padStart(2, '0')}:
                  {String(countdown.minutes).padStart(2, '0')}:
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500 mt-1">Remaining</div>
              </div>
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Countdown progress">
              <div
                className={`h-3 rounded-full transition-all duration-100 ${
                  isComplete ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
